/**
 * HomeLayout — SRI-19 page template
 *
 * Structure:
 *   - Full-width CinematicHero (edge-to-edge, no padding)
 *   - Content rails below, with standard page padding
 *   - TV safe zones: rails get pl-[20px] to clear left sidebar gutter
 *
 * Usage:
 *   <HomeLayout hero={<CinematicHero ... />}>
 *     <ContentRail ... />
 *     <ContentRail ... />
 *   </HomeLayout>
 */

import type { ReactNode } from "react";

interface HomeLayoutProps {
  /** Full-width hero section (CinematicHero or HeroBanner) */
  hero: ReactNode;
  /** Content rails and sections rendered below the hero */
  children: ReactNode;
}

export function HomeLayout({ hero, children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen" data-testid="home-layout">
      {/* Hero: edge-to-edge, no horizontal padding */}
      <section aria-label="Featured content" className="w-full">
        {hero}
      </section>

      {/* Content rails: standard page padding, vertical spacing */}
      <div className="flex flex-col gap-8 py-8 px-6 lg:px-12">{children}</div>
    </div>
  );
}
