export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};