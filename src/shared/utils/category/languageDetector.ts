import {
  LANGUAGE_ALIASES,
  CHANNEL_TO_LANGUAGE,
  LIVE_CATEGORY_MAP,
} from './channelMappings';
import { escapeRegex, toTitleCase } from './helpers';

// ---------------------------------------------------------------------------
// Language detection from category name
// ---------------------------------------------------------------------------

/**
 * Ordered list of language keywords to try, longest first to avoid
 * "south indian hindi dubbed" matching "indian" before the full phrase.
 */
const LANGUAGE_KEYWORDS_SORTED = Object.keys(LANGUAGE_ALIASES).sort(
  (a, b) => b.length - a.length,
);

/**
 * Detect language from a VOD or live category name.
 * Tries multiple strategies:
 * 1. Exact match on full name (after lowering)
 * 2. Leading paren match: "(TELUGU) ..."
 * 3. Separator match: "TAMIL | NEWS"
 * 4. Keyword match against LANGUAGE_ALIASES (longest-first)
 * 5. Special composite patterns: "SOUTH INDIAN HINDI DUBBED", "NETFLIX MOVIES HINDI"
 */
export function detectLanguageFromName(name: string): string | null {
  const lower = name.toLowerCase().trim();

  // 1. Exact match
  if (LANGUAGE_ALIASES[lower]) return LANGUAGE_ALIASES[lower]!;

  // 2. Leading paren: "(TELUGU) (2026)" -> telugu
  const parenMatch = lower.match(/^\(([^)]+)\)/);
  if (parenMatch) {
    const inner = parenMatch[1]!.trim();
    if (LANGUAGE_ALIASES[inner]) return LANGUAGE_ALIASES[inner]!;
  }

  // 3. Separator: "TAMIL | NEWS", "MALAYALAM | MOVIES"
  const sepMatch = lower.match(/^([a-z\s]+?)\s*[|:\-\u2013\u2014]\s*/);
  if (sepMatch) {
    const prefix = sepMatch[1]!.trim();
    if (LANGUAGE_ALIASES[prefix]) return LANGUAGE_ALIASES[prefix]!;
  }

  // 4. Check for composite patterns first (before single-word keywords)
  // "SOUTH INDIAN HINDI DUBBED" -> Hindi
  if (/south\s+indian\s+hindi\s+dubbed/i.test(lower)) return 'Hindi';
  if (/english\s+hindi\s+dubbed/i.test(lower)) return 'Hindi';
  if (/netflix\s+movies?\s+hindi/i.test(lower)) return 'Hindi';
  if (/netflix\s+movies?\s+english/i.test(lower)) return 'English';
  if (/hindi\s+old\s+movies/i.test(lower)) return 'Hindi';
  if (/bollywood\s+comedy/i.test(lower)) return 'Hindi';
  if (/bollywood\s+beuties/i.test(lower)) return 'Hindi';
  if (/bollywood/i.test(lower)) return 'Hindi';

  // 5. Keyword match (longest first)
  for (const keyword of LANGUAGE_KEYWORDS_SORTED) {
    // Only match at word boundary to avoid partial matches
    const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
    if (regex.test(lower)) {
      return LANGUAGE_ALIASES[keyword]!;
    }
  }

  return null;
}

/**
 * Detect language from a series category name using channel mapping.
 * Falls back to keyword-based detection.
 */
export function detectLanguageFromSeriesName(name: string): {
  language: string | null;
  channelName: string | null;
} {
  const lower = name.toLowerCase().trim();

  // Remove trailing category ID patterns like " (453)"
  const cleanLower = lower.replace(/\s*\(\d+\)\s*$/, '').trim();

  // 1. Exact match in channel map
  if (CHANNEL_TO_LANGUAGE[cleanLower]) {
    return {
      language: CHANNEL_TO_LANGUAGE[cleanLower]!,
      channelName: toTitleCase(cleanLower),
    };
  }

  // 2. Try progressively shorter prefixes for channels with suffixes
  // e.g., "STAR MAA HD" -> try "star maa hd", then "star maa"
  const words = cleanLower.split(/\s+/);
  for (let len = words.length; len >= 1; len--) {
    const prefix = words.slice(0, len).join(' ');
    if (CHANNEL_TO_LANGUAGE[prefix]) {
      return {
        language: CHANNEL_TO_LANGUAGE[prefix]!,
        channelName: toTitleCase(prefix),
      };
    }
  }

  // 3. Try keyword-based detection as fallback (e.g., "Tamil Tv Series")
  const lang = detectLanguageFromName(name);
  if (lang) {
    return { language: lang, channelName: null };
  }

  return { language: null, channelName: null };
}

/**
 * Detect language from a live TV category name using the live map
 * and falling back to keyword detection.
 */
export function detectLanguageFromLiveName(name: string): string | null {
  const lower = name.toLowerCase().trim();

  // 1. Exact match in live map
  if (LIVE_CATEGORY_MAP[lower]) return LIVE_CATEGORY_MAP[lower]!;

  // 2. Try keyword detection
  return detectLanguageFromName(name);
}
