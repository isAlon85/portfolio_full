import { randomUUID } from "crypto";
import { IUUIDGeneratorService } from "../../domain/services/UUIDGeneratorService";
import { UUID } from "../../domain/value-objects/UUID.vo";

export class CryptoUUIDGeneratorService implements IUUIDGeneratorService {
  generate(): UUID {
    try {
      const uuidString = randomUUID();
      return new UUID(uuidString);
    } catch (error) {
      console.error(
        "[CryptoUUIDGeneratorService] Error generating UUID:",
        error
      );
      throw new Error("Failed to generate UUID");
    }
  }

  generateString(): string {
    try {
      return randomUUID();
    } catch (error) {
      console.error(
        "[CryptoUUIDGeneratorService] Error generating UUID string:",
        error
      );
      throw new Error("Failed to generate UUID string");
    }
  }

  validate(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

export const cryptoUUIDGeneratorService = new CryptoUUIDGeneratorService();
