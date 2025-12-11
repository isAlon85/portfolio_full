import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { Role } from "../../../domain/entities/Role";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { RoleModel } from "../postgres/models/RoleModel";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class PostgreSQLRoleRepository implements IRoleRepository {
  async findById(id: UUID): Promise<Role | null> {
    const roleModel = await RoleModel.findByPk(id.value);

    if (!roleModel) {
      return null;
    }

    return new Role(
      new UUID(roleModel.id),
      roleModel.name,
      roleModel.description,
      roleModel.created_at,
      roleModel.updated_at,
      roleModel.deleted_at
    );
  }

  async findByName(name: string): Promise<Role | null> {
    const roleModel = await RoleModel.findOne({ where: { name } });

    if (!roleModel) {
      return null;
    }

    return new Role(
      new UUID(roleModel.id),
      roleModel.name,
      roleModel.description,
      roleModel.created_at,
      roleModel.updated_at,
      roleModel.deleted_at
    );
  }

  async findAll(): Promise<Role[]> {
    const roleModels = await RoleModel.findAll({
      order: [["name", "ASC"]],
    });

    return roleModels.map(
      (model) =>
        new Role(
          new UUID(model.id),
          model.name,
          model.description,
          model.created_at,
          model.updated_at,
          model.deleted_at
        )
    );
  }

  async create(role: Role): Promise<Role> {
    const createdModel = await RoleModel.create({
      id: role.id.value,
      name: role.name,
      description: role.description,
      created_at: role.createdAt,
      updated_at: role.updatedAt,
    });

    return new Role(
      new UUID(createdModel.id),
      createdModel.name,
      createdModel.description,
      createdModel.created_at,
      createdModel.updated_at,
      createdModel.deleted_at
    );
  }

  async update(role: Role): Promise<Role> {
    const roleModel = await RoleModel.findByPk(role.id.value);

    if (!roleModel) {
      throw new NotFoundError(`Role with ID ${role.id.value} not found`);
    }

    await roleModel.update({
      name: role.name,
      description: role.description,
      updated_at: new Date(),
    });

    return new Role(
      new UUID(roleModel.id),
      roleModel.name,
      roleModel.description,
      roleModel.created_at,
      roleModel.updated_at,
      roleModel.deleted_at
    );
  }

  async softDelete(id: UUID): Promise<void> {
    const roleModel = await RoleModel.findByPk(id.value);

    if (!roleModel) {
      throw new NotFoundError(`Role with ID ${id.value} not found`);
    }

    await roleModel.destroy();
  }

  async hardDelete(id: UUID): Promise<void> {
    const roleModel = await RoleModel.findByPk(id.value, { paranoid: false });

    if (!roleModel) {
      throw new NotFoundError(`Role with ID ${id.value} not found`);
    }

    await roleModel.destroy({ force: true });
  }
}
