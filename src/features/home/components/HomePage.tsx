import { useDeviceContext } from "@/hooks/useDeviceContext";
import { HeroBanner } from "./HeroBanner";
import { ContentRail } from "./ContentRail";
import { ContinueWatchingRail } from "./ContinueWatchingRail";
import { FeaturedRail } from "./FeaturedRail";
import { CategoryRail } from "./CategoryRail";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HomePage() {
  const device = useDeviceContext();
  // Device context available for TV-specific layout adjustments
  void device;

  return (
    <div className="pb-12">
      <h1 className="sr-only">Home</h1>

      {/* Hero banner */}
      <HeroBanner
        title="Featured Content"
        description="Discover the latest and greatest content."
        imageUrl="/hero-placeholder.jpg"
        genres={["Drama", "Action"]}
        rating="8.5"
        onPlay={() => {}}
      />

      {/* Continue Watching */}
      <ContinueWatchingRail />

      {/* Featured */}
      <FeaturedRail />

      {/* Category rails */}
      <CategoryRail title="Action Movies" category="action" />
      <CategoryRail title="Comedy Series" category="comedy" />

      {/* Generic content rail example */}
      <ContentRail title="Trending Now" items={[]} renderCard={() => null} />
    </div>
  );
}
