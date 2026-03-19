import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { STALE_TIMES } from '@lib/queryConfig';

/**
 * Prefetches a query when the user hovers over an element.
 * Spread the returned props onto any element: `<div {...prefetchProps}>`
 */
export function usePrefetchOnHover(
  queryKey: unknown[],
  queryFn: () => Promise<unknown>,
  staleTime?: number,
) {
  const queryClient = useQueryClient();

  const onMouseEnter = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: staleTime ?? STALE_TIMES.default,
    });
  }, [queryClient, queryKey, queryFn, staleTime]);

  return { onMouseEnter };
}
