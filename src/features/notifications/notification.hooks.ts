import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notificationService } from "./notification.service";

import type {
  NotificationFilters,
  NotificationResponse,
} from "./notification.types";

type UseNotificationsResult = {
  data: NotificationResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

export function useNotifications(
  filters?: NotificationFilters
): UseNotificationsResult {
  const queryClient =
    useQueryClient();

  const query = useQuery({
    queryKey: [
      "notifications",
      filters?.unreadOnly,
      filters?.limit,
    ],
    queryFn: () =>
      notificationService.getNotifications(
        filters
      ),
  });

  const markAsReadMutation =
    useMutation({
      mutationFn: (id: string) =>
        notificationService.markAsRead(id),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      },
    });

  const markAllAsReadMutation =
    useMutation({
      mutationFn: () =>
        notificationService.markAllAsRead(),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      },
    });

  return {
    data: query.data ?? null,

    isLoading: query.isLoading,

    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? "Failed to load notifications."
          : null,

    refetch: async () => {
      await query.refetch();
    },

    markAsRead: async (id: string) => {
      await markAsReadMutation.mutateAsync(id);
    },

    markAllAsRead: async () => {
      await markAllAsReadMutation.mutateAsync();
    },
  };
}