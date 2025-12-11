import { IEmailRepository } from "../../../domain/repositories/IEmailRepository";
import { PaginationDTO } from "../../dto/common/PaginationDTO";

export interface EmailResponseDTO {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
}

export class ListEmailsUseCase {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    subscribedOnly: boolean = true
  ): Promise<PaginationDTO<EmailResponseDTO>> {
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    const { emails, total } = subscribedOnly
      ? await this.emailRepository.findSubscribed(page, limit)
      : await this.emailRepository.findAll(page, limit, false);

    const emailDTOs: EmailResponseDTO[] = emails.map((email) => ({
      id: email.id.value,
      email: email.email.value,
      isSubscribed: email.isSubscribed,
      subscribedAt: email.subscribedAt,
      unsubscribedAt: email.unsubscribedAt,
    }));

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: emailDTOs,
    };
  }
}
