import { UUID } from "../../../domain/value-objects/UUID.vo";

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  roleId?: UUID;
}
