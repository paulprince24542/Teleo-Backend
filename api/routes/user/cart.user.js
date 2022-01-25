const Router = require("express").Router();
const url = require("url");
require("dotenv").config();
const {
    userToken,
    verifyUser,
} = require("../../../middlewares/jwt_user_verify");

//Instamjo Dependency
const Insta = require("instamojo-nodejs");
const { pool } = require("../../../config/postgres");

// @Route /api/cart/user/cart
Router.get("/cart", userToken, verifyUser, async(req, res) => {
    var getCart = await pool.query("select * from v_products INNER JOIN cart ON v_products.productid=cart.productid where userid = $1;", [req.user.id])

    if (getCart.rowCount >= 1) {
        const items = await pool.query("select v_products.productid, v_products.imagelocation, v_products.productname, v_products.mrp, v_products.sellingprice, v_products.unit, cart.quantity from v_products INNER JOIN cart ON v_products.productid=cart.productid where userid = $1;", [req.user.id])
        var arr = items.rows
        let d = []
        var sum
        for (var i = 0; i < arr.length; i++) {
            d.push(parseInt(items.rows[i].sellingprice * items.rows[i].quantity))
        }
        console.log(d)
        sum = d.reduce(function(a, b) {
            return a + b;
        }, 0);
    }
    res.status(200).json({
        data: arr,
        sum: sum
    })
});

// @Route /api/cart/user/updatecart/:productid
Router.post("/updatecart/:vendorid/:productid", userToken, verifyUser, async(req, res) => {
    try {
        console.log(req.body)
        var updatecart = await pool.query("UPDATE cart SET quantity = $1 WHERE productid = $2 AND userid = $3", [req.body.quantity, req.params.productid, req.user.id])
        if (updatecart.rowCount == 1) {
            res.status(200).json({
                msg: "Cart Updated"
            })
        } else {
            console.log("Not Updated")
        }
    } catch (err) {
        res.json(400).json({
            msg: "Internal Server Error"
        })
        console.log(err)
    }
});


// Route: /api/order/user/cart/additem/:itemid
// Type: POST
// Show stores based on location
Router.post("/cart/additem/:vendorid/:itemid", userToken, verifyUser, async(req, res) => {
    console.log(req.body)
    try {
        var cartItems = await pool.query("SELECT * FROM cart WHERE productid =$1 AND userid = $2", [req.params.itemid, req.user.id])
        if (cartItems.rowCount == 1) {
            res.status(400).json({
                found: "Product is already in your cart"
            })
        } else {
            console.log(req.user.id)
            const addtocart = await pool.query("INSERT INTO cart(userid, vendorid, productid, productname,quantity, unit, price) VALUES($1, $2, $3,$4, $5, $6,$7)", [req.user.id, req.params.vendorid, req.params.itemid, req.body.productname, '1', req.body.unit, req.body.price])
            if (addtocart.rowCount == 1) {
                res.status(200).json({
                    msg: "Item is added to your cart"
                })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            err: "Internal Error"
        })
    }
});

Router.delete("/cart/deleteitem/:itemid", userToken, verifyUser, async(req, res) => {
    try {
        var remItem = await pool.query("DELETE from cart where productid = $1 AND userid = $2", [req.params.itemid, req.user.id])
        if (remItem.rowCount == 1) {
            res.status(200).json({
                msg: "Product Deleted From Cart"
            })
        }
    } catch (err) {
        res.status(400).json({
            msg: "Internal Error"
        })
    }
})

module.exports = Router;