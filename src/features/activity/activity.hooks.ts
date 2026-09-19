import { useQuery } from "@tanstack/react-query";

import { activityService } from "./activity.service";

import type {
  ActivityFilters,
  ActivityResponse,
} from "./activity.types";

type UseActivityResult = {
  data: ActivityResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useActivity(
  filters?: ActivityFilters
): UseActivityResult {
  const query = useQuery({
    queryKey: [
      "activity",
      filters?.limit,
      filters?.service,
      filters?.status,
    ],
    queryFn: () =>
      activityService.getActivity(filters),
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? "Failed to load activity data."
          : null,
    refetch: async () => {
      await query.refetch();
    },
  };
}