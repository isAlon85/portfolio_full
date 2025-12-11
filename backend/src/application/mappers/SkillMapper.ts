import { Skill, SkillProficiency } from "../../domain/entities/Skill";
import { UUID } from "../../domain/value-objects/UUID.vo";

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

export interface CreateSkillDTO {
  name: string;
  category?: string;
  proficiencyLevel?: SkillProficiency;
  iconUrl?: string;
  colorHex?: string;
}

export class SkillMapper {
  static toDTO(entity: Skill): SkillResponseDTO {
    return {
      id: entity.id.value,
      name: entity.name,
      category: entity.category,
      proficiencyLevel: entity.proficiencyLevel,
      iconUrl: entity.iconUrl,
      colorHex: entity.colorHex,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDTOList(entities: Skill[]): SkillResponseDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  static toEntity(dto: CreateSkillDTO & { id: UUID }): Skill {
    const now = new Date();

    return new Skill(
      dto.id,
      dto.name,
      dto.category || null,
      dto.proficiencyLevel || SkillProficiency.INTERMEDIATE,
      dto.iconUrl || null,
      dto.colorHex || null,
      now,
      now,
      null
    );
  }

  static fromSequelizeModel(model: any): Skill {
    return new Skill(
      new UUID(model.id),
      model.name,
      model.category,
      (model.proficiencyLevel as SkillProficiency) ||
        (model.proficiency_level as SkillProficiency),
      model.iconUrl || model.icon_url,
      model.colorHex || model.color_hex,
      model.createdAt || model.created_at,
      model.updatedAt || model.updated_at,
      model.deletedAt || model.deleted_at
    );
  }

  static toSequelizeModel(entity: Skill): Record<string, any> {
    return {
      id: entity.id.value,
      name: entity.name,
      category: entity.category,
      proficiency_level: entity.proficiencyLevel,
      icon_url: entity.iconUrl,
      color_hex: entity.colorHex,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: entity.deletedAt,
    };
  }
}
