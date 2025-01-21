'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
      id: {
          type: Sequelize.STRING,
          primaryKey: true,
          autoIncrement: false
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      full_name: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      national_id: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      phone_number: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      hospital_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
              model: 'hospitals',
              key: 'id',
          },
          onDelete: 'CASCADE',
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
    await queryInterface.dropTable('admins');
  }
};
