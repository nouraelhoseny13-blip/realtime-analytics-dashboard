import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { authService } from "./auth.service";

import type {
  AuthResponse,
  LoginCredentials,
  User,
} from "./auth.types";

type UseAuthResult = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (
    credentials: LoginCredentials
  ) => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const queryClient =
    useQueryClient();

  const userQuery = useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const loginMutation =
    useMutation({
      mutationFn: (
        credentials: LoginCredentials
      ) =>
        authService.login(
          credentials
        ),

      onSuccess: (result) => {
        queryClient.setQueryData(
          ["auth", "current-user"],
          result.user
        );
      },
    });

  const logoutMutation =
    useMutation({
      mutationFn:
        authService.logout,

      onSuccess: () => {
        queryClient.setQueryData(
          ["auth", "current-user"],
          null
        );
      },
    });

  const error =
    loginMutation.error ??
    logoutMutation.error ??
    userQuery.error;

  return {
    user: userQuery.data ?? null,

    isLoading:
      userQuery.isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending,

    error:
      error instanceof Error
        ? error.message
        : error
          ? "Authentication failed."
          : null,

    login: async (
      credentials: LoginCredentials
    ) => {
      try {
        return await loginMutation.mutateAsync(
          credentials
        );
      } catch {
        return null;
      }
    },

    logout: async () => {
      try {
        await logoutMutation.mutateAsync();
      } catch {
        // Error is exposed through the hook.
      }
    },
  };
}