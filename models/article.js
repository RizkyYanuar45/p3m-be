"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Article.belongsTo(models.Admin, {
        foreignKey: "author_id",
        as: "authorDetails",
      });

      Article.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "categoryDetails",
      });
    }
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
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Model.Admin,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "Articles",
    }
  );
  return Article;
};
