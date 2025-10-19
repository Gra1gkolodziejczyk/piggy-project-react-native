import { AuthPort, SignInData, SignUpData } from '@/src/domain/ports/outbound';
import { User, AuthTokens } from '@/src/domain/entities';
import { HttpClient } from '../http/httpClient';

interface BackendUserResponse {
  id: string;
  email: string;
  name: string;
  age?: number | null;
  phoneNumber?: string | null;
  emailVerified?: boolean;
  image?: string | null;
  stripeId?: string | null;
  lang?: string;
  isActive?: boolean;
  emailNotification?: boolean;
  smsNotification?: boolean;
}

interface BackendAuthResponse {
  user: BackendUserResponse;
  accessToken: string;
  refreshToken: string;
}

export class AuthApiAdapter implements AuthPort {
  constructor(private readonly httpClient: HttpClient) {}

  async signIn(data: SignInData): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await this.httpClient.post<BackendAuthResponse>(
        '/authentication/signin',
        {
          email: data.email,
          password: data.password,
        }
      );

      if (!response || !response.user) {
        throw new Error('Format de réponse invalide du serveur');
      }

      return this.mapAuthResponse(response);
    } catch (error) {
      console.error('Erreur dans signIn:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Identifiants incorrects');
      }
      throw new Error('Une erreur est survenue lors de la connexion');
    }
  }

  async signUp(data: SignUpData): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await this.httpClient.post<BackendAuthResponse>(
        '/authentication/signup',
        {
          email: data.email,
          password: data.password,
          name: data.name,
        }
      );

      if (!response || !response.user) {
        throw new Error('Format de réponse invalide du serveur');
      }

      return this.mapAuthResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Impossible de créer le compte');
      }
      throw new Error('Une erreur est survenue lors de l\'inscription');
    }
  }

  async signOut(userId: string): Promise<void> {
    try {
      await this.httpClient.post(`/authentication/signout/${userId}`);
    } catch (error) {
      console.warn('Erreur lors du signOut backend:', error);
    }
  }

  private mapAuthResponse(response: BackendAuthResponse): { user: User; tokens: AuthTokens } {
    const user = new User(
      response.user.id,
      response.user.email,
      response.user.name,
      new Date()
    );

    const tokens = new AuthTokens(
      response.accessToken,
      response.refreshToken
    );

    return { user, tokens };
  }
}
