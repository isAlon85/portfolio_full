import { UserModel } from "./UserModel";
import { RoleModel } from "./RoleModel";
import { ProjectModel } from "./ProjectModel";
import { DeveloperModel } from "./DeveloperModel";
import { SkillModel } from "./SkillModel";

export function initializeAssociations(): void {
  UserModel.belongsToMany(RoleModel, {
    through: "user_roles",
    foreignKey: "user_id",
    otherKey: "role_id",
    as: "roles",
  });

  RoleModel.belongsToMany(UserModel, {
    through: "user_roles",
    foreignKey: "role_id",
    otherKey: "user_id",
    as: "users",
  });

  DeveloperModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user",
  });

  UserModel.hasOne(DeveloperModel, {
    foreignKey: "user_id",
    as: "developer",
  });

  ProjectModel.belongsToMany(SkillModel, {
    through: "project_skills",
    foreignKey: "project_id",
    otherKey: "skill_id",
    as: "skills",
  });

  SkillModel.belongsToMany(ProjectModel, {
    through: "project_skills",
    foreignKey: "skill_id",
    otherKey: "project_id",
    as: "projects",
  });

  DeveloperModel.belongsToMany(SkillModel, {
    through: "developer_skills",
    foreignKey: "developer_id",
    otherKey: "skill_id",
    as: "skills",
  });

  SkillModel.belongsToMany(DeveloperModel, {
    through: "developer_skills",
    foreignKey: "skill_id",
    otherKey: "developer_id",
    as: "developers",
  });
}
