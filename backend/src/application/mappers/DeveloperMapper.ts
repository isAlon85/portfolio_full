import { Developer } from "../../domain/entities/Developer";
import { UUID } from "../../domain/value-objects/UUID.vo";
import { URL as URLValueObject } from "../../domain/value-objects/URL.vo";
import { DeveloperResponseDTO } from "../dto/developer/DeveloperResponseDTO";
import { CreateDeveloperDTO } from "../dto/developer/CreateDeveloperDTO";

export class DeveloperMapper {
  static toDTO(entity: Developer): DeveloperResponseDTO {
    return {
      id: entity.id.value,
      userId: entity.userId?.value || null,
      fullName: entity.fullName,
      title: entity.title,
      bio: entity.bio,
      profileImageUrl: entity.profileImageUrl,
      resumeUrl: entity.resumeUrl,
      githubUrl: entity.githubUrl?.value || null,
      linkedinUrl: entity.linkedinUrl?.value || null,
      twitterUrl: entity.twitterUrl?.value || null,
      websiteUrl: entity.websiteUrl?.value || null,
      location: entity.location,
      yearsExperience: entity.yearsExperience,
      availableForHire: entity.availableForHire,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDTOList(entities: Developer[]): DeveloperResponseDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  static toEntity(dto: CreateDeveloperDTO & { id: UUID }): Developer {
    const now = new Date();

    return new Developer(
      dto.id,
      dto.userId ? new UUID(dto.userId) : null,
      dto.fullName,
      dto.title || null,
      dto.bio || null,
      dto.profileImageUrl || null,
      dto.resumeUrl || null,
      dto.githubUrl ? new URLValueObject(dto.githubUrl) : null,
      dto.linkedinUrl ? new URLValueObject(dto.linkedinUrl) : null,
      dto.twitterUrl ? new URLValueObject(dto.twitterUrl) : null,
      dto.websiteUrl ? new URLValueObject(dto.websiteUrl) : null,
      dto.location || null,
      dto.yearsExperience || null,
      dto.availableForHire !== undefined ? dto.availableForHire : true,
      now,
      now,
      null
    );
  }

  static fromSequelizeModel(model: any): Developer {
    return new Developer(
      new UUID(model.id),
      model.userId || model.user_id
        ? new UUID(model.userId || model.user_id)
        : null,
      model.fullName || model.full_name,
      model.title,
      model.bio,
      model.profileImageUrl || model.profile_image_url,
      model.resumeUrl || model.resume_url,
      model.githubUrl || model.github_url
        ? new URLValueObject(model.githubUrl || model.github_url)
        : null,
      model.linkedinUrl || model.linkedin_url
        ? new URLValueObject(model.linkedinUrl || model.linkedin_url)
        : null,
      model.twitterUrl || model.twitter_url
        ? new URLValueObject(model.twitterUrl || model.twitter_url)
        : null,
      model.websiteUrl || model.website_url
        ? new URLValueObject(model.websiteUrl || model.website_url)
        : null,
      model.location,
      model.yearsExperience !== undefined
        ? model.yearsExperience
        : model.years_experience,
      model.availableForHire !== undefined
        ? model.availableForHire
        : model.available_for_hire,
      model.createdAt || model.created_at,
      model.updatedAt || model.updated_at,
      model.deletedAt || model.deleted_at
    );
  }

  static toSequelizeModel(entity: Developer): Record<string, any> {
    return {
      id: entity.id.value,
      user_id: entity.userId?.value || null,
      full_name: entity.fullName,
      title: entity.title,
      bio: entity.bio,
      profile_image_url: entity.profileImageUrl,
      resume_url: entity.resumeUrl,
      github_url: entity.githubUrl?.value || null,
      linkedin_url: entity.linkedinUrl?.value || null,
      twitter_url: entity.twitterUrl?.value || null,
      website_url: entity.websiteUrl?.value || null,
      location: entity.location,
      years_experience: entity.yearsExperience,
      available_for_hire: entity.availableForHire,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: entity.deletedAt,
    };
  }
}
