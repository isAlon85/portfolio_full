import { IEmailRepository } from "../../../domain/repositories/IEmailRepository";
import { Email as EmailEntity } from "../../../domain/entities/Email";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { Email as EmailVO } from "../../../domain/value-objects/Email.vo";
import { EmailModel } from "../postgres/models/EmailModel";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class PostgreSQLEmailRepository implements IEmailRepository {
  async findById(id: UUID): Promise<EmailEntity | null> {
    const emailModel = await EmailModel.findByPk(id.value);

    if (!emailModel) {
      return null;
    }

    return new EmailEntity(
      new UUID(emailModel.id),
      new EmailVO(emailModel.email),
      emailModel.is_subscribed,
      emailModel.subscribed_at,
      emailModel.unsubscribed_at,
      emailModel.created_at,
      emailModel.updated_at,
      emailModel.deleted_at
    );
  }

  async findByEmail(email: EmailVO): Promise<EmailEntity | null> {
    const emailModel = await EmailModel.findOne({
      where: { email: email.value },
    });

    if (!emailModel) {
      return null;
    }

    return new EmailEntity(
      new UUID(emailModel.id),
      new EmailVO(emailModel.email),
      emailModel.is_subscribed,
      emailModel.subscribed_at,
      emailModel.unsubscribed_at,
      emailModel.created_at,
      emailModel.updated_at,
      emailModel.deleted_at
    );
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    isSubscribed?: boolean;
  }): Promise<EmailEntity[]> {
    const where: any = {};

    if (options?.isSubscribed !== undefined) {
      where.is_subscribed = options.isSubscribed;
    }

    const emailModels = await EmailModel.findAll({
      where,
      limit: options?.limit,
      offset: options?.offset,
      order: [["subscribed_at", "DESC"]],
    });

    return emailModels.map(
      (model) =>
        new EmailEntity(
          new UUID(model.id),
          new EmailVO(model.email),
          model.is_subscribed,
          model.subscribed_at,
          model.unsubscribed_at,
          model.created_at,
          model.updated_at,
          model.deleted_at
        )
    );
  }

  async count(isSubscribed?: boolean): Promise<number> {
    const where: any = {};

    if (isSubscribed !== undefined) {
      where.is_subscribed = isSubscribed;
    }

    return await EmailModel.count({ where });
  }

  async create(email: EmailEntity): Promise<EmailEntity> {
    const createdModel = await EmailModel.create({
      id: email.id.value,
      email: email.email.value,
      is_subscribed: email.isSubscribed,
      subscribed_at: email.subscribedAt,
      unsubscribed_at: email.unsubscribedAt,
      created_at: email.createdAt,
      updated_at: email.updatedAt,
    });

    return new EmailEntity(
      new UUID(createdModel.id),
      new EmailVO(createdModel.email),
      createdModel.is_subscribed,
      createdModel.subscribed_at,
      createdModel.unsubscribed_at,
      createdModel.created_at,
      createdModel.updated_at,
      createdModel.deleted_at
    );
  }

  async update(email: EmailEntity): Promise<EmailEntity> {
    const emailModel = await EmailModel.findByPk(email.id.value);

    if (!emailModel) {
      throw new NotFoundError(`Email with ID ${email.id.value} not found`);
    }

    await emailModel.update({
      email: email.email.value,
      is_subscribed: email.isSubscribed,
      subscribed_at: email.subscribedAt,
      unsubscribed_at: email.unsubscribedAt,
      updated_at: new Date(),
    });

    return new EmailEntity(
      new UUID(emailModel.id),
      new EmailVO(emailModel.email),
      emailModel.is_subscribed,
      emailModel.subscribed_at,
      emailModel.unsubscribed_at,
      emailModel.created_at,
      emailModel.updated_at,
      emailModel.deleted_at
    );
  }

  async subscribe(id: UUID): Promise<void> {
    const emailModel = await EmailModel.findByPk(id.value);

    if (!emailModel) {
      throw new NotFoundError(`Email with ID ${id.value} not found`);
    }

    await emailModel.update({
      is_subscribed: true,
      subscribed_at: new Date(),
      unsubscribed_at: null,
    });
  }

  async unsubscribe(id: UUID): Promise<void> {
    const emailModel = await EmailModel.findByPk(id.value);

    if (!emailModel) {
      throw new NotFoundError(`Email with ID ${id.value} not found`);
    }

    await emailModel.update({
      is_subscribed: false,
      unsubscribed_at: new Date(),
    });
  }

  async softDelete(id: UUID): Promise<void> {
    const emailModel = await EmailModel.findByPk(id.value);

    if (!emailModel) {
      throw new NotFoundError(`Email with ID ${id.value} not found`);
    }

    await emailModel.destroy();
  }

  async hardDelete(id: UUID): Promise<void> {
    const emailModel = await EmailModel.findByPk(id.value, { paranoid: false });

    if (!emailModel) {
      throw new NotFoundError(`Email with ID ${id.value} not found`);
    }

    await emailModel.destroy({ force: true });
  }
}
