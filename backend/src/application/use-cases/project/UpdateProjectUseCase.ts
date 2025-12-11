import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { URL as URLValueObject } from "../../../domain/value-objects/URL.vo";
import { ProjectStatus } from "../../../domain/entities/Project";
import { UpdateProjectDTO } from "../../dto/project/UpdateProjectDTO";
import { ProjectResponseDTO } from "../../dto/project/ProjectResponseDTO";
import { ProjectMapper } from "../../mappers/ProjectMapper";

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(
    projectId: string,
    dto: UpdateProjectDTO
  ): Promise<ProjectResponseDTO> {
    const projectIdVO = new UUID(projectId);

    const project = await this.projectRepository.findById(projectIdVO);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.isDeleted()) {
      throw new Error("Cannot update a deleted project");
    }

    if (dto.slug && dto.slug !== project.slug) {
      const slugExists = await this.projectRepository.existsBySlug(dto.slug);
      if (slugExists) {
        throw new Error("Project slug already exists");
      }
      project.slug = dto.slug;
    }

    if (dto.title !== undefined) project.title = dto.title;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.longDescription !== undefined)
      project.longDescription = dto.longDescription;
    if (dto.thumbnailUrl !== undefined) project.thumbnailUrl = dto.thumbnailUrl;

    if (dto.demoUrl !== undefined) {
      project.demoUrl = dto.demoUrl ? new URLValueObject(dto.demoUrl) : null;
    }

    if (dto.repoUrl !== undefined) {
      project.repoUrl = dto.repoUrl ? new URLValueObject(dto.repoUrl) : null;
    }

    if (dto.status !== undefined) {
      project.updateStatus(dto.status as ProjectStatus);
    }

    if (dto.isFeatured !== undefined) {
      if (dto.isFeatured) {
        project.feature();
      } else {
        project.unfeature();
      }
    }

    if (dto.isPublished !== undefined) {
      if (dto.isPublished) {
        project.publish();
      } else {
        project.unpublish();
      }
    }

    if (dto.startDate !== undefined || dto.endDate !== undefined) {
      project.updateDates(
        dto.startDate ? new Date(dto.startDate) : project.startDate,
        dto.endDate ? new Date(dto.endDate) : project.endDate
      );
    }

    if (dto.displayOrder !== undefined) {
      project.updateDisplayOrder(dto.displayOrder);
    }

    const updatedProject = await this.projectRepository.update(
      projectIdVO,
      project
    );

    return ProjectMapper.toDTO(updatedProject);
  }
}
