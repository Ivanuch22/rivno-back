'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Додаємо нові стовпці
    await queryInterface.removeColumn('plans', 'stripe_id');
    

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('plans', 'stripe_id', {
      type: DataTypes.STRING,
      unique: true
  });
  }
};
