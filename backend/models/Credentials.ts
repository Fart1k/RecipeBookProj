import { Sequelize, DataTypes } from "sequelize"

export default function CredentialsModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Credential = sequelize.define(
        "Credential", {
            id: {
                type: dataTypes.UUID,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true
            },
            UserId: {
                type: dataTypes.STRING,
                allowNull: false
            },
            //List<Credentials>
            UserType: {
                type: dataTypes.STRING,
                allowNull: false
            }
        }
    )
}