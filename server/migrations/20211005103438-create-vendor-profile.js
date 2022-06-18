'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendor-profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.UUID
      },
      ownername: {
        type: Sequelize.STRING
      },
      alternatephone: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      postalcode: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendor-profiles');
  }
};