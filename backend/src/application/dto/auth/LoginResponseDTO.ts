import { UserResponseDTO } from "../user/UserResponseDTO";

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDTO;
}
