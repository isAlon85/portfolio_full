import { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository";
import { IUUIDGeneratorService } from "../../../domain/services/UUIDGeneratorService";
import { Developer } from "../../../domain/entities/Developer";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { URL as URLValueObject } from "../../../domain/value-objects/URL.vo";
import { CreateDeveloperDTO } from "../../dto/developer/CreateDeveloperDTO";
import { DeveloperResponseDTO } from "../../dto/developer/DeveloperResponseDTO";
import { DeveloperMapper } from "../../mappers/DeveloperMapper";

export class CreateDeveloperUseCase {
  constructor(
    private readonly developerRepository: IDeveloperRepository,
    private readonly uuidGeneratorService: IUUIDGeneratorService
  ) {}

  async execute(dto: CreateDeveloperDTO): Promise<DeveloperResponseDTO> {
    if (dto.userId) {
      const userIdVO = new UUID(dto.userId);
      const existsByUserId = await this.developerRepository.existsByUserId(
        userIdVO
      );
      if (existsByUserId) {
        throw new Error("Developer profile already exists for this user");
      }
    }

    const developerId = this.uuidGeneratorService.generate();
    const now = new Date();

    const githubUrl = dto.githubUrl ? new URLValueObject(dto.githubUrl) : null;
    const linkedinUrl = dto.linkedinUrl
      ? new URLValueObject(dto.linkedinUrl)
      : null;
    const twitterUrl = dto.twitterUrl
      ? new URLValueObject(dto.twitterUrl)
      : null;
    const websiteUrl = dto.websiteUrl
      ? new URLValueObject(dto.websiteUrl)
      : null;

    const developer = new Developer(
      developerId,
      dto.userId ? new UUID(dto.userId) : null,
      dto.fullName,
      dto.title || null,
      dto.bio || null,
      dto.profileImageUrl || null,
      dto.resumeUrl || null,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      websiteUrl,
      dto.location || null,
      dto.yearsExperience || null,
      dto.availableForHire !== undefined ? dto.availableForHire : true,
      now,
      now,
      null
    );

    const createdDeveloper = await this.developerRepository.create(developer);

    return DeveloperMapper.toDTO(createdDeveloper);
  }
}
