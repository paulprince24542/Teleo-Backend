var { Sequelize, DataTypes } = require("sequelize");
var sequelize = require("../config/DbConfig");

var VendorProfile = sequelize.define("vendorprofile", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  profileimage:{
    type: DataTypes.STRING,
  },
  type: {
    type: Sequelize.STRING,
  },
  ownername: {
    type: DataTypes.STRING,
  },
  alternatephone: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
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
  gst:{
    type: DataTypes.STRING,
  },
  fssai:{
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

module.exports = VendorProfile;
