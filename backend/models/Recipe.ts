import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class Recipe extends Model<InferAttributes<Recipe>, InferCreationAttributes<Recipe>> {
    declare id: string
    declare RecipeTitle: string
    declare Instructions: string
    declare Ingredients: string
    declare IsVisibleToOther: boolean
    declare Status: boolean

    declare ImageUrl: CreationOptional<string | null>
    declare RatingOverall: CreationOptional<number | null>

    declare createdAt: CreationOptional<string | null>
    declare updatedAt: CreationOptional<string | null>
}

export default function RecipeModel(
    sequelize: Sequelize
) {
    Recipe.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            RecipeTitle: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Instructions: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Ingredients: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ImageUrl: {
                type: DataTypes.STRING
            },
            IsVisibleToOther: {
                type: DataTypes.BOOLEAN
            },
            RatingOverall: {
                type: DataTypes.TINYINT
            },
            Status: {
                type: DataTypes.BOOLEAN
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Recipe"
        }
    )

    return Recipe
}