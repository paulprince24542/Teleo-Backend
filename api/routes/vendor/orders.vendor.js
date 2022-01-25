const Router = require("express").Router();
//Postgres Pool
const { pool } = require("../../../config/postgres");

const {
    vendorToken,
    verifyVendor,
} = require("../../../middlewares/jwt_vendor_verify");
var format = require("pg-format");

//@Route /api/orders/vendor/getorders
Router.get("/getorders", verifyVendor, vendorToken, async(req, res) => {
    const getCount = await pool.query(
        "SELECT DISTINCT orderid,name, COUNT(orderid) as COUNT, SUM(quantity * price) as total, orderstatus from vendorsorders where vendorid = $1 group by orderid, orderstatus, name", [req.user.id]
    );
    console.log(getCount.rows)
    if (getCount.rowCount != 0) {
        res.status(200).json({
            data: getCount.rows
        })
    } else {
        res.status(200).json({
            data: []
        })
    }
});


//@Route //@Route /api/orders/vendor/getorders/items/:orderid
Router.get(
    "/getorders/items/:orderid",
    verifyVendor,
    vendorToken,
    async(req, res) => {
        // var getitems = await pool.query(
        //     "select productname, quantity, price, unit, ordertime, orderstatus, userid, orderpickup, paymentmode from vendorsorders where vendorid = $1 AND orderid = $2;", [req.user.id, req.params.orderid]
        // );
        var getitems = await pool.query(
            "SELECT vendorsorders.productname,  vendorsorders.quantity, vendorsorders.unit, vendorsorders.price, SUM(vendorsorders.quantity * vendorsorders.price) as total, imagelocation, vendorsorders.orderstatus, vendorsorders.orderid, vendorsorders.userid, vendorsorders.name as username from vendorsorders INNER JOIN v_products ON vendorsorders.productid = v_products.productid where orderid = $1 AND vendorid = $2 GROUP BY vendorsorders.productname, vendorsorders.orderid, vendorsorders.unit,vendorsorders.price, vendorsorders.quantity, imagelocation, vendorsorders.orderstatus, vendorsorders.orderid, vendorsorders.userid, vendorsorders.name", [req.params.orderid, req.user.id]
        );

        var sumData = await pool.query("SELECT price, quantity from vendorsorders where vendorid = $1 AND orderid = $2", [req.user.id, req.params.orderid])
        var data = await pool.query("SELECT orderstatus, orderpickup, payment, ordertime, paymentmode from vendorsorders where vendorid = $1 AND orderid = $2", [req.user.id, req.params.orderid])
        console.log(data.rows)
        console.log(getitems.rows)
        var userid = getitems.rows[0].userid;
        var phonenumber = await pool.query("select phonenumber from users where id = $1", [userid])
        var name = await pool.query("select name from usersprofile where id = $1", [userid])
        var sum = sumData.rows.reduce(function(a, b) {
            return a + parseInt(b.price) * parseInt(b.quantity)
        }, 0)
        if (getitems != 0) {
            res.status(200).json({
                data: getitems.rows,
                sum: sum,
                phonenumber: phonenumber.rows[0].phonenumber,
                username: name.rows[0].name,
                orderedtime: data.rows[0].ordertime,
                status: data.rows[0].orderstatus,
                delivery: data.rows[0].orderpickup,
                paymentmethod: data.rows[0].paymentmode
            })
        } else {
            data: []
        }
    }
);



Router.get(
    "/getorders/items/upfordelivery/:orderid",
    verifyVendor,
    vendorToken,
    async(req, res) => {
        // var getitems = await pool.query(
        //     "select productname, quantity, price, unit, ordertime, orderstatus, userid, orderpickup, paymentmode from vendorsorders where vendorid = $1 AND orderid = $2;", [req.user.id, req.params.orderid]
        // );
        var getitems = await pool.query(
            "SELECT acceptedorders.productname,  acceptedorders.quantity, acceptedorders.unit, acceptedorders.price, SUM(acceptedorders.quantity * acceptedorders.price) as total, imagelocation, acceptedorders.orderstatus, acceptedorders.orderid, acceptedorders.userid, acceptedorders.name as username from acceptedorders INNER JOIN v_products ON acceptedorders.productid = v_products.productid where orderid = $1 and vendorid = $2 GROUP BY acceptedorders.productname, acceptedorders.orderid, acceptedorders.unit,acceptedorders.price, acceptedorders.quantity, imagelocation, acceptedorders.orderstatus, acceptedorders.orderid, acceptedorders.userid, acceptedorders.name", [req.params.orderid, req.user.id]
        );

        var sumData = await pool.query("SELECT price, quantity from acceptedorders where vendorid = $1 AND orderid = $2", [req.user.id, req.params.orderid])
        var data = await pool.query("SELECT orderstatus, orderpickup, payment, ordertime, paymentmode from acceptedorders where vendorid = $1 AND orderid = $2", [req.user.id, req.params.orderid])
        console.log(data.rows)
        console.log(getitems.rows)
        var userid = getitems.rows[0].userid;
        var phonenumber = await pool.query("select phonenumber from users where id = $1", [userid])
        var name = await pool.query("select name from usersprofile where id = $1", [userid])
        console.log(name.rows)
        var sum = sumData.rows.reduce(function(a, b) {
            return a + parseInt(b.price) * parseInt(b.quantity)
        }, 0)
        if (getitems != 0) {
            res.status(200).json({
                data: getitems.rows,
                sum: sum,
                phonenumber: phonenumber.rows[0].phonenumber,
                username: name.rows[0].name,
                orderedtime: data.rows[0].ordertime,
                status: data.rows[0].orderstatus,
                delivery: data.rows[0].orderpickup,
                paymentmethod: data.rows[0].paymentmode
            })
        } else {
            data: []
        }
    }
);

//@Route //@Route /api/orders/vendor/getorders/items/confirm/:orderid
Router.post("/getorders/items/confirm/:orderid", verifyVendor,
    vendorToken, async(req, res) => {
        const status = req.body.status;
        if (status == "Accepted") {
            try {
                var getitems = await pool.query(
                    "update vendorsorders set orderstatus= $1 where vendorid = $2 AND orderid = $3", [status, req.user.id, req.params.orderid]
                );
                var updateStatus = await pool.query(
                    "update usersorders set orderstatus= $1 where vendorid = $2 AND orderid = $3", [status, req.user.id, req.params.orderid]
                );
                console.log(getitems.rowCount)
                if (getitems.rowCount != 0) {
                    var getOrder = await pool.query("select * from vendorsorders where orderid = $1", [req.params.orderid])
                    var data = []
                    var property
                    getOrder.rows.forEach(items => {
                        property = Object.values(items)
                        data.push(property)
                    })
                    var s = format('INSERT INTO acceptedorders(vendorid, userid, productid,productname, price, quantity, unit, orderid, name, state, city, pincode, houseno, address, paymentmode, orderpickup, payment, orderstatus, ordertime) VALUES %L', data)
                    const accepted = await pool.query(s)
                    var deletedOrder = await pool.query("DELETE from vendorsorders where orderid = $1", [req.params.orderid])
                    if (accepted.rowCount != 0) {
                        res.status(200).json({
                            msg: "Status Updated",
                        });
                    } else {
                        res.status(400).json({
                            msg: "Status Updation Failed",
                        });
                    }
                }
            } catch (err) {
                console.log(err)
                res.status(400).json({
                    msg: "Internal Server Error"
                })
            }
        } else if (status == "Declined") {
            var updateOrder = await pool.query("UPDATE vendorsorders set orderstatus = $1 where orderid = $2", [req.body.status, req.params.orderid])
            var updateOrder = await pool.query("UPDATE usersorders set orderstatus = $1 where orderid = $2", [req.body.status, req.params.orderid])
            var getOrder = await pool.query("select * from vendorsorders where orderid = $1", [req.params.orderid])
            var data = []
            var property
            getOrder.rows.forEach(items => {
                property = Object.values(items)
                data.push(property)
            })
            console.log(data)
            var s = format('INSERT INTO cancelledorders(vendorid, userid, productid,productname, price, quantity, unit, orderid, name, state, city, pincode, houseno, address, paymentmode, orderpickup, payment, orderstatus, ordertime) VALUES %L', data)
            console.log(s)
            var cancelledorder = pool.query(s);
            var delteItems = pool.query("DELETE from vendorsorders where orderid = $1", [req.params.orderid])
            res.status(200).json({
                msg: "Order has been declined"
            })
        }

    });


Router.get("/getorders/details/:orderid", verifyVendor,
    vendorToken, async(req, res) => {
        const details = await pool.query("select DISTINCT state,city,pincode,houseno,address from acceptedorders where orderid = $1", [req.params.orderid])
        if (details.rowCount != 0) {
            res.status(200).json({
                details: {
                    address: details.rows[0].address,
                    houseno: details.rows[0].houseno
                }
            })
        } else {
            res.status(400).json({
                details: []
            })
        }
    })



Router.post("/update/order/:orderid", verifyVendor, vendorToken, async(req, res) => {
    // var updateStatus = await pool.query("update vendorsorders set orderstatus = $1 where orderid = $2", [req.body.status, req.params.orderid]);
    // var updated = await updateStatus.rowCount
    // console.log(updated)

    if (req.body.status == "Delivered") {
        var getOrder = await pool.query("select * from acceptedorders where orderid = $1", [req.params.orderid])
        console.log(getOrder.rows)
            // var orders = await pool.query("select * from vendorsorders where orderid = $1 AND vendorid = $2", [req.params.orderid, req.user.id])
            // var s = format('INSERT INTO vendorsorders (vendorid, userid, productid,productname, price, quantity, unit, orderid, name, state, city, pincode, houseno, address, paymentmode, orderpickup, payment, orderstatus, ordertime) VALUES %L', orders.rows)
            // console.log(s)
            // var previousOrders = orders.rows
        var updateStatus = await pool.query("update acceptedorders set orderstatus = $1 where orderid = $2", ["Delivered", req.params.orderid]);
        var updateStatus = await pool.query("update usersorders set orderstatus = $1 where orderid = $2", ["Delivered", req.params.orderid]);

        var data = []
        var property
            // data.push(getOrder.rows)
        getOrder.rows.forEach(items => {
            property = Object.values(items)
            data.push(property)
        })
        console.log(data)
            // console.log(getOrder.rows)
        var s = format('INSERT INTO deliveredorders(vendorid, userid, productid,productname, price, quantity, unit, orderid, name, state, city, pincode, houseno, address, paymentmode, orderpickup, payment, orderstatus, ordertime) VALUES %L', data)
        console.log(s)
        const delivered = await pool.query(s)
        var deleteOrder = await pool.query("DELETE from acceptedorders where orderid = $1", [req.params.orderid])
        res.status(200).json({
            msg: "Delivered"
        })

    } else if (req.body.status == "Order Pickup") {
        var getOrder = await pool.query("select * from acceptedorders where orderid = $1", [req.params.orderid])
        console.log("reg")
        var updateStatus = await pool.query("update acceptedorders set orderstatus = $1 where orderid = $2", [req.body.status, req.params.orderid]);
        var updateStatus = await pool.query("update usersorders set orderstatus = $1 where orderid = $2", [req.body.status, req.params.orderid]);

        console.log(getOrder.rows)
        res.status(200).json({
            msg: "Order Pickup"
        })
    } else if (req.body.status == "Reverted") {
        try {
            var updateStatus = await pool.query("update acceptedorders set orderstatus = $1 where orderid = $2", ["pending", req.params.orderid]);
            if (updateStatus.rowCount != 0) {
                var getOrder = await pool.query("select * from acceptedorders where orderid = $1", [req.params.orderid])
                var data = []
                var property
                    // data.push(getOrder.rows)
                getOrder.rows.forEach(items => {
                    property = Object.values(items)
                    data.push(property)
                })

                var s = format('INSERT INTO vendorsorders(vendorid, userid, productid,productname, price, quantity, unit, orderid, name, state, city, pincode, houseno, address, paymentmode, orderpickup, payment, orderstatus, ordertime) VALUES %L', data)
                const reverted = await pool.query(s)
                var deleteReverted = await pool.query("DELETE from acceptedorders where orderid = $1 and vendorid = $2", [req.params.orderid, req.user.id])
                console.log(deleteReverted.rowCount)
                if (deleteReverted.rowCount != 0) {
                    res.status(200).json({
                        msg: "Status Updated",
                    });
                } else {
                    res.status(400).json({
                        msg: "Status Updation Failed",
                    });
                }
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                msg: "Internal Server Error"
            })
        }

    }
})


Router.get("/fordelivery", verifyVendor, vendorToken, async(req, res) => {
    try {
        console.log(req.user)
        console.log(req.user.id)
        const getData = await pool.query(
            "SELECT DISTINCT orderid,name, COUNT(orderid) as COUNT, SUM(quantity * price) as total, orderstatus, orderpickup from acceptedorders where vendorid = $1 group by orderid, orderstatus, name, orderpickup", [req.user.id]
        );
        console.log(getData.rows)
        if (getData.rowCount != 0) {
            res.status(200).json({
                data: getData.rows
            })
        } else {
            res.status(200).json({
                data: []
            })
        }
    } catch (err) {
        console.log(err)
        res.status(200).json({
            msg: "Internal Server Error"
        })
    }

})


Router.get("/cancelled", verifyVendor, vendorToken, async(req, res) => {
    try {
        console.log(req.user)
        console.log(req.user.id)
        var cancelled = await pool.query("select DISTINCT cancelledorders.orderid, quantity*price as total, cancelledorders.name, cancelledorders.userid, users.phonenumber from cancelledorders INNER JOIN users ON cancelledorders.userid = users.id where vendorid = $1", [req.user.id])
        if (cancelled.rowCount != 0) {
            res.status(200).json({
                data: cancelled.rows
            })
        } else {
            res.status(400).json({
                data: []
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: "Internal Server Error"
        })
    }
})

Router.get("/delivered", verifyVendor, vendorToken, async(req, res) => {
    try {
        var delivered = await pool.query("select DISTINCT deliveredorders.orderid, quantity*price as total, deliveredorders.name, deliveredorders.userid, users.phonenumber from deliveredorders INNER JOIN users ON deliveredorders.userid = users.id where vendorid = $1", [req.user.id])
        if (delivered.rowCount != 0) {
            res.status(200).json({
                data: delivered.rows
            })
        } else {
            res.status(400).json({
                data: []
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: "Internal Server Error"
        })
    }
})


module.exports = Router;