import { IEmailRepository } from "../../../domain/repositories/IEmailRepository";
import { IUUIDGeneratorService } from "../../../domain/services/UUIDGeneratorService";
import { Email as EmailEntity } from "../../../domain/entities/Email";
import { Email as EmailValueObject } from "../../../domain/value-objects/Email.vo";

export interface SubscribeEmailDTO {
  email: string;
}

export class SubscribeEmailUseCase {
  constructor(
    private readonly emailRepository: IEmailRepository,
    private readonly uuidGeneratorService: IUUIDGeneratorService
  ) {}

  async execute(dto: SubscribeEmailDTO): Promise<void> {
    const emailVO = new EmailValueObject(dto.email);

    const existingEmail = await this.emailRepository.findByEmail(emailVO);

    if (existingEmail) {
      if (existingEmail.isSubscribed && !existingEmail.isDeleted()) {
        throw new Error("Email is already subscribed");
      }

      if (existingEmail.isDeleted()) {
        await this.emailRepository.restore(existingEmail.id);
      }

      await this.emailRepository.subscribe(existingEmail.id);
      return;
    }

    const emailId = this.uuidGeneratorService.generate();
    const now = new Date();

    const emailEntity = new EmailEntity(
      emailId,
      emailVO,
      true,
      now,
      null,
      now,
      now,
      null
    );

    await this.emailRepository.create(emailEntity);
  }
}
