var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var userCart = require("../models/user-cart")

var VendorProducts = sequelize.define("vendorproducts", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  productimage:{
    type: DataTypes.STRING,
  },
  productname: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  subcategory: {
    type: DataTypes.STRING,
  },
  mrp: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  unit: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  desc: {
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
});


module.exports = VendorProducts;
