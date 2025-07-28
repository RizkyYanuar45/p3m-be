"use strict";
const bcrypt = require("bcrypt"); // 1. Impor bcrypt

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 2. Hash password sebelum dimasukkan
    const hashedPassword = await bcrypt.hash("password123", 10); // Ganti 'password123' dengan password default Anda

    await queryInterface.bulkInsert(
      "admins",
      [
        {
          name: "Super Admin",
          email: "superadmin@gmail.com",
          password: hashedPassword, // 3. Gunakan password yang sudah di-hash
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Menghapus semua data dari tabel admins.
     */
    await queryInterface.bulkDelete("admins", null, {});
  },
};
