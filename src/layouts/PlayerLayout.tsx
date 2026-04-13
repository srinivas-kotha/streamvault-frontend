/**
 * PlayerLayout — SRI-19 page template
 *
 * Structure:
 *   - Full-bleed video area (16:9 viewport-height, black background)
 *   - OSD overlay (controls, scrubber) positioned over video
 *   - Metadata section below: title, episode info, description
 *   - Related content rail at bottom
 *
 * TV safe zones:
 *   - Content rails: px-6 lg:px-12 (48px at lg → total 52+48=100px > 96px spec)
 *   - OSD controls: px-6 lg:px-12 with bottom safe-zone padding
 *
 * Spatial nav:
 *   - Focus lands on playback controls (play/pause) on mount
 *   - D-pad up/down navigates between OSD and metadata/rail
 *
 * Usage:
 *   <PlayerLayout
 *     videoSlot={<VideoPlayer src={streamUrl} />}
 *     osdSlot={<PlayerControls />}
 *     title="Movie Title"
 *     subtitle="2h 15m · Action · 2024"
 *     description="Film synopsis goes here..."
 *   >
 *     <ContentRail title="More Like This" ... />
 *   </PlayerLayout>
 */

import type { ReactNode } from "react";

interface PlayerLayoutProps {
  /** Video player element (full-bleed) */
  videoSlot: ReactNode;
  /** On-screen display: controls, scrubber, volume — overlaid on video */
  osdSlot?: ReactNode;
  /** Content title */
  title: string;
  /** Subtitle: duration, genre, year */
  subtitle?: string;
  /** Description / synopsis */
  description?: string;
  /** Related content rails rendered below metadata */
  children?: ReactNode;
}

export function PlayerLayout({
  videoSlot,
  osdSlot,
  title,
  subtitle,
  description,
  children,
}: PlayerLayoutProps) {
  return (
    <div
      className="min-h-screen bg-black flex flex-col"
      data-testid="player-layout"
    >
      {/* Full-bleed video + OSD overlay */}
      <section
        aria-label={`Playing ${title}`}
        className="relative w-full bg-black"
        style={{ aspectRatio: "16 / 9", maxHeight: "100vh" }}
      >
        {/* Video fill */}
        <div className="absolute inset-0">{videoSlot}</div>

        {/* OSD overlay — bottom-anchored, TV safe-zone padding */}
        {osdSlot && (
          <div
            className="absolute inset-x-0 bottom-0 px-6 lg:px-12 pb-8 pt-16"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
            }}
            aria-label="Playback controls"
          >
            {osdSlot}
          </div>
        )}
      </section>

      {/* Metadata section */}
      <section
        aria-label="Content details"
        className="flex flex-col gap-2 px-6 lg:px-12 py-6 bg-bg-primary"
      >
        <h1 className="text-xl lg:text-2xl font-bold text-text-primary font-[family-name:var(--font-family-heading)] tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
        {description && (
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl mt-1">
            {description}
          </p>
        )}
      </section>

      {/* Related content rails */}
      {children && (
        <div
          className="flex flex-col gap-8 py-6 px-6 lg:px-12 bg-bg-primary"
          aria-label="Related content"
        >
          {children}
        </div>
      )}
    </div>
  );
}
