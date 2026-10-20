import { Sequelize, DataTypes } from "sequelize";

export default function FavoriteModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Favorite = sequelize.define(
        "Recipe", {
            id: {
                type: dataTypes.UUID,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true
            },
            UserId: {
                type: dataTypes.UUID,
                allowNull: false
            },
            RecipeId: {
                type: dataTypes.STRING,
                allowNull: false
            }
        }
    )
    return Favorite
}