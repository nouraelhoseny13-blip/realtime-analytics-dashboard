import { api } from "../../services/api";

import type {
  ActivityFilters,
  ActivityResponse,
} from "./activity.types";

function buildQuery(
  filters?: ActivityFilters
) {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();

  if (filters.limit !== undefined) {
    params.set(
      "limit",
      String(filters.limit)
    );
  }

  if (filters.service) {
    params.set(
      "service",
      filters.service
    );
  }

  if (filters.status) {
    params.set(
      "status",
      filters.status
    );
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export const activityService = {
  getActivity(
    filters?: ActivityFilters
  ) {
    const query = buildQuery(filters);

    return api.get<ActivityResponse>(
      `/activity${query}`
    );
  },
};