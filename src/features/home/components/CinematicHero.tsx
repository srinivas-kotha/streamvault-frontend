/**
 * CinematicHero — SRI-19 hero/banner redesign
 *
 * Replaces generic carousel pattern with a single featured piece of content
 * using the "Ambient Depth" aesthetic:
 *   - Full-bleed backdrop image
 *   - Multi-layer gradient: bottom fog + left vignette + ambient colour bloom
 *   - 3% grain texture (depth without complexity)
 *   - Staggered entrance animation for metadata
 *   - D-pad focusable CTA (Play + Add to List)
 *   - TV safe zones: content sits within TV overscan margins
 *   - No carousel — single hero, no auto-rotation
 *
 * Design rationale: Netflix/Disney+ both use a single-item hero for their
 * featured slot. Carousels auto-rotate, which is disorienting on TV and adds
 * spatial nav complexity without user benefit.
 */

import { cn } from "@/shared/utils/cn";
import { Badge } from "@/design-system/primitives/Badge";
import {
  useSpatialFocusable,
  useSpatialContainer,
  FocusContext,
} from "@shared/hooks/useSpatialNav";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CinematicHeroProps {
  title: string;
  description: string;
  backdropUrl: string;
  /** Small logo/title image (optional — falls back to text title) */
  logoUrl?: string;
  genres?: string[];
  rating?: string;
  year?: number | string;
  duration?: string;
  onPlay?: () => void;
  onAddToList?: () => void;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function CinematicHeroSkeleton() {
  return (
    <div
      data-testid="cinematic-hero-skeleton"
      className="relative w-full overflow-hidden bg-bg-secondary animate-pulse"
      style={{ minHeight: "clamp(380px, 52vw, 640px)" }}
    >
      {/* Gradient shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
      <div className="absolute bottom-10 left-10 space-y-4">
        <div className="h-10 w-72 bg-bg-tertiary rounded-lg" />
        <div className="h-4 w-96 bg-bg-tertiary rounded" />
        <div className="h-4 w-80 bg-bg-tertiary rounded" />
        <div className="flex gap-3 mt-2">
          <div className="h-12 w-36 bg-bg-tertiary rounded-lg" />
          <div className="h-12 w-36 bg-bg-tertiary rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Play button with spatial nav
// ---------------------------------------------------------------------------

function PlayButton({ onClick }: { onClick?: () => void }) {
  const { ref, showFocusRing, focusProps } = useSpatialFocusable({
    focusKey: "hero-play",
    onEnterPress: onClick,
  });

  return (
    <button
      ref={ref}
      {...focusProps}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 px-7 py-3",
        "bg-accent-teal text-bg-primary font-bold text-sm rounded-lg",
        "transition-[background-color,transform,box-shadow] duration-150 ease-out",
        "hover-capable:hover:bg-accent-teal/90 hover-capable:hover:scale-[1.03]",
        // 3D press effect (modern-web-design pattern)
        "shadow-[0_4px_0_rgba(10,100,90,0.8)]",
        "active:translate-y-[3px] active:shadow-[0_1px_0_rgba(10,100,90,0.8)]",
        // TV focus ring
        showFocusRing &&
          "ring-2 ring-accent-teal ring-offset-2 ring-offset-bg-primary scale-[1.03]",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 flex-shrink-0"
        aria-hidden
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      Play Now
    </button>
  );
}

function AddToListButton({ onClick }: { onClick?: () => void }) {
  const { ref, showFocusRing, focusProps } = useSpatialFocusable({
    focusKey: "hero-add-list",
    onEnterPress: onClick,
  });

  return (
    <button
      ref={ref}
      {...focusProps}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 px-7 py-3",
        "bg-surface-raised/70 border border-border text-text-primary font-semibold text-sm rounded-lg",
        "transition-[background-color,border-color,transform] duration-150 ease-out",
        "hover-capable:hover:bg-surface-raised hover-capable:hover:border-border-subtle/80",
        showFocusRing &&
          "ring-2 ring-accent-teal ring-offset-2 ring-offset-bg-primary",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 flex-shrink-0"
        aria-hidden
      >
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
      My List
    </button>
  );
}

// ---------------------------------------------------------------------------
// CinematicHero
// ---------------------------------------------------------------------------

export function CinematicHero({
  title,
  description,
  backdropUrl,
  logoUrl,
  genres,
  rating,
  year,
  duration,
  onPlay,
  onAddToList,
  isLoading,
}: CinematicHeroProps) {
  if (isLoading) {
    return <CinematicHeroSkeleton />;
  }

  const { ref: ctaRef, focusKey: ctaFocusKey } = useSpatialContainer({
    focusKey: "hero-ctas",
    saveLastFocusedChild: true,
  });

  return (
    <header
      role="banner"
      data-testid="cinematic-hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "clamp(380px, 52vw, 640px)" }}
    >
      {/* ── Layer 1: Backdrop image — decorative, content title is in h1/logo below ── */}
      <img
        src={backdropUrl}
        alt=""
        aria-hidden
        loading="eager"
        fetchPriority="high"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* ── Layer 2: Ambient colour bloom (teal tint top-right) ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 75% 20%, rgba(20,184,166,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Layer 3: Bottom fog gradient ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.85) 30%, rgba(10,10,15,0.4) 60%, rgba(10,10,15,0.1) 85%, transparent 100%)",
        }}
      />

      {/* ── Layer 4: Left vignette (text readability) ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,15,0.75) 0%, rgba(10,10,15,0.3) 50%, transparent 100%)",
        }}
      />

      {/* ── Layer 5: 3% grain texture (depth) ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Content: bottom-left, TV safe zones ── */}
      {/* TV safe zone: px-[max(40px,5vw)] ensures content clears overscan */}
      <div
        className="absolute inset-x-0 bottom-0 pb-10 px-[max(40px,5vw)]"
        style={{ maxWidth: "680px" }}
      >
        {/* Genre badges — stagger-1 */}
        {genres && genres.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 mb-3 animate-[fade-up_0.4s_ease-out_0.05s_both]"
            style={{ animation: "fadeUp 0.4s ease-out 0.05s both" }}
          >
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" size="sm">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {/* Title / Logo — stagger-2 */}
        <div
          className="mb-3"
          style={{ animation: "fadeUp 0.4s ease-out 0.1s both" }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title}
              className="h-16 object-contain object-left"
              draggable={false}
            />
          ) : (
            <h1
              className="text-3xl lg:text-5xl font-bold text-text-primary leading-tight"
              style={{
                fontFamily: "var(--font-family-heading)",
                letterSpacing: "-0.5px",
              }}
            >
              {title}
            </h1>
          )}
        </div>

        {/* Meta row: rating + year + duration — stagger-3 */}
        {(rating || year || duration) && (
          <div
            className="flex items-center gap-3 mb-3"
            style={{ animation: "fadeUp 0.4s ease-out 0.15s both" }}
          >
            {rating && (
              <Badge variant="rating" size="md">
                {rating}
              </Badge>
            )}
            {year && (
              <span className="text-sm text-text-secondary font-medium">
                {year}
              </span>
            )}
            {duration && (
              <span className="text-sm text-text-secondary">{duration}</span>
            )}
          </div>
        )}

        {/* Description — stagger-4 */}
        <p
          className="text-sm lg:text-base text-text-secondary leading-relaxed line-clamp-3 mb-6"
          style={{ animation: "fadeUp 0.4s ease-out 0.2s both" }}
        >
          {description}
        </p>

        {/* CTA buttons — stagger-5 */}
        <FocusContext.Provider value={ctaFocusKey}>
          <div
            ref={ctaRef}
            className="flex items-center gap-3"
            style={{ animation: "fadeUp 0.4s ease-out 0.25s both" }}
          >
            <PlayButton onClick={onPlay} />
            <AddToListButton onClick={onAddToList} />
          </div>
        </FocusContext.Provider>
      </div>
    </header>
  );
}
