import { IEmailRepository } from "../../../domain/repositories/IEmailRepository";
import { Email as EmailValueObject } from "../../../domain/value-objects/Email.vo";

export interface UnsubscribeEmailDTO {
  email: string;
}

export class UnsubscribeEmailUseCase {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async execute(dto: UnsubscribeEmailDTO): Promise<void> {
    const emailVO = new EmailValueObject(dto.email);

    const existingEmail = await this.emailRepository.findByEmail(emailVO);

    if (!existingEmail) {
      throw new Error("Email not found");
    }

    if (!existingEmail.isSubscribed) {
      throw new Error("Email is already unsubscribed");
    }

    if (existingEmail.isDeleted()) {
      throw new Error("Email has been deleted");
    }

    await this.emailRepository.unsubscribe(existingEmail.id);
  }
}
