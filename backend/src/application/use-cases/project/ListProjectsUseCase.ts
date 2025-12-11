import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { PaginationDTO } from "../../dto/common/PaginationDTO";
import { ProjectResponseDTO } from "../../dto/project/ProjectResponseDTO";
import { ProjectMapper } from "../../mappers/ProjectMapper";

export class ListProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    publishedOnly: boolean = false
  ): Promise<PaginationDTO<ProjectResponseDTO>> {
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    const { projects, total } = publishedOnly
      ? await this.projectRepository.findPublished(page, limit)
      : await this.projectRepository.findAll(page, limit, false);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: ProjectMapper.toDTOList(projects),
    };
  }
}
