import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@lib/api';
import { STALE_TIMES } from '@lib/queryConfig';
import { useToastStore } from '@lib/toastStore';
import type { DbWatchHistory } from '@shared/types/api';

export function useWatchHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => api<DbWatchHistory[]>('/history'),
    staleTime: STALE_TIMES.history,
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>('/history', { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: () => {
      useToastStore.getState().addToast('Failed to clear history', 'error');
    },
  });
}

export function useRemoveHistoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ contentId, contentType }: { contentId: number; contentType: string }) => {
      return api<void>(`/history/${contentId}?content_type=${contentType}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: () => {
      useToastStore.getState().addToast('Failed to remove history item', 'error');
    },
  });
}
