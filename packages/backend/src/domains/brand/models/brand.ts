import { DataTypes } from "sequelize";
import { sequelize } from "@backend/database";

const Brand = sequelize.define("Brand", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// @ts-ignore
Brand.associate = (models) => {
  Brand.hasMany(models.Car, {
    foreignKey: "brandId",
    as: "cars",
  });
};

export default Brand;
