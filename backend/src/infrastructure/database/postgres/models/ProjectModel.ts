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
import { SkillModel } from "./SkillModel";

export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ON_HOLD = "on_hold",
  CANCELLED = "cancelled",
}

export class ProjectModel extends Model<
  InferAttributes<ProjectModel, { omit: "skills" }>,
  InferCreationAttributes<ProjectModel, { omit: "skills" }>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare slug: string;
  declare description: string | null;
  declare long_description: string | null;
  declare thumbnail_url: string | null;
  declare demo_url: string | null;
  declare repo_url: string | null;
  declare status: CreationOptional<ProjectStatus>;
  declare is_featured: CreationOptional<boolean>;
  declare is_published: CreationOptional<boolean>;
  declare start_date: Date | null;
  declare end_date: Date | null;
  declare display_order: CreationOptional<number>;
  declare views_count: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;

  declare skills?: NonAttribute<SkillModel[]>;

  declare static associations: {
    skills: Association<ProjectModel, SkillModel>;
  };
}

ProjectModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        len: [3, 150],
      },
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/,
      },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    long_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    demo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    repo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProjectStatus)),
      allowNull: false,
      defaultValue: ProjectStatus.PLANNING,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    views_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "projects",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: "idx_projects_slug",
        unique: true,
        fields: ["slug"],
        where: { deleted_at: null },
      },
      {
        name: "idx_projects_status_published",
        fields: ["status", "is_published", "deleted_at"],
      },
      {
        name: "idx_projects_featured_published",
        fields: ["is_featured", "is_published", "deleted_at"],
      },
      {
        name: "idx_projects_display_order",
        fields: ["display_order", "deleted_at"],
      },
      {
        name: "idx_projects_deleted_at_id",
        fields: ["deleted_at", "id"],
      },
    ],
  }
);
