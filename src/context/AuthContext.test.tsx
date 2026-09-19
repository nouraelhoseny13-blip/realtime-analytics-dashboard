import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  AuthProvider,
  useAuthContext,
} from "./AuthContext";

import { storage } from "../utils/storage";
import { useAuth } from "../features/auth/auth.hooks";

vi.mock("../features/auth/auth.hooks", () => ({
  useAuth: vi.fn(),
}));

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("throws an error when used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow(
      "useAuthContext must be used inside AuthProvider"
    );
  });

  it("stores the access token after successful login", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "admin",
      },
      isLoading: false,
      error: null,
      login: vi.fn().mockResolvedValue({
        accessToken: "test-access-token",
      }),
      logout: vi.fn().mockResolvedValue(undefined),
    });

    const { result } = renderHook(
      () => useAuthContext(),
      {
        wrapper: AuthProvider,
      }
    );

    let success = false;

    await act(async () => {
      success = await result.current.login({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(success).toBe(true);

    expect(
      storage.getAccessToken()
    ).toBe("test-access-token");
  });

  it("removes the access token after logout", async () => {
    storage.setAccessToken("existing-token");

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn().mockResolvedValue(undefined),
    });

    const { result } = renderHook(
      () => useAuthContext(),
      {
        wrapper: AuthProvider,
      }
    );

    await act(async () => {
      await result.current.logout();
    });

    expect(
      storage.getAccessToken()
    ).toBeNull();
  });
});
