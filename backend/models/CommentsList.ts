import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class CommentList extends Model<InferAttributes<CommentList>, InferCreationAttributes<CommentList>> {
    declare id: string
    declare UserId: string

    declare createdAt: CreationOptional<string | null>
    declare updatedAt: CreationOptional<string | null>
}

export default function initCommentListModel(
    sequelize: Sequelize
) {
    CommentList.init(
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
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "CommentsList"
        }
    )
    return CommentList
}