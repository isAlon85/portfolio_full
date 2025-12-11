import { ProjectStatus } from "../../../domain/entities/Project";

export interface UpdateProjectDTO {
  title?: string;
  slug?: string;
  description?: string | null;
  longDescription?: string | null;
  thumbnailUrl?: string | null;
  demoUrl?: string | null;
  repoUrl?: string | null;
  status?: ProjectStatus;
  isFeatured?: boolean;
  isPublished?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder?: number;
}
