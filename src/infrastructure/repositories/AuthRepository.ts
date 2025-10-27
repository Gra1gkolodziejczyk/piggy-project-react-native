import { HttpClient } from '@/src/adapters/outbound/http/httpClient';
import { TokenService } from '@/src/infrastructure/services/TokenService';
import { User } from '@/src/domain/entities/User';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

export class AuthRepository {
  constructor(private readonly httpClient: HttpClient) {
  }

  async signIn(credentials: SignInCredentials): Promise<User> {
    try {

      const response = await this.httpClient.post<{
        user: User;
        token: string;
      }>('/authentication/signin', credentials);

      if (!response.token) {
        throw new Error('Aucun token reçu du serveur');
      }
      await TokenService.setToken(response.token);
      await TokenService.getToken();
      return response.user;
    } catch (error) {
      console.error('[AuthRepository] ❌ Erreur de connexion:', error);
      throw error;
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<User> {
    try {

      const response = await this.httpClient.post<AuthResponse>(
        '/authentication/signup',
        credentials
      );
      await TokenService.setToken(response.accessToken);
      return response.user;
    } catch (error) {
      console.error('[AuthRepository] ❌ Erreur d\'inscription:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const hasToken = await TokenService.hasToken();

      if (!hasToken) {
        return null;
      }
      const user = await this.httpClient.get<User>('/users/me');
      return user;
    } catch (error) {
      if (error instanceof Error &&
        (error.message.includes('Unauthorized') || error.message.includes('401'))) {
        await TokenService.removeToken();
      }
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      try {
        await this.httpClient.post('/authentication/signout');
      } catch (error) {
        console.warn('[AuthRepository] ⚠️ Erreur logout API (ignorée)');
      }
      await TokenService.removeToken();
    } catch (error) {
      await TokenService.removeToken();
      throw error;
    }
  }
}