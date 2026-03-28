/**
 * Tests for PlayerShell bridge effects:
 * - Store status → video element play/pause
 * - Store quality/subtitle → HLS imperative calls
 * - Infinite loop prevention via isInternalStatusChange guard
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { usePlayerStore } from "@lib/stores/playerStore";

// ── Mock HLS.js ──────────────────────────────────────────────────────────────

vi.mock("hls.js", () => ({
  default: class MockHls {
    static isSupported = () => true;
    static Events = {
      MEDIA_ATTACHED: "hlsMediaAttached",
      MANIFEST_PARSED: "hlsManifestParsed",
      ERROR: "hlsError",
      LEVEL_SWITCHED: "hlsLevelSwitched",
      SUBTITLE_TRACKS_UPDATED: "hlsSubtitleTracksUpdated",
      BUFFER_APPENDED: "hlsBufferAppended",
    };
    on = vi.fn();
    off = vi.fn();
    loadSource = vi.fn();
    attachMedia = vi.fn();
    destroy = vi.fn();
    stopLoad = vi.fn();
    detachMedia = vi.fn();
    startLoad = vi.fn();
    currentLevel = -1;
    nextLevel = -1;
    subtitleTrack = -1;
    audioTrack = 0;
    levels = [];
    subtitleTracks = [];
    audioTracks = [];
  },
}));

vi.mock("mpegts.js", () => ({
  default: {
    isSupported: () => true,
    createPlayer: () => ({
      attachMediaElement: vi.fn(),
      load: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      destroy: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    }),
    Events: { ERROR: "error", LOADING_COMPLETE: "loadingComplete" },
  },
}));

// ── Mock device detection ────────────────────────────────────────────────────

vi.mock("@shared/hooks/useDeviceContext", () => ({
  useDeviceContext: vi.fn(() => ({
    deviceClass: "desktop" as const,
    isTVMode: false,
    hlsBackBuffer: 60,
    hlsMaxBuffer: 60,
    hlsEnableWorker: true,
  })),
}));

// ── Mock VideoElement with controllable ref handle ───────────────────────────

const mockVideoElement = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  seek: vi.fn(),
  setQuality: vi.fn(),
  setSubtitleTrack: vi.fn(),
  setPlaybackRate: vi.fn(),
  seekToLiveEdge: vi.fn(),
  getVideo: vi.fn(),
  toggleFullscreen: vi.fn(),
  togglePiP: vi.fn().mockResolvedValue(undefined),
};

const mockHTMLVideoElement = {
  paused: true,
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  volume: 1,
  muted: false,
  currentTime: 0,
} as unknown as HTMLVideoElement;

vi.mock("../../components/VideoElement", () => {
  const { forwardRef, useImperativeHandle } = require("react");
  return {
    VideoElement: forwardRef(function MockVideoElement(
      _props: unknown,
      ref: React.Ref<unknown>,
    ) {
      useImperativeHandle(ref, () => mockVideoElement);
      return <video data-testid="video-element" />;
    }),
  };
});

vi.mock("../../components/BufferingOverlay", () => ({
  BufferingOverlay: () => <div data-testid="buffering-overlay" />,
}));

vi.mock("../../components/ErrorRecovery", () => ({
  ErrorRecovery: () => <div data-testid="error-recovery" />,
}));

vi.mock("../../components/controls/DesktopControls", () => ({
  DesktopControls: () => <div data-testid="desktop-controls" />,
}));

vi.mock("../../components/controls/TVControls", () => ({
  TVControls: () => <div data-testid="tv-controls" />,
}));

vi.mock("../../components/controls/MobileControls", () => ({
  MobileControls: () => <div data-testid="mobile-controls" />,
}));

vi.mock("../../hooks/useProgressTracking", () => ({
  useProgressTracking: vi.fn(),
}));

vi.mock("../../components/PlayerOSD", () => ({
  PlayerOSD: () => null,
}));

// ── Import after mocks ──────────────────────────────────────────────────────

import { PlayerShell } from "../../components/PlayerShell";

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  mockVideoElement.getVideo.mockReturnValue(mockHTMLVideoElement);
  (mockHTMLVideoElement as { paused: boolean }).paused = true;
  mockHTMLVideoElement.play = vi.fn().mockResolvedValue(undefined);
  mockHTMLVideoElement.pause = vi.fn();

  usePlayerStore.setState({
    status: "idle",
    currentStreamId: null,
    streamType: null,
    streamName: "",
    startTime: 0,
    seriesContext: null,
    currentTime: 0,
    duration: 0,
    bufferedEnd: 0,
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

// ── Status bridge tests ──────────────────────────────────────────────────────

describe("PlayerShell — status → video bridge", () => {
  it("calls video.play() when store status changes to playing", () => {
    usePlayerStore.setState({
      status: "playing",
      currentStreamId: "stream-1",
      streamType: "vod",
      streamName: "Test",
    });
    render(<PlayerShell />);

    // The bridge effect should have called play() because video.paused is true
    expect(mockHTMLVideoElement.play).toHaveBeenCalled();
  });

  it("calls video.pause() when store status changes to paused", () => {
    // Start playing
    usePlayerStore.setState({
      status: "playing",
      currentStreamId: "stream-1",
      streamType: "vod",
      streamName: "Test",
    });
    (mockHTMLVideoElement as { paused: boolean }).paused = false;

    render(<PlayerShell />);
    vi.clearAllMocks();

    // Transition to paused
    act(() => {
      usePlayerStore.getState().setStatus("paused");
    });

    expect(mockHTMLVideoElement.pause).toHaveBeenCalled();
  });

  it("does not call play() when video is already playing", () => {
    (mockHTMLVideoElement as { paused: boolean }).paused = false;
    usePlayerStore.setState({
      status: "playing",
      currentStreamId: "stream-1",
      streamType: "vod",
      streamName: "Test",
    });
    render(<PlayerShell />);

    expect(mockHTMLVideoElement.play).not.toHaveBeenCalled();
  });

  it("does not call pause() when video is already paused", () => {
    (mockHTMLVideoElement as { paused: boolean }).paused = true;
    usePlayerStore.setState({
      status: "paused",
      currentStreamId: "stream-1",
      streamType: "vod",
      streamName: "Test",
    });
    render(<PlayerShell />);

    expect(mockHTMLVideoElement.pause).not.toHaveBeenCalled();
  });
});

// ── Quality/subtitle bridge tests ────────────────────────────────────────────

describe("PlayerShell — quality/subtitle bridge", () => {
  beforeEach(() => {
    usePlayerStore.setState({
      status: "playing",
      currentStreamId: "stream-1",
      streamType: "vod",
      streamName: "Test",
    });
  });

  it("calls setQuality on playerRef when currentQuality changes", () => {
    render(<PlayerShell />);
    vi.clearAllMocks();

    act(() => {
      usePlayerStore.getState().setCurrentQuality(2);
    });

    expect(mockVideoElement.setQuality).toHaveBeenCalledWith(2);
  });

  it("calls setSubtitleTrack on playerRef when currentSubtitle changes", () => {
    render(<PlayerShell />);
    vi.clearAllMocks();

    act(() => {
      usePlayerStore.getState().setCurrentSubtitle(1);
    });

    expect(mockVideoElement.setSubtitleTrack).toHaveBeenCalledWith(1);
  });
});
