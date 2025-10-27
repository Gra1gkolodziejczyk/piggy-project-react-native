import React, { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "@/src/domain/entities";
import { authUseCases } from "../config";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultAuthContext: AuthContextValue = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus()
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authUseCases.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      throw error && await handleInvalidToken();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidToken = async () => {
    try {
      await authUseCases.signOut();
    } catch (error) {
      console.error("AUTH: error logout :", error);
    }
    setUser(null);
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await authUseCases.signIn({ email, password });
      setUser(authenticatedUser);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const newUser = await authUseCases.signUp({ email, password, name });
      setUser(newUser);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authUseCases.signOut();
      setUser(null);
    } catch (error) {
      throw error && setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}