"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      published_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM,
        values: [
          "informasi_kkn",
          "informasi_pengabdian_masyarakat",
          "informasi_pengabdian_masyarakat_mandiri",
          "informasi_penelitian",
          "umum",
        ],
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
    await queryInterface.dropTable("Articles");
  },
};
