const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
const jwt = require("jsonwebtoken")

const config = require("../../../config/config");
const {
    verifyAdmin,
    adminToken,
} = require("../../../middlewares/jwt_admin_verify");

const { pool } = require("../../../config/postgres");


Router.post("/signup", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    var found = await pool.query("SELECT id from admins WHERE username = $1", [username]);
    if (found.rowCount == 1) {
        res.status(201).json({
            msg: "Admin already found"
        })
    } else {
        var salt = await bcrypt.genSalt(10);
        var hash = await bcrypt.hash(password, salt)
        console.log(hash)
        var newAdmin = await pool.query("INSERT INTO admins VALUES($1,$2,$3,$4,$5)", [cryptoRandomString({ length: 24 }), username, hash, true, "admin"])
        if (newAdmin.rowCount == 1)
            res.status(200).json({
                msg: "Admin Added"
            })
        else
            res.status(400).json({
                msg: "Error in adding new admin"
            })
    }


})

Router.post("/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let admin = await pool.query("SELECT id from admins WHERE username = $1", [username]);
    if (admin.rowCount == 1) {
        var ap = await pool.query("SELECT password from admins where username = $1", [username]);
        var hashedpassword = await bcrypt.compare(password, ap.rows[0].password)
        if (hashedpassword == true) {
            var payload = {
                id: ap.rows[0].id
            }
            const token = jwt.sign(payload, config.adminSecret, {
                expiresIn: 60 * 2
            });
            // console.log(token)
            res.status(200).cookie("a_token", token).json({
                login: true,
                msg: "Admin Authenticated",
                a_token: token
            })

        } else {
            res.status(401).json({
                msg: "Incorrect Password"
            })
        }
    }
})

Router.get("/test", adminToken, (req, res) => {
    res.send("verutthe")
})

module.exports = Router