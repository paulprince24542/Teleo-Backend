const Router = require("express").Router();
const speakEasy = require("speakeasy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const cryptoRandomString = require("crypto-random-string");
const axios = require("axios");

//Postgres Pool
const { pool } = require("../../../config/postgres");

//Otp Service
const { sentMessage } = require("../../../services/OTPmessage.services");

//Validations Libraries
const { loginValidate, verifySign } = require("../../../Validation/Vendor/login.validation");



function generateOTP(length) {
    var secret = speakEasy.generateSecret({
        length: length,
    }).base32
    var token = speakEasy.totp({
        secret: secret,
        encoding: "base32",
    });
    return {
        token,
        secret
    }
}

const config = require("../../../config/config");
const {
    vendorToken,
    verifyVendor,
} = require("../../../middlewares/jwt_vendor_verify");




// Route: /api/auth/vendor/login
// Type: POST
// Vendor Vendor Login and Registeration
Router.post('/login', async(req, res) => {
    const error = loginValidate(req.body);
    // res.setHeader("Content-Type", "application/json");
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    try {
        var phonenumber = req.body.phonenumber
        let user = await pool.query("SELECT id FROM vendors where phonenumber = $1", [phonenumber])
        if (user.rowCount == 1) {
            // Old User Execute this
            var { token, secret } = generateOTP(50);
            await pool.query("UPDATE vendors SET secret = $1 WHERE id = $2", [secret, user.rows[0].id])
                // sentMessage(phonenumber, token, "vendor");
            const userData = await pool.query(
                "SELECT id, phonenumber, phoneverified, secret FROM vendors where phonenumber = $1", [phonenumber]
            );
            const data = await userData.rows[0];
            const payload = {
                id: data.id,
                phonenumber: data.phonenumber,
                verified: data.phoneverified,
                secret: data.secret,
                newUser: false
            };
            const AuthToken = jwt.sign(payload, config.vendorSecret);
            res.set({
                "v_token": AuthToken
            }).status(200).json({
                token: token,
                msg: "Token Send",
                "v_token": AuthToken
            })

        } else {
            // New User Execute 
            var { token, secret } = generateOTP(50);
            await pool.query(
                "INSERT INTO vendors (id, phonenumber, secret) VALUES ($1, $2, $3)", [cryptoRandomString({ length: 24 }), phonenumber, secret]
            );
            // sentMessage(phonenumber, token, "vendor");
            const userData = await pool.query(
                "SELECT id, phonenumber, phoneverified, secret FROM vendors where phonenumber = $1", [phonenumber]
            );
            const data = await userData.rows[0];
            const payload = {
                id: data.id,
                phonenumber: data.phonenumber,
                verified: data.phoneverified,
                secret: data.secret,
                newUser: true
            };
            const AuthToken = jwt.sign(payload, config.vendorSecret);
            res.set({
                "v_token": AuthToken
            }).status(200).json({
                token: token,
                msg: "Token Send",
                "v_token": AuthToken
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            msg: "Internal Sever Error"
        })
    }
})


Router.post("/verifylogin", vendorToken, async(req, res) => {
    const error = verifySign(req.body);
    res.setHeader("Content-Type", "application/json");
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    try {
        let user = await pool.query("SELECT * FROM vendors WHERE id = $1", [
            req.user.id,
        ]);
        var secret = await user.rows[0].secret;
        var token = req.body.token;

        if (user.rowCount === 0) {
            const validateToken = speakEasy.totp.verify({
                secret: secret,
                encoding: "base32",
                token: token,
                window: 4,
            });
            console.log(validateToken)
            if (validateToken == true) {
                let result = await pool.query(
                    "UPDATE vendors SET phoneverified = $1 WHERE id = $2", [true, req.user.id]
                );
                if (result.rowCount) {
                    res.header("v_id", req.user.id).status(200).json({
                        msg: "Vendor is verified",
                        id: req.user.id,
                        newUser: req.user.newUser
                    });
                }
            } else {
                res.status(400).json({
                    msg: "Invalid OTP",
                });
            }
        } else {
            const validateToken = speakEasy.totp.verify({
                secret: secret,
                encoding: "base32",
                token: token,
                window: 4,
            });

            if (validateToken == true) {
                let result = await pool.query(
                    "UPDATE vendors SET phoneverified = $1 WHERE id = $2", [true, req.user.id]
                );
                var data = {};
                var checkProfile = await pool.query("SELECT storename, storetype from vendorsprofile where id = $1", [req.user.id])
                var checkProduct = await pool.query("SELECT productid from v_products where storeid = $1", [req.user.id])
                var storename, storetype
                if (checkProfile.rowCount == 1 && checkProduct.rowCount >= 1) {
                    data.store = true;
                    storename = checkProfile.rows[0].storename;
                    storetype = checkProfile.rows[0].storetype;
                } else {
                    data.store = false
                    storename = "Null"
                    storetype = "Null"
                }
                console.log(checkProfile.rows)
                res.header("id", req.user.id).status(200).json({
                    msg: "Login Sucessfull",
                    id: req.user.id,
                    store: storename,
                    storename: storetype
                });
            } else {
                res.status(400).json({
                    msg: "Invalid OTP",
                });
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Internal Sever Error"
        })
    }
})

// Route: /api/auth/vendor/resendotp
// Type: POST
// Vendor Resend Account Verification OTP
Router.post("/resendotp", vendorToken, async(req, res) => {
    var { token, secret } = generateOTP()
    let update = await pool.query(
        "UPDATE vendors SET secret = $1 WHERE id = $2", [secret, req.user.id]
    );
    if (update.rowCount) {
        // sentMessage(data.phonenumber, token, "vendor")
        if (token) {
            res.status(200).json({
                msg: "OTP is generated",
                token: token,
            });
        } else {
            res.status(401).json({
                msg: "Creating token failed",
            });
        }
    } else {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
});


module.exports = Router;