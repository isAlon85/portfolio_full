import { Developer } from "../entities/Developer";
import { UUID } from "../value-objects/UUID.vo";

export interface IDeveloperRepository {
  findById(id: UUID): Promise<Developer | null>;
  findByUserId(userId: UUID): Promise<Developer | null>;
  findAll(includeDeleted?: boolean): Promise<Developer[]>;
  findAvailable(): Promise<Developer[]>;
  create(developer: Developer): Promise<Developer>;
  update(id: UUID, developer: Partial<Developer>): Promise<Developer>;
  softDelete(id: UUID): Promise<void>;
  hardDelete(id: UUID): Promise<void>;
  restore(id: UUID): Promise<void>;
  existsById(id: UUID): Promise<boolean>;
  existsByUserId(userId: UUID): Promise<boolean>;
  attachSkills(developerId: UUID, skillIds: UUID[]): Promise<void>;
  detachSkills(developerId: UUID, skillIds: UUID[]): Promise<void>;
  getDeveloperSkills(developerId: UUID): Promise<UUID[]>;
  updateAvailability(id: UUID, available: boolean): Promise<void>;
  updateExperience(id: UUID, years: number): Promise<void>;
  searchByName(query: string): Promise<Developer[]>;
}
