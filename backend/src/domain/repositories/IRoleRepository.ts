import { Role } from "../entities/Role";
import { UUID } from "../value-objects/UUID.vo";

export interface IRoleRepository {
  findById(id: UUID): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(includeDeleted?: boolean): Promise<Role[]>;
  create(role: Role): Promise<Role>;
  update(id: UUID, role: Partial<Role>): Promise<Role>;
  softDelete(id: UUID): Promise<void>;
  hardDelete(id: UUID): Promise<void>;
  restore(id: UUID): Promise<void>;
  existsByName(name: string): Promise<boolean>;
  existsById(id: UUID): Promise<boolean>;
  assignRoleToUser(userId: UUID, roleId: UUID): Promise<void>;
  removeRoleFromUser(userId: UUID, roleId: UUID): Promise<void>;
  getUserRoles(userId: UUID): Promise<Role[]>;
  hasRole(userId: UUID, roleName: string): Promise<boolean>;
  getUsersWithRole(roleId: UUID): Promise<UUID[]>;
}
