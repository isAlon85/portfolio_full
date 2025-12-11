import { UUID } from "../value-objects/UUID.vo";
import { URL as URLValueObject } from "../value-objects/URL.vo";

export class Developer {
  constructor(
    public readonly id: UUID,
    public userId: UUID | null,
    public fullName: string,
    public title: string | null,
    public bio: string | null,
    public profileImageUrl: string | null,
    public resumeUrl: string | null,
    public githubUrl: URLValueObject | null,
    public linkedinUrl: URLValueObject | null,
    public twitterUrl: URLValueObject | null,
    public websiteUrl: URLValueObject | null,
    public location: string | null,
    public yearsExperience: number | null,
    public availableForHire: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.fullName || this.fullName.trim().length === 0) {
      throw new Error("Developer full name cannot be empty");
    }

    if (this.fullName.length > 255) {
      throw new Error("Developer full name cannot exceed 255 characters");
    }

    if (this.title !== null && this.title.length > 255) {
      throw new Error("Developer title cannot exceed 255 characters");
    }

    if (this.bio !== null && this.bio.length > 5000) {
      throw new Error("Developer bio cannot exceed 5000 characters");
    }

    if (this.profileImageUrl !== null && this.profileImageUrl.length > 500) {
      throw new Error("Profile image URL cannot exceed 500 characters");
    }

    if (this.resumeUrl !== null && this.resumeUrl.length > 500) {
      throw new Error("Resume URL cannot exceed 500 characters");
    }

    if (this.location !== null && this.location.length > 255) {
      throw new Error("Location cannot exceed 255 characters");
    }

    if (
      this.yearsExperience !== null &&
      (this.yearsExperience < 0 || this.yearsExperience > 100)
    ) {
      throw new Error("Years of experience must be between 0 and 100");
    }
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public softDelete(): void {
    this.deletedAt = new Date();
    this.availableForHire = false;
    this.updatedAt = new Date();
  }

  public restore(): void {
    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  public updateProfile(
    fullName: string,
    title: string | null,
    bio: string | null,
    location: string | null
  ): void {
    if (!fullName || fullName.trim().length === 0) {
      throw new Error("Developer full name cannot be empty");
    }
    if (fullName.length > 255) {
      throw new Error("Developer full name cannot exceed 255 characters");
    }
    if (title !== null && title.length > 255) {
      throw new Error("Developer title cannot exceed 255 characters");
    }
    if (bio !== null && bio.length > 5000) {
      throw new Error("Developer bio cannot exceed 5000 characters");
    }
    if (location !== null && location.length > 255) {
      throw new Error("Location cannot exceed 255 characters");
    }

    this.fullName = fullName;
    this.title = title;
    this.bio = bio;
    this.location = location;
    this.updatedAt = new Date();
  }

  public updateSocialLinks(
    githubUrl: URLValueObject | null,
    linkedinUrl: URLValueObject | null,
    twitterUrl: URLValueObject | null,
    websiteUrl: URLValueObject | null
  ): void {
    this.githubUrl = githubUrl;
    this.linkedinUrl = linkedinUrl;
    this.twitterUrl = twitterUrl;
    this.websiteUrl = websiteUrl;
    this.updatedAt = new Date();
  }

  public updateAvailability(available: boolean): void {
    if (this.isDeleted()) {
      throw new Error(
        "Cannot update availability of a deleted developer profile"
      );
    }
    this.availableForHire = available;
    this.updatedAt = new Date();
  }

  public updateExperience(years: number): void {
    if (years < 0 || years > 100) {
      throw new Error("Years of experience must be between 0 and 100");
    }
    this.yearsExperience = years;
    this.updatedAt = new Date();
  }
}
