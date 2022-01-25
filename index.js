const express = require("express");
const app = express();
const path = require("path")
    //Sub Libraries
const bodyParser = require("body-parser");
const volleyball = require("volleyball");
var cookieParser = require('cookie-parser')
var cors = require("cors")

//Sub Routes

const adminAuth = require("./api/routes/admin/auth.admin");


const vendorAuth = require("./api/routes/vendor/auth.vendor");
const vendorProfile = require("./api/routes/vendor/profile.vendor");
const vendorProducts = require("./api/routes/vendor/product.vendor");
const vendorOrders = require("./api/routes/vendor/orders.vendor");
const publicVendors = require("./api/routes/vendor/public.vendor");

const userAuth = require("./api/routes/user/auth.user");
const userProfile = require("./api/routes/user/profile.user");
const userOrder = require("./api/routes/user/order.user");
const userCart = require("./api/routes/user/cart.user");

//Configuration Files
const config = require("./config/config");

//Middleware Parser
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(volleyball);
app.use(cookieParser())
app.use(cors())

app.use("/api/auth/admin", adminAuth);
//app.use(express.static("./client/public"));

app.use("/api/auth/vendor", vendorAuth);
app.use("/api/data/vendor", vendorProfile);
app.use("/api/products/vendor", vendorProducts);
app.use("/api/orders/vendor", vendorOrders);
app.use("/vendor/data", publicVendors)

app.use("/api/auth/user", userAuth);
app.use("/api/data/user", userProfile);
app.use("/api/order/user", userOrder);
app.use("/api/cart/user", userCart);

app.get("/", (req, res) => {
    res.send("Server is running")
})

// app.get("/api/admin/login", (req, res) => {
//     res.sendFile(path.join(__dirname + '/client/public/index.html'))
// });

app.listen(8080, (req, res) => {
    console.log("Server Started at port 8080")
})