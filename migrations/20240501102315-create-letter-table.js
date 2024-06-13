'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LetterArchive', {
      letter_id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      body: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      status_id: { 
        type: Sequelize.INTEGER, 
        references: { 
          model: 'status', 
          key: 'status_id' 
        },
        allowNull: false 
      },
      user_id: { 
        type: Sequelize.INTEGER, 
        references: { 
          model: 'users', 
          key: 'id' 
        },
        allowNull: false 
      },
      site_id: { 
        type: Sequelize.INTEGER, 
        references: { 
          model: 'user_sites', 
          key: 'site_id' 
        },
        allowNull: false 
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
    await queryInterface.dropTable('LetterArchive');
  }
};
