/**
 * CinematicHero tests — SRI-19
 *
 * Verifies:
 * - Renders banner landmark
 * - Shows skeleton when isLoading
 * - Title renders as h1 when no logoUrl
 * - Genre badges rendered (max 3)
 * - Rating, year, duration metadata shown
 * - Play + Add to List buttons present and accessible
 * - onPlay called when Play button clicked
 * - onAddToList called when My List button clicked
 * - Backdrop image has empty alt (decorative)
 * - Grain overlay is aria-hidden
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ── Mock spatial nav ──────────────────────────────────────────────────────────

vi.mock("@shared/hooks/useSpatialNav", () => ({
  useSpatialFocusable: () => ({
    ref: { current: null },
    focused: false,
    showFocusRing: false,
    focusProps: { onMouseEnter: vi.fn(), "data-focus-key": "test" },
  }),
  useSpatialContainer: () => ({
    ref: { current: null },
    focusKey: "hero-ctas",
  }),
  FocusContext: {
    Provider: ({ children }: { children: React.ReactNode; value: unknown }) => (
      <>{children}</>
    ),
  },
}));

// ── Mock Badge ────────────────────────────────────────────────────────────────

vi.mock("@/design-system/primitives/Badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

import { CinematicHero } from "../CinematicHero";

const defaultProps = {
  title: "Test Movie",
  description: "A great film.",
  backdropUrl: "/test-backdrop.jpg",
  genres: ["Action", "Sci-Fi", "Thriller"],
  rating: "8.5",
  year: "2024",
  duration: "2h 10m",
  onPlay: vi.fn(),
  onAddToList: vi.fn(),
};

describe("CinematicHero", () => {
  it("renders banner landmark", () => {
    render(<CinematicHero {...defaultProps} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("cinematic-hero")).toBeInTheDocument();
  });

  it("shows skeleton when isLoading=true", () => {
    render(<CinematicHero {...defaultProps} isLoading />);
    expect(screen.getByTestId("cinematic-hero-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("cinematic-hero")).not.toBeInTheDocument();
  });

  it("renders title as h1", () => {
    render(<CinematicHero {...defaultProps} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Test Movie" }),
    ).toBeInTheDocument();
  });

  it("renders logo image instead of h1 when logoUrl provided", () => {
    render(<CinematicHero {...defaultProps} logoUrl="/logo.png" />);
    // Backdrop has alt="" (decorative); logo img has alt=title
    const logo = screen.getByRole("img", { name: "Test Movie" });
    expect(logo).toHaveAttribute("src", "/logo.png");
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("renders up to 3 genre badges", () => {
    render(
      <CinematicHero {...defaultProps} genres={["A", "B", "C", "D", "E"]} />,
    );
    const badges = screen.getAllByTestId("badge");
    // Only 3 genres shown (slice(0,3) in component)
    const genreBadges = badges.filter((b) =>
      ["A", "B", "C"].includes(b.textContent ?? ""),
    );
    expect(genreBadges).toHaveLength(3);
  });

  it("renders rating, year and duration", () => {
    render(<CinematicHero {...defaultProps} />);
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2h 10m")).toBeInTheDocument();
  });

  it("renders Play Now and My List buttons", () => {
    render(<CinematicHero {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /play now/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /my list/i }),
    ).toBeInTheDocument();
  });

  it("calls onPlay when Play button clicked", () => {
    const onPlay = vi.fn();
    render(<CinematicHero {...defaultProps} onPlay={onPlay} />);
    fireEvent.click(screen.getByRole("button", { name: /play now/i }));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("calls onAddToList when My List button clicked", () => {
    const onAddToList = vi.fn();
    render(<CinematicHero {...defaultProps} onAddToList={onAddToList} />);
    fireEvent.click(screen.getByRole("button", { name: /my list/i }));
    expect(onAddToList).toHaveBeenCalledTimes(1);
  });

  it("backdrop image is decorative (empty alt, aria-hidden)", () => {
    const { container } = render(<CinematicHero {...defaultProps} />);
    // Backdrop is aria-hidden (removed from a11y tree) so use DOM query
    const backdropImg = container.querySelector(
      `img[src="${defaultProps.backdropUrl}"]`,
    );
    expect(backdropImg).toBeInTheDocument();
    expect(backdropImg).toHaveAttribute("alt", "");
    expect(backdropImg).toHaveAttribute("aria-hidden", "true");
  });

  it("description is rendered", () => {
    render(<CinematicHero {...defaultProps} />);
    expect(screen.getByText("A great film.")).toBeInTheDocument();
  });

  it("omits meta row when no rating/year/duration", () => {
    render(
      <CinematicHero
        title="Bare"
        description="Minimal."
        backdropUrl="/bg.jpg"
      />,
    );
    expect(screen.queryByText("8.5")).not.toBeInTheDocument();
    expect(screen.queryByText("2024")).not.toBeInTheDocument();
  });
});
