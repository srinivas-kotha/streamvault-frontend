/**
 * Tests for usePlayerKeyboard onSeek callback — verifies that keyboard seek
 * calls the imperative seek function instead of only updating store state.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlayerStore } from "@lib/stores/playerStore";

vi.mock("@shared/utils/isTVMode", () => ({ isTVMode: false }));

import { usePlayerKeyboard } from "../usePlayerKeyboard";

function fireKey(
  key: string,
  keyCode?: number,
  options: Partial<KeyboardEventInit> = {},
) {
  const event = new KeyboardEvent("keydown", {
    key,
    keyCode: keyCode ?? key.charCodeAt(0),
    bubbles: true,
    ...options,
  });
  window.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  vi.useFakeTimers();
  usePlayerStore.setState({
    status: "playing",
    currentStreamId: "stream-1",
    streamType: "vod",
    streamName: "Test Movie",
    currentTime: 120,
    duration: 3600,
    bufferedEnd: 300,
    volume: 1,
    isMuted: false,
    qualityLevels: [],
    currentQuality: -1,
    subtitleTracks: [],
    currentSubtitle: -1,
    audioTracks: [],
    currentAudio: 0,
    error: null,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePlayerKeyboard — onSeek callback", () => {
  it("calls onSeek with computed time on ArrowRight", () => {
    const onSeek = vi.fn();
    renderHook(() => usePlayerKeyboard({ onSeek }));
    fireKey("ArrowRight");
    expect(onSeek).toHaveBeenCalledWith(130); // 120 + 10
  });

  it("calls onSeek with computed time on ArrowLeft", () => {
    const onSeek = vi.fn();
    renderHook(() => usePlayerKeyboard({ onSeek }));
    fireKey("ArrowLeft");
    expect(onSeek).toHaveBeenCalledWith(110); // 120 - 10
  });

  it("does not update store currentTime when onSeek is provided", () => {
    const onSeek = vi.fn();
    renderHook(() => usePlayerKeyboard({ onSeek }));
    fireKey("ArrowRight");
    // Store should NOT be updated — onSeek handles it imperatively
    expect(usePlayerStore.getState().currentTime).toBe(120);
  });

  it("falls back to store update when onSeek is not provided", () => {
    renderHook(() => usePlayerKeyboard());
    fireKey("ArrowRight");
    expect(usePlayerStore.getState().currentTime).toBe(130);
  });

  it("calls onSeek during hold-to-seek acceleration", () => {
    const onSeek = vi.fn();
    renderHook(() => usePlayerKeyboard({ onSeek }));
    fireKey("ArrowRight");
    expect(onSeek).toHaveBeenCalledWith(130);

    vi.advanceTimersByTime(600);
    fireKey("ArrowRight");
    // At 500ms+ hold, step is 30s: 120 + 30 = 150
    // But currentTime in store is still 120 (onSeek doesn't update store)
    expect(onSeek).toHaveBeenCalledTimes(2);
    expect(onSeek).toHaveBeenLastCalledWith(150);
  });

  it("clamps seek to 0 when onSeek is provided", () => {
    usePlayerStore.setState({ currentTime: 5 });
    const onSeek = vi.fn();
    renderHook(() => usePlayerKeyboard({ onSeek }));
    fireKey("ArrowLeft");
    expect(onSeek).toHaveBeenCalledWith(0);
  });

  it("clamps seek to duration when onSeek is provided", () => {
    usePlayerStore.setState({ currentTime: 3595 });
    const onSeek = vi.fn();
    renderHook(() => usePlayerKeyboard({ onSeek }));
    fireKey("ArrowRight");
    expect(onSeek).toHaveBeenCalledWith(3600);
  });

  it("does not call onSeek for live streams", () => {
    usePlayerStore.setState({ streamType: "live" });
    const onSeek = vi.fn();
    renderHook(() => usePlayerKeyboard({ onSeek }));
    fireKey("ArrowLeft");
    fireKey("ArrowRight");
    expect(onSeek).not.toHaveBeenCalled();
  });
});
