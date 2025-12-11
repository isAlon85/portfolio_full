import bcrypt from "bcrypt";
import { IPasswordHashService } from "../../domain/services/PasswordHashService";

export class BcryptPasswordHashService implements IPasswordHashService {
  private readonly saltRounds: number;

  constructor(saltRounds?: number) {
    this.saltRounds =
      saltRounds || parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

    if (this.saltRounds < 10 || this.saltRounds > 15) {
      console.warn(
        `[BcryptPasswordHashService] Salt rounds ${this.saltRounds} is outside recommended range (10-15). Using 12 as default.`
      );
      this.saltRounds = 12;
    }
  }

  async hash(plainPassword: string): Promise<string> {
    try {
      const hash = await bcrypt.hash(plainPassword, this.saltRounds);
      return hash;
    } catch (error) {
      console.error(
        "[BcryptPasswordHashService] Error hashing password:",
        error
      );
      throw new Error("Failed to hash password");
    }
  }

  async compare(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error(
        "[BcryptPasswordHashService] Error comparing passwords:",
        error
      );
      return false;
    }
  }

  getSaltRounds(): number {
    return this.saltRounds;
  }
}

export const bcryptPasswordHashService = new BcryptPasswordHashService();
