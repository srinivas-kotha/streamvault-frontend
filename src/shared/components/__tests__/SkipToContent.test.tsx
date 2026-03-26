/**
 * Sprint 6C — Accessibility Tests
 * SkipToContent: skip link behavior
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipToContent } from "../SkipToContent";

describe("SkipToContent", () => {
  it("renders a link element", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
  });

  it("links to #main-content", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("is positioned off-screen by default (negative translate)", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    // Uses -translate-y-[200%] to position off-screen (not sr-only which breaks focus)
    expect(link.className).toContain("-translate-y-");
  });

  it("slides into view on focus (focus:translate-y-0 class)", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link.className).toContain("focus:translate-y-0");
  });

  it("has high z-index", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link.className).toContain("9999");
  });

  it("has descriptive text content", () => {
    render(<SkipToContent />);
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });
});
