var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var Roles = sequelize.define("roles", {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
});




module.exports = Roles