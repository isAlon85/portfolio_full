import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { UUID } from "../../../domain/value-objects/UUID.vo";

export interface AssignRoleDTO {
  userId: string;
  roleId: string;
}

export class AssignRoleToUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(dto: AssignRoleDTO): Promise<void> {
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

    const hasRole = await this.roleRepository.hasRole(userIdVO, "");
    const currentRoles = await this.roleRepository.getUserRoles(userIdVO);
    const alreadyHasRole = currentRoles.some((role) =>
      role.id.equals(roleIdVO)
    );

    if (alreadyHasRole) {
      throw new Error("User already has this role");
    }

    await this.roleRepository.assignRoleToUser(userIdVO, roleIdVO);
  }
}
