import { describe, expect, it, vi, beforeEach } from "vitest";

import { api } from "./api";
import { ApiError } from "./apiError";
import { storage } from "../utils/storage";

describe("api service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a GET request to the correct endpoint", async () => {
    vi.spyOn(storage, "getAccessToken").mockReturnValue(null);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const result = await api.get<{ success: boolean }>("/analytics");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/analytics",
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    expect(result).toEqual({ success: true });
  });

  it("adds the authorization token when available", async () => {
    vi.spyOn(storage, "getAccessToken").mockReturnValue(
      "test-access-token"
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    await api.get("/analytics");

    const [, options] = vi.mocked(fetch).mock.calls[0];

    expect(options?.headers).toBeInstanceOf(Headers);

    const headers = options?.headers as Headers;

    expect(headers.get("Authorization")).toBe(
      "Bearer test-access-token"
    );
  });

  it("throws ApiError with the backend error message", async () => {
    vi.spyOn(storage, "getAccessToken").mockReturnValue(null);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          detail: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    const request = api.get("/analytics");

    await expect(request).rejects.toBeInstanceOf(ApiError);

    await expect(request).rejects.toMatchObject({
      message: "Unauthorized",
      status: 401,
    });
  });
});
