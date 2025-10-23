import { User } from "../../entities";

export interface SignInCommand {
  email: string;
  password: string;
}

export interface SignUpCommand {
  email: string;
  password: string;
  name: string;
}

export interface AuthUseCasePort {
  signIn(command: SignInCommand): Promise<User>;
  signUp(command: SignUpCommand): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;
}
