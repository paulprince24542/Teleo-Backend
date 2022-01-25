const Router = require("express").Router();
const speakEasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const cryptoRandomString = require("crypto-random-string");
const axios = require("axios");

//Postgres Pool
const { pool } = require("../../../config/postgres");

//Otp Service
const { sentMessage } = require("../../../services/OTPmessage.services");

//Validations Libraries
const { loginValidate, verifySign } = require("../../../Validation/user/login.validation");


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
    userToken,
    verifyUser,
} = require("../../../middlewares/jwt_user_verify");


//var { sendMessage } = require("../../../services/TwilioService")
// Route: /api/auth/user/login
// Type: POST
// User User Login and Registeration
Router.post('/login', async(req, res) => {
    const error = loginValidate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    try {
        var phonenumber = req.body.phonenumber
        let user = await pool.query("SELECT id FROM users where phonenumber = $1", [phonenumber])
        if (user.rowCount == 1) {
            // Old User Execute this
            var { token, secret } = generateOTP(50);
            const updated = await pool.query("UPDATE users SET secret = $1 WHERE id = $2", [secret, user.rows[0].id])
            sentMessage(phonenumber, token, "testuser");
            //sendMessage(phonenumber, token)
            const userData = await pool.query(
                "SELECT id, phonenumber, phoneverified, secret FROM users where phonenumber = $1", [phonenumber]
            );
            const data = await userData.rows[0];
            const payload = {
                id: data.id,
                phonenumber: data.phonenumber,
                verified: data.phoneverified,
            };
            const AuthToken = jwt.sign(payload, config.userSecret, {
                expiresIn: '12hr'
            });
            res.set({
                "utoken": AuthToken
            }).status(200).json({
                token: token,
                msg: "Token Send",
                utoken: AuthToken,
            })

        } else {
            // New User Execute 
            var { token, secret } = generateOTP(50);
            await pool.query(
                "INSERT INTO users (id, phonenumber, secret) VALUES ($1, $2, $3)", [cryptoRandomString({ length: 24 }), phonenumber, secret]
            );
            sentMessage(phonenumber, token, "testuser");
            const userData = await pool.query(
                "SELECT id, phonenumber, phoneverified, secret FROM users where phonenumber = $1", [phonenumber]
            );
            const data = await userData.rows[0];
            const payload = {
                id: data.id,
                phonenumber: data.phonenumber,
                verified: data.phoneverified,
                secret: data.secret,
            };
            const AuthToken = jwt.sign(payload, config.userSecret, {
                expiresIn: '12h'
            });
            res.set({
                "utoken": AuthToken
            }).status(200).json({
                token: token,
                msg: "Token Send",
                utoken: AuthToken,
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Internal Sever Error"
        })
    }
})


Router.post("/verifylogin", userToken, async(req, res) => {
    const error = verifySign(req.body);
    res.setHeader("Content-Type", "application/json");
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    const newUser = await pool.query("select * from usersprofile where id = $1", [req.user.id])
    var nuser
    if (newUser.rowCount == 1) {
        nuser = false
    } else {
        nuser = true
    }
    try {
        let user = await pool.query("SELECT * FROM users WHERE id = $1", [
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
                    "UPDATE users SET phoneverified = $1 WHERE id = $2", [true, req.user.id]
                );
                if (result.rowCount) {
                    console.log(nuser)
                        // res.header("v_id", req.user.id).status(200).json({
                        //     msg: "User is verified",
                        //     id: req.user.id,
                        //     newUser: nuser
                        // });
                    res.cookie({
                        'id': req.user.id,
                        'newUser': nuser
                    }).status(200).json({
                        msg: "Login Successfully"
                    }).send()
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
                    "UPDATE users SET phoneverified = $1 WHERE id = $2", [true, req.user.id]
                );
                res.header("v_id", req.user.id).status(200).json({
                    msg: "Login Sucessfull",
                    id: req.user.id,
                    newUser: nuser
                });
                // res.cookie({
                //     'id': req.user.id,
                //     'newUser': nuser
                // }).status(200).json({
                //     msg: "Login Successfull"
                // }).send()
                // res.cookie("id", "efweef,", {
                //     httpOnly: true
                // }).json({
                //     msg: "Login Successfulleee"
                // })
            } else {
                res.status(400).json({
                    msgtoken: "Invalid OTP",
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

// Route: /api/auth/user/resendotp
// Type: POST
// User Resend Account Verification OTP
Router.post("/resendotp", userToken, async(req, res) => {
    var { token, secret } = generateOTP()
    let update = await pool.query(
        "UPDATE users SET secret = $1 WHERE id = $2", [secret, req.user.id]
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
                msg: "Error in creating token",
            });
        }
    } else {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
});


module.exports = Router;