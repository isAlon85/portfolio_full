export interface UpdateUserDTO {
  username?: string;
  email?: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  isActive?: boolean;
}
