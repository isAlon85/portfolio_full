import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PaginationDTO } from "../../dto/common/PaginationDTO";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO";
import { UserMapper } from "../../mappers/UserMapper";

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationDTO<UserResponseDTO>> {
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    const { users, total } = await this.userRepository.findAll(
      page,
      limit,
      false
    );

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: UserMapper.toDTOList(users),
    };
  }
}
