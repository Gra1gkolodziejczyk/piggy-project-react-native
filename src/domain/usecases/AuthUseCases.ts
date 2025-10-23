import {
  AuthUseCasePort,
  SignInCommand,
  SignUpCommand,
} from "../ports/inbound";
import { AuthPort, StoragePort } from "../ports/outbound";

import { User } from "../entities";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER: "auth_user",
} as const;

export class AuthUseCases implements AuthUseCasePort {
  constructor(
    private readonly authPort: AuthPort,
    private readonly storagePort: StoragePort
  ) {}

  async signIn(command: SignInCommand): Promise<User> {
    if (!command.email || !command.password) {
      throw new Error("Email et mot de passe requis");
    }

    const { user, tokens } = await this.authPort.signIn({
      email: command.email.toLowerCase().trim(),
      password: command.password,
    });

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error("Tokens manquants dans la réponse");
    }

    await this.storagePort.saveSecure(
      STORAGE_KEYS.ACCESS_TOKEN,
      tokens.accessToken
    );
    await this.storagePort.saveSecure(
      STORAGE_KEYS.REFRESH_TOKEN,
      tokens.refreshToken
    );

    await this.storagePort.save(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      })
    );

    return user;
  }

  async signUp(command: SignUpCommand): Promise<User> {
    if (!command.email || !command.password || !command.name) {
      throw new Error("Tous les champs sont requis");
    }

    if (command.name.trim().length < 2) {
      throw new Error("Le nom doit contenir au moins 2 caractères");
    }

    const { user, tokens } = await this.authPort.signUp({
      email: command.email.toLowerCase().trim(),
      password: command.password,
      name: command.name.trim(),
    });

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error("Tokens manquants dans la réponse");
    }

    await this.storagePort.saveSecure(
      STORAGE_KEYS.ACCESS_TOKEN,
      tokens.accessToken
    );
    await this.storagePort.saveSecure(
      STORAGE_KEYS.REFRESH_TOKEN,
      tokens.refreshToken
    );

    await this.storagePort.save(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      })
    );

    return user;
  }

  async signOut(): Promise<void> {
    const user = await this.getCurrentUser();

    if (user) {
      try {
        await this.authPort.signOut(user.id);
      } catch (error) {
        console.warn("Erreur lors du signOut backend:", error);
      }
    }

    await this.storagePort.removeSecure(STORAGE_KEYS.ACCESS_TOKEN);
    await this.storagePort.removeSecure(STORAGE_KEYS.REFRESH_TOKEN);
    await this.storagePort.remove(STORAGE_KEYS.USER);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await this.storagePort.get(STORAGE_KEYS.USER);

      if (!userJson) {
        return null;
      }

      const userData = JSON.parse(userJson);

      return new User(
        userData.id,
        userData.email,
        userData.name,
        new Date(userData.createdAt)
      );
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storagePort.getSecure(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }

  async getAccessToken(): Promise<string | null> {
    return await this.storagePort.getSecure(STORAGE_KEYS.ACCESS_TOKEN);
  }
}
