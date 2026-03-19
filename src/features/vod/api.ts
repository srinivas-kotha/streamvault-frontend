import { useQuery } from '@tanstack/react-query';
import { api } from '@lib/api';
import { STALE_TIMES } from '@lib/queryConfig';
import type { XtreamCategory, XtreamVODStream, XtreamVODInfo } from '@shared/types/api';

export function useVODCategories() {
  return useQuery({
    queryKey: ['vod', 'categories'],
    queryFn: () => api<XtreamCategory[]>('/vod/categories'),
    staleTime: STALE_TIMES.categories,
  });
}

export function useVODStreams(categoryId: string) {
  return useQuery({
    queryKey: ['vod', 'streams', categoryId],
    queryFn: () => api<XtreamVODStream[]>(`/vod/streams/${categoryId}`),
    enabled: !!categoryId,
    staleTime: STALE_TIMES.streams,
  });
}

export function useVODInfo(vodId: string) {
  return useQuery({
    queryKey: ['vod', 'info', vodId],
    queryFn: () => api<XtreamVODInfo>(`/vod/info/${vodId}`),
    enabled: !!vodId,
    staleTime: STALE_TIMES.streams,
  });
}
