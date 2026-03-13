import { createRootRoute, Outlet } from '@tanstack/react-router';
import { MiniPlayer } from '@features/player/components/MiniPlayer';
import { usePlayerStore } from '@lib/store';
import { PlayerPage } from '@features/player/components/PlayerPage';

export const Route = createRootRoute({
  component: RootLayout,
});

function FullscreenPlayer() {
  const currentStreamId = usePlayerStore((s) => s.currentStreamId);
  const currentStreamType = usePlayerStore((s) => s.currentStreamType);
  const currentStreamName = usePlayerStore((s) => s.currentStreamName);
  const startTime = usePlayerStore((s) => s.startTime);
  const isMiniPlayer = usePlayerStore((s) => s.isMiniPlayer);
  const stop = usePlayerStore((s) => s.stop);

  // Only render when playing in fullscreen mode (TV/standalone — not mini-player)
  if (isMiniPlayer || !currentStreamId || !currentStreamType) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button — always visible */}
      <button
        onClick={stop}
        className="absolute top-4 right-4 z-[60] p-2 bg-obsidian/70 rounded-full text-white/80 hover:text-white hover:bg-obsidian/90 transition-colors"
        aria-label="Close player"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <PlayerPage
        streamType={currentStreamType}
        streamId={currentStreamId}
        streamName={currentStreamName || undefined}
        startTime={startTime}
        onClose={stop}
      />
    </div>
  );
}

function RootLayout() {
  return (
    <>
      <div className="grain-overlay" />
      <Outlet />
      <MiniPlayer />
      <FullscreenPlayer />
    </>
  );
}
