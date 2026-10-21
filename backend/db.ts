import { Sequelize, DataTypes } from "sequelize";

import RecipeModel from "./models/Recipe.ts";
import UserModel from "./models/User.ts";
import CategoryModel from "./models/Category.ts";
import CredentialsModel from "./models/Credentials.ts";
import FavoriteModel from "./models/Favorites.ts";
import CommentModel from "./models/Commets.ts";
import CommentListModel from "./models/CommentsList.ts";



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
}

const db = {
    Sequelize,
    sequelize,
    recipes: RecipeModel(sequelize, DataTypes),
    users: UserModel(sequelize, DataTypes),
    category: CategoryModel(sequelize, DataTypes),
    credential: CredentialsModel(sequelize, DataTypes),
    favorite: FavoriteModel(sequelize, DataTypes),
    commentList: CommentListModel(sequelize, DataTypes),
    comment: CommentModel(sequelize, DataTypes),
    userRecipesCollection: require("../backend/models/UserRecipesCollection.ts")(sequelize, DataTypes),

};
db.userRecipesCollection = require("../backend/models/UserRecipesCollection.ts")(sequelize, DataTypes, db.recipes, db.users),
db.recipes.belongsToMany(db.users, {through: db.userRecipesCollection, as: "UserId"})
db.users.belongsTo(db.recipes, {through: db.userRecipesCollection, as: "RecipeId"})

db.users.hasMany(db.userRecipesCollection, {foreignKey: "UserId" as "RecipeId"})
db.userRecipesCollection.belongsTo(db.users, {foreignKey: "UserId" as "RecipeId"})

const sync = async(): Promise<void> => {
    await sequelize.sync({ alter: true })
    console.log("DB is synced")
};

export {db, sync, connect};