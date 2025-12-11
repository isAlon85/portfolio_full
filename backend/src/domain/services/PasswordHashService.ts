export interface IPasswordHashService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
  needsRehash(hash: string): Promise<boolean>;
  getHashInfo(hash: string): Promise<{ algorithm: string; cost: number }>;
}
