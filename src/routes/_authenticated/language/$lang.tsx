import { createFileRoute } from '@tanstack/react-router';

interface LanguageHubSearch {
  tab?: 'movies' | 'series' | 'live' | 'sports';
}

export const Route = createFileRoute('/_authenticated/language/$lang')({
  validateSearch: (search: Record<string, unknown>): LanguageHubSearch => ({
    tab: ['movies', 'series', 'live', 'sports'].includes(search.tab as string)
      ? (search.tab as 'movies' | 'series' | 'live' | 'sports')
      : undefined,
  }),
});
