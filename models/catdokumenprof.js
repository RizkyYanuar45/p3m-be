"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class catDokumenProf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      catDokumenProf.hasMany(models.dokumenProf, {
        foreignKey: "catdokumenprofId",
        as: "dokumen",
      });
    }
  }
  catDokumenProf.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "catDokumenProf",
      tableName: "catdokumenprofs",
    }
  );
  return catDokumenProf;
};
