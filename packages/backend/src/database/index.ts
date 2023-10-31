import * as fs from "fs";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_SCHEMA!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const models: { [key: string]: any } = {};
const normalizedPath = require("path").join(__dirname, "../domains");

fs.readdirSync(normalizedPath).forEach((folder: string) => {
  if (fs.existsSync(`${normalizedPath}/${folder}/models`)) {
    fs.readdirSync(`${normalizedPath}/${folder}/models`)
      .filter((file: string) => file.endsWith(".js"))
      .forEach((file: string) => {
        const model =
          require(`${normalizedPath}/${folder}/models/${file}`).default;
        models[model.name] = model;
      });
  }
});

// Apply associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

sequelize.sync();

// Export models and sequelize instance
export { sequelize, models };
