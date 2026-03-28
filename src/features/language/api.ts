import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { api } from "@lib/api";
import { STALE_TIMES } from "@lib/queryConfig";
import { useLiveCategories } from "@features/live/api";
import { useVODCategories } from "@features/vod/api";
import { useSeriesCategories } from "@features/series/api";
import { getCategoriesForLanguage } from "@shared/utils/categoryParser";
import type {
  XtreamVODStream,
  XtreamSeriesItem,
  XtreamLiveStream,
  XtreamCategory,
} from "@shared/types/api";

/**
 * Get grouped categories for a language.
 */
export function useLanguageCategories(language: string) {
  const { data: liveCategories } = useLiveCategories();
  const { data: vodCategories } = useVODCategories();
  const { data: seriesCategories } = useSeriesCategories();

  const categories = useMemo(
    () =>
      getCategoriesForLanguage(
        language,
        liveCategories ?? [],
        vodCategories ?? [],
        seriesCategories ?? [],
      ),
    [language, liveCategories, vodCategories, seriesCategories],
  );

  return {
    movies: categories.movies,
    series: categories.series,
    live: categories.live,
    isReady: !!(liveCategories && vodCategories && seriesCategories),
  };
}

/**
 * Fetch first N streams for each movie sub-category in a language.
 */
export function useLanguageMovieRails(language: string) {
  const { movies, isReady } = useLanguageCategories(language);

  const queries = useQueries({
    queries: movies.map((cat) => ({
      queryKey: ["vod", "streams", cat.id],
      queryFn: () => api<XtreamVODStream[]>(`/vod/streams/${cat.id}`),
      enabled: isReady,
      staleTime: STALE_TIMES.streams,
      select: (data: XtreamVODStream[]) => ({
        category: cat,
        items: data,
      }),
    })),
  });

  return {
    rails: queries
      .filter((q) => q.data && q.data.items.length > 0)
      .map((q) => q.data!),
    isLoading: queries.some((q) => q.isLoading),
  };
}

/**
 * Fetch ALL movies for a language (for grid/filter mode).
 * Pass `enabled=false` to defer fetching until filters are actually activated.
 */
export function useLanguageAllMovies(language: string, enabled = true) {
  const { movies, isReady } = useLanguageCategories(language);

  const queries = useQueries({
    queries: movies.map((cat) => ({
      queryKey: ["vod", "streams", cat.id],
      queryFn: () => api<XtreamVODStream[]>(`/vod/streams/${cat.id}`),
      enabled: isReady && enabled,
      staleTime: STALE_TIMES.streams,
    })),
  });

  const allMovies = useMemo(() => {
    return queries
      .filter((q) => q.data)
      .flatMap((q, idx) =>
        (q.data || []).map((item) => ({
          ...item,
          category_id: movies[idx]?.id || "",
          category_name: movies[idx]?.name || movies[idx]?.originalName || "",
        })),
      );
  }, [queries, movies]);

  const categories = useMemo(
    () =>
      movies
        .map((cat, idx) => ({
          id: cat.id,
          name: cat.name || cat.originalName,
          count: queries[idx]?.data?.length || 0,
        }))
        .filter((c) => c.count > 0),
    [movies, queries],
  );

  return {
    allMovies,
    categories,
    isLoading: queries.some((q) => q.isLoading),
  };
}

/**
 * Fetch series for a language.
 */
export function useLanguageSeriesRails(language: string) {
  const { series, isReady } = useLanguageCategories(language);

  const queries = useQueries({
    queries: series.map((cat) => ({
      queryKey: ["series", "list", cat.id],
      queryFn: () => api<XtreamSeriesItem[]>(`/series/list/${cat.id}`),
      enabled: isReady,
      staleTime: STALE_TIMES.streams,
      select: (data: XtreamSeriesItem[]) => ({
        category: cat,
        items: data,
      }),
    })),
  });

  return {
    rails: queries
      .filter((q) => q.data && q.data.items.length > 0)
      .map((q) => q.data!),
    isLoading: queries.some((q) => q.isLoading),
  };
}

/**
 * Fetch live channels for a language.
 */
export function useLanguageLiveChannels(language: string) {
  const { live, isReady } = useLanguageCategories(language);

  const queries = useQueries({
    queries: live.map((cat) => ({
      queryKey: ["live", "streams", cat.id],
      queryFn: () => api<XtreamLiveStream[]>(`/live/streams/${cat.id}`),
      enabled: isReady,
      staleTime: STALE_TIMES.liveStreams,
      select: (data: XtreamLiveStream[]) => ({
        category: cat,
        items: data,
      }),
    })),
  });

  return {
    rails: queries
      .filter((q) => q.data && q.data.items.length > 0)
      .map((q) => q.data!),
    isLoading: queries.some((q) => q.isLoading),
    allChannels: queries.filter((q) => q.data).flatMap((q) => q.data!.items),
  };
}

// ── Sports ────────────────────────────────────────────────────────────────────

const SPORTS_KEYWORDS = [
  "sport",
  "cricket",
  "ipl",
  "football",
  "soccer",
  "nba",
  "basketball",
  "tennis",
  "f1",
  "formula",
  "ufc",
  "boxing",
  "wrestling",
  "hockey",
  "baseball",
  "golf",
  "rugby",
];

function isSportsCategory(name: string): boolean {
  const lower = name.toLowerCase();
  return SPORTS_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Fetch all sports-related live channels across all categories.
 */
export function useSportsChannels() {
  const { data: allCategories } = useLiveCategories();

  const sportsCategories = useMemo(
    () =>
      (allCategories ?? []).filter((cat: XtreamCategory) =>
        isSportsCategory(cat.name),
      ),
    [allCategories],
  );

  const queries = useQueries({
    queries: sportsCategories.map((cat: XtreamCategory) => ({
      queryKey: ["live", "streams", cat.id],
      queryFn: () => api<XtreamLiveStream[]>(`/live/streams/${cat.id}`),
      enabled: sportsCategories.length > 0,
      staleTime: STALE_TIMES.liveStreams,
      select: (data: XtreamLiveStream[]) => ({
        category: { id: cat.id, name: cat.name, originalName: cat.name },
        items: data,
      }),
    })),
  });

  return {
    rails: queries
      .filter((q) => q.data && q.data.items.length > 0)
      .map((q) => q.data!),
    isLoading: queries.some((q) => q.isLoading),
    allChannels: queries.filter((q) => q.data).flatMap((q) => q.data!.items),
    hasCategories: sportsCategories.length > 0,
  };
}
