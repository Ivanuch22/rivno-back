module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'subscription', // Назва таблиці
      'stripe_subscription_id', // Назва нового стовпця
      {
        type: Sequelize.STRING,
        allowNull: false, // Поле може бути порожнім, якщо ще немає підписки
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'subscription', // Назва таблиці
      'stripe_subscription_id', // Стовпець для видалення
    );
  },
};
