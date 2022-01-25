var Router = require("express").Router();

//User Model
var User = require("../../models/users");
var Roles = require("../../models/user-role");
var config = require("../../config/secretsConfig");
var jwt = require("jsonwebtoken");
var { authenticateJWTUser } = require("../../middlewares/userJWT");
var {
    generateOtp,
    secretGenerator,
    validateOtp,
} = require("../../services/otp.service");

// @Route /api/user/login
// @Method POST
Router.post("/login", async(req, res) => {
    try {
        var phone = req.body.phone;
        var presentUser = await User.findOne({
            where: {
                phone: phone,
            },
        });
        if (presentUser == null) {
            var newUser = await User.create({
                phone,
            });
            var newUserRoles = await Roles.create({
                role: "user",
                userId: newUser.dataValues.id,
            });
            if (newUserRoles.dataValues.id) {
                console.log("New Vendor Account");

                jwt.sign({
                        id: newUser.dataValues.id,
                        phone: newUser.dataValues.phone,
                        verified: newUser.dataValues.is_verified,
                    },
                    config.jwtSecret,
                    async function(err, token) {
                        var data = await generateOtp();
                        console.log("OTP: ", data.token);
                        // sendOTP(newUser.dataValues.phone,data.token,'vendor')
                        res.status(200).json({
                            account: "New User",
                            msg: "Otp generated",
                            otp: data.token,
                            secret: data.secret,
                            vtoken: token,
                        });
                    }
                );
            }
        } else {
            console.log("Vendor Account Found");
            var vendordata = presentUser.dataValues;
            if (vendordata.id) var data = await generateOtp();
            jwt.sign({
                    id: presentUser.dataValues.id,
                    phone: presentUser.dataValues.phone,
                    verified: presentUser.dataValues.is_verified,
                },
                config.jwtSecret,
                async function(err, token) {
                    var data = await generateOtp();
                    console.log("OTP: ", data.token);
                    // sendOTP(newVendor.dataValues.phone,data.token,'vendor')
                    res.status(200).json({
                        account: "Found",
                        msg: "Otp generated",
                        otp: data.token,
                        secret: data.secret,
                        vtoken: token,
                    });
                }
            );
        }
    } catch (err) {
        res.status(401).json({
            msg: err
        })
    }
});

// @Route /api/user/verifylogin

Router.post("/verifylogin", authenticateJWTUser, async(req, res) => {
    console.log(req.body);
    var verifyToken = await validateOtp(req.body.token, req.body.secret);
    console.log(verifyToken);
    if (verifyToken == true) {
        var foundVerified = await User.findOne({
            where: {
                id: req.user.id,
            },
        });
        if (foundVerified.dataValues.is_verified == true) {
            res.status(200).json({
                data: "Otp Valid",
            });
        } else {
            User.update({
                is_verified: true,
            }, {
                where: {
                    id: req.user.id,
                },
            });
            res.status(200).json({
                data: "Otp Valid",
                msg: "User Verified",
            });
        }
    } else {
        res.status(400).json({
            msg: "Invalid Otp"
        })
    }
});

Router.post("/resendotp", authenticateJWTUser, async(req, res) => {
    try {
        var data = await generateOtp();
        if (data) {
            res.status(200).json({
                token: data.token,
                secret: data.secret,
            });
        } else {
            res.status(401).json({
                msg: "Token regeneration failed"
            })
        }
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error",
        });
    }
});

module.exports = Router;