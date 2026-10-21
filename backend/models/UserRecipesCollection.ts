import { Sequelize, DataTypes } from "sequelize";

export default function UserRecipesCollectionModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const UserRecipesCollection = sequelize.define(
        "UserRecipesCollection", {
            id: {
                type: dataTypes.UUID,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true
            },
            CollectionName: {
                type: dataTypes.STRING,
                allowNull: false
            },
            CollectionDescription: {
                type: dataTypes.STRING,
                allowNull: false
            },
            // Foreign keys
            RecipeId: {
                type: dataTypes.ARRAY(dataTypes.UUID),
                allowNull: false
            },
            UserId: {
                type: dataTypes.UUID,
                allowNull: false
            }
        }
    )
}