var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var UserAddress = sequelize.define("useraddress", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  address: {
    type:DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  postalcode: {
    type: DataTypes.INTEGER,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
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

module.exports = UserAddress;
