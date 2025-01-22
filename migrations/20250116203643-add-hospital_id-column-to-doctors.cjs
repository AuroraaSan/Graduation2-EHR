'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('doctors', 'hospital_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'hospitals',
        key: 'id',
      },
      onDelete: 'CASCADE',
  });
},

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('doctors', 'hospital_id');
  }
};
