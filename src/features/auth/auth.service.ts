import { api } from "../../services/api";

import type {
  AuthResponse,
  LoginCredentials,
} from "./auth.types";

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  login(credentials: LoginCredentials) {
    return api.post<AuthResponse>(
      "/auth/login",
      credentials
    );
  },

  register(credentials: RegisterCredentials) {
    return api.post<AuthResponse>(
      "/auth/register",
      credentials
    );
  },

  logout() {
    return api.post<void>("/auth/logout");
  },

  getCurrentUser() {
    return api.get<AuthResponse["user"]>(
      "/auth/me"
    );
  },
};
