import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
    declare id: string
    declare CommentBody: string
    declare Author: string
    declare RecipeId: Json
    declare CommentListId: Json

    declare Rating: CreationOptional<number | null>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export default function initCommentModel(
    sequelize: Sequelize
) {
    Comment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            CommentBody: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Rating: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            Author: {
                type: DataTypes.UUID,
                allowNull: false
            },
            RecipeId: {
                type: DataTypes.JSON,
                allowNull: false
            },
            CommentListId: {
                type: DataTypes.JSON,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Comments"
        }
    )
    return Comment
}