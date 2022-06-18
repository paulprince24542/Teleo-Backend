"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("storetypes", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "vendors",
          },
          key: "id",
        },
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("storetypes");
  },
};
