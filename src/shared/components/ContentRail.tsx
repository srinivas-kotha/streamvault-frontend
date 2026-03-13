import { createContext, useRef, type ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useSpatialFocusable, useSpatialContainer, FocusContext } from '@shared/hooks/useSpatialNav';
import { HorizontalScroll } from './HorizontalScroll';

const RailContext = createContext<string>('SN:ROOT');

function FocusableSeeAll({ to, parentFocusKey }: { to: string; parentFocusKey: string }) {
  const navigate = useNavigate();

  const { ref, showFocusRing, focusProps } = useSpatialFocusable({
    focusKey: `see-all-${parentFocusKey}`,
    onEnterPress: () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic route path from props
      navigate({ to: to as any });
    },
  });

  return (
    <div ref={ref} {...focusProps}>
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic route path from props
        to={to as any}
        className={`text-sm text-teal hover:text-teal/80 transition-colors whitespace-nowrap min-h-[44px] flex items-center ${
          showFocusRing ? 'ring-2 ring-teal/50 rounded px-2' : ''
        }`}
      >
        See All →
      </Link>
    </div>
  );
}

interface ContentRailProps {
  title: string;
  seeAllTo?: string;
  children: ReactNode;
  className?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  isLoading?: boolean;
  focusKey?: string;
}

export function ContentRail({
  title,
  seeAllTo,
  children,
  className = '',
  emptyMessage: _emptyMessage = 'Nothing here yet',
  isEmpty = false,
  isLoading = false,
  focusKey: propFocusKey,
}: ContentRailProps) {
  const railId = propFocusKey || `rail-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const scrollRef = useRef<HTMLDivElement>(null);

  const { ref, focusKey } = useSpatialContainer({
    focusKey: railId,
    saveLastFocusedChild: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ['left', 'right'],
  });

  if (isEmpty && !isLoading) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} className={`${className}`}>
        <div className="flex items-center justify-between mb-3 px-6 lg:px-10">
          <h2 className="font-display text-lg lg:text-xl font-semibold text-text-primary">
            {title}
          </h2>
          {seeAllTo && (
            <FocusableSeeAll to={seeAllTo} parentFocusKey={railId} />
          )}
        </div>

        <div className="px-6 lg:px-10">
          {isLoading ? (
            <div className="flex gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="rail-item flex-shrink-0 animate-pulse">
                  <div className="aspect-[2/3] bg-surface-raised rounded-lg" />
                  <div className="mt-2 h-4 bg-surface-raised rounded w-3/4" />
                  <div className="mt-1 h-3 bg-surface-raised rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <HorizontalScroll ref={scrollRef}>
              <RailContext.Provider value={focusKey}>
                {children}
              </RailContext.Provider>
            </HorizontalScroll>
          )}
        </div>
      </section>
    </FocusContext.Provider>
  );
}
