import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class Credential extends Model<InferAttributes<Credential>, InferCreationAttributes<Credential>> {
    declare id: string
    declare UserId: string
    declare UserType: string

    declare createdAt: CreationOptional<string | null>
    declare updatedAt: CreationOptional<string | null>
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
            UserId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            //List<Credentials>
            UserType: {
                type: DataTypes.STRING,
                allowNull: false
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