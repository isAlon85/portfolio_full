import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IPasswordHashService } from "../../../domain/services/PasswordHashService";
import { IUUIDGeneratorService } from "../../../domain/services/UUIDGeneratorService";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email.vo";
import { Password } from "../../../domain/value-objects/Password.vo";
import { CreateUserDTO } from "../../dto/user/CreateUserDTO";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO";
import { UserMapper } from "../../mappers/UserMapper";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordHashService: IPasswordHashService,
    private readonly uuidGeneratorService: IUUIDGeneratorService
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    const emailVO = new Email(dto.email);

    const emailExists = await this.userRepository.existsByEmail(emailVO);
    if (emailExists) {
      throw new Error("Email already exists");
    }

    const usernameExists = await this.userRepository.existsByUsername(
      dto.username
    );
    if (usernameExists) {
      throw new Error("Username already exists");
    }

    const passwordVO = new Password(dto.password);
    const passwordHash = await this.passwordHashService.hash(passwordVO.value);

    const userId = this.uuidGeneratorService.generate();
    const now = new Date();

    const user = new User(
      userId,
      dto.username,
      emailVO,
      passwordHash,
      dto.fullName || null,
      null,
      true,
      false,
      null,
      now,
      now,
      null
    );

    const createdUser = await this.userRepository.create(user);

    if (dto.roleId) {
      const roleExists = await this.roleRepository.existsById(dto.roleId);
      if (roleExists) {
        await this.roleRepository.assignRoleToUser(userId, dto.roleId);
      }
    } else {
      const userRole = await this.roleRepository.findByName("user");
      if (userRole) {
        await this.roleRepository.assignRoleToUser(userId, userRole.id);
      }
    }

    return UserMapper.toDTO(createdUser);
  }
}
