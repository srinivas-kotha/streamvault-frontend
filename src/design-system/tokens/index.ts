/**
 * Design tokens — typed references to CSS custom properties defined in
 * src/styles/tailwind.css. Import from '@/design-system/tokens' to get
 * autocomplete + type safety when using tokens in inline styles or JS.
 *
 * For Tailwind classes, use the CSS variables directly (e.g. `bg-[var(--color-bg-primary)]`).
 * These exports are for cases where you need the value in JS (canvas, charts, animations).
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const colors = {
  bg: {
    primary: "var(--color-bg-primary)",
    secondary: "var(--color-bg-secondary)",
    tertiary: "var(--color-bg-tertiary)",
    overlay: "var(--color-bg-overlay)",
    hover: "var(--color-bg-hover)",
  },
  surface: {
    base: "var(--color-surface)",
    raised: "var(--color-surface-raised)",
    hover: "var(--color-surface-hover)",
    overlay: "var(--color-surface-overlay)",
  },
  accent: {
    teal: "var(--color-accent-teal)",
    indigo: "var(--color-accent-indigo)",
    tealDim: "var(--color-accent-teal-dim)",
    indigoDim: "var(--color-accent-indigo-dim)",
  },
  text: {
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    tertiary: "var(--color-text-tertiary)",
    muted: "var(--color-text-muted)",
  },
  border: {
    default: "var(--color-border)",
    subtle: "var(--color-border-subtle)",
  },
  status: {
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
    info: "var(--color-info)",
  },
  focus: "var(--color-focus)",
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

export const spacing = {
  pageX: "var(--spacing-page-x)",
  railGap: "var(--spacing-rail-gap)",
  sectionGap: "var(--spacing-section-gap)",
} as const;

// ---------------------------------------------------------------------------
// Typography (font sizes)
// ---------------------------------------------------------------------------

export const fontSize = {
  xs: "var(--font-size-xs)",
  sm: "var(--font-size-sm)",
  base: "var(--font-size-base)",
  lg: "var(--font-size-lg)",
  xl: "var(--font-size-xl)",
  "2xl": "var(--font-size-2xl)",
  "3xl": "var(--font-size-3xl)",
  "4xl": "var(--font-size-4xl)",
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

export const radius = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  full: "var(--radius-full)",
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export const shadows = {
  focus: "var(--shadow-focus)",
  focusTv: "var(--shadow-focus-tv)",
} as const;

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

export const transitions = {
  fast: "var(--transition-fast)",
  normal: "var(--transition-normal)",
  slow: "var(--transition-slow)",
} as const;

// ---------------------------------------------------------------------------
// Z-index stack
// ---------------------------------------------------------------------------

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  player: 60,
} as const;
