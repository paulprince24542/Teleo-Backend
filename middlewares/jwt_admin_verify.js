const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { pool } = require("../config/postgres");
//Authenticate the token
function authenticateJwtToken(req, res, next) {
    //const token = req.header("a_token");
    const token = req.cookies["a_token"];
    //console.log(token)
    if (token) {
        jwt.verify(token, config.adminSecret, (err, decoded) => {
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
        res.status(401).json({
            msg: "Unauthorized",
        });
        res.end();
    }
}

async function verifyAdmin(req, res, next) {
    const userid = req.header("id");
    if (userid) {
        const query = await pool.query("SELECT * FROM admins WHERE id = $1", [
            userid,
        ]);
        const data = await query.rows[0];
        if (data.workrole == "admin") {
            next()
        } else {
            res.status(401).json({
                msg: "Admin Forbidden",
            });
            res.end();
        }
    } else {
        res.status(401).json({
            msg: "No admin ID",
        });
        res.end();
    }
}

module.exports.verifyAdmin = verifyAdmin;

module.exports.adminToken = authenticateJwtToken;