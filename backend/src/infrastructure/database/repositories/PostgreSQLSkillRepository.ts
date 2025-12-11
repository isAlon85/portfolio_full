import { ISkillRepository } from "../../../domain/repositories/ISkillRepository";
import { Skill } from "../../../domain/entities/Skill";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { SkillModel } from "../postgres/models/SkillModel";
import { SkillMapper } from "../../../application/mappers/SkillMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class PostgreSQLSkillRepository implements ISkillRepository {
  async findById(id: UUID): Promise<Skill | null> {
    const skillModel = await SkillModel.findByPk(id.value);

    if (!skillModel) {
      return null;
    }

    return SkillMapper.fromSequelizeModel(skillModel);
  }

  async findByName(name: string): Promise<Skill | null> {
    const skillModel = await SkillModel.findOne({ where: { name } });

    if (!skillModel) {
      return null;
    }

    return SkillMapper.fromSequelizeModel(skillModel);
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<Skill[]> {
    const where: any = {};

    if (options?.category) {
      where.category = options.category;
    }

    const skillModels = await SkillModel.findAll({
      where,
      limit: options?.limit,
      offset: options?.offset,
      order: [["name", "ASC"]],
    });

    return skillModels.map((model) => SkillMapper.fromSequelizeModel(model));
  }

  async findByIds(ids: UUID[]): Promise<Skill[]> {
    const skillModels = await SkillModel.findAll({
      where: {
        id: ids.map((id) => id.value),
      },
    });

    return skillModels.map((model) => SkillMapper.fromSequelizeModel(model));
  }

  async count(category?: string): Promise<number> {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    return await SkillModel.count({ where });
  }

  async create(skill: Skill): Promise<Skill> {
    const skillData = SkillMapper.toSequelizeModel(skill);
    const createdModel = await SkillModel.create(skillData);

    return SkillMapper.fromSequelizeModel(createdModel);
  }

  async update(skill: Skill): Promise<Skill> {
    const skillModel = await SkillModel.findByPk(skill.id.value);

    if (!skillModel) {
      throw new NotFoundError(`Skill with ID ${skill.id.value} not found`);
    }

    const skillData = SkillMapper.toSequelizeModel(skill);
    await skillModel.update(skillData);

    return SkillMapper.fromSequelizeModel(skillModel);
  }

  async softDelete(id: UUID): Promise<void> {
    const skillModel = await SkillModel.findByPk(id.value);

    if (!skillModel) {
      throw new NotFoundError(`Skill with ID ${id.value} not found`);
    }

    await skillModel.destroy();
  }

  async hardDelete(id: UUID): Promise<void> {
    const skillModel = await SkillModel.findByPk(id.value, { paranoid: false });

    if (!skillModel) {
      throw new NotFoundError(`Skill with ID ${id.value} not found`);
    }

    await skillModel.destroy({ force: true });
  }
}
