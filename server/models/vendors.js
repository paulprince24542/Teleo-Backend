var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var Roles = require("../models/roles");
const VendorProfile = require("../models/vendor-profile");
const VendorProduct = require("../models/vendor-products");


var Vendor = sequelize.define("vendors", {
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


module.exports = Vendor