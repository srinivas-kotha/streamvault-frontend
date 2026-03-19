import { QueryClient } from '@tanstack/react-query';
import { STALE_TIMES, GC_TIMES } from './queryConfig';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIMES.default,
      gcTime: GC_TIMES.default,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
