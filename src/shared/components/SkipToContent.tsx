/**
 * Sprint 6C — Accessibility
 * SkipToContent: visually hidden link that becomes visible on keyboard focus.
 * Must be the FIRST focusable element in the DOM — placed at top of RootLayout.
 * Targets #main-content to allow keyboard users to bypass navigation.
 *
 * Uses translate-based off-screen positioning instead of sr-only (which uses
 * clip/overflow:hidden and can prevent focus traversal in some browsers).
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={[
        // Off-screen by default (not sr-only — clip can break focus)
        "fixed top-4 left-4 z-[9999]",
        "-translate-y-[200%]",
        // Slide into view on focus
        "focus:translate-y-0",
        // Appearance
        "px-4 py-2 rounded-lg",
        "bg-teal text-obsidian font-semibold text-sm",
        "outline-none ring-2 ring-white ring-offset-2 ring-offset-obsidian",
        "shadow-lg",
        "transition-transform duration-150",
      ].join(" ")}
    >
      Skip to main content
    </a>
  );
}
