import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { Project } from "../../../domain/entities/Project";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { ProjectModel } from "../postgres/models/ProjectModel";
import { SkillModel } from "../postgres/models/SkillModel";
import { ProjectMapper } from "../../../application/mappers/ProjectMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class PostgreSQLProjectRepository implements IProjectRepository {
  async findById(id: UUID): Promise<Project | null> {
    const projectModel = await ProjectModel.findByPk(id.value, {
      include: [{ model: SkillModel, as: "skills" }],
    });

    if (!projectModel) {
      return null;
    }

    return ProjectMapper.fromSequelizeModel(projectModel);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const projectModel = await ProjectModel.findOne({
      where: { slug },
      include: [{ model: SkillModel, as: "skills" }],
    });

    if (!projectModel) {
      return null;
    }

    return ProjectMapper.fromSequelizeModel(projectModel);
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    isPublished?: boolean;
    isFeatured?: boolean;
  }): Promise<Project[]> {
    const where: any = {};

    if (options?.isPublished !== undefined) {
      where.is_published = options.isPublished;
    }

    if (options?.isFeatured !== undefined) {
      where.is_featured = options.isFeatured;
    }

    const projectModels = await ProjectModel.findAll({
      where,
      include: [{ model: SkillModel, as: "skills" }],
      limit: options?.limit,
      offset: options?.offset,
      order: [
        ["display_order", "ASC"],
        ["created_at", "DESC"],
      ],
    });

    return projectModels.map((model) =>
      ProjectMapper.fromSequelizeModel(model)
    );
  }

  async count(isPublished?: boolean): Promise<number> {
    const where: any = {};

    if (isPublished !== undefined) {
      where.is_published = isPublished;
    }

    return await ProjectModel.count({ where });
  }

  async create(project: Project): Promise<Project> {
    const projectData = ProjectMapper.toSequelizeModel(project);
    const createdModel = await ProjectModel.create(projectData);

    return ProjectMapper.fromSequelizeModel(createdModel);
  }

  async update(project: Project): Promise<Project> {
    const projectModel = await ProjectModel.findByPk(project.id.value);

    if (!projectModel) {
      throw new NotFoundError(`Project with ID ${project.id.value} not found`);
    }

    const projectData = ProjectMapper.toSequelizeModel(project);
    await projectModel.update(projectData);

    const updatedModel = await ProjectModel.findByPk(project.id.value, {
      include: [{ model: SkillModel, as: "skills" }],
    });

    return ProjectMapper.fromSequelizeModel(updatedModel!);
  }

  async softDelete(id: UUID): Promise<void> {
    const projectModel = await ProjectModel.findByPk(id.value);

    if (!projectModel) {
      throw new NotFoundError(`Project with ID ${id.value} not found`);
    }

    await projectModel.destroy();
  }

  async hardDelete(id: UUID): Promise<void> {
    const projectModel = await ProjectModel.findByPk(id.value, {
      paranoid: false,
    });

    if (!projectModel) {
      throw new NotFoundError(`Project with ID ${id.value} not found`);
    }

    await projectModel.destroy({ force: true });
  }

  async attachSkills(projectId: UUID, skillIds: UUID[]): Promise<void> {
    const projectModel = await ProjectModel.findByPk(projectId.value);

    if (!projectModel) {
      throw new NotFoundError(`Project with ID ${projectId.value} not found`);
    }

    await projectModel.$set(
      "skills",
      skillIds.map((id) => id.value)
    );
  }

  async detachSkills(projectId: UUID, skillIds: UUID[]): Promise<void> {
    const projectModel = await ProjectModel.findByPk(projectId.value);

    if (!projectModel) {
      throw new NotFoundError(`Project with ID ${projectId.value} not found`);
    }

    const currentSkills = await projectModel.$get("skills");
    const remainingSkillIds = currentSkills
      .filter((skill) => !skillIds.some((id) => id.value === skill.id))
      .map((skill) => skill.id);

    await projectModel.$set("skills", remainingSkillIds);
  }

  async incrementViewsCount(id: UUID): Promise<void> {
    const projectModel = await ProjectModel.findByPk(id.value);

    if (!projectModel) {
      throw new NotFoundError(`Project with ID ${id.value} not found`);
    }

    await projectModel.increment("views_count", { by: 1 });
  }
}
