'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('admissions', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        autoIncrement: false
    },
    patient_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'patients',
            key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
    },
    doctor_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'doctors',
            key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
    },
    admin_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
    },
    hospital_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'hospitals',
            key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
    },
    discharge_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });
},

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('admissions');
  }
};
