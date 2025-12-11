export class Email {
  private readonly _value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MAX_LENGTH = 255;

  constructor(email: string) {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || trimmedEmail.length === 0) {
      throw new Error("Email cannot be empty");
    }

    if (trimmedEmail.length > Email.MAX_LENGTH) {
      throw new Error(`Email cannot exceed ${Email.MAX_LENGTH} characters`);
    }

    if (!Email.EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    const [localPart, domain] = trimmedEmail.split("@");

    if (localPart.length > 64) {
      throw new Error("Email local part cannot exceed 64 characters");
    }

    if (domain.length > 255) {
      throw new Error("Email domain cannot exceed 255 characters");
    }

    const domainParts = domain.split(".");
    if (domainParts.some((part) => part.length === 0)) {
      throw new Error("Invalid email domain format");
    }

    this._value = trimmedEmail;
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }

  public getDomain(): string {
    return this._value.split("@")[1];
  }

  public getLocalPart(): string {
    return this._value.split("@")[0];
  }

  public static isValid(email: string): boolean {
    try {
      new Email(email);
      return true;
    } catch {
      return false;
    }
  }

  public static fromString(email: string): Email {
    return new Email(email);
  }
}
