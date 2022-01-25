var jwt = require("jsonwebtoken");
var config = require("../config/secretsConfig");

//Vendor Model
var User = require("../models/users");

async function authenticateJWTUser(req, res, next) {
    const headerTokenValue = req.headers["utoken"];
    if (headerTokenValue)
        try {
            jwt.verify(headerTokenValue, config.jwtSecret, async(err, decoded) => {
                if (decoded) {
                    console.log(decoded)
                    var checkAuth = await User.findOne({
                        where: {
                            id: decoded.id,
                        },
                    });
                    console.log(checkAuth.dataValues.is_verified)
                    if (checkAuth == null) {
                        res.status(400).json({
                            msg: "Authorization Blocked",
                        });
                    } else {
                        req.user = decoded;
                        next();
                    }
                } else {
                    res.status(401).json({
                        msg: "Unauthorized",
                    });
                    res.end();
                }
            });
        } catch (err) {
            res.status(500).json({
                msg: "Internal Server Error",
            });
        } else {
            res.status(400).json({
                msg: "No token"
            })
        }
}


async function authenticateJWTa(req, res, next) {
    const headerTokenValue = req.headers["vtoken"];
    if (headerTokenValue)
        try {
            jwt.verify(headerTokenValue, config.jwtSecret, async(err, decoded) => {
                if (decoded) {
                    var checkAuth = await User.findOne({
                        where: {
                            id: decoded.id,
                        },
                    });
                    console.log(checkAuth.dataValues.is_verified)
                    if (checkAuth == null) {
                        res.status(400).json({
                            msg: "Authorization Blocked",
                        });
                    } else {
                        req.user = decoded;
                        next();
                    }
                } else {
                    res.status(401).json({
                        msg: "Unauthorized",
                    });
                    res.end();
                }
            });
        } catch (err) {
            res.status(500).json({
                msg: "Internal Server Error",
            });
        } else {
            res.status(400).json({
                msg: "No token"
            })
        }
}




module.exports.authenticateJWTUser = authenticateJWTUser;