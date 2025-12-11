import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  Association,
} from "sequelize";
import { sequelize } from "../connection";
import { UserModel } from "./UserModel";
import { SkillModel } from "./SkillModel";

export class DeveloperModel extends Model<
  InferAttributes<DeveloperModel, { omit: "user" | "skills" }>,
  InferCreationAttributes<DeveloperModel, { omit: "user" | "skills" }>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<string> | null;
  declare full_name: string;
  declare title: string | null;
  declare bio: string | null;
  declare profile_image_url: string | null;
  declare resume_url: string | null;
  declare github_url: string | null;
  declare linkedin_url: string | null;
  declare twitter_url: string | null;
  declare website_url: string | null;
  declare location: string | null;
  declare years_experience: number | null;
  declare available_for_hire: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;

  declare user?: NonAttribute<UserModel>;
  declare skills?: NonAttribute<SkillModel[]>;

  declare static associations: {
    user: Association<DeveloperModel, UserModel>;
    skills: Association<DeveloperModel, SkillModel>;
  };
}

DeveloperModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profile_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    resume_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    github_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    linkedin_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    twitter_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    website_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    years_experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    available_for_hire: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "developers",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: "idx_developers_user_id",
        unique: true,
        fields: ["user_id"],
        where: { deleted_at: null },
      },
      {
        name: "idx_developers_available_for_hire",
        fields: ["available_for_hire", "deleted_at"],
      },
      {
        name: "idx_developers_deleted_at",
        fields: ["deleted_at"],
      },
    ],
  }
);
