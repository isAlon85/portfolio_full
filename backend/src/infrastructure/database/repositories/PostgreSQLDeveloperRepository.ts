import { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository";
import { Developer } from "../../../domain/entities/Developer";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { DeveloperModel } from "../postgres/models/DeveloperModel";
import { SkillModel } from "../postgres/models/SkillModel";
import { DeveloperMapper } from "../../../application/mappers/DeveloperMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class PostgreSQLDeveloperRepository implements IDeveloperRepository {
  async findById(id: UUID): Promise<Developer | null> {
    const developerModel = await DeveloperModel.findByPk(id.value, {
      include: [{ model: SkillModel, as: "skills" }],
    });

    if (!developerModel) {
      return null;
    }

    return DeveloperMapper.fromSequelizeModel(developerModel);
  }

  async findByUserId(userId: UUID): Promise<Developer | null> {
    const developerModel = await DeveloperModel.findOne({
      where: { user_id: userId.value },
      include: [{ model: SkillModel, as: "skills" }],
    });

    if (!developerModel) {
      return null;
    }

    return DeveloperMapper.fromSequelizeModel(developerModel);
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<Developer[]> {
    const developerModels = await DeveloperModel.findAll({
      include: [{ model: SkillModel, as: "skills" }],
      limit: options?.limit,
      offset: options?.offset,
      order: [["created_at", "DESC"]],
    });

    return developerModels.map((model) =>
      DeveloperMapper.fromSequelizeModel(model)
    );
  }

  async count(): Promise<number> {
    return await DeveloperModel.count();
  }

  async create(developer: Developer): Promise<Developer> {
    const developerData = DeveloperMapper.toSequelizeModel(developer);
    const createdModel = await DeveloperModel.create(developerData);

    return DeveloperMapper.fromSequelizeModel(createdModel);
  }

  async update(developer: Developer): Promise<Developer> {
    const developerModel = await DeveloperModel.findByPk(developer.id.value);

    if (!developerModel) {
      throw new NotFoundError(
        `Developer with ID ${developer.id.value} not found`
      );
    }

    const developerData = DeveloperMapper.toSequelizeModel(developer);
    await developerModel.update(developerData);

    const updatedModel = await DeveloperModel.findByPk(developer.id.value, {
      include: [{ model: SkillModel, as: "skills" }],
    });

    return DeveloperMapper.fromSequelizeModel(updatedModel!);
  }

  async softDelete(id: UUID): Promise<void> {
    const developerModel = await DeveloperModel.findByPk(id.value);

    if (!developerModel) {
      throw new NotFoundError(`Developer with ID ${id.value} not found`);
    }

    await developerModel.destroy();
  }

  async hardDelete(id: UUID): Promise<void> {
    const developerModel = await DeveloperModel.findByPk(id.value, {
      paranoid: false,
    });

    if (!developerModel) {
      throw new NotFoundError(`Developer with ID ${id.value} not found`);
    }

    await developerModel.destroy({ force: true });
  }

  async attachSkills(developerId: UUID, skillIds: UUID[]): Promise<void> {
    const developerModel = await DeveloperModel.findByPk(developerId.value);

    if (!developerModel) {
      throw new NotFoundError(
        `Developer with ID ${developerId.value} not found`
      );
    }

    await developerModel.$set(
      "skills",
      skillIds.map((id) => id.value)
    );
  }

  async detachSkills(developerId: UUID, skillIds: UUID[]): Promise<void> {
    const developerModel = await DeveloperModel.findByPk(developerId.value);

    if (!developerModel) {
      throw new NotFoundError(
        `Developer with ID ${developerId.value} not found`
      );
    }

    const currentSkills = await developerModel.$get("skills");
    const remainingSkillIds = currentSkills
      .filter((skill) => !skillIds.some((id) => id.value === skill.id))
      .map((skill) => skill.id);

    await developerModel.$set("skills", remainingSkillIds);
  }
}
