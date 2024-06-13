'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Додаємо нові стовпці
    await queryInterface.addColumn('plans', 'plan_features', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    
    await queryInterface.addColumn('plans', 'plan_description', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Видаляємо додані стовпці при відкаті міграції
    await queryInterface.removeColumn('plans', 'plan_features');
    await queryInterface.removeColumn('plans', 'plan_description');
  }
};
