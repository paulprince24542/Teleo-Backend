'use strict';
module.exports = (sequelize, DataTypes) => {
  const cjunction = sequelize.define('cjunction', {
    firstname: DataTypes.STRING
  }, {});
  cjunction.associate = function(models) {
    // associations can be defined here
  };
  return cjunction;
};