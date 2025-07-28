"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  profile.init(
    {
      image: { type: DataTypes.STRING, allowNull: false },
      alt: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM("pimpinan_lembaga", "struktur_organisasi"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "profile",
      tableName: "profiles",
    }
  );
  return profile;
};
