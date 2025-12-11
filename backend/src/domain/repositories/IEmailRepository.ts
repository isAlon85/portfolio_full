import { Email } from "../entities/Email";
import { Email as EmailValueObject } from "../value-objects/Email.vo";
import { UUID } from "../value-objects/UUID.vo";

export interface IEmailRepository {
  findById(id: UUID): Promise<Email | null>;
  findByEmail(email: EmailValueObject): Promise<Email | null>;
  findAll(
    page: number,
    limit: number,
    includeDeleted?: boolean
  ): Promise<{ emails: Email[]; total: number }>;
  findSubscribed(
    page: number,
    limit: number
  ): Promise<{ emails: Email[]; total: number }>;
  findUnsubscribed(
    page: number,
    limit: number
  ): Promise<{ emails: Email[]; total: number }>;
  create(email: Email): Promise<Email>;
  update(id: UUID, email: Partial<Email>): Promise<Email>;
  softDelete(id: UUID): Promise<void>;
  hardDelete(id: UUID): Promise<void>;
  restore(id: UUID): Promise<void>;
  subscribe(id: UUID): Promise<void>;
  unsubscribe(id: UUID): Promise<void>;
  existsByEmail(email: EmailValueObject): Promise<boolean>;
  existsById(id: UUID): Promise<boolean>;
  countSubscribed(): Promise<number>;
  countUnsubscribed(): Promise<number>;
  countAll(includeDeleted?: boolean): Promise<number>;
  findRecentSubscriptions(days: number): Promise<Email[]>;
}
