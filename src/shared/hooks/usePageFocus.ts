import { useEffect, useMemo } from 'react';
import { lrud } from '@shared/providers/LRUDProvider';

/**
 * Sets spatial navigation focus to a target focusKey when the page mounts.
 * Always assigns focus in standalone/TV mode (no mouse available).
 * In desktop mode, focus is assigned via mouse hover instead.
 */
export function usePageFocus(focusKey: string, delay = 100) {
  const isStandalone = useMemo(() => window.matchMedia('(display-mode: standalone)').matches, []);

  useEffect(() => {
    // In standalone/TV mode, always set initial focus so D-pad works immediately.
    // In browser mode, still set focus — mouse hover will override if needed.
    const timer = setTimeout(() => {
      try { lrud.assignFocus(focusKey); } catch { /* focusKey may not be registered yet */ }
    }, delay);

    return () => clearTimeout(timer);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStandalone]);
}
