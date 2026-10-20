import { Sequelize, DataTypes } from "sequelize"

export default function CommentListModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const CommentList = sequelize.define(
        "Recipe",{
            id: {
                type: dataTypes.UUID,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true
            },
            UserId: {
                type: dataTypes.UUID,
                allowNull: false
            }
        }
    )
    return CommentList
}