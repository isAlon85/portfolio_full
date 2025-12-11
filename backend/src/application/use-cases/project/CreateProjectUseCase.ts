import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUUIDGeneratorService } from "../../../domain/services/UUIDGeneratorService";
import { Project, ProjectStatus } from "../../../domain/entities/Project";
import { URL as URLValueObject } from "../../../domain/value-objects/URL.vo";
import { CreateProjectDTO } from "../../dto/project/CreateProjectDTO";
import { ProjectResponseDTO } from "../../dto/project/ProjectResponseDTO";
import { ProjectMapper } from "../../mappers/ProjectMapper";

export class CreateProjectUseCase {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly uuidGeneratorService: IUUIDGeneratorService
  ) {}

  async execute(dto: CreateProjectDTO): Promise<ProjectResponseDTO> {
    const slugExists = await this.projectRepository.existsBySlug(dto.slug);
    if (slugExists) {
      throw new Error("Project slug already exists");
    }

    const projectId = this.uuidGeneratorService.generate();
    const now = new Date();

    const demoUrl = dto.demoUrl ? new URLValueObject(dto.demoUrl) : null;
    const repoUrl = dto.repoUrl ? new URLValueObject(dto.repoUrl) : null;

    const project = new Project(
      projectId,
      dto.title,
      dto.slug,
      dto.description || null,
      dto.longDescription || null,
      dto.thumbnailUrl || null,
      demoUrl,
      repoUrl,
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

    const createdProject = await this.projectRepository.create(project);

    return ProjectMapper.toDTO(createdProject);
  }
}
