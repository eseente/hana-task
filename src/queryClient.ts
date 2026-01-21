import { QueryClient, keepPreviousData } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,

      staleTime: 60_000,
      gcTime: 5 * 60_000,

      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),

      placeholderData: keepPreviousData,
    },

    mutations: {
      retry: 0,
      networkMode: "online",
    },
  },
});
