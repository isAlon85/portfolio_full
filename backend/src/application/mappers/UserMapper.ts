import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email.vo";
import { UUID } from "../../domain/value-objects/UUID.vo";
import { UserResponseDTO } from "../dto/user/UserResponseDTO";
import { CreateUserDTO } from "../dto/user/CreateUserDTO";

export class UserMapper {
  static toDTO(entity: User): UserResponseDTO {
    return {
      id: entity.id.value,
      username: entity.username,
      email: entity.email.value,
      fullName: entity.fullName,
      avatarUrl: entity.avatarUrl,
      isActive: entity.isActive,
      emailVerified: entity.emailVerified,
      lastLoginAt: entity.lastLoginAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDTOList(entities: User[]): UserResponseDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  static toEntity(
    dto: CreateUserDTO & { id: UUID; passwordHash: string }
  ): User {
    const now = new Date();

    return new User(
      dto.id,
      dto.username,
      new Email(dto.email),
      dto.passwordHash,
      dto.fullName || null,
      null,
      true,
      false,
      null,
      now,
      now,
      null
    );
  }

  static fromSequelizeModel(model: any): User {
    return new User(
      new UUID(model.id),
      model.username,
      new Email(model.email),
      model.passwordHash || model.password_hash,
      model.fullName || model.full_name,
      model.avatarUrl || model.avatar_url,
      model.isActive !== undefined ? model.isActive : model.is_active,
      model.emailVerified !== undefined
        ? model.emailVerified
        : model.email_verified,
      model.lastLoginAt || model.last_login_at,
      model.createdAt || model.created_at,
      model.updatedAt || model.updated_at,
      model.deletedAt || model.deleted_at
    );
  }

  static toSequelizeModel(entity: User): Record<string, any> {
    return {
      id: entity.id.value,
      username: entity.username,
      email: entity.email.value,
      password_hash: entity.passwordHash,
      full_name: entity.fullName,
      avatar_url: entity.avatarUrl,
      is_active: entity.isActive,
      email_verified: entity.emailVerified,
      last_login_at: entity.lastLoginAt,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: entity.deletedAt,
    };
  }
}
