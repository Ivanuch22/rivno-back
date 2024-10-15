module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'age', {
      type: Sequelize.STRING // або TEXT
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'age', {
      type: Sequelize.INTEGER
    });
  }
};
