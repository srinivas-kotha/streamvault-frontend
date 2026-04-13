/**
 * Page layout template tests — SRI-19
 * Covers: HomeLayout, GridLayout, DetailLayout, PlayerLayout
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeLayout } from "../HomeLayout";
import { GridLayout } from "../GridLayout";
import { DetailLayout } from "../DetailLayout";
import { PlayerLayout } from "../PlayerLayout";

// ── HomeLayout ────────────────────────────────────────────────────────────────

describe("HomeLayout", () => {
  it("renders the home-layout test id", () => {
    render(
      <HomeLayout hero={<div data-testid="hero" />}>
        <p>Content</p>
      </HomeLayout>,
    );
    expect(screen.getByTestId("home-layout")).toBeInTheDocument();
  });

  it("renders the hero section with aria-label", () => {
    render(
      <HomeLayout hero={<div data-testid="hero" />}>
        <p>Content</p>
      </HomeLayout>,
    );
    expect(screen.getByLabelText("Featured content")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("renders children below the hero", () => {
    render(
      <HomeLayout hero={<div />}>
        <p>Rail One</p>
        <p>Rail Two</p>
      </HomeLayout>,
    );
    expect(screen.getByText("Rail One")).toBeInTheDocument();
    expect(screen.getByText("Rail Two")).toBeInTheDocument();
  });
});

// ── GridLayout ────────────────────────────────────────────────────────────────

describe("GridLayout", () => {
  it("renders the grid-layout test id", () => {
    render(<GridLayout title="Movies">{null}</GridLayout>);
    expect(screen.getByTestId("grid-layout")).toBeInTheDocument();
  });

  it("renders the page title as h1", () => {
    render(<GridLayout title="Telugu Movies">{null}</GridLayout>);
    expect(
      screen.getByRole("heading", { level: 1, name: "Telugu Movies" }),
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <GridLayout title="Movies" subtitle="142 titles">
        {null}
      </GridLayout>,
    );
    expect(screen.getByText("142 titles")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(<GridLayout title="Movies">{null}</GridLayout>);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("renders filter bar slot when provided", () => {
    render(
      <GridLayout
        title="Movies"
        filterBar={<div data-testid="filters">Filters</div>}
      >
        {null}
      </GridLayout>,
    );
    expect(screen.getByTestId("filters")).toBeInTheDocument();
  });

  it("omits filter bar when not provided", () => {
    render(<GridLayout title="Movies">{null}</GridLayout>);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders children in the content grid", () => {
    render(
      <GridLayout title="Movies">
        <div data-testid="card-1" />
        <div data-testid="card-2" />
      </GridLayout>,
    );
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
  });
});

// ── DetailLayout ──────────────────────────────────────────────────────────────

describe("DetailLayout", () => {
  it("renders the detail-layout test id", () => {
    render(
      <DetailLayout
        backdropUrl="/backdrop.jpg"
        title="Show Title"
        metadata={<div />}
      />,
    );
    expect(screen.getByTestId("detail-layout")).toBeInTheDocument();
  });

  it("renders backdrop image as decorative (aria-hidden)", () => {
    render(
      <DetailLayout
        backdropUrl="/backdrop.jpg"
        title="Show Title"
        metadata={<div />}
      />,
    );
    const img = document.querySelector("img[aria-hidden]");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/backdrop.jpg");
    expect(img).toHaveAttribute("alt", "");
  });

  it("renders the details section with aria-label containing title", () => {
    render(
      <DetailLayout
        backdropUrl="/backdrop.jpg"
        title="Inception"
        metadata={<div />}
      />,
    );
    expect(screen.getByLabelText("Inception details")).toBeInTheDocument();
  });

  it("renders metadata slot", () => {
    render(
      <DetailLayout
        backdropUrl="/backdrop.jpg"
        title="Film"
        metadata={<div data-testid="metadata-panel">Meta</div>}
      />,
    );
    expect(screen.getByTestId("metadata-panel")).toBeInTheDocument();
  });

  it("renders optional children (related content)", () => {
    render(
      <DetailLayout backdropUrl="/backdrop.jpg" title="Film" metadata={<div />}>
        <div data-testid="related-rail" />
      </DetailLayout>,
    );
    expect(screen.getByTestId("related-rail")).toBeInTheDocument();
  });

  it("omits related content section when no children", () => {
    const { container } = render(
      <DetailLayout
        backdropUrl="/backdrop.jpg"
        title="Film"
        metadata={<div />}
      />,
    );
    // Only the hero section should be present, no extra flex-col div
    const flexDivs = container.querySelectorAll(".flex-col.gap-8");
    expect(flexDivs.length).toBe(0);
  });
});

// ── PlayerLayout ──────────────────────────────────────────────────────────────

describe("PlayerLayout", () => {
  it("renders the player-layout test id", () => {
    render(
      <PlayerLayout
        videoSlot={<video data-testid="video" />}
        title="Inception"
      />,
    );
    expect(screen.getByTestId("player-layout")).toBeInTheDocument();
  });

  it("renders section with aria-label containing the title", () => {
    render(<PlayerLayout videoSlot={<video />} title="Interstellar" />);
    expect(screen.getByLabelText("Playing Interstellar")).toBeInTheDocument();
  });

  it("renders the video slot in the full-bleed area", () => {
    render(
      <PlayerLayout
        videoSlot={<video data-testid="video-player" />}
        title="Film"
      />,
    );
    expect(screen.getByTestId("video-player")).toBeInTheDocument();
  });

  it("renders OSD slot when provided", () => {
    render(
      <PlayerLayout
        videoSlot={<video />}
        osdSlot={<div data-testid="controls">Controls</div>}
        title="Film"
      />,
    );
    expect(screen.getByTestId("controls")).toBeInTheDocument();
    expect(screen.getByLabelText("Playback controls")).toBeInTheDocument();
  });

  it("omits OSD overlay when osdSlot is not provided", () => {
    render(<PlayerLayout videoSlot={<video />} title="Film" />);
    expect(
      screen.queryByLabelText("Playback controls"),
    ).not.toBeInTheDocument();
  });

  it("renders title as h1 in metadata section", () => {
    render(<PlayerLayout videoSlot={<video />} title="The Matrix" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "The Matrix" }),
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <PlayerLayout
        videoSlot={<video />}
        title="Film"
        subtitle="2h 16m · Sci-Fi"
      />,
    );
    expect(screen.getByText("2h 16m · Sci-Fi")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <PlayerLayout
        videoSlot={<video />}
        title="Film"
        description="A computer hacker learns the truth."
      />,
    );
    expect(
      screen.getByText("A computer hacker learns the truth."),
    ).toBeInTheDocument();
  });

  it("renders related content rail children", () => {
    render(
      <PlayerLayout videoSlot={<video />} title="Film">
        <div data-testid="related-rail" />
      </PlayerLayout>,
    );
    expect(screen.getByTestId("related-rail")).toBeInTheDocument();
    expect(screen.getByLabelText("Related content")).toBeInTheDocument();
  });

  it("omits related content section when no children", () => {
    render(<PlayerLayout videoSlot={<video />} title="Film" />);
    expect(screen.queryByLabelText("Related content")).not.toBeInTheDocument();
  });
});
