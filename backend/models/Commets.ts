import { Sequelize, DataTypes } from "sequelize"

export default function CommentModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Comment = sequelize.define(
        "Comment", {
            id: {
                type: dataTypes.UUID,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true
            },
            CommentBody: {
                type: dataTypes.STRING,
                allowNull: false
            },
            Rating: {
                type: dataTypes.TINYINT,
                allowNull: true
            },
            Author: {
                type: dataTypes.UUID,
                allowNull: false
            },
            RecipeId: {
                type: dataTypes.UUID,
                allowNull: false
            },
            CommentListId: {
                type: dataTypes.UUID,
                allowNull: false
            }
        }
    )
    return Comment
}