import { api } from "../../services/api";

import type {
  NotificationFilters,
  NotificationResponse,
} from "./notification.types";

function buildQuery(
  filters?: NotificationFilters
) {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();

  if (filters.unreadOnly !== undefined) {
    params.set(
      "unreadOnly",
      String(filters.unreadOnly)
    );
  }

  if (filters.limit !== undefined) {
    params.set(
      "limit",
      String(filters.limit)
    );
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export const notificationService = {
  getNotifications(
    filters?: NotificationFilters
  ) {
    const query = buildQuery(filters);

    return api.get<NotificationResponse>(
      `/notifications${query}`
    );
  },

  markAsRead(id: string) {
    return api.put<void>(
      `/notifications/${id}/read`
    );
  },

  markAllAsRead() {
    return api.put<void>(
      "/notifications/read-all"
    );
  },
};