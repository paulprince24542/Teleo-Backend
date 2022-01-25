const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { pool } = require("../config/postgres");
const { verifyUser } = require("./jwt_user_verify");
//Authenticate the token
function authenticateJwtToken(req, res, next) {
    const bearer_token = req.headers["vtoken"]
    if (bearer_token) {
        jwt.verify(bearer_token, config.vendorSecret, async(err, decoded) => {
            if (!decoded) {
                res.status(401).json({
                    msg: "Unauthorized",
                });
                res.end();
            } else {
                var checkAuthU = await pool.query("SELECT id from vendors where id = $1", [decoded.id]);
                if (checkAuthU.rowCount == 1) {
                    req.user = decoded;
                    next();
                } else {
                    res.status(400).json({
                        msg: "Invalid Token Authorization Restricted"
                    })
                }

            }
        });
    } else {
        res.status(401).json({
            msg: "No token Found",
        });
        res.end();
    }
}

async function verifyVendor(req, res, next) {
    const userid = req.header("id");
    if (userid) {
        const query = await pool.query("SELECT workrole, phoneverified FROM vendors WHERE id = $1", [
            userid,
        ]);
        const data = await query.rows[0];
        if (data.workrole === "vendors") {
            if (data.phoneverified == true)
                next();
            else
                res.status(400).json({
                    msg: "Please verify your account"
                })
        } else {
            res.status(401).json({
                msg: "Vendor Forbidden",
            });
            res.end();
        }
    } else {
        res.status(401).json({
            msg: "No ID",
        });
        res.end();
    }
}

module.exports.verifyVendor = verifyVendor;
module.exports.vendorToken = authenticateJwtToken;