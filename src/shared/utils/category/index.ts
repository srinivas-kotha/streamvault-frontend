// Barrel re-exports — preserves all public API from the original categoryParser.ts
export type { SubCategory, LanguageGroup } from './types';
export {
  parseCategory,
  groupCategoriesByLanguage,
  getDetectedLanguages,
  getCategoriesForLanguage,
  getMovieCategoriesForLanguage,
  getSeriesCategoriesForLanguage,
  getLiveCategoriesForLanguage,
} from './categoryGrouper';
