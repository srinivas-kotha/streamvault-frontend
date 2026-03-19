// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SubCategory {
  id: string;
  name: string;
  originalName: string;
  /** Year extracted from category name, e.g. 2026 */
  year?: number;
  /** Quality tag: "4K", "FHD", "HD" */
  quality?: string;
  /** True if category name contains (CAM) */
  isCam?: boolean;
  /** For series: the TV channel / platform name this category represents */
  channelName?: string;
}

export interface LanguageGroup {
  language: string;
  languageKey: string; // lowercase, URL-safe: "telugu", "hindi", "english"
  movies: SubCategory[];
  series: SubCategory[];
  live: SubCategory[];
  all: SubCategory[]; // all sub-categories before type classification
}
