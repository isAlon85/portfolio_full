import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISkillRepository } from "../../../domain/repositories/ISkillRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";

export interface AttachSkillsDTO {
  projectId: string;
  skillIds: string[];
}

export class AttachSkillsToProjectUseCase {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly skillRepository: ISkillRepository
  ) {}

  async execute(dto: AttachSkillsDTO): Promise<void> {
    const projectIdVO = new UUID(dto.projectId);

    const project = await this.projectRepository.findById(projectIdVO);
    if (!project || project.isDeleted()) {
      throw new Error("Project not found");
    }

    const skillUUIDs: UUID[] = [];
    for (const skillId of dto.skillIds) {
      const skillIdVO = new UUID(skillId);
      const skillExists = await this.skillRepository.existsById(skillIdVO);
      if (!skillExists) {
        throw new Error(`Skill with ID ${skillId} not found`);
      }
      skillUUIDs.push(skillIdVO);
    }

    await this.projectRepository.attachSkills(projectIdVO, skillUUIDs);
  }
}
