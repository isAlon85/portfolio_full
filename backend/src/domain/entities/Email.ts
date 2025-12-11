import { UUID } from "../value-objects/UUID.vo";
import { Email as EmailValueObject } from "../value-objects/Email.vo";

export class Email {
  constructor(
    public readonly id: UUID,
    public email: EmailValueObject,
    public isSubscribed: boolean,
    public subscribedAt: Date,
    public unsubscribedAt: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email) {
      throw new Error("Email value object cannot be null");
    }

    if (this.subscribedAt > new Date()) {
      throw new Error("Subscribed date cannot be in the future");
    }

    if (
      this.unsubscribedAt !== null &&
      this.unsubscribedAt < this.subscribedAt
    ) {
      throw new Error("Unsubscribed date cannot be before subscribed date");
    }
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public softDelete(): void {
    this.deletedAt = new Date();
    this.unsubscribe();
  }

  public restore(): void {
    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  public subscribe(): void {
    if (this.isDeleted()) {
      throw new Error("Cannot subscribe a deleted email");
    }
    this.isSubscribed = true;
    this.subscribedAt = new Date();
    this.unsubscribedAt = null;
    this.updatedAt = new Date();
  }

  public unsubscribe(): void {
    this.isSubscribed = false;
    this.unsubscribedAt = new Date();
    this.updatedAt = new Date();
  }

  public isActiveSubscriber(): boolean {
    return (
      this.isSubscribed && !this.isDeleted() && this.unsubscribedAt === null
    );
  }

  public getSubscriptionDuration(): number {
    if (!this.isActiveSubscriber()) {
      return 0;
    }
    const endDate = this.unsubscribedAt || new Date();
    return Math.floor(
      (endDate.getTime() - this.subscribedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
}
