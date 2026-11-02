import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class Favorite extends Model<InferAttributes<Favorite>, InferCreationAttributes<Favorite>> {
    declare id: string
    declare UserId: string
    declare RecipeId: Json

    declare createdAt: CreationOptional<string | null>
    declare updatedAt: CreationOptional<string | null>
}

export default function initFavoriteModel(
    sequelize: Sequelize
) {
    Favorite.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            UserId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            RecipeId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Favorite"
        }
    )
    return Favorite
}