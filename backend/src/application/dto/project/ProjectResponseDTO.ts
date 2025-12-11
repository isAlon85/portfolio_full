import { ProjectStatus } from "../../../domain/entities/Project";

export interface ProjectResponseDTO {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  longDescription: string | null;
  thumbnailUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  status: ProjectStatus;
  isFeatured: boolean;
  isPublished: boolean;
  startDate: Date | null;
  endDate: Date | null;
  displayOrder: number;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
