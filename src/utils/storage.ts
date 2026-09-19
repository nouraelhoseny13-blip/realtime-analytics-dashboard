const ACCESS_TOKEN_KEY =
  "realtime_analytics_access_token";

export const storage = {
  getAccessToken(): string | null {
    return localStorage.getItem(
      ACCESS_TOKEN_KEY
    );
  },

  setAccessToken(token: string): void {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      token
    );
  },

  removeAccessToken(): void {
    localStorage.removeItem(
      ACCESS_TOKEN_KEY
    );
  },
};