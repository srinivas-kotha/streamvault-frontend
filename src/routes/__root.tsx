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
