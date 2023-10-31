import { DataTypes } from "sequelize";
import { sequelize } from "@backend/database";

const Car = sequelize.define("Car", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// @ts-ignore
Car.associate = (models) => {
  Car.belongsTo(models.Brand, {
    foreignKey: "brandId",
    as: "brand",
  });
};

export default Car;
