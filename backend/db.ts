import { Sequelize, DataTypes } from "sequelize";

import RecipeModel from "./models/Recipe.ts";
import UserModel from "./models/User.ts";
import CategoryModel from "./models/Category.ts";
import CredentialsModel from "./models/Credentials.ts";
import FavoriteModel from "./models/Favorites.ts";
import CommentModel from "./models/Commets.ts";
import CommentListModel from "./models/CommentsList.ts";
import UserRecipesCollectionModel from "./models/UserRecipesCollection.ts"



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
const _Recipe = RecipeModel(sequelize, DataTypes)
const _User = UserModel(sequelize, DataTypes)
const _Category = CategoryModel(sequelize, DataTypes)
const _Credentials = CredentialsModel(sequelize, DataTypes)
const _Favorite = FavoriteModel(sequelize, DataTypes)
const _CommentList = CommentListModel(sequelize, DataTypes)
const _Comment = CommentModel(sequelize, DataTypes)
const _UserRecipesCollections = UserRecipesCollectionModel(sequelize, DataTypes)

_User.hasMany(_UserRecipesCollections, {foreignKey: "UserId" as "User"})
_UserRecipesCollections.belongsTo(_User, {foreignKey: "UserId" as "RecipeId"})

const db = {
    Sequelize,
    sequelize,
    recipes: _Recipe,
    users: _User,
    category: _Category,
    credential: _Credentials,
    favorite: _Favorite,
    commentList: _CommentList,
    comment: _Comment,
    userRecipesCollection: _UserRecipesCollections
    //userRecipesCollection: UserRecipesCollectionModel(sequelize, DataTypes)

};
// db.userRecipesCollection = require("../backend/models/UserRecipesCollection.ts")(sequelize, DataTypes, db.recipes, db.users),
// db.recipes.belongsToMany(db.users, {through: db.userRecipesCollection, as: "UserId"})
// db.users.belongsTo(db.recipes, {through: db.userRecipesCollection, as: "RecipeId"})

// db.users.hasMany(db.userRecipesCollection, {foreignKey: "UserId" as "RecipeId"})
// db.userRecipesCollection.belongsTo(db.users, {foreignKey: "UserId" as "RecipeId"})

const sync = async(): Promise<void> => {
    await sequelize.sync({ alter: true })
    console.log("DB is synced")
};

export {db, sync, connect};