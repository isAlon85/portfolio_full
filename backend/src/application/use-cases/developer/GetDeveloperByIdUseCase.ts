import { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { DeveloperResponseDTO } from "../../dto/developer/DeveloperResponseDTO";
import { DeveloperMapper } from "../../mappers/DeveloperMapper";

export class GetDeveloperByIdUseCase {
  constructor(private readonly developerRepository: IDeveloperRepository) {}

  async execute(developerId: string): Promise<DeveloperResponseDTO> {
    const developerIdVO = new UUID(developerId);

    const developer = await this.developerRepository.findById(developerIdVO);
    if (!developer) {
      throw new Error("Developer not found");
    }

    if (developer.isDeleted()) {
      throw new Error("Developer profile has been deleted");
    }

    return DeveloperMapper.toDTO(developer);
  }
}
