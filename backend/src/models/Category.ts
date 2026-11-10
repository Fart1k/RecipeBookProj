import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare id: string
    declare CategoryName: string

    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}
export default function initCategoryModel (
    sequelize: Sequelize
) {
    Category.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            CategoryName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Category"
        }
    )
    return Category
}