"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dokumenProf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dokumenProf.belongsTo(models.catDokumenProf, {
        foreignKey: "catdokumenprofId",
        as: "kategori",
      });
    }
  }
  dokumenProf.init(
    {
      file_url: { type: DataTypes.STRING, allowNull: false },
      file_name: { type: DataTypes.STRING, allowNull: false },
      catdokumenprofId: {
        type: DataTypes.INTEGER,
        references: {
          model: "catdokumenprofs",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "dokumenProf",
      tableName: "dokumenProfs",
    }
  );
  return dokumenProf;
};
