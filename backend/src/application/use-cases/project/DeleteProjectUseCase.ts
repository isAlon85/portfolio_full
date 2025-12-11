import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(projectId: string): Promise<void> {
    const projectIdVO = new UUID(projectId);

    const project = await this.projectRepository.findById(projectIdVO);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.isDeleted()) {
      throw new Error("Project is already deleted");
    }

    await this.projectRepository.softDelete(projectIdVO);
  }
}
