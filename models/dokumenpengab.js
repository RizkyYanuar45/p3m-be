"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dokumenPengab extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dokumenPengab.belongsTo(models.catDokumenPengab, {
        foreignKey: "catdokumenpengabId",
        as: "kategori",
      });
    }
  }
  dokumenPengab.init(
    {
      file_url: { type: DataTypes.STRING, allowNull: false },
      file_name: { type: DataTypes.STRING, allowNull: false },
      catdokumenpengabId: {
        type: DataTypes.INTEGER,
        references: {
          model: "catdokumenpengabs",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "dokumenPengab",
      tableName: "dokumenPengabs",
    }
  );
  return dokumenPengab;
};
