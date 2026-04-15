import { HomeLayout } from "@/layouts/HomeLayout";
import { CinematicHero } from "./CinematicHero";
import { ContentRail } from "./ContentRail";
import { ContinueWatchingRail } from "./ContinueWatchingRail";
import { FeaturedRail } from "./FeaturedRail";
import { CategoryRail } from "./CategoryRail";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HomePage() {
  return (
    <HomeLayout
      hero={
        <CinematicHero
          title="Featured Content"
          description="Discover the latest and greatest content from your favourite channels and streaming sources."
          backdropUrl="/hero-placeholder.jpg"
          genres={["Drama", "Action", "Thriller"]}
          rating="8.5"
          year="2024"
          duration="2h 18m"
          onPlay={() => {}}
          onAddToList={() => {}}
        />
      }
    >
      {/* Continue Watching */}
      <ContinueWatchingRail />

      {/* Featured */}
      <FeaturedRail />

      {/* Category rails */}
      <CategoryRail title="Action Movies" category="action" />
      <CategoryRail title="Comedy Series" category="comedy" />

      {/* Generic content rail example */}
      <ContentRail title="Trending Now" items={[]} renderCard={() => null} />
    </HomeLayout>
  );
}
