import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { ProjectResponseDTO } from "../../dto/project/ProjectResponseDTO";
import { ProjectMapper } from "../../mappers/ProjectMapper";

export class GetProjectByIdUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(
    projectId: string,
    incrementViews: boolean = false
  ): Promise<ProjectResponseDTO> {
    const projectIdVO = new UUID(projectId);

    const project = await this.projectRepository.findById(projectIdVO);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.isDeleted()) {
      throw new Error("Project has been deleted");
    }

    if (incrementViews) {
      await this.projectRepository.incrementViews(projectIdVO);
      project.incrementViews();
    }

    return ProjectMapper.toDTO(project);
  }
}
