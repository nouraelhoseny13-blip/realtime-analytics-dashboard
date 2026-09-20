import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useAuth } from "../features/auth/auth.hooks";
import type {
  LoginCredentials,
  User,
} from "../features/auth/auth.types";
import { storage } from "../utils/storage";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const {
    user,
    isLoading,
    error,
    login: authLogin,
    logout: authLogout,
  } = useAuth();

  const login = async (
    credentials: LoginCredentials
  ): Promise<boolean> => {
    const result = await authLogin(credentials);

    if (!result?.accessToken) {
      return false;
    }

    storage.setAccessToken(result.accessToken);

    return true;
  };

  const logout = async (): Promise<void> => {
    try {
      await authLogout();
    } finally {
      storage.removeAccessToken();
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}