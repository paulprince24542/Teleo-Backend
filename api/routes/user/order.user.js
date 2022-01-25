const Router = require("express").Router();
const {
    userToken,
    verifyUser,
} = require("../../../middlewares/jwt_user_verify");

const { pool } = require("../../../config/postgres");
const { vendorSecret } = require("../../../config/config");
var format = require("pg-format");
var { orderValidate } = require("../../../Validation/user/order.validation")
const cryptoRandomString = require("crypto-random-string");


// Route: /api/order/user/cart/placeorder
// Type: POST
// User place order
Router.post("/cart/placeorder", userToken, verifyUser, async(req, res) => {
    const error = orderValidate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    try {
        console.log(req.body.orderpickup)
        var vendorid = req.body.vendorid
        var name = req.body.name
        var userId = req.user.id
        var state = req.body.state
        var city = req.body.city
        var pincode = req.body.pincode
        var houseno = req.body.houseno
        var address = req.body.address
        var paymentmode = req.body.paymentmode
        var orderpickup = req.body.orderpickup
        var orderId = cryptoRandomString({ length: 20 })
        var placeorder = await pool.query("SELECT vendorid, userid, productid, productname, price, quantity, unit FROM cart WHERE userid = $1", [userId])
        var data = []
        var propertyNames
        var date = new Date()
        var hour = date.getHours()
        var minute = date.getMinutes()
        placeorder.rows.forEach(items => {
            // console.log(items.productid)
            items.orderid = orderId
            items.name = name
            items.state = state
            items.city = city
            items.pincode = pincode
            items.houseno = houseno
            items.address = address
            items.paymentmode = paymentmode
            items.orderpickup = orderpickup
            items.payment = false
            items.orderstatus = "pending"
            items.ordertime = `${hour}:${minute}`
            propertyNames = Object.values(items);

            data.push(propertyNames)
        });
        console.log(data)
        var s = format('INSERT INTO vendorsorders (vendorid, userid, productid,productname, price, quantity, unit, orderid, name, state, city, pincode, houseno, address, paymentmode, orderpickup, payment, orderstatus, ordertime) VALUES %L', data)
        var su = format('INSERT INTO usersorders (vendorid, userid, productid,productname, price, quantity, unit, orderid, name, state, city, pincode, houseno, address, paymentmode, orderpickup, payment, orderstatus, ordertime) VALUES %L', data)
        var query = await pool.query(s)
        var query = await pool.query(su)
        if (query.rowCount != 0) {
            var clearCart = pool.query("DELETE from cart where userid = $1", [req.user.id])
            res.status(200).json({
                msg: "Added"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: err
        })
    }
})

Router.get("/showorders", userToken, verifyUser, async(req, res) => {
    //var showOrder = await pool.query("select productname, price, quantity, unit, orderstatus from vendorsorders where userid = $1", [req.user.id])
    var showOrder = await pool.query("select v_products.productid, usersorders.productname,usersorders.price,usersorders.quantity,usersorders.unit,usersorders.orderstatus, v_products.imagelocation from usersorders LEFT JOIN v_products ON v_products.productid=usersorders.productid where userid = $1;", [req.user.id])
    console.log(showOrder.rows)
    var data = await showOrder.rows
    if (data) {
        res.status(200).json({
            data: data
        })
    } else {
        res.status(400).json({
            msg: "No Data"
        })
    }
})



module.exports = Router;