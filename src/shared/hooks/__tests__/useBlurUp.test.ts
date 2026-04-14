import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// ── mock useReducedMotion ─────────────────────────────────────────────────────

const mockReducedMotion = vi.fn(() => false);

vi.mock("../useReducedMotion", () => ({
  useReducedMotion: () => mockReducedMotion(),
}));

import { useBlurUp } from "../useBlurUp";

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockReducedMotion.mockReturnValue(false);
});

describe("useBlurUp — initial state", () => {
  it("imgLoaded starts as false", () => {
    const { result } = renderHook(() => useBlurUp());
    expect(result.current.imgLoaded).toBe(false);
  });

  it("imgClass starts with opacity-0 when motion is allowed", () => {
    const { result } = renderHook(() => useBlurUp());
    expect(result.current.imgClass).toContain("opacity-0");
  });

  it("imgClass includes transition class when motion is allowed", () => {
    const { result } = renderHook(() => useBlurUp());
    expect(result.current.imgClass).toContain("transition-opacity");
  });

  it("exposes an onLoad handler in imgProps", () => {
    const { result } = renderHook(() => useBlurUp());
    expect(typeof result.current.imgProps.onLoad).toBe("function");
  });
});

describe("useBlurUp — after onLoad fires", () => {
  it("imgLoaded becomes true", () => {
    const { result } = renderHook(() => useBlurUp());
    act(() => result.current.imgProps.onLoad());
    expect(result.current.imgLoaded).toBe(true);
  });

  it("imgClass switches to opacity-100", () => {
    const { result } = renderHook(() => useBlurUp());
    act(() => result.current.imgProps.onLoad());
    expect(result.current.imgClass).toContain("opacity-100");
    expect(result.current.imgClass).not.toContain("opacity-0");
  });
});

describe("useBlurUp — reduced motion", () => {
  it("imgClass is opacity-100 immediately when reduced motion is active", () => {
    mockReducedMotion.mockReturnValue(true);
    const { result } = renderHook(() => useBlurUp());
    // Even before onLoad, image must be visible
    expect(result.current.imgClass).toBe("opacity-100");
  });

  it("imgClass has no transition class when reduced motion is active", () => {
    mockReducedMotion.mockReturnValue(true);
    const { result } = renderHook(() => useBlurUp());
    expect(result.current.imgClass).not.toContain("transition-opacity");
  });
});
