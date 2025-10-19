import { User, AuthTokens } from '../../entities';

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthPort {
  signIn(data: SignInData): Promise<{ user: User; tokens: AuthTokens }>;
  signUp(data: SignUpData): Promise<{ user: User; tokens: AuthTokens }>;
  signOut(userId: string): Promise<void>;
}
