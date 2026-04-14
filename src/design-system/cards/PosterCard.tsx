import { useState, useRef, useEffect, memo, useCallback } from "react";
import { cn } from "@/shared/utils/cn";
import { Badge } from "@/design-system/primitives/Badge";
import { isTVMode } from "@/shared/utils/isTVMode";
import { useBlurUp } from "@/shared/hooks/useBlurUp";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PosterCardProps {
  title: string;
  imageUrl: string;
  rating?: string | number;
  isNew?: boolean;
  year?: number;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  className?: string;
  /** Used for data-focus-key — must be unique per card in a list */
  focusKey?: string;
}

// ---------------------------------------------------------------------------
// Image fallback (gradient + title text)
// ---------------------------------------------------------------------------

function PosterFallback({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-b from-bg-secondary to-bg-tertiary flex items-end p-3"
    >
      <span className="text-xs font-medium text-text-secondary line-clamp-2 font-[family-name:var(--font-family-heading)] leading-snug">
        {title}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PosterCard = memo(function PosterCard({
  title,
  imageUrl,
  rating,
  isNew,
  year,
  isFavorite,
  onFavoriteToggle,
  onClick,
  className,
  focusKey,
}: PosterCardProps) {
  const [imgError, setImgError] = useState(false);
  const reducedMotion = useReducedMotion();
  const { imgProps, imgClass } = useBlurUp();

  // Track previous isFavorite to trigger pop animation only on toggle
  const prevFavoriteRef = useRef(isFavorite);
  const [showFavPop, setShowFavPop] = useState(false);

  useEffect(() => {
    if (
      prevFavoriteRef.current !== isFavorite &&
      isFavorite &&
      !reducedMotion
    ) {
      setShowFavPop(true);
    }
    prevFavoriteRef.current = isFavorite;
  }, [isFavorite, reducedMotion]);

  const handleFavAnimEnd = useCallback(() => {
    setShowFavPop(false);
  }, []);

  const handleImgError = useCallback(() => {
    setImgError(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && onClick) onClick();
    },
    [onClick],
  );

  const hasBadge = isNew || rating !== undefined;

  const ariaLabelParts = [title];
  if (year) ariaLabelParts.push(String(year));
  if (rating !== undefined) ariaLabelParts.push(String(rating));
  const ariaLabel = ariaLabelParts.join(" — ");

  return (
    <div
      data-focus-key={focusKey}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className={cn(
        // Sizing: 120px mobile → 180px desktop → 240px TV (set by parent rail/grid)
        "relative cursor-pointer select-none",
        "rounded-[var(--radius-lg)] overflow-hidden",
        // 2:3 aspect
        "aspect-[2/3]",
        // Background for before image loads
        "bg-bg-secondary",
        // Border
        "border border-transparent",
        // Hover — mouse only (TV remotes have no hover capability)
        "hover-capable:border-accent-teal/30",
        // Focus ring — keyboard & TV D-pad
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        // Scale + shadow on hover/focus (specific props only, no transition-all)
        "transition-[transform,box-shadow,border-color] duration-200 ease-out",
        "hover-capable:hover:scale-[1.04] hover-capable:hover:shadow-[0_4px_24px_rgba(20,184,166,0.15)]",
        "focus-visible:scale-[1.04] focus-visible:shadow-[var(--shadow-focus-tv)]",
        className,
      )}
    >
      {/* Image — blur-up: fades in from transparent once loaded */}
      {!imgError ? (
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={handleImgError}
          {...imgProps}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            imgClass,
          )}
          draggable={false}
        />
      ) : (
        <PosterFallback title={title} />
      )}

      {/* Bottom gradient overlay — always rendered so title is readable */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-primary/95 via-bg-primary/40 to-transparent pointer-events-none"
      />

      {/* Badges (top-left) */}
      {hasBadge && (
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {isNew && (
            <Badge variant="new" size="sm">
              NEW
            </Badge>
          )}
          {rating !== undefined && (
            <Badge variant="rating" size="sm">
              {rating}
            </Badge>
          )}
        </div>
      )}

      {/* Favorite toggle (top-right) */}
      {onFavoriteToggle && (
        <button
          type="button"
          role="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-bg-primary/50 hover-capable:hover:bg-bg-primary/70 transition-[background-color] duration-150"
        >
          <svg
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            onAnimationEnd={handleFavAnimEnd}
            className={cn(
              "w-4 h-4",
              isFavorite ? "text-error" : "text-text-primary",
              // Transition fill color smoothly
              "transition-[color,fill] duration-200 ease-out",
              // Pop on add-to-favorites
              showFavPop && "animate-favorite-pop",
            )}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            />
          </svg>
        </button>
      )}

      {/* Title + year — bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 px-2 pb-2 pointer-events-none">
        <p
          className={cn(
            "font-medium text-text-primary truncate font-[family-name:var(--font-family-heading)] leading-snug",
            isTVMode ? "text-sm" : "text-xs",
          )}
        >
          {title}
        </p>
        {year && (
          <p className="text-[10px] text-text-secondary mt-0.5">{year}</p>
        )}
      </div>
    </div>
  );
});
