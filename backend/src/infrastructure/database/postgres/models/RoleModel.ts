import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
} from "sequelize";
import { sequelize } from "../connection";
import { UserModel } from "./UserModel";

export class RoleModel extends Model<
  InferAttributes<RoleModel, { omit: "users" }>,
  InferCreationAttributes<RoleModel, { omit: "users" }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;

  declare users?: NonAttribute<UserModel[]>;

  declare static associations: {
    users: Association<RoleModel, UserModel>;
  };
}

RoleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 50],
        isLowercase: true,
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: "idx_roles_name",
        unique: true,
        fields: ["name"],
        where: { deleted_at: null },
      },
      {
        name: "idx_roles_deleted_at",
        fields: ["deleted_at"],
      },
    ],
  }
);
