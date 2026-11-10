import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize"
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string
    declare UserName: string
    declare PasswordHash: string
    declare UserStatus: string
    declare EmailAddress: string
    declare CredentialId: Json

    declare UserRecipesCollectionId: CreationOptional<Json | null>
    declare CommentsListId: CreationOptional<Json | null>

    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export default function UserModel(
    sequelize: Sequelize
){
    User.init(
        { 
        id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
        UserName: {type: DataTypes.STRING, allowNull: false},
        PasswordHash: {type: DataTypes.STRING, allowNull: false},
        UserStatus: {type: DataTypes.STRING, defaultValue:"unverified"},
        UserRecipesCollectionId: {type: DataTypes.JSON, allowNull: true},
        CommentsListId: {type: DataTypes.JSON, allowNull: true},
        EmailAddress: {type: DataTypes.STRING, allowNull: false},
        CredentialId: {type: DataTypes.JSON},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "User"
        }
    )

    console.log(User === sequelize.models.User)
    return User
}