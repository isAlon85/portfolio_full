import { ISkillRepository } from "../../../domain/repositories/ISkillRepository";
import { IUUIDGeneratorService } from "../../../domain/services/UUIDGeneratorService";
import { Skill, SkillProficiency } from "../../../domain/entities/Skill";
import { SkillMapper } from "../../mappers/SkillMapper";

export interface CreateSkillDTO {
  name: string;
  category?: string;
  proficiencyLevel?: SkillProficiency;
  iconUrl?: string;
  colorHex?: string;
}

export interface SkillResponseDTO {
  id: string;
  name: string;
  category: string | null;
  proficiencyLevel: SkillProficiency;
  iconUrl: string | null;
  colorHex: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateSkillUseCase {
  constructor(
    private readonly skillRepository: ISkillRepository,
    private readonly uuidGeneratorService: IUUIDGeneratorService
  ) {}

  async execute(dto: CreateSkillDTO): Promise<SkillResponseDTO> {
    const nameExists = await this.skillRepository.existsByName(dto.name);
    if (nameExists) {
      throw new Error("Skill name already exists");
    }

    const skillId = this.uuidGeneratorService.generate();
    const now = new Date();

    const skill = new Skill(
      skillId,
      dto.name,
      dto.category || null,
      dto.proficiencyLevel || SkillProficiency.INTERMEDIATE,
      dto.iconUrl || null,
      dto.colorHex || null,
      now,
      now,
      null
    );

    const createdSkill = await this.skillRepository.create(skill);

    return SkillMapper.toDTO(createdSkill);
  }
}
