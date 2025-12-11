import { UUID } from "../value-objects/UUID.vo";

export enum SkillProficiency {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export class Skill {
  constructor(
    public readonly id: UUID,
    public name: string,
    public category: string | null,
    public proficiencyLevel: SkillProficiency,
    public iconUrl: string | null,
    public colorHex: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Skill name cannot be empty");
    }

    if (this.name.length > 100) {
      throw new Error("Skill name cannot exceed 100 characters");
    }

    if (this.category !== null && this.category.length > 100) {
      throw new Error("Skill category cannot exceed 100 characters");
    }

    if (this.iconUrl !== null && this.iconUrl.length > 500) {
      throw new Error("Skill icon URL cannot exceed 500 characters");
    }

    if (this.colorHex !== null) {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorRegex.test(this.colorHex)) {
        throw new Error(
          "Color hex must be a valid hex color code (e.g., #FFFFFF or #FFF)"
        );
      }
    }
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public softDelete(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  public restore(): void {
    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  public updateProficiency(level: SkillProficiency): void {
    this.proficiencyLevel = level;
    this.updatedAt = new Date();
  }

  public updateCategory(category: string | null): void {
    if (category !== null && category.length > 100) {
      throw new Error("Skill category cannot exceed 100 characters");
    }
    this.category = category;
    this.updatedAt = new Date();
  }

  public updateVisuals(iconUrl: string | null, colorHex: string | null): void {
    if (iconUrl !== null && iconUrl.length > 500) {
      throw new Error("Skill icon URL cannot exceed 500 characters");
    }
    if (colorHex !== null) {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorRegex.test(colorHex)) {
        throw new Error("Color hex must be a valid hex color code");
      }
    }
    this.iconUrl = iconUrl;
    this.colorHex = colorHex;
    this.updatedAt = new Date();
  }

  public static getValidCategories(): string[] {
    return [
      "Frontend",
      "Backend",
      "DevOps",
      "Database",
      "Mobile",
      "Testing",
      "Design",
      "Other",
    ];
  }
}
