'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('hospital_doctors', {
      hospital_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'hospitals',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      doctor_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'doctors',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('hospital_doctors');
  }
};
