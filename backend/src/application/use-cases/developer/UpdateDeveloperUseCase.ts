import { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { URL as URLValueObject } from "../../../domain/value-objects/URL.vo";
import { UpdateDeveloperDTO } from "../../dto/developer/UpdateDeveloperDTO";
import { DeveloperResponseDTO } from "../../dto/developer/DeveloperResponseDTO";
import { DeveloperMapper } from "../../mappers/DeveloperMapper";

export class UpdateDeveloperUseCase {
  constructor(private readonly developerRepository: IDeveloperRepository) {}

  async execute(
    developerId: string,
    dto: UpdateDeveloperDTO
  ): Promise<DeveloperResponseDTO> {
    const developerIdVO = new UUID(developerId);

    const developer = await this.developerRepository.findById(developerIdVO);
    if (!developer) {
      throw new Error("Developer not found");
    }

    if (developer.isDeleted()) {
      throw new Error("Cannot update a deleted developer profile");
    }

    if (
      dto.fullName ||
      dto.title !== undefined ||
      dto.bio !== undefined ||
      dto.location !== undefined
    ) {
      developer.updateProfile(
        dto.fullName || developer.fullName,
        dto.title !== undefined ? dto.title : developer.title,
        dto.bio !== undefined ? dto.bio : developer.bio,
        dto.location !== undefined ? dto.location : developer.location
      );
    }

    if (
      dto.githubUrl !== undefined ||
      dto.linkedinUrl !== undefined ||
      dto.twitterUrl !== undefined ||
      dto.websiteUrl !== undefined
    ) {
      developer.updateSocialLinks(
        dto.githubUrl !== undefined
          ? dto.githubUrl
            ? new URLValueObject(dto.githubUrl)
            : null
          : developer.githubUrl,
        dto.linkedinUrl !== undefined
          ? dto.linkedinUrl
            ? new URLValueObject(dto.linkedinUrl)
            : null
          : developer.linkedinUrl,
        dto.twitterUrl !== undefined
          ? dto.twitterUrl
            ? new URLValueObject(dto.twitterUrl)
            : null
          : developer.twitterUrl,
        dto.websiteUrl !== undefined
          ? dto.websiteUrl
            ? new URLValueObject(dto.websiteUrl)
            : null
          : developer.websiteUrl
      );
    }

    if (dto.profileImageUrl !== undefined)
      developer.profileImageUrl = dto.profileImageUrl;
    if (dto.resumeUrl !== undefined) developer.resumeUrl = dto.resumeUrl;

    if (dto.yearsExperience !== undefined && dto.yearsExperience !== null) {
      developer.updateExperience(dto.yearsExperience);
    }

    if (dto.availableForHire !== undefined) {
      developer.updateAvailability(dto.availableForHire);
    }

    const updatedDeveloper = await this.developerRepository.update(
      developerIdVO,
      developer
    );

    return DeveloperMapper.toDTO(updatedDeveloper);
  }
}
