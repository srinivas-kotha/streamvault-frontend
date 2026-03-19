import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { STALE_TIMES } from '@lib/queryConfig';

export interface UseContentRailDataOptions<T> {
  categoryIds: (number | string)[];
  fetchFn: (categoryId: number | string) => Promise<T[]>;
  queryKeyPrefix: string[];
  dedupeKey: keyof T;
  sortBy?: 'added' | 'rating' | 'name';
  limit?: number;
  staleTime?: number;
  enabled?: boolean;
}

// --- Sort helpers ---

function parseAdded(val: string): number {
  const num = Number(val);
  if (!isNaN(num) && num > 1e9) return num; // Unix timestamp
  const parsed = Date.parse(val);
  return isNaN(parsed) ? 0 : parsed / 1000;
}

function getSortValue(item: Record<string, unknown>, sortBy: 'added' | 'rating' | 'name'): number | string {
  switch (sortBy) {
    case 'added': {
      // Try 'added' field first, fall back to 'last_modified'
      const val = (item.added ?? item.last_modified ?? '0') as string;
      return parseAdded(val);
    }
    case 'rating': {
      const r = item.rating_5based ?? item.rating ?? 0;
      return typeof r === 'string' ? parseFloat(r) || 0 : (r as number);
    }
    case 'name':
      return ((item.name as string) ?? '').toLowerCase();
    default:
      return 0;
  }
}

function compareFn(sortBy: 'added' | 'rating' | 'name') {
  return (a: Record<string, unknown>, b: Record<string, unknown>): number => {
    const aVal = getSortValue(a, sortBy);
    const bVal = getSortValue(b, sortBy);
    if (sortBy === 'name') {
      return (aVal as string).localeCompare(bVal as string);
    }
    // Descending for added/rating
    return (bVal as number) - (aVal as number);
  };
}

// --- Hook ---

export function useContentRailData<T extends object>(
  options: UseContentRailDataOptions<T>,
): { items: T[]; isLoading: boolean; error: Error | null } {
  const {
    categoryIds,
    fetchFn,
    queryKeyPrefix,
    dedupeKey,
    sortBy = 'added',
    limit = 20,
    staleTime = STALE_TIMES.streams,
    enabled = true,
  } = options;

  const queries = useQueries({
    queries: categoryIds.map((catId) => ({
      queryKey: [...queryKeyPrefix, catId],
      queryFn: () => fetchFn(catId),
      enabled: enabled && categoryIds.length > 0,
      staleTime,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error ?? null;

  // Use a stable fingerprint string instead of a new array reference each render.
  // Each slot is the item count for that query (-1 when no data yet), which changes
  // only when a query actually loads or reloads — avoiding spurious recomputation.
  const dataFingerprint = queries.map((q) => q.data?.length ?? -1).join(',');

  const items = useMemo<T[]>(() => {
    const all: T[] = [];
    for (const q of queries) {
      if (q.data) all.push(...q.data);
    }
    if (all.length === 0) return [];

    // Dedupe
    const seen = new Set<unknown>();
    const unique = all.filter((item) => {
      const key = item[dedupeKey];
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort
    unique.sort(compareFn(sortBy) as (a: T, b: T) => number);

    // Limit
    return unique.slice(0, limit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFingerprint, dedupeKey, sortBy, limit]);

  return { items, isLoading, error };
}
