const jwt = require("jsonwebtoken");
const { pool } = require("../config/postgres")
const config = require("../config/config");
//Authenticate the token
function authenticateJwtToken(req, res, next) {
    const token = req.header("utoken");
    if (token) {
        jwt.verify(token, config.userSecret, (err, decoded) => {
            if (!decoded) {
                res.status(400).json({
                    msg: "Unauthorized",
                });
                res.end();
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.json({
            msg: "Unauthorized",
        });
        res.end();
    }
}

async function verifyUser(req, res, next) {
    const userid = req.header("id");
    if (userid) {
        const query = await pool.query("SELECT * FROM users WHERE id = $1", [
            userid,
        ]);
        const data = await query.rows[0];
        console.log(data)
        if (data.workrole == "users") {
            if (data.phoneverified == true)
                next();
            else
                res.status(400).json({
                    msg: "Please verify your account"
                })
        } else {
            res.status(401).json({
                msg: "User Forbidden",
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

module.exports.verifyUser = verifyUser;
module.exports.userToken = authenticateJwtToken;