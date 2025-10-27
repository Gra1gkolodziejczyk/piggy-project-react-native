import { HttpClient } from "../http/httpClient";
import { TokenService } from "@/src/infrastructure/services/TokenService";
import { User } from "@/src/domain/entities/User";
import { AuthPort } from "@/src/domain/ports/outbound";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthApiResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    emailVerified: boolean;
    image: string | null;
    stripeId: string | null;
    lang: string;
    isActive: boolean;
    emailNotification: boolean;
    smsNotification: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

interface AuthResult {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthApiAdapter implements AuthPort {
  constructor(private readonly httpClient: HttpClient) {}

  async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    try {
      const response = await this.httpClient.post<AuthApiResponse>(
        "/authentication/signin",
        credentials
      );
      if (!response.accessToken || !response.refreshToken) {
        throw new Error('Tokens manquants dans la réponse du serveur');
      }
      await TokenService.setToken(response.accessToken);
      const user = new User(
        response.user.id,
        response.user.email,
        response.user.name,
        new Date()
      );

      return {
        user,
        tokens: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      };
    } catch (error) {
      console.error("Erreur dans signIn:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Identifiants incorrects");
      }
      throw new Error("Une erreur est survenue lors de la connexion");
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    try {

      const response = await this.httpClient.post<AuthApiResponse>(
        "/authentication/signup",
        credentials
      );

      if (!response.accessToken || !response.refreshToken) {
        throw new Error('Tokens manquants dans la réponse du serveur');
      }

      await TokenService.setToken(response.accessToken);

      const user = new User(
        response.user.id,
        response.user.email,
        response.user.name,
        new Date()
      );

      return {
        user,
        tokens: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Erreur lors de l'inscription");
      }
      throw new Error("Une erreur est survenue lors de l'inscription");
    }
  }

  async signOut(userId: string): Promise<void> {
    try {
      await this.httpClient.post("/authentication/signout", { userId });
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const hasToken = await TokenService.hasToken();

      if (!hasToken) {
        return null;
      }

      const response = await this.httpClient.get<{
        id: string;
        email: string;
        name: string;
      }>("/users/me");

      const user = new User(
        response.id,
        response.email,
        response.name,
        new Date()
      );

      return user;
    } catch (error) {
      if (error instanceof Error &&
        (error.message.includes('Unauthorized') || error.message.includes('401'))) {
        await TokenService.removeToken();
      }
      throw error;
    }
  }
}