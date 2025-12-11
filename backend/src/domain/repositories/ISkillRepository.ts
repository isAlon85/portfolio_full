import { Skill, SkillProficiency } from "../entities/Skill";
import { UUID } from "../value-objects/UUID.vo";

export interface ISkillRepository {
  findById(id: UUID): Promise<Skill | null>;
  findByName(name: string): Promise<Skill | null>;
  findAll(includeDeleted?: boolean): Promise<Skill[]>;
  findByCategory(category: string): Promise<Skill[]>;
  findByProficiency(proficiency: SkillProficiency): Promise<Skill[]>;
  create(skill: Skill): Promise<Skill>;
  update(id: UUID, skill: Partial<Skill>): Promise<Skill>;
  softDelete(id: UUID): Promise<void>;
  hardDelete(id: UUID): Promise<void>;
  restore(id: UUID): Promise<void>;
  existsByName(name: string): Promise<boolean>;
  existsById(id: UUID): Promise<boolean>;
  getAllCategories(): Promise<string[]>;
  countByCategory(): Promise<Record<string, number>>;
  searchByName(query: string): Promise<Skill[]>;
  findManyByIds(ids: UUID[]): Promise<Skill[]>;
}
