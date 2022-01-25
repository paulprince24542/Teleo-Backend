'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("catloads", [
      {
        id: uuidv4(),
        type: 'Supermarket/General Stores',
        category: 'Grocery',
        subcategory: 'Food Grains',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'Supermarket/General Stores',
        category: 'Grocery',
        subcategory: 'Cereals',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'Supermarket/General Stores',
        category: 'Grocery',
        subcategory: 'Masala',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'Supermarket/General Stores',
        category: 'Fruits and Vegetables',
        subcategory: 'Fruits',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'Supermarket/General Stores',
        category: 'Fruits and Vegetables',
        subcategory: 'Vegetables',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
