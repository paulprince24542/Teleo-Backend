'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: {
            tableName: 'vendors'
          },
          key: 'id'
        }
      },
      role: {
        type: Sequelize.DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  }
};