import { User } from "../entities/User";
import { Email } from "../value-objects/Email.vo";
import { UUID } from "../value-objects/UUID.vo";

export interface IUserRepository {
  findById(id: UUID): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(
    page: number,
    limit: number,
    includeDeleted?: boolean
  ): Promise<{ users: User[]; total: number }>;
  create(user: User): Promise<User>;
  update(id: UUID, user: Partial<User>): Promise<User>;
  softDelete(id: UUID): Promise<void>;
  hardDelete(id: UUID): Promise<void>;
  restore(id: UUID): Promise<void>;
  existsByEmail(email: Email): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
  existsById(id: UUID): Promise<boolean>;
  countAll(includeDeleted?: boolean): Promise<number>;
  findByRoleId(
    roleId: UUID,
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }>;
  updateLastLogin(id: UUID): Promise<void>;
  verifyEmail(id: UUID): Promise<void>;
  changePassword(id: UUID, passwordHash: string): Promise<void>;
}
