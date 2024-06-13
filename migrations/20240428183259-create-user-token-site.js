'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      avatar: { type: Sequelize.STRING },
      full_name: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      country: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      zip_code: { type: Sequelize.STRING },
      secret_question: { type: Sequelize.STRING },
      secret_answer: { type: Sequelize.STRING },
      alternate_email: { type: Sequelize.STRING },
      alternate_phone: { type: Sequelize.STRING },
      stripe_customer_id: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      googleId: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('tokens', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      refreshToken: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('user_sites', {
      site_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      link: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      key: {type: Sequelize.STRING,allowNull: true }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_sites');
    await queryInterface.dropTable('tokens');
    await queryInterface.dropTable('users');
  }
};
