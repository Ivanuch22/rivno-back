'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('status', {
      status_id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      status_text: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true 
      },
      createdAt: { 
        type: Sequelize.DATE 
      },
      updatedAt: { 
        type: Sequelize.DATE 
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('status');
  }
};
