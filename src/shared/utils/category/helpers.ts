import { LANGUAGE_ALIASES } from './channelMappings';

// ---------------------------------------------------------------------------
// Metadata extraction helpers
// ---------------------------------------------------------------------------

/** Extract a 4-digit year like (2026) or standalone 2025 near parens */
export function extractYear(name: string): number | undefined {
  // Match (2019)-(2026) or standalone 20xx at word boundary
  const m = name.match(/\b((?:19|20)\d{2})\b/);
  return m ? parseInt(m[1]!, 10) : undefined;
}

/** Extract quality tag: 4K, FHD, HD */
export function extractQuality(name: string): string | undefined {
  const m = name.match(/\b(4K|FHD|UHD|HD|BluRay|Blu[- ]?Ray|WEB[- ]?DL)\b/i);
  return m ? m[1]!.toUpperCase() : undefined;
}

/** Check if category name contains CAM indicator */
export function isCamRelease(name: string): boolean {
  return /\(CAM\)/i.test(name);
}

/**
 * Strip metadata suffixes from a category name to get a clean display name.
 * "(TELUGU) (2026)" -> "2026"
 * "TELUGU (2025) (CAM)" -> "2025 CAM"
 * "INDIAN FHD (2024)" -> "FHD 2024"
 * "TELUGU" -> "All"
 */
export function buildDisplayName(
  originalName: string,
  language: string,
  year?: number,
  quality?: string,
  isCam?: boolean,
  channelName?: string,
): string {
  if (channelName) return channelName;

  const parts: string[] = [];
  if (quality) parts.push(quality);
  if (year) parts.push(String(year));
  if (isCam) parts.push('CAM');

  if (parts.length === 0) {
    // Check for special descriptors left after stripping language
    const stripped = stripLanguagePrefix(originalName, language);
    if (stripped && stripped !== 'General') return stripped;
    return 'All';
  }

  return parts.join(' ');
}

/**
 * Strip language prefix / known keywords from a name to get the descriptor.
 */
export function stripLanguagePrefix(name: string, language: string): string {
  let result = name;

  // Remove leading parens around language: "(TELUGU)" -> ""
  result = result.replace(/^\(?\s*/i, '');

  // Remove the language keyword itself (case-insensitive)
  // Also remove known aliases that map to this language
  const aliasesToRemove = new Set<string>();
  aliasesToRemove.add(language.toLowerCase());
  for (const [alias, canonical] of Object.entries(LANGUAGE_ALIASES)) {
    if (canonical === language) aliasesToRemove.add(alias);
  }

  for (const alias of aliasesToRemove) {
    const regex = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'gi');
    result = result.replace(regex, '');
  }

  // Remove years, quality, CAM, parens
  result = result
    .replace(/\b(?:19|20)\d{2}\b/g, '')
    .replace(/\b(?:4K|FHD|UHD|HD|CAM)\b/gi, '')
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return result || 'General';
}

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function toTitleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => {
      // Keep all-caps acronyms
      if (w.length <= 3 && w === w.toUpperCase()) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}
