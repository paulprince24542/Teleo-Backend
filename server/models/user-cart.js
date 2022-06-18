var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");


var UserCart = sequelize.define("usercarts", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  quantity: {
    type: DataTypes.INTEGER,
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


module.exports = UserCart;
