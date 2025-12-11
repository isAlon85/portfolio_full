import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
} from "sequelize";
import { sequelize } from "../connection";
import { RoleModel } from "./RoleModel";

export class UserModel extends Model<
  InferAttributes<UserModel, { omit: "roles" }>,
  InferCreationAttributes<UserModel, { omit: "roles" }>
> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare full_name: string | null;
  declare avatar_url: string | null;
  declare is_active: CreationOptional<boolean>;
  declare email_verified: CreationOptional<boolean>;
  declare last_login_at: Date | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;

  declare roles?: NonAttribute<RoleModel[]>;

  declare getRoles: BelongsToManyGetAssociationsMixin<RoleModel>;
  declare setRoles: BelongsToManySetAssociationsMixin<RoleModel, string>;
  declare addRole: BelongsToManyAddAssociationMixin<RoleModel, string>;
  declare removeRole: BelongsToManyRemoveAssociationMixin<RoleModel, string>;

  declare static associations: {
    roles: Association<UserModel, RoleModel>;
  };
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        is: /^[a-zA-Z0-9_]+$/,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: "idx_users_email",
        unique: true,
        fields: ["email"],
        where: { deleted_at: null },
      },
      {
        name: "idx_users_username",
        unique: true,
        fields: ["username"],
        where: { deleted_at: null },
      },
      {
        name: "idx_users_deleted_at_id",
        fields: ["deleted_at", "id"],
      },
      {
        name: "idx_users_is_active_deleted_at",
        fields: ["is_active", "deleted_at"],
      },
    ],
  }
);
