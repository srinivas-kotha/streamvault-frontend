import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  PosterCardSkeleton,
  LandscapeCardSkeleton,
  ChannelCardSkeleton,
  EpisodeCardSkeleton,
  HeroCardSkeleton,
} from "../CardSkeletons";

// ── helpers ───────────────────────────────────────────────────────────────────

function expectSkeletonA11y(container: HTMLElement) {
  const status = container.querySelector('[role="status"]');
  expect(status, 'should have role="status"').not.toBeNull();
  expect(status?.getAttribute("aria-busy")).toBe("true");
  expect(status?.getAttribute("aria-label")).toBeTruthy();
}

// ── PosterCardSkeleton ────────────────────────────────────────────────────────

describe("PosterCardSkeleton", () => {
  it("renders without crash", () => {
    const { container } = render(<PosterCardSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(<PosterCardSkeleton />);
    expectSkeletonA11y(container);
  });

  it('is queryable via getByRole("status")', () => {
    render(<PosterCardSkeleton />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("applies 2:3 aspect ratio class", () => {
    const { container } = render(<PosterCardSkeleton />);
    const el = container.querySelector('[role="status"]') as HTMLElement;
    expect(el.className).toContain("aspect-[2/3]");
  });

  it("accepts className override", () => {
    const { container } = render(<PosterCardSkeleton className="w-32" />);
    const el = container.querySelector('[role="status"]') as HTMLElement;
    expect(el.className).toContain("w-32");
  });
});

// ── LandscapeCardSkeleton ─────────────────────────────────────────────────────

describe("LandscapeCardSkeleton", () => {
  it("renders without crash", () => {
    const { container } = render(<LandscapeCardSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(<LandscapeCardSkeleton />);
    expectSkeletonA11y(container);
  });

  it("contains an aspect-video thumbnail area", () => {
    const { container } = render(<LandscapeCardSkeleton />);
    const aspectEl = container.querySelector(".aspect-video");
    expect(aspectEl).not.toBeNull();
  });

  it("accepts className override", () => {
    const { container } = render(<LandscapeCardSkeleton className="w-64" />);
    const el = container.querySelector('[role="status"]') as HTMLElement;
    expect(el.className).toContain("w-64");
  });
});

// ── ChannelCardSkeleton ───────────────────────────────────────────────────────

describe("ChannelCardSkeleton", () => {
  it("renders without crash", () => {
    const { container } = render(<ChannelCardSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(<ChannelCardSkeleton />);
    expectSkeletonA11y(container);
  });

  it("applies aspect-video class", () => {
    const { container } = render(<ChannelCardSkeleton />);
    const el = container.querySelector('[role="status"]') as HTMLElement;
    expect(el.className).toContain("aspect-video");
  });
});

// ── EpisodeCardSkeleton ───────────────────────────────────────────────────────

describe("EpisodeCardSkeleton", () => {
  it("renders without crash", () => {
    const { container } = render(<EpisodeCardSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(<EpisodeCardSkeleton />);
    expectSkeletonA11y(container);
  });

  it("contains thumbnail area and text area", () => {
    const { container } = render(<EpisodeCardSkeleton />);
    // thumbnail
    expect(container.querySelector(".aspect-video")).not.toBeNull();
    // text lines — multiple animate-pulse divs
    const lines = container.querySelectorAll(".animate-pulse");
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });
});

// ── HeroCardSkeleton ──────────────────────────────────────────────────────────

describe("HeroCardSkeleton", () => {
  it("renders without crash", () => {
    const { container } = render(<HeroCardSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(<HeroCardSkeleton />);
    expectSkeletonA11y(container);
  });

  it("applies full-width and min-height classes", () => {
    const { container } = render(<HeroCardSkeleton />);
    const el = container.querySelector('[role="status"]') as HTMLElement;
    expect(el.className).toContain("w-full");
    expect(el.className).toContain("min-h-[200px]");
  });

  it("accepts className override", () => {
    const { container } = render(<HeroCardSkeleton className="h-64" />);
    const el = container.querySelector('[role="status"]') as HTMLElement;
    expect(el.className).toContain("h-64");
  });
});
