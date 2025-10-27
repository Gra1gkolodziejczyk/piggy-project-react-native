import * as SecureStore from 'expo-secure-store';

export class TokenService {
  private static readonly TOKEN_KEY = 'auth_token';

  static async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(this.TOKEN_KEY);
      return token;
    } catch (error) {
      return null;
    }
  }

  static async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
    } catch (error) {
      throw error;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
    } catch (error) {
      throw error;
    }
  }

  static async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }
}