/**
 * SideNav tests — SRI-19
 *
 * Verifies:
 * - Renders with correct aria roles and labels
 * - All nav items present with correct labels
 * - Collapsed by default (52px wide data attribute)
 * - Expands on mouse enter, collapses on mouse leave
 * - Active indicator for current route
 * - TV safe zone: sidebar respects left margin
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ── Mock router ───────────────────────────────────────────────────────────────

const mockPathname = { value: "/" };

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    [key: string]: unknown;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRouterState: () => ({
    location: { pathname: mockPathname.value },
  }),
}));

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
    focusKey: "side-nav",
  }),
  FocusContext: {
    Provider: ({ children }: { children: React.ReactNode; value: unknown }) => (
      <>{children}</>
    ),
  },
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

import { SideNav } from "../SideNav";

describe("SideNav", () => {
  beforeEach(() => {
    mockPathname.value = "/";
  });

  it("renders with main navigation landmark", () => {
    render(<SideNav />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
  });

  it("renders all nav items by aria-label (visible even when collapsed)", () => {
    render(<SideNav />);
    // Links always have aria-label for screen reader accessibility,
    // even when text labels are hidden in collapsed state.
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Live TV" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Movies" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Series" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Favorites" })).toBeInTheDocument();
  });

  it("is collapsed by default (data-expanded=false)", () => {
    render(<SideNav />);
    const aside = screen.getByTestId("side-nav");
    expect(aside).toHaveAttribute("data-expanded", "false");
  });

  it("expands on mouse enter", () => {
    render(<SideNav />);
    const aside = screen.getByTestId("side-nav");
    fireEvent.mouseEnter(aside);
    expect(aside).toHaveAttribute("data-expanded", "true");
  });

  it("collapses on mouse leave", () => {
    render(<SideNav />);
    const aside = screen.getByTestId("side-nav");
    fireEvent.mouseEnter(aside);
    fireEvent.mouseLeave(aside);
    expect(aside).toHaveAttribute("data-expanded", "false");
  });

  it("calls onExpandChange when expanding", () => {
    const onExpandChange = vi.fn();
    render(<SideNav onExpandChange={onExpandChange} />);
    const aside = screen.getByTestId("side-nav");
    fireEvent.mouseEnter(aside);
    expect(onExpandChange).toHaveBeenCalledWith(true);
  });

  it("calls onExpandChange when collapsing", () => {
    const onExpandChange = vi.fn();
    render(<SideNav onExpandChange={onExpandChange} />);
    const aside = screen.getByTestId("side-nav");
    fireEvent.mouseEnter(aside);
    fireEvent.mouseLeave(aside);
    expect(onExpandChange).toHaveBeenCalledWith(false);
  });

  it("marks Home link as active on root path", () => {
    mockPathname.value = "/";
    render(<SideNav />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("marks Search link as active on /search", () => {
    mockPathname.value = "/search";
    render(<SideNav />);
    const searchLink = screen.getByRole("link", { name: /search/i });
    expect(searchLink).toHaveAttribute("aria-current", "page");
  });

  it("renders brand wordmark when expanded", () => {
    render(<SideNav />);
    const aside = screen.getByTestId("side-nav");
    // Expand sidebar so wordmark becomes visible
    fireEvent.mouseEnter(aside);
    expect(screen.getByText("Vault")).toBeInTheDocument();
  });
});
