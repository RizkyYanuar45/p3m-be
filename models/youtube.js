"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Youtube extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Youtube.init(
    {
      title: { type: DataTypes.STRING },
      link: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Youtube",
      tableName: "Youtubes",
    }
  );
  return Youtube;
};
