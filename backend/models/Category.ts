import { Sequelize, DataTypes } from "sequelize"

export default function CategoryModel (
    sequelize: Sequelize, 
    dataTypes: typeof DataTypes
) {
    const Category = sequelize.define(
        "Category", {
            id: {
                type: dataTypes.UUID,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true
            },
            CategoryName: {
                type: dataTypes.STRING,
                allowNull: false
            }
        }
    )

    return Category
}