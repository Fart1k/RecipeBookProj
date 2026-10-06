import { Sequelize, DataTypes } from "sequelize"

export default function RecipeModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
)
 {
    const Recipe = sequelize.define(
        "Recipe", {
            id: {
                type: dataTypes.UUIDV4
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
            //UserId
            //CategoryId
            IsVisibleToOther: {
                type: dataTypes.BOOLEAN
            },
            RatingOverall: {
                type: dataTypes.TINYINT
            },
            //Comment<>
        }
    ) 
 }

 //Things in coments will be added later because they are the foreign keys.