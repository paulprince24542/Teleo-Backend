var express = require("express");
var app = express();
var volleyball = require("volleyball");
require("dotenv").config();

//Sequelize Configurations
var sequelize = require("./config/DbConfig");

//Connection Establishment
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

//Default Model Sync
sequelize.sync({
  alter: true
});


//Express Parsing
app.use(express.urlencoded())
app.use(express.json())



//Logs
app.use(volleyball)

//Model Relationship User
var { Sequelize, DataTypes } = require("sequelize");

var User = require("./models/users");
var Cart = require("./models/user-cart");
var UserRoles = require("./models/user-role");
var Address = require("./models/user-address");
var Profile = require("./models/user-profile");
var Order = require("./models/orders");

User.hasOne(UserRoles,{
  foreignKey:{
    type: DataTypes.UUID,
    allowNull: false,
  }
});
UserRoles.belongsTo(User)

User.hasOne(Profile,{
  foreignKey:{
    type: DataTypes.UUID,
    allowNull: false,
  }
});
Profile.belongsTo(User)

User.hasMany(Address, {
  foreignKey:{
    type: DataTypes.UUID,
    allowNull: false
  }
})
Address.belongsTo(User)

User.hasMany(Cart,{
  foreignKey:{
    type: DataTypes.UUID,
    allowNull: false
  }
})

Cart.belongsTo(User)

User.hasMany(Order, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
})

Order.belongsTo(User)


//Model Relationship Vendor

var Vendor = require("./models/vendors");
var VendorsRoles = require("./models/roles");
var VendorProfile = require("./models/vendor-profile");
var VendorProduct = require("./models/vendor-products")

Vendor.hasOne(VendorsRoles, {
  foreignKey:{
    type: DataTypes.UUID,
    allowNull: false,
  }
});
VendorsRoles.belongsTo(Vendor)


Vendor.hasOne(VendorProfile,{
  foreignKey:{
    type: DataTypes.UUID,
    allowNull: false,
  }
});
VendorProfile.belongsTo(Vendor)

Vendor.hasMany(VendorProduct, {
  foreignKey:{
    type: DataTypes.UUID,
    allowNull: false,
  }
})
VendorProduct.belongsTo(Vendor)

VendorProduct.hasMany(Cart, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
})
Cart.belongsTo(VendorProduct)





// Co-Relation Model
// VendorProduct.belongsToMany(VendorProduct,{ as: "VendorProduct", foreignKey: "ProductId", through: "CartJunction"});
// VendorProduct.belongsToMany(VendorProduct,{ as: "CartProduct", foreignKey: "CartId", through: "CartJunction"});

//Sub Routes
var VendorAuth = require("./routes/vendors/vendor.auth");
var UserAuth = require("./routes/users/user.auth");

var VendorProfile = require("./routes/vendors/vendor.profile")
var UserProfile = require("./routes/users/user.profile")
var UserCart = require("./routes/users/user.cart")

var VendorProduct = require("./routes/vendors/vendor.product");
var VendorOrder  = require("./routes/vendors/vendor.order")

//Sub Routes Config
app.use("/api/user/auth", UserAuth);
app.use("/api/vendor/auth", VendorAuth);


app.use("/api/vendor", VendorProfile)
app.use("/api/user", UserProfile)
app.use("/api/user/cart", UserCart)


app.use("/api/vendor/product", VendorProduct)
app.use("/api/vendor/orders", VendorOrder)



app.get("/", (req,res) => {
  res.send("Up and Running")
})

var PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server Initiated Successfully")
})