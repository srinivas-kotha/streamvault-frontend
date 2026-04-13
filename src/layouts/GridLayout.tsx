/**
 * GridLayout — SRI-19 page template
 *
 * Structure:
 *   - PageHeader: title + optional subtitle
 *   - FilterBar: horizontal chip filters (optional)
 *   - Poster grid: responsive columns, bento-aware
 *
 * Usage:
 *   <GridLayout title="Telugu Movies" filterBar={<FilterBar />}>
 *     {items.map(item => <PosterCard key={item.id} {...item} />)}
 *   </GridLayout>
 */

import type { ReactNode } from "react";

interface GridLayoutProps {
  /** Page title */
  title: string;
  /** Optional subtitle or count */
  subtitle?: string;
  /** Optional horizontal filter/chip bar */
  filterBar?: ReactNode;
  /** Grid items (cards) */
  children: ReactNode;
}

export function GridLayout({
  title,
  subtitle,
  filterBar,
  children,
}: GridLayoutProps) {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-6" data-testid="grid-layout">
      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary font-[family-name:var(--font-family-heading)] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        )}
      </header>

      {/* Filter bar */}
      {filterBar && (
        <div className="mb-6 -mx-1" role="group" aria-label="Filters">
          {filterBar}
        </div>
      )}

      {/* Poster grid — responsive: 2 cols mobile, 4 tablet, 6 desktop, 8 TV */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(clamp(120px, 14vw, 160px), 1fr))",
        }}
        role="list"
        aria-label={`${title} content`}
      >
        {children}
      </div>
    </div>
  );
}
