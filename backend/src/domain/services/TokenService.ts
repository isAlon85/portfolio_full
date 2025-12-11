export interface TokenPayload {
  userId: string;
  email?: string;
  roles?: string[];
  type?: "access" | "refresh";
  [key: string]: any;
}

export interface TokenVerificationResult {
  valid: boolean;
  payload?: TokenPayload;
  expired?: boolean;
  error?: string;
}

export interface ITokenService {
  generate(payload: TokenPayload, expiresIn: string | number): string;
  verify(token: string): TokenPayload;
  decode(token: string): TokenPayload | null;
  refresh(refreshToken: string): string;
  revoke(token: string): Promise<void>;
  isRevoked(token: string): Promise<boolean>;
  verifyWithDetails(token: string): TokenVerificationResult;
  getExpirationDate(token: string): Date | null;
  getRemainingTime(token: string): number;
}
