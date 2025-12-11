import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import {
  ITokenService,
  TokenPayload,
  TokenPair,
} from "../../domain/services/TokenService";

export class JWTTokenService implements ITokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;
  private readonly issuer: string;
  private readonly audience: string;

  constructor() {
    this.accessTokenSecret =
      process.env.JWT_ACCESS_SECRET || "access-secret-key-change-in-production";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET ||
      "refresh-secret-key-change-in-production";
    this.accessTokenExpiration = process.env.JWT_ACCESS_EXPIRES_IN || "10m";
    this.refreshTokenExpiration = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    this.issuer = process.env.JWT_ISSUER || "portfolio-system";
    this.audience = process.env.JWT_AUDIENCE || "portfolio-api";

    if (
      this.accessTokenSecret === "access-secret-key-change-in-production" ||
      this.refreshTokenSecret === "refresh-secret-key-change-in-production"
    ) {
      console.warn(
        "[JWTTokenService] Using default JWT secrets. Change them in production!"
      );
    }
  }

  generateAccessToken(payload: TokenPayload): string {
    try {
      const options: SignOptions = {
        expiresIn: this.accessTokenExpiration,
        issuer: this.issuer,
        audience: this.audience,
        subject: payload.userId,
      };

      const token = jwt.sign(
        {
          userId: payload.userId,
          email: payload.email,
          roles: payload.roles,
        },
        this.accessTokenSecret,
        options
      );

      return token;
    } catch (error) {
      console.error("[JWTTokenService] Error generating access token:", error);
      throw new Error("Failed to generate access token");
    }
  }

  generateRefreshToken(payload: TokenPayload): string {
    try {
      const options: SignOptions = {
        expiresIn: this.refreshTokenExpiration,
        issuer: this.issuer,
        audience: this.audience,
        subject: payload.userId,
      };

      const token = jwt.sign(
        {
          userId: payload.userId,
          email: payload.email,
        },
        this.refreshTokenSecret,
        options
      );

      return token;
    } catch (error) {
      console.error("[JWTTokenService] Error generating refresh token:", error);
      throw new Error("Failed to generate refresh token");
    }
  }

  generateTokenPair(payload: TokenPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        issuer: this.issuer,
        audience: this.audience,
      };

      const decoded = jwt.verify(
        token,
        this.accessTokenSecret,
        options
      ) as JwtPayload;

      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        roles: decoded.roles as string[],
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Access token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid access token");
      }
      console.error("[JWTTokenService] Error verifying access token:", error);
      throw new Error("Failed to verify access token");
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        issuer: this.issuer,
        audience: this.audience,
      };

      const decoded = jwt.verify(
        token,
        this.refreshTokenSecret,
        options
      ) as JwtPayload;

      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        roles: [],
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      console.error("[JWTTokenService] Error verifying refresh token:", error);
      throw new Error("Failed to verify refresh token");
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token, { complete: false }) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error("[JWTTokenService] Error decoding token:", error);
      return null;
    }
  }

  getAccessTokenExpiration(): string {
    return this.accessTokenExpiration;
  }

  getRefreshTokenExpiration(): string {
    return this.refreshTokenExpiration;
  }
}

export const jwtTokenService = new JWTTokenService();
