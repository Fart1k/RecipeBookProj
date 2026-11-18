import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

export class Credential extends Model<InferAttributes<Credential>, InferCreationAttributes<Credential>> {
    declare id: string
    declare UserType: string

    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export default function initCredentialModel(
    sequelize: Sequelize
) {
    Credential.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            //List<Credentials>
            UserType: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Credentials"
        }
    )
    return Credential
}