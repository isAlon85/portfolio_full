import { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository";
import { ISkillRepository } from "../../../domain/repositories/ISkillRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";

export interface AttachSkillsToDeveloperDTO {
  developerId: string;
  skillIds: string[];
}

export class AttachSkillsToDeveloperUseCase {
  constructor(
    private readonly developerRepository: IDeveloperRepository,
    private readonly skillRepository: ISkillRepository
  ) {}

  async execute(dto: AttachSkillsToDeveloperDTO): Promise<void> {
    const developerIdVO = new UUID(dto.developerId);

    const developer = await this.developerRepository.findById(developerIdVO);
    if (!developer || developer.isDeleted()) {
      throw new Error("Developer not found");
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

    await this.developerRepository.attachSkills(developerIdVO, skillUUIDs);
  }
}
