const Router = require("express").Router();

//Postgres Pool
const { pool } = require("../../../config/postgres");

const {
    userToken,
    verifyUser,
} = require("../../../middlewares/jwt_user_verify");

Router.post("/profile", userToken, async(req, res) => {
    const name = req.body.name
    const email = req.body.email;
    const query = await pool.query("INSERT INTO usersprofile VALUES($1,$2,$3,$4)", [req.user.id, name, email, req.user.phonenumber])
    if (query.rowCount == 1) {
        res.status(200).json({
            msg: "Profile has been added",
            added: true,
        })
    }
})


Router.get("/profile", userToken, async(req, res) => {
    const getProfile = await pool.query("SELECT * from usersprofile where id = $1", [req.user.id])
    console.log(getProfile.rows)
    if (getProfile.rowCount == 1) {
        res.status(200).json({
            profile: getProfile.rows
        })
    }
})

module.exports = Router;