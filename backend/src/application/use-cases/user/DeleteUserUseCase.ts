import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const userIdVO = new UUID(userId);

    const user = await this.userRepository.findById(userIdVO);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isDeleted()) {
      throw new Error("User is already deleted");
    }

    await this.userRepository.softDelete(userIdVO);
  }
}
