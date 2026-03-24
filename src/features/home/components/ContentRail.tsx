// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContentRailProps<T = any> {
  title: string;
  items: T[];
  renderCard: (item: T, index: number, isFirstVisible: boolean) => React.ReactNode;
  isLoading?: boolean;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  /** Number of items treated as "first visible" for eager loading (default 6) */
  eagerCount?: number;
}

// ---------------------------------------------------------------------------
// Skeleton cards
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div
      data-testid="card-skeleton"
      className="shrink-0 w-36 aspect-[2/3] rounded-[var(--radius-lg)] bg-bg-secondary animate-pulse"
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContentRail<T = any>({
  title,
  items,
  renderCard,
  isLoading,
  showSeeAll,
  onSeeAll,
  eagerCount = 5,
}: ContentRailProps<T>) {
  return (
    <section role="region" aria-label={title}>
      {/* Header row */}
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-base font-semibold text-text-primary font-[family-name:var(--font-family-heading)]">
          {title}
        </h2>
        {showSeeAll && onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-sm text-accent-teal hover-capable:hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal rounded px-2 py-1"
          >
            See All
          </button>
        )}
      </div>

      {/* Scroll container */}
      {isLoading ? (
        <div
          data-testid="rail-scroll-container"
          className="flex gap-3 px-4 overflow-x-auto scrollbar-hide"
        >
          {Array.from({ length: eagerCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-6 text-sm text-text-tertiary">
          No items to display
        </div>
      ) : (
        <div
          data-testid="rail-scroll-container"
          className="flex gap-3 px-4 overflow-x-auto scrollbar-hide"
        >
          {items.map((item, index) => {
            const isFirstVisible = index < eagerCount;
            return renderCard(item, index, isFirstVisible);
          })}
        </div>
      )}
    </section>
  );
}
