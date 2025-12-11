import { UUID } from "../value-objects/UUID.vo";

export interface IUUIDGeneratorService {
  generate(): UUID;
  generateString(): string;
  isValid(uuid: string): boolean;
  fromString(uuid: string): UUID;
  generateBatch(count: number): UUID[];
}
