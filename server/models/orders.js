var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var Orders = sequelize.define("orders", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  orderid: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  productid: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  price: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  orderstatus: {
    type: DataTypes.INTEGER,
    defaultValue: 0,

    //0-Order Placed
    //1-Order Accepted
    //2-Order Delined
    //3-Up for delivery
    //4-Delivered
  },
  ordertype: {
    type: DataTypes.INTEGER, //0-Store Pickup 1-Home Delivery
    defaultValue: 0,
    allowNull: false,
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

module.exports = Orders;
