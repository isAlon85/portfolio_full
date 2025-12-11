import { ITokenService } from "../../../domain/services/TokenService";

export class LogoutUseCase {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<void> {
    if (!refreshToken || refreshToken.trim().length === 0) {
      throw new Error("Refresh token is required");
    }

    try {
      const payload = this.tokenService.verify(refreshToken);

      if (payload.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      await this.tokenService.revoke(refreshToken);
    } catch (error) {
      throw new Error("Failed to logout: Invalid or expired token");
    }
  }
}
