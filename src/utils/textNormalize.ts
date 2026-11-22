/**
 * Shared Unicode normalization helpers for diacritic-agnostic search across
 * African sovereign nations, toponyms, peoples, languages, and archival plates.
 */

const DIACRITIC_RE = /\p{Diacritic}/gu;
const SEPARATOR_RE = /['’`´ʻ\-–—./,;:()[\]{}]+/g;

/**
 * Strips combining diacritics (e.g. Côte d'Ivoire -> cote d ivoire, São Tomé -> sao tome)
 * and folds Unicode compatibility forms and case.
 */
export function normalizeSearchText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(DIACRITIC_RE, '')
    .toLowerCase()
    .trim();
}

/**
 * Tokenizes normalized text for search engines (splitting apostrophes, hyphens, punctuation, and whitespace).
 */
export function tokenizeSearchText(value: string | null | undefined): string[] {
  const normalized = normalizeSearchText(value);
  if (!normalized) return [];
  return normalized
    .replace(SEPARATOR_RE, ' ')
    .split(/\s+/)
    .filter(Boolean);
}
