import { Project, ProjectStatus } from "../entities/Project";
import { UUID } from "../value-objects/UUID.vo";

export interface IProjectRepository {
  findById(id: UUID): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  findAll(
    page: number,
    limit: number,
    includeDeleted?: boolean
  ): Promise<{ projects: Project[]; total: number }>;
  findPublished(
    page: number,
    limit: number
  ): Promise<{ projects: Project[]; total: number }>;
  findFeatured(limit?: number): Promise<Project[]>;
  findByStatus(
    status: ProjectStatus,
    page: number,
    limit: number
  ): Promise<{ projects: Project[]; total: number }>;
  create(project: Project): Promise<Project>;
  update(id: UUID, project: Partial<Project>): Promise<Project>;
  softDelete(id: UUID): Promise<void>;
  hardDelete(id: UUID): Promise<void>;
  restore(id: UUID): Promise<void>;
  existsBySlug(slug: string): Promise<boolean>;
  existsById(id: UUID): Promise<boolean>;
  incrementViews(id: UUID): Promise<void>;
  publish(id: UUID): Promise<void>;
  unpublish(id: UUID): Promise<void>;
  feature(id: UUID): Promise<void>;
  unfeature(id: UUID): Promise<void>;
  attachSkills(projectId: UUID, skillIds: UUID[]): Promise<void>;
  detachSkills(projectId: UUID, skillIds: UUID[]): Promise<void>;
  getProjectSkills(projectId: UUID): Promise<UUID[]>;
  searchByTitle(
    query: string,
    page: number,
    limit: number
  ): Promise<{ projects: Project[]; total: number }>;
  countAll(includeDeleted?: boolean): Promise<number>;
  countByStatus(status: ProjectStatus): Promise<number>;
}
