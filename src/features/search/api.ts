import { useQuery } from '@tanstack/react-query';
import { api } from '@lib/api';
import { STALE_TIMES } from '@lib/queryConfig';
import type { SearchResults } from '@shared/types/api';

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => api<SearchResults>(`/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: STALE_TIMES.search,
  });
}
