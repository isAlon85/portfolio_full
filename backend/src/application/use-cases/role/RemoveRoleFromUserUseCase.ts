import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";

export interface RemoveRoleDTO {
  userId: string;
  roleId: string;
}

export class RemoveRoleFromUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(dto: RemoveRoleDTO): Promise<void> {
    const userIdVO = new UUID(dto.userId);
    const roleIdVO = new UUID(dto.roleId);

    const userExists = await this.userRepository.existsById(userIdVO);
    if (!userExists) {
      throw new Error("User not found");
    }

    const roleExists = await this.roleRepository.existsById(roleIdVO);
    if (!roleExists) {
      throw new Error("Role not found");
    }

    const currentRoles = await this.roleRepository.getUserRoles(userIdVO);
    const hasRole = currentRoles.some((role) => role.id.equals(roleIdVO));

    if (!hasRole) {
      throw new Error("User does not have this role");
    }

    await this.roleRepository.removeRoleFromUser(userIdVO, roleIdVO);
  }
}
