import { ISkillRepository } from "../../../domain/repositories/ISkillRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";

export class DeleteSkillUseCase {
  constructor(private readonly skillRepository: ISkillRepository) {}

  async execute(skillId: string): Promise<void> {
    const skillIdVO = new UUID(skillId);

    const skill = await this.skillRepository.findById(skillIdVO);
    if (!skill) {
      throw new Error("Skill not found");
    }

    if (skill.isDeleted()) {
      throw new Error("Skill is already deleted");
    }

    await this.skillRepository.softDelete(skillIdVO);
  }
}
