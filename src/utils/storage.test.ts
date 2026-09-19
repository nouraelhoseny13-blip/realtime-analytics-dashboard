import { describe, expect, it, beforeEach } from "vitest";

import { storage } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no access token exists", () => {
    expect(storage.getAccessToken()).toBeNull();
  });

  it("stores and retrieves the access token", () => {
    storage.setAccessToken("test-access-token");

    expect(storage.getAccessToken()).toBe(
      "test-access-token"
    );
  });

  it("removes the access token", () => {
    storage.setAccessToken("test-access-token");

    storage.removeAccessToken();

    expect(storage.getAccessToken()).toBeNull();
  });
});
