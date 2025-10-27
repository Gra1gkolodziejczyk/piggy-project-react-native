import { StoragePort } from "@/src/domain/ports/outbound";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class SecureStorageAdapter implements StoragePort {
  async saveSecure(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`secure_${key}`, value);
    } catch (error) {
      throw new Error("Impossible to save datas");
    }
  }

  async getSecure(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(`secure_${key}`);
      return value;
    } catch (error) {
      console.error(`❌ Error when the key is reading  ${key}:`, error);
      return null;
    }
  }

  async removeSecure(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error(`❌ Error when the key is deleted  ${key}:`, error);
    }
  }

  async save(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw new Error("Impossible to save datas");
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`❌ Error when the key is deleted ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
    }
  }
}
