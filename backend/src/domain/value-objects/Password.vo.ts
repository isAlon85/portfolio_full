export enum PasswordStrength {
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
  VERY_STRONG = "very_strong",
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export class Password {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;
  private static readonly UPPERCASE_REGEX = /[A-Z]/;
  private static readonly LOWERCASE_REGEX = /[a-z]/;
  private static readonly NUMBER_REGEX = /[0-9]/;
  private static readonly SPECIAL_CHAR_REGEX =
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  constructor(password: string) {
    if (!password || password.length === 0) {
      throw new Error("Password cannot be empty");
    }

    if (password.length < Password.MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${Password.MIN_LENGTH} characters long`
      );
    }

    if (password.length > Password.MAX_LENGTH) {
      throw new Error(
        `Password cannot exceed ${Password.MAX_LENGTH} characters`
      );
    }

    const requirements = this.checkRequirements(password);

    if (!requirements.hasUppercase) {
      throw new Error("Password must contain at least one uppercase letter");
    }

    if (!requirements.hasLowercase) {
      throw new Error("Password must contain at least one lowercase letter");
    }

    if (!requirements.hasNumber) {
      throw new Error("Password must contain at least one number");
    }

    if (!requirements.hasSpecialChar) {
      throw new Error("Password must contain at least one special character");
    }

    this._value = password;
  }

  get value(): string {
    return this._value;
  }

  private checkRequirements(password: string): PasswordRequirements {
    return {
      minLength: password.length >= Password.MIN_LENGTH,
      hasUppercase: Password.UPPERCASE_REGEX.test(password),
      hasLowercase: Password.LOWERCASE_REGEX.test(password),
      hasNumber: Password.NUMBER_REGEX.test(password),
      hasSpecialChar: Password.SPECIAL_CHAR_REGEX.test(password),
    };
  }

  public meetsRequirements(): PasswordRequirements {
    return this.checkRequirements(this._value);
  }

  public validateStrength(): PasswordStrength {
    let score = 0;

    if (this._value.length >= 12) score++;
    if (this._value.length >= 16) score++;
    if (Password.UPPERCASE_REGEX.test(this._value)) score++;
    if (Password.LOWERCASE_REGEX.test(this._value)) score++;
    if (Password.NUMBER_REGEX.test(this._value)) score++;
    if (Password.SPECIAL_CHAR_REGEX.test(this._value)) score++;

    const uniqueChars = new Set(this._value).size;
    if (uniqueChars >= 10) score++;

    if (score <= 3) return PasswordStrength.WEAK;
    if (score <= 5) return PasswordStrength.MEDIUM;
    if (score <= 6) return PasswordStrength.STRONG;
    return PasswordStrength.VERY_STRONG;
  }

  public equals(other: Password): boolean {
    if (!(other instanceof Password)) {
      return false;
    }
    return this._value === other._value;
  }

  public toString(): string {
    return "********";
  }

  public static isValid(password: string): boolean {
    try {
      new Password(password);
      return true;
    } catch {
      return false;
    }
  }

  public static fromString(password: string): Password {
    return new Password(password);
  }

  public static getRequirements(): string[] {
    return [
      `Minimum ${Password.MIN_LENGTH} characters`,
      `Maximum ${Password.MAX_LENGTH} characters`,
      "At least one uppercase letter",
      "At least one lowercase letter",
      "At least one number",
      "At least one special character (!@#$%^&*()_+-=[]{};':\"|,.<>/?)",
    ];
  }
}
