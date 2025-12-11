import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/TokenService";
import { UUID } from "../../../domain/value-objects/UUID.vo";
import { RefreshTokenDTO } from "../../dto/auth/RefreshTokenDTO";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(
    dto: RefreshTokenDTO
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!dto.refreshToken || dto.refreshToken.trim().length === 0) {
      throw new Error("Refresh token is required");
    }

    const isRevoked = await this.tokenService.isRevoked(dto.refreshToken);
    if (isRevoked) {
      throw new Error("Refresh token has been revoked");
    }

    let payload;
    try {
      payload = this.tokenService.verify(dto.refreshToken);
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }

    if (payload.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    const userIdVO = new UUID(payload.userId);
    const user = await this.userRepository.findById(userIdVO);

    if (!user || user.isDeleted()) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const newAccessToken = this.tokenService.generate(
      {
        userId: user.id.value,
        email: user.email.value,
        type: "access",
      },
      "10m"
    );

    const newRefreshToken = this.tokenService.generate(
      {
        userId: user.id.value,
        type: "refresh",
      },
      "7d"
    );

    await this.tokenService.revoke(dto.refreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
