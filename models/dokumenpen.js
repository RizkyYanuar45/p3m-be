"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dokumenPen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dokumenPen.belongsTo(models.catDokumenPen, {
        foreignKey: "catdokumenpenId",
        as: "kategori",
      });
    }
  }
  dokumenPen.init(
    {
      file_url: { type: DataTypes.STRING, allowNull: false },
      file_name: { type: DataTypes.STRING, allowNull: false },
      catdokumenpenId: {
        type: DataTypes.INTEGER,
        references: {
          model: "catdokumenpens",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "dokumenPen",
      tableName: "dokumenpens",
    }
  );
  return dokumenPen;
};
