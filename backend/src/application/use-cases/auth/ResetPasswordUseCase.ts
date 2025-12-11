import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordHashService } from "../../../domain/services/PasswordHashService";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { Password } from "../../../domain/value-objects/Password.vo";

export interface ResetPasswordDTO {
  userId: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashService: IPasswordHashService
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<void> {
    const userIdVO = new UUID(dto.userId);

    const user = await this.userRepository.findById(userIdVO);
    if (!user || user.isDeleted()) {
      throw new Error("User not found");
    }

    const passwordVO = new Password(dto.newPassword);
    const newPasswordHash = await this.passwordHashService.hash(
      passwordVO.value
    );

    await this.userRepository.changePassword(userIdVO, newPasswordHash);
  }
}
