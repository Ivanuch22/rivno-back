'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // // Додаємо нові стовпці
    // await queryInterface.addColumn('plans', 'stripe_id_mo', {
    //   type: Sequelize.STRING,
    //   unique: true
    // });
    
    // await queryInterface.addColumn('plans', 'stripe_id_y', {
    //   type: Sequelize.STRING,
    //   unique: true
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Видаляємо додані стовпці при відкаті міграції
    await queryInterface.removeColumn('plans', 'stripe_id_y');
    await queryInterface.removeColumn('plans', 'stripe_id_mo');
  }
};
