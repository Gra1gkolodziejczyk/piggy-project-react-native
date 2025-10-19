export interface StoragePort {
  saveSecure(key: string, value: string): Promise<void>;
  getSecure(key: string): Promise<string | null>;
  removeSecure(key: string): Promise<void>;

  save(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
