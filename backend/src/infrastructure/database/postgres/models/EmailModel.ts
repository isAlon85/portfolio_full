import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../connection";

export class EmailModel extends Model<
  InferAttributes<EmailModel>,
  InferCreationAttributes<EmailModel>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare is_subscribed: CreationOptional<boolean>;
  declare subscribed_at: CreationOptional<Date>;
  declare unsubscribed_at: Date | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;
}

EmailModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    is_subscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    subscribed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    unsubscribed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "emails",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: "idx_emails_email",
        unique: true,
        fields: ["email"],
        where: { deleted_at: null },
      },
      {
        name: "idx_emails_subscribed",
        fields: ["is_subscribed", "deleted_at"],
      },
      {
        name: "idx_emails_deleted_at",
        fields: ["deleted_at"],
      },
    ],
  }
);
