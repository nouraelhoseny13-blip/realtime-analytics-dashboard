import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { useAnalytics } from "./analytics.hooks";
import { analyticsService } from "./analytics.service";

vi.mock("./analytics.service", () => ({
  analyticsService: {
    getAnalytics: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

const mockData = {
  stats: {
    activeUsers: 100,
    requestsPerMinute: 250,
    peakTraffic: 400,
    successRate: 99.5,
    averageResponseTime: 120,
    totalRequests: 15000,
    errorRate: 0.5,
  },
  traffic: [],
  services: [],
  endpoints: [],
  period: "today" as const,
  updatedAt: "2026-09-18T00:00:00Z",
};

describe("useAnalytics", () => {
  it("calls analyticsService with the provided filters", async () => {
    vi.mocked(analyticsService.getAnalytics).mockResolvedValue(
      mockData
    );

    const filters = {
      period: "today" as const,
      service: "api-gateway",
    };

    renderHook(() => useAnalytics(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(
        analyticsService.getAnalytics
      ).toHaveBeenCalledWith(filters);
    });
  });

  it("returns analytics data after a successful request", async () => {
    vi.mocked(
      analyticsService.getAnalytics
    ).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useAnalytics({
          period: "today",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });
  });
});
