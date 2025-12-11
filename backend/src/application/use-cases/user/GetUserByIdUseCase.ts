import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO";
import { UserMapper } from "../../mappers/UserMapper";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDTO> {
    const userIdVO = new UUID(userId);

    const user = await this.userRepository.findById(userIdVO);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isDeleted()) {
      throw new Error("User has been deleted");
    }

    return UserMapper.toDTO(user);
  }
}
