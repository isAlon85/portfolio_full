import { Project, ProjectStatus } from "../../domain/entities/Project";
import { UUID } from "../../domain/value-objects/UUID.vo";
import { URL as URLValueObject } from "../../domain/value-objects/URL.vo";
import { ProjectResponseDTO } from "../dto/project/ProjectResponseDTO";
import { CreateProjectDTO } from "../dto/project/CreateProjectDTO";

export class ProjectMapper {
  static toDTO(entity: Project): ProjectResponseDTO {
    return {
      id: entity.id.value,
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      longDescription: entity.longDescription,
      thumbnailUrl: entity.thumbnailUrl,
      demoUrl: entity.demoUrl?.value || null,
      repoUrl: entity.repoUrl?.value || null,
      status: entity.status,
      isFeatured: entity.isFeatured,
      isPublished: entity.isPublished,
      startDate: entity.startDate,
      endDate: entity.endDate,
      displayOrder: entity.displayOrder,
      viewsCount: entity.viewsCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDTOList(entities: Project[]): ProjectResponseDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  static toEntity(dto: CreateProjectDTO & { id: UUID }): Project {
    const now = new Date();

    return new Project(
      dto.id,
      dto.title,
      dto.slug,
      dto.description || null,
      dto.longDescription || null,
      dto.thumbnailUrl || null,
      dto.demoUrl ? new URLValueObject(dto.demoUrl) : null,
      dto.repoUrl ? new URLValueObject(dto.repoUrl) : null,
      dto.status || ProjectStatus.PLANNING,
      dto.isFeatured || false,
      dto.isPublished || false,
      dto.startDate ? new Date(dto.startDate) : null,
      dto.endDate ? new Date(dto.endDate) : null,
      dto.displayOrder || 0,
      0,
      now,
      now,
      null
    );
  }

  static fromSequelizeModel(model: any): Project {
    return new Project(
      new UUID(model.id),
      model.title,
      model.slug,
      model.description,
      model.longDescription || model.long_description,
      model.thumbnailUrl || model.thumbnail_url,
      model.demoUrl || model.demo_url
        ? new URLValueObject(model.demoUrl || model.demo_url)
        : null,
      model.repoUrl || model.repo_url
        ? new URLValueObject(model.repoUrl || model.repo_url)
        : null,
      model.status as ProjectStatus,
      model.isFeatured !== undefined ? model.isFeatured : model.is_featured,
      model.isPublished !== undefined ? model.isPublished : model.is_published,
      model.startDate || model.start_date,
      model.endDate || model.end_date,
      model.displayOrder !== undefined
        ? model.displayOrder
        : model.display_order,
      model.viewsCount !== undefined ? model.viewsCount : model.views_count,
      model.createdAt || model.created_at,
      model.updatedAt || model.updated_at,
      model.deletedAt || model.deleted_at
    );
  }

  static toSequelizeModel(entity: Project): Record<string, any> {
    return {
      id: entity.id.value,
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      long_description: entity.longDescription,
      thumbnail_url: entity.thumbnailUrl,
      demo_url: entity.demoUrl?.value || null,
      repo_url: entity.repoUrl?.value || null,
      status: entity.status,
      is_featured: entity.isFeatured,
      is_published: entity.isPublished,
      start_date: entity.startDate,
      end_date: entity.endDate,
      display_order: entity.displayOrder,
      views_count: entity.viewsCount,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: entity.deletedAt,
    };
  }
}
