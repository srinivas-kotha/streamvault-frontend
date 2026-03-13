import { usePlayerStore, useUIStore } from '@lib/store';
import { PlayerPage } from './PlayerPage';
import { useLRUD } from '@shared/hooks/useLRUD';

function FocusableCloseButton({ onClick }: { onClick: () => void }) {
  const inputMode = useUIStore((s) => s.inputMode);
  const { ref, isFocused, focusProps } = useLRUD({ id: 'miniplayer-close', parent: 'root', onEnter: onClick });
  const showFocus = isFocused && inputMode === 'keyboard';

  return (
    <button
      ref={ref}
      {...focusProps}
      onClick={onClick}
      className={`absolute top-2 right-2 z-10 p-1 bg-obsidian/80 rounded-full text-text-muted hover:text-text-primary transition-colors ${showFocus ? 'ring-2 ring-teal text-text-primary' : ''}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

export function MiniPlayer() {
  const currentStreamId = usePlayerStore((s) => s.currentStreamId);
  const currentStreamType = usePlayerStore((s) => s.currentStreamType);
  const currentStreamName = usePlayerStore((s) => s.currentStreamName);
  const isMiniPlayer = usePlayerStore((s) => s.isMiniPlayer);
  const stop = usePlayerStore((s) => s.stop);

  if (!isMiniPlayer || !currentStreamId || !currentStreamType) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 z-50 rounded-xl overflow-hidden shadow-2xl border border-border bg-surface">
      <FocusableCloseButton onClick={stop} />
      <PlayerPage
        streamType={currentStreamType}
        streamId={currentStreamId}
        streamName={currentStreamName || undefined}
        onClose={stop}
      />
    </div>
  );
}
