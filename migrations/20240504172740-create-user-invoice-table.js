'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_invoice", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      invoice_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: { 
        type: Sequelize.DATE 
      },
      updatedAt: { 
        type: Sequelize.DATE 
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_invoice");
  },
};
