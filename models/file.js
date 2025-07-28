"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class file extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  file.init(
    {
      file_url: { type: DataTypes.STRING, allowNull: false },
      file_name: { type: DataTypes.STRING, allowNull: false },
      file_type: {
        type: DataTypes.ENUM(
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
      file_description: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "file",
      tableName: "files",
    }
  );
  return file;
};
