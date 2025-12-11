export class URL {
  private readonly _value: string;
  private static readonly MAX_LENGTH = 2048;
  private static readonly VALID_PROTOCOLS = ["http", "https"];

  constructor(url: string) {
    const trimmedUrl = url.trim();

    if (!trimmedUrl || trimmedUrl.length === 0) {
      throw new Error("URL cannot be empty");
    }

    if (trimmedUrl.length > URL.MAX_LENGTH) {
      throw new Error(`URL cannot exceed ${URL.MAX_LENGTH} characters`);
    }

    let urlObject: globalThis.URL;
    try {
      urlObject = new globalThis.URL(trimmedUrl);
    } catch {
      throw new Error(`Invalid URL format: ${url}`);
    }

    if (!URL.VALID_PROTOCOLS.includes(urlObject.protocol.slice(0, -1))) {
      throw new Error(
        `URL protocol must be one of: ${URL.VALID_PROTOCOLS.join(", ")}`
      );
    }

    if (!urlObject.hostname || urlObject.hostname.length === 0) {
      throw new Error("URL must have a valid hostname");
    }

    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(urlObject.hostname)) {
      throw new Error("URL hostname contains invalid characters");
    }

    this._value = trimmedUrl;
  }

  get value(): string {
    return this._value;
  }

  public equals(other: URL): boolean {
    if (!(other instanceof URL)) {
      return false;
    }
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }

  public getProtocol(): string {
    const urlObject = new globalThis.URL(this._value);
    return urlObject.protocol.slice(0, -1);
  }

  public getHostname(): string {
    const urlObject = new globalThis.URL(this._value);
    return urlObject.hostname;
  }

  public getPathname(): string {
    const urlObject = new globalThis.URL(this._value);
    return urlObject.pathname;
  }

  public getDomain(): string {
    const urlObject = new globalThis.URL(this._value);
    return urlObject.hostname;
  }

  public isSecure(): boolean {
    return this.getProtocol() === "https";
  }

  public static isValid(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public static fromString(url: string): URL {
    return new URL(url);
  }

  public static getValidProtocols(): string[] {
    return [...URL.VALID_PROTOCOLS];
  }
}
