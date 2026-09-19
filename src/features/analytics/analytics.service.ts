import { api } from "../../services/api";
import type {
  AnalyticsFilters,
  AnalyticsResponse,
} from "./analytics.types";

function buildQuery(
  filters?: AnalyticsFilters
) {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();

  params.set("period", filters.period);

  if (filters.startDate) {
    params.set(
      "startDate",
      filters.startDate
    );
  }

  if (filters.endDate) {
    params.set(
      "endDate",
      filters.endDate
    );
  }

  if (filters.service) {
    params.set(
      "service",
      filters.service
    );
  }

  return `?${params.toString()}`;
}

export const analyticsService = {
  getAnalytics(
    filters?: AnalyticsFilters
  ) {
    const query = buildQuery(filters);

    return api.get<AnalyticsResponse>(
      `/analytics${query}`
    );
  },
};