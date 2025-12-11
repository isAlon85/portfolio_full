import { UUID } from "../value-objects/UUID.vo";
import { URL as URLValueObject } from "../value-objects/URL.vo";

export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}

export class Project {
  constructor(
    public readonly id: UUID,
    public title: string,
    public slug: string,
    public description: string | null,
    public longDescription: string | null,
    public thumbnailUrl: string | null,
    public demoUrl: URLValueObject | null,
    public repoUrl: URLValueObject | null,
    public status: ProjectStatus,
    public isFeatured: boolean,
    public isPublished: boolean,
    public startDate: Date | null,
    public endDate: Date | null,
    public displayOrder: number,
    public viewsCount: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Project title cannot be empty");
    }

    if (this.title.length > 255) {
      throw new Error("Project title cannot exceed 255 characters");
    }

    if (!this.slug || this.slug.trim().length === 0) {
      throw new Error("Project slug cannot be empty");
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(this.slug)) {
      throw new Error(
        "Project slug must be lowercase, alphanumeric, and separated by hyphens"
      );
    }

    if (this.slug.length > 255) {
      throw new Error("Project slug cannot exceed 255 characters");
    }

    if (this.description !== null && this.description.length > 5000) {
      throw new Error("Project description cannot exceed 5000 characters");
    }

    if (this.longDescription !== null && this.longDescription.length > 50000) {
      throw new Error(
        "Project long description cannot exceed 50000 characters"
      );
    }

    if (this.thumbnailUrl !== null && this.thumbnailUrl.length > 500) {
      throw new Error("Project thumbnail URL cannot exceed 500 characters");
    }

    if (this.displayOrder < 0) {
      throw new Error("Display order cannot be negative");
    }

    if (this.viewsCount < 0) {
      throw new Error("Views count cannot be negative");
    }

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      throw new Error("Start date cannot be after end date");
    }
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public softDelete(): void {
    this.deletedAt = new Date();
    this.isPublished = false;
    this.updatedAt = new Date();
  }

  public restore(): void {
    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  public publish(): void {
    if (this.isDeleted()) {
      throw new Error("Cannot publish a deleted project");
    }
    this.isPublished = true;
    this.updatedAt = new Date();
  }

  public unpublish(): void {
    this.isPublished = false;
    this.updatedAt = new Date();
  }

  public feature(): void {
    if (this.isDeleted()) {
      throw new Error("Cannot feature a deleted project");
    }
    this.isFeatured = true;
    this.updatedAt = new Date();
  }

  public unfeature(): void {
    this.isFeatured = false;
    this.updatedAt = new Date();
  }

  public incrementViews(): void {
    this.viewsCount++;
    this.updatedAt = new Date();
  }

  public updateStatus(status: ProjectStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  public updateDisplayOrder(order: number): void {
    if (order < 0) {
      throw new Error("Display order cannot be negative");
    }
    this.displayOrder = order;
    this.updatedAt = new Date();
  }

  public updateDates(startDate: Date | null, endDate: Date | null): void {
    if (startDate && endDate && startDate > endDate) {
      throw new Error("Start date cannot be after end date");
    }
    this.startDate = startDate;
    this.endDate = endDate;
    this.updatedAt = new Date();
  }
}
