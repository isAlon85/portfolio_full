import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { Email } from "../../../domain/value-objects/Email.vo";
import { UserModel } from "../postgres/models/UserModel";
import { RoleModel } from "../postgres/models/RoleModel";
import { UserMapper } from "../../../application/mappers/UserMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class PostgreSQLUserRepository implements IUserRepository {
  async findById(id: UUID): Promise<User | null> {
    const userModel = await UserModel.findByPk(id.value, {
      include: [{ model: RoleModel, as: "roles" }],
    });

    if (!userModel) {
      return null;
    }

    return UserMapper.fromSequelizeModel(userModel);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userModel = await UserModel.findOne({
      where: { email: email.value },
      include: [{ model: RoleModel, as: "roles" }],
    });

    if (!userModel) {
      return null;
    }

    return UserMapper.fromSequelizeModel(userModel);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userModel = await UserModel.findOne({
      where: { username },
      include: [{ model: RoleModel, as: "roles" }],
    });

    if (!userModel) {
      return null;
    }

    return UserMapper.fromSequelizeModel(userModel);
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    const userModels = await UserModel.findAll({
      include: [{ model: RoleModel, as: "roles" }],
      limit: options?.limit,
      offset: options?.offset,
      order: [["created_at", "DESC"]],
    });

    return userModels.map((model) => UserMapper.fromSequelizeModel(model));
  }

  async count(): Promise<number> {
    return await UserModel.count();
  }

  async create(user: User): Promise<User> {
    const userData = UserMapper.toSequelizeModel(user);
    const createdModel = await UserModel.create(userData);

    return UserMapper.fromSequelizeModel(createdModel);
  }

  async update(user: User): Promise<User> {
    const userModel = await UserModel.findByPk(user.id.value);

    if (!userModel) {
      throw new NotFoundError(`User with ID ${user.id.value} not found`);
    }

    const userData = UserMapper.toSequelizeModel(user);
    await userModel.update(userData);

    const updatedModel = await UserModel.findByPk(user.id.value, {
      include: [{ model: RoleModel, as: "roles" }],
    });

    return UserMapper.fromSequelizeModel(updatedModel!);
  }

  async softDelete(id: UUID): Promise<void> {
    const userModel = await UserModel.findByPk(id.value);

    if (!userModel) {
      throw new NotFoundError(`User with ID ${id.value} not found`);
    }

    await userModel.destroy();
  }

  async hardDelete(id: UUID): Promise<void> {
    const userModel = await UserModel.findByPk(id.value, { paranoid: false });

    if (!userModel) {
      throw new NotFoundError(`User with ID ${id.value} not found`);
    }

    await userModel.destroy({ force: true });
  }

  async restore(id: UUID): Promise<User> {
    const userModel = await UserModel.findByPk(id.value, { paranoid: false });

    if (!userModel) {
      throw new NotFoundError(`User with ID ${id.value} not found`);
    }

    await userModel.restore();

    const restoredModel = await UserModel.findByPk(id.value, {
      include: [{ model: RoleModel, as: "roles" }],
    });

    return UserMapper.fromSequelizeModel(restoredModel!);
  }

  async assignRole(userId: UUID, roleId: UUID): Promise<void> {
    const userModel = await UserModel.findByPk(userId.value);

    if (!userModel) {
      throw new NotFoundError(`User with ID ${userId.value} not found`);
    }

    await userModel.addRole(roleId.value);
  }

  async removeRole(userId: UUID, roleId: UUID): Promise<void> {
    const userModel = await UserModel.findByPk(userId.value);

    if (!userModel) {
      throw new NotFoundError(`User with ID ${userId.value} not found`);
    }

    await userModel.removeRole(roleId.value);
  }

  async updateLastLogin(id: UUID): Promise<void> {
    const userModel = await UserModel.findByPk(id.value);

    if (!userModel) {
      throw new NotFoundError(`User with ID ${id.value} not found`);
    }

    await userModel.update({ last_login_at: new Date() });
  }
}
