"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("files", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      file_type: {
        type: Sequelize.ENUM(
          "panduan_penelitian",
          "sk_rektor_penelitian",
          "dokumen_penelitian",
          "dokumen_pengabdian_masyarakat_mandiri",
          "panduan_pengabdian_masyarakat",
          "sk_rektor_pengabdian_masyarakat",
          "dokumen_penting_pengabdian_masyarakat",
          "panduan_kkn_bbm",
          "sk_rektor_pelaksanaan_kkn_bbm"
        ),
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("files");
  },
};
