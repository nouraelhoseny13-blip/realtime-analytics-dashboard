import { describe, expect, it, vi } from "vitest";

import { analyticsService } from "./analytics.service";
import { api } from "../../services/api";

vi.mock("../../services/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("analyticsService", () => {
  it("calls the analytics endpoint with the selected period", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        stats: {},
        traffic: [],
        services: [],
        endpoints: [],
      },
    });

    await analyticsService.getAnalytics({
      period: "today",
    });

    expect(api.get).toHaveBeenCalledWith(
      "/analytics?period=today"
    );
  });

  it("includes custom date range in the query", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        stats: {},
        traffic: [],
        services: [],
        endpoints: [],
      },
    });

    await analyticsService.getAnalytics({
      period: "custom",
      startDate: "2026-09-01",
      endDate: "2026-09-18",
    });

    expect(api.get).toHaveBeenCalledWith(
      "/analytics?period=custom&startDate=2026-09-01&endDate=2026-09-18"
    );
  });

  it("includes the service filter in the query", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        stats: {},
        traffic: [],
        services: [],
        endpoints: [],
      },
    });

    await analyticsService.getAnalytics({
      period: "today",
      service: "api-gateway",
    });

    expect(api.get).toHaveBeenCalledWith(
      "/analytics?period=today&service=api-gateway"
    );
  });
});
