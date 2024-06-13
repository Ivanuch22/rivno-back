'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Створення таблиці Subscription
    await queryInterface.createTable('subscription', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sites_limit: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      messages_limit: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      createdAt: { 
        type: Sequelize.DATE 
      },
      updatedAt: { 
        type: Sequelize.DATE 
      }
    });

    // Створення таблиці Addon
    await queryInterface.createTable("addon", {
      addon_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stripe_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      messages_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sites_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      plan_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'plans',
          key: 'plan_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addon');
    await queryInterface.dropTable('subscription');
  },
};
