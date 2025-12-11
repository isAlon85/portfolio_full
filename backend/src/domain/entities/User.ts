import { Email } from "../value-objects/Email.vo";
import { UUID } from "../value-objects/UUID.vo";

export class User {
  constructor(
    public readonly id: UUID,
    public username: string,
    public email: Email,
    public passwordHash: string,
    public fullName: string | null,
    public avatarUrl: string | null,
    public isActive: boolean,
    public emailVerified: boolean,
    public lastLoginAt: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.username || this.username.trim().length === 0) {
      throw new Error("Username cannot be empty");
    }

    if (this.username.length < 3 || this.username.length > 100) {
      throw new Error("Username must be between 3 and 100 characters");
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(this.username)) {
      throw new Error(
        "Username can only contain alphanumeric characters, underscores, and hyphens"
      );
    }

    if (!this.passwordHash || this.passwordHash.length === 0) {
      throw new Error("Password hash cannot be empty");
    }

    if (this.fullName !== null && this.fullName.length > 255) {
      throw new Error("Full name cannot exceed 255 characters");
    }

    if (this.avatarUrl !== null && this.avatarUrl.length > 500) {
      throw new Error("Avatar URL cannot exceed 500 characters");
    }
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public activate(): void {
    if (this.isDeleted()) {
      throw new Error("Cannot activate a deleted user");
    }
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public softDelete(): void {
    this.deletedAt = new Date();
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public restore(): void {
    this.deletedAt = null;
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public verifyEmail(): void {
    this.emailVerified = true;
    this.updatedAt = new Date();
  }

  public updateLastLogin(): void {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  public updateProfile(
    fullName: string | null,
    avatarUrl: string | null
  ): void {
    if (fullName !== null && fullName.length > 255) {
      throw new Error("Full name cannot exceed 255 characters");
    }
    if (avatarUrl !== null && avatarUrl.length > 500) {
      throw new Error("Avatar URL cannot exceed 500 characters");
    }

    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
    this.updatedAt = new Date();
  }

  public changePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.length === 0) {
      throw new Error("Password hash cannot be empty");
    }
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }

  public changeEmail(newEmail: Email): void {
    this.email = newEmail;
    this.emailVerified = false;
    this.updatedAt = new Date();
  }
}
