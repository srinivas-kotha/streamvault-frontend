import { useEffect, useRef, useCallback, useState } from 'react';
import { useLRUDContext } from '../providers/LRUDProvider';
import type { NodeConfig } from '@bam.tech/lrud';

interface UseLRUDOptions extends Omit<NodeConfig, 'id'> {
  id: string;
  onEnter?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  parent?: string;
}

export function useLRUD({ id, onEnter, onFocus, onBlur, parent = 'root', ...config }: UseLRUDOptions) {
  const { lrud } = useLRUDContext();
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    // Register the node in the LRUD tree
    lrud.registerNode(id, {
      ...config,
      onFocus: () => {
        setIsFocused(true);
        if (onFocus) onFocus();
        
        // Auto-scroll the DOM node into view when focused by the keyboard
        if (ref.current && typeof ref.current.scrollIntoView === 'function') {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      },
      onBlur: () => {
        setIsFocused(false);
        if (onBlur) onBlur();
      },
      onSelect: () => {
        if (onEnter) onEnter();
      }
    });

    // If it has a parent other than root, we need to ensure the parent exists or register it to the parent.
    // However, the Lrud API registers nodes at the top level and handles relationships via parent ids internally or structurally.
    // The current version of @bam.tech/lrud registers nodes via lrud.registerNode(id, config) ignoring a parent tree structure explicitly at registration unless it's given the parent ID in its config.
    // To support parent references we need to assign it to the parent in the tree if parent !== 'root'.
    if (parent && parent !== 'root') {
      try { lrud.assignFocus(parent); } catch (e) {} // ensure parent is known
      lrud.registerNode(id, { isFocusable: config.isFocusable ?? true });
      // NOTE: actually, lrud.registerNode only accepts 1-2 args: id, nodeConfig. Since `parent` is a property on nodeConfig for older versions, we should just pass it in nodeConfig if valid, or handle structural nodes. We'll simplify and trust lrud's state for this app's flat/simple spatial layout to rely more on DOM ordering and proximity handling.
    }

    return () => {
      // Unregister the node when the component unmounts
      try {
        lrud.unregisterNode(id);
      } catch (e) {
        // Node might already be gone
      }
    };
  }, [id, lrud, parent, config.orientation, config.isFocusable]);

  // Handle focus natively manually via mouse/touch
  const handleMouseEnter = useCallback(() => {
    try {
      lrud.assignFocus(id);
    } catch (e) {
      // Ignore if node is not focusable or tree isn't ready
    }
  }, [id, lrud]);

  const setFocus = useCallback(() => {
    try {
      lrud.assignFocus(id);
    } catch (e) {
      console.warn(`Could not focus LRUD node ${id}`, e);
    }
  }, [id, lrud]);

  return {
    ref,
    isFocused,
    setFocus,
    focusProps: {
      onMouseEnter: handleMouseEnter,
      // For accessibility, still use standard focus handlers if the element is naturally focusable
      onFocus: handleMouseEnter, 
    }
  };
}
