import { useState, memo, useCallback } from 'react';
import { cn } from '@/shared/utils/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EpisodeCardProps {
  title: string;
  thumbnailUrl: string;
  duration?: string;
  /** Watch progress 0-100 */
  progress?: number;
  season?: number;
  episode?: number;
  description?: string;
  onClick?: () => void;
  className?: string;
  focusKey?: string;
}

// ---------------------------------------------------------------------------
// Progress bar sub-component
// ---------------------------------------------------------------------------

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      aria-label={`${Math.round(clamped)}% watched`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="absolute bottom-0 inset-x-0 h-[3px] bg-bg-overlay"
    >
      <div
        className="h-full bg-accent-teal rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image fallback
// ---------------------------------------------------------------------------

function EpisodeFallback({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-br from-bg-secondary to-bg-tertiary flex items-center justify-center p-3"
    >
      <span className="text-sm font-medium text-text-secondary text-center line-clamp-2 font-[family-name:var(--font-family-heading)] leading-snug">
        {title}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatEpisodeCode(season?: number, episode?: number): string | null {
  if (season === undefined || episode === undefined) return null;
  const s = String(season).padStart(2, '0');
  const e = String(episode).padStart(2, '0');
  return `S${s}E${e}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const EpisodeCard = memo(function EpisodeCard({
  title,
  thumbnailUrl,
  duration,
  progress,
  season,
  episode,
  description,
  onClick,
  className,
  focusKey,
}: EpisodeCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleImgError = useCallback(() => {
    setImgError(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && onClick) onClick();
    },
    [onClick],
  );

  const hasProgress = progress !== undefined && progress > 0;
  const clampedProgress = progress !== undefined ? Math.min(100, Math.max(0, progress)) : undefined;
  const episodeCode = formatEpisodeCode(season, episode);

  const ariaLabel = duration ? `${title} — ${duration}` : title;

  return (
    <div
      data-focus-key={focusKey}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className={cn(
        'relative cursor-pointer select-none',
        'rounded-[var(--radius-lg)] overflow-hidden',
        'bg-bg-secondary',
        'border border-transparent',
        'hover-capable:border-accent-teal/30',
        'transition-[transform,box-shadow,border-color] duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        'focus-visible:scale-[1.04] focus-visible:shadow-[var(--shadow-focus-tv)]',
        className,
      )}
    >
      {/* Thumbnail area — 16:9 */}
      <div className="relative aspect-video">
        {!imgError ? (
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={handleImgError}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <EpisodeFallback title={title} />
        )}

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="text-[10px] font-medium text-text-primary bg-bg-primary/70 px-1.5 py-0.5 rounded">
              {duration}
            </span>
          </div>
        )}

        {/* Progress bar — at bottom of thumbnail */}
        {hasProgress && <ProgressBar value={clampedProgress!} />}
      </div>

      {/* Text below thumbnail */}
      <div className="px-2 py-2">
        {/* Episode code + title row */}
        <div className="flex items-baseline gap-1.5">
          {episodeCode && (
            <span className="text-[10px] font-semibold text-accent-teal shrink-0">
              {episodeCode}
            </span>
          )}
          <p className="font-medium text-text-primary truncate text-xs font-[family-name:var(--font-family-heading)] leading-snug">
            {title}
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[10px] text-text-secondary line-clamp-2 mt-1 leading-snug">
            {description}
          </p>
        )}
      </div>
    </div>
  );
});
