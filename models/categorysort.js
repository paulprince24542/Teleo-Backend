var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var Category = sequelize.define("catload", {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  subcategory : {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
});




module.exports = Category