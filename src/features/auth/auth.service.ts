import { api } from "../../services/api";

import type {
  AuthResponse,
  LoginCredentials,
} from "./auth.types";

export const authService = {
  login(credentials: LoginCredentials) {
    return api.post<AuthResponse>(
      "/auth/login",
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
