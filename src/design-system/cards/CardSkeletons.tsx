/**
 * CardSkeletons — shimmer loading placeholders for each card type (SRI-40)
 *
 * Each skeleton matches the exact dimensions and layout of its real card
 * so there is no layout shift when the real card replaces the skeleton.
 *
 * All skeletons:
 * - Use animate-shimmer (gradient sweep) for the image area
 * - Use animate-pulse for text lines (matches existing Skeleton primitive)
 * - Are suppressed to static colors when prefers-reduced-motion is active
 *   (handled entirely in CSS — no JS needed here)
 * - Carry role="status" + aria-busy="true" + aria-label for screen readers
 */

import { cn } from "@/shared/utils/cn";

// ---------------------------------------------------------------------------
// Shared primitive — shimmer block
// ---------------------------------------------------------------------------

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-shimmer rounded-[var(--radius-lg)]", className)}
    />
  );
}

// Text skeleton line — matches Skeleton primitive style
function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-bg-tertiary rounded-[var(--radius-md)] h-3",
        className,
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// PosterCardSkeleton — 2:3 aspect ratio
// ---------------------------------------------------------------------------

export function PosterCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading…"
      className={cn(
        "relative aspect-[2/3] rounded-[var(--radius-lg)] overflow-hidden bg-bg-secondary",
        className,
      )}
    >
      <ShimmerBlock className="absolute inset-0 rounded-none" />
      {/* Text lines at bottom */}
      <div className="absolute inset-x-0 bottom-0 px-2 pb-2 flex flex-col gap-1.5">
        <SkeletonLine className="w-3/4" />
        <SkeletonLine className="w-1/2" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LandscapeCardSkeleton — 16:9 aspect ratio
// ---------------------------------------------------------------------------

export function LandscapeCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading…"
      className={cn(
        "relative rounded-[var(--radius-lg)] overflow-hidden bg-bg-secondary",
        className,
      )}
    >
      {/* 16:9 image area */}
      <div className="relative aspect-video">
        <ShimmerBlock className="absolute inset-0 rounded-none" />
      </div>
      {/* Text below */}
      <div className="px-2.5 py-2 flex flex-col gap-1.5">
        <SkeletonLine className="w-3/4" />
        <SkeletonLine className="w-1/2" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChannelCardSkeleton — 16:9 aspect ratio (no text area below)
// ---------------------------------------------------------------------------

export function ChannelCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading…"
      className={cn(
        "relative aspect-video rounded-[var(--radius-lg)] overflow-hidden bg-bg-secondary",
        className,
      )}
    >
      <ShimmerBlock className="absolute inset-0 rounded-none" />
      {/* Channel name line at bottom */}
      <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2">
        <SkeletonLine className="w-1/2" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EpisodeCardSkeleton — 16:9 thumbnail + text area
// ---------------------------------------------------------------------------

export function EpisodeCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading…"
      className={cn(
        "relative rounded-[var(--radius-lg)] overflow-hidden bg-bg-secondary",
        className,
      )}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video">
        <ShimmerBlock className="absolute inset-0 rounded-none" />
      </div>
      {/* Text below thumbnail */}
      <div className="px-2 py-2 flex flex-col gap-1.5">
        <SkeletonLine className="w-4/5" />
        <SkeletonLine className="w-3/5" />
        <SkeletonLine className="w-full" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeroCardSkeleton — full-width, min-height matches HeroCard
// ---------------------------------------------------------------------------

export function HeroCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading…"
      className={cn(
        "relative w-full min-h-[200px] md:min-h-[300px] rounded-[var(--radius-xl)] overflow-hidden bg-bg-secondary",
        className,
      )}
    >
      <ShimmerBlock className="absolute inset-0 rounded-none" />
      {/* Title + description lines bottom-left */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-8 md:pb-8 flex flex-col gap-2">
        <SkeletonLine className="w-2/5 h-5" />
        <SkeletonLine className="w-3/5" />
        <SkeletonLine className="w-2/5" />
      </div>
    </div>
  );
}
