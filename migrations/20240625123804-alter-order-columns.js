'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'photo1', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'photo2', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'photo3', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'photo4', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'photo5', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'photo6', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'xray', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'ctScan', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'scan1', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('orders', 'scan2', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'photo1', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'photo2', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'photo3', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'photo4', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'photo5', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'photo6', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'xray', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'ctScan', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'scan1', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn('orders', 'scan2', {
      type: Sequelize.STRING(255),
    });
  }
};
