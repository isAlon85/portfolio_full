import { ISkillRepository } from "../../../domain/repositories/ISkillRepository";
import { SkillMapper } from "../../mappers/SkillMapper";

export interface SkillResponseDTO {
  id: string;
  name: string;
  category: string | null;
  proficiencyLevel: string;
  iconUrl: string | null;
  colorHex: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ListSkillsUseCase {
  constructor(private readonly skillRepository: ISkillRepository) {}

  async execute(category?: string): Promise<SkillResponseDTO[]> {
    const skills = category
      ? await this.skillRepository.findByCategory(category)
      : await this.skillRepository.findAll(false);

    return SkillMapper.toDTOList(skills);
  }
}
