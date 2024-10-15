// migrations/20230617122000-create-orders.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middleName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // other fields...
      photo1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photo2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photo3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photo4: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photo5: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photo6: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      xray: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ctScan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ctLink: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      scan1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      scan2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      treatment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      treatmentOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      correction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      correctionOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additionalTools: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additionalToolsOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      toothExtraction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      toothExtractionOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      correction2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      correction2Other: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gumSmileCorrection: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      midlineCorrection: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      separation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      complaints: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      complaintsOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      orthopedicTreatment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issueCaps: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'status',
          key: 'status_id',
        },
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  },
};