import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IUUIDGeneratorService } from "../../../domain/services/UUIDGeneratorService";
import { Role } from "../../../domain/entities/Role";

export interface CreateRoleDTO {
  name: string;
  description?: string;
}

export interface RoleResponseDTO {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateRoleUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly uuidGeneratorService: IUUIDGeneratorService
  ) {}

  async execute(dto: CreateRoleDTO): Promise<RoleResponseDTO> {
    const nameExists = await this.roleRepository.existsByName(
      dto.name.toLowerCase()
    );
    if (nameExists) {
      throw new Error("Role name already exists");
    }

    const roleId = this.uuidGeneratorService.generate();
    const now = new Date();

    const role = new Role(
      roleId,
      dto.name.toLowerCase(),
      dto.description || null,
      now,
      now,
      null
    );

    const createdRole = await this.roleRepository.create(role);

    return {
      id: createdRole.id.value,
      name: createdRole.name,
      description: createdRole.description,
      createdAt: createdRole.createdAt,
      updatedAt: createdRole.updatedAt,
    };
  }
}
