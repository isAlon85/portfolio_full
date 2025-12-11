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
import { ProjectModel } from "./ProjectModel";
import { DeveloperModel } from "./DeveloperModel";

export enum SkillProficiency {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export class SkillModel extends Model<
  InferAttributes<SkillModel, { omit: "projects" | "developers" }>,
  InferCreationAttributes<SkillModel, { omit: "projects" | "developers" }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare category: string | null;
  declare proficiency_level: CreationOptional<SkillProficiency>;
  declare icon_url: string | null;
  declare color_hex: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;

  declare projects?: NonAttribute<ProjectModel[]>;
  declare developers?: NonAttribute<DeveloperModel[]>;

  declare static associations: {
    projects: Association<SkillModel, ProjectModel>;
    developers: Association<SkillModel, DeveloperModel>;
  };
}

SkillModel.init(
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
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    proficiency_level: {
      type: DataTypes.ENUM(...Object.values(SkillProficiency)),
      allowNull: false,
      defaultValue: SkillProficiency.INTERMEDIATE,
    },
    icon_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    color_hex: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i,
      },
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "skills",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: "idx_skills_name",
        unique: true,
        fields: ["name"],
        where: { deleted_at: null },
      },
      {
        name: "idx_skills_category",
        fields: ["category", "deleted_at"],
      },
      {
        name: "idx_skills_proficiency",
        fields: ["proficiency_level", "deleted_at"],
      },
      {
        name: "idx_skills_deleted_at",
        fields: ["deleted_at"],
      },
    ],
  }
);
