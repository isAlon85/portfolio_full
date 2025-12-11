export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
