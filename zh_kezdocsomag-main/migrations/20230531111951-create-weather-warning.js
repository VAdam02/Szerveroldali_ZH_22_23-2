'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('WarningsWeather', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        WeatherId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Weather",
                key: "id",
            },
            onDelete: "cascade",
        },
        WarningId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Warning",
                key: "id",
            },
            onDelete: "cascade",
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WeatherWarnings');
  }
};
