'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,  
        allowNull: false,
        primaryKey: true,
      },
      phone: {
        type: Sequelize.DataTypes.TEXT
      },
      is_verified: {
        type: Sequelize.DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendors');
  }
};