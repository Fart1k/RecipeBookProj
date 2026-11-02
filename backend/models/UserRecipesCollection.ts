import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class UserRecipesCollection extends Model<InferAttributes<UserRecipesCollection>, InferCreationAttributes<UserRecipesCollection>> {
    declare CollectionName: string
    declare RecipeIds: Json
    declare UserId: string
    declare id: string
    
    declare CollectionDescription: CreationOptional<string | null>

    declare createdAt: CreationOptional<string | null>
    declare updatedAt: CreationOptional<string | null>
}

export default function initUserRecipesCollectionModel(
    sequelize: Sequelize
) {
    UserRecipesCollection.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true
            },
            CollectionName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            CollectionDescription: {
                type: DataTypes.STRING,
                allowNull: false
            },
            // Foreign keys
            RecipeIds: {
                type: DataTypes.JSON,
                allowNull: false
            },
            UserId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "UserRecipesCollection"
        }
    )
    return UserRecipesCollection
}