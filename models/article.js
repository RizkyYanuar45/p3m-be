"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Article.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      thumbnail: { type: DataTypes.STRING, allowNull: false },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      published_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.Now,
        allowNull: false,
      },

      published_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM,
        values: [
          "informasi_kkn",
          "informasi_pengabdian_masyarakat",
          "informasi_pengabdian_masyarakat_mandiri",
          "informasi_penelitian",
          "umum",
        ],
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "articles",
    }
  );
  return Article;
};
