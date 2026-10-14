import { Sequelize, DataTypes } from "sequelize";

import RecipeModel from "./models/Recipe";
import UserModel from "./models/User";

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
{
    host: process.env.DB_HOSTNAME!,
    dialect: "mariadb",
    logging: console.log,
}
);

const connect = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Connection established");
    }
    catch (error) {
        console.log("db connection error", error);
    }

    const db = {
        Sequelize,
        sequelize,
        recipe: RecipeModel(sequelize, DataTypes)
    };

    const sync = async (): Promise<void> => {
        await sequelize.sync({ alter: true });
    };

    await sync();
};

export { sequelize, connect };