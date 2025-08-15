"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class catDokumenPengab extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      catDokumenPengab.hasMany(models.dokumenPengab, {
        foreignKey: "catdokumenpengabId",
        as: "dokumen",
      });
    }
  }
  catDokumenPengab.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "catDokumenPengab",
      tableName: "catDokumenPengabs",
    }
  );
  return catDokumenPengab;
};
