export class UUID {
  private readonly _value: string;
  private static readonly UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(uuid: string) {
    const trimmedUuid = uuid.trim();

    if (!trimmedUuid || trimmedUuid.length === 0) {
      throw new Error("UUID cannot be empty");
    }

    if (!UUID.UUID_V4_REGEX.test(trimmedUuid)) {
      throw new Error(`Invalid UUID v4 format: ${uuid}`);
    }

    this._value = trimmedUuid.toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  public equals(other: UUID): boolean {
    if (!(other instanceof UUID)) {
      return false;
    }
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }

  public static isValid(uuid: string): boolean {
    try {
      new UUID(uuid);
      return true;
    } catch {
      return false;
    }
  }

  public static fromString(uuid: string): UUID {
    return new UUID(uuid);
  }

  public static generate(): UUID {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return new UUID(crypto.randomUUID());
    }

    const hex = "0123456789abcdef";
    let uuid = "";
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += "-";
      } else if (i === 14) {
        uuid += "4";
      } else if (i === 19) {
        uuid += hex[(Math.random() * 4) | 8];
      } else {
        uuid += hex[(Math.random() * 16) | 0];
      }
    }
    return new UUID(uuid);
  }

  public getVersion(): number {
    return parseInt(this._value.charAt(14), 16);
  }

  public getVariant(): string {
    const variantByte = parseInt(this._value.charAt(19), 16);
    if ((variantByte & 0x8) === 0) return "NCS";
    if ((variantByte & 0xc) === 0x8) return "RFC4122";
    if ((variantByte & 0xe) === 0xc) return "Microsoft";
    return "Reserved";
  }
}
