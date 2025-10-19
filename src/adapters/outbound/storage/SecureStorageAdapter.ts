import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoragePort } from '@/src/domain/ports/outbound';

export class SecureStorageAdapter implements StoragePort {
  async saveSecure(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`secure_${key}`, value);
    } catch (error) {
      throw new Error('Impossible de sauvegarder les données');
    }
  }

  async getSecure(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(`secure_${key}`);
      return value;
    } catch (error) {
      console.error(`❌ Erreur lors de la lecture de ${key}:`, error);
      return null;
    }
  }

  async removeSecure(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de ${key}:`, error);
    }
  }

  async save(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw new Error('Impossible de sauvegarder les données');
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
      console.error(`❌ Erreur lors de la suppression de ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log(`✅ Cleared all storage`);
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage du storage:', error);
    }
  }
}
