import { UUID } from "../value-objects/UUID.vo";

export class Role {
  constructor(
    public readonly id: UUID,
    public name: string,
    public description: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Role name cannot be empty");
    }

    if (this.name.length < 2 || this.name.length > 50) {
      throw new Error("Role name must be between 2 and 50 characters");
    }

    const roleNameRegex = /^[a-z_]+$/;
    if (!roleNameRegex.test(this.name)) {
      throw new Error(
        "Role name must be lowercase and can only contain letters and underscores"
      );
    }

    if (this.description !== null && this.description.length > 1000) {
      throw new Error("Role description cannot exceed 1000 characters");
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

  public updateDescription(description: string | null): void {
    if (description !== null && description.length > 1000) {
      throw new Error("Role description cannot exceed 1000 characters");
    }
    this.description = description;
    this.updatedAt = new Date();
  }

  public static isValidRoleName(name: string): boolean {
    const validRoles = ["admin", "user", "moderator", "guest"];
    return validRoles.includes(name.toLowerCase());
  }
}
