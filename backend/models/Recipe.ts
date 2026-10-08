
import { Sequelize, DataTypes } from "sequelize"

export default function RecipeModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Recipe = sequelize.define(
        "Recipe", {
            id: {
                type: dataTypes.UUID,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true
            },
            RecipeTitle: {
                type: dataTypes.STRING,
                allowNull: false
            },
            Instructions: {
                type: dataTypes.STRING,
                allowNull: false
            },
            Ingredients: {
                type: dataTypes.STRING,
                allowNull: false
            },
            ImageUrl: {
                type: dataTypes.STRING
            },
            IsVisibleToOther: {
                type: dataTypes.BOOLEAN
            },
            RatingOverall: {
                type: dataTypes.TINYINT
            }
        }
    )

    return Recipe
}