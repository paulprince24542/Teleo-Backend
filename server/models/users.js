var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var Roles = require("../models/user-role");
var Profile = require("../models/user-profile")
var Address = require("../models/user-address")
var Cart = require("../models/user-cart")
var Order = require("../models/orders")

var User = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  phone: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  is_verified: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DataTypes.DATE,
  },
});


module.exports = User