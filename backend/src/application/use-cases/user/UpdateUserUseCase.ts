import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { Email } from "../../../domain/value-objects/Email.vo";
import { UpdateUserDTO } from "../../dto/user/UpdateUserDTO";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO";
import { UserMapper } from "../../mappers/UserMapper";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const userIdVO = new UUID(userId);

    const user = await this.userRepository.findById(userIdVO);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isDeleted()) {
      throw new Error("Cannot update a deleted user");
    }

    if (dto.email && dto.email !== user.email.value) {
      const newEmailVO = new Email(dto.email);
      const emailExists = await this.userRepository.existsByEmail(newEmailVO);
      if (emailExists) {
        throw new Error("Email already exists");
      }
      user.changeEmail(newEmailVO);
    }

    if (dto.username && dto.username !== user.username) {
      const usernameExists = await this.userRepository.existsByUsername(
        dto.username
      );
      if (usernameExists) {
        throw new Error("Username already exists");
      }
      user.username = dto.username;
    }

    if (dto.fullName !== undefined || dto.avatarUrl !== undefined) {
      user.updateProfile(
        dto.fullName !== undefined ? dto.fullName : user.fullName,
        dto.avatarUrl !== undefined ? dto.avatarUrl : user.avatarUrl
      );
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    const updatedUser = await this.userRepository.update(userIdVO, user);

    return UserMapper.toDTO(updatedUser);
  }
}
