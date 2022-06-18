var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");


var UserProfile = sequelize.define("userprofile", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  profileimage:{
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
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


module.exports = UserProfile;
