import { ProjectStatus } from "../../../domain/entities/Project";

export interface CreateProjectDTO {
  title: string;
  slug: string;
  description?: string;
  longDescription?: string;
  thumbnailUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  status?: ProjectStatus;
  isFeatured?: boolean;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
}
