import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordHashService } from "../../../domain/services/PasswordHashService";
import { ITokenService } from "../../../domain/services/TokenService";
import { Email } from "../../../domain/value-objects/Email.vo";
import { LoginDTO } from "../../dto/auth/LoginDTO";
import { LoginResponseDTO } from "../../dto/auth/LoginResponseDTO";
import { UserMapper } from "../../mappers/UserMapper";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashService: IPasswordHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
    const emailVO = new Email(dto.email);

    const user = await this.userRepository.findByEmail(emailVO);
    if (!user || user.isDeleted()) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const isPasswordValid = await this.passwordHashService.compare(
      dto.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = this.tokenService.generate(
      {
        userId: user.id.value,
        email: user.email.value,
        type: "access",
      },
      "10m"
    );

    const refreshToken = this.tokenService.generate(
      {
        userId: user.id.value,
        type: "refresh",
      },
      "7d"
    );

    await this.userRepository.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    };
  }
}
