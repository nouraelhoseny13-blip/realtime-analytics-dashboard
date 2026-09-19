import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "./analytics.service";
import type {
  AnalyticsFilters,
  AnalyticsResponse,
} from "./analytics.types";

export function useAnalytics(
  filters: AnalyticsFilters
) {
  const query = useQuery<AnalyticsResponse>({
    queryKey: [
      "analytics",
      filters.period,
      filters.startDate,
      filters.endDate,
      filters.service,
    ],

    queryFn: () =>
      analyticsService.getAnalytics(filters),

    staleTime: 15_000,

    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error
      ? "Failed to load analytics data"
      : null,
    refetch: query.refetch,
  };
}
