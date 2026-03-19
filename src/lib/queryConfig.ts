/**
 * Centralized query cache configuration.
 *
 * All staleTime / gcTime values live here so cache behaviour is consistent
 * across features and easy to tune from a single location.
 */

// ── Stale times ──────────────────────────────────────────────────────────────

export const STALE_TIMES = {
  /** VOD & series category lists — rarely change */
  categories: 6 * 60 * 60 * 1000, // 6 hours
  /** Live TV category list — matches backend cache */
  liveCategories: 60 * 60 * 1000, // 1 hour
  /** VOD / series stream lists */
  streams: 2 * 60 * 60 * 1000, // 2 hours
  /** Live streams & featured channels */
  liveStreams: 30 * 60 * 1000, // 30 minutes
  /** Electronic programme guide */
  epg: 15 * 60 * 1000, // 15 minutes
  /** Favorites list */
  favorites: 5 * 60 * 1000, // 5 minutes
  /** Watch history */
  history: 2 * 60 * 1000, // 2 minutes
  /** Search results */
  search: 60 * 1000, // 1 minute
  /** Auth session check */
  auth: 60 * 1000, // 1 minute
  /** Default (matches queryClient default) */
  default: 5 * 60 * 1000, // 5 minutes
} as const;

// ── Garbage-collection times ─────────────────────────────────────────────────

export const GC_TIMES = {
  default: 30 * 60 * 1000, // 30 minutes
} as const;
