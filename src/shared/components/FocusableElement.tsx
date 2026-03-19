import { type ReactNode, useCallback } from 'react';
import { useSpatialFocusable } from '@shared/hooks/useSpatialNav';

interface FocusableElementProps {
  /** Unique spatial navigation focus key */
  focusKey: string;
  /** Callback when Enter/OK is pressed while focused */
  onEnterPress?: () => void;
  /** Base CSS classes (always applied) */
  className?: string;
  /** Additional CSS classes applied when the element is focused */
  focusedClassName?: string;
  /** Render prop or static children. When a function, receives the focused state. */
  children: ReactNode | ((focused: boolean) => ReactNode);
  /** Which HTML element to render */
  as?: 'div' | 'button';
  /** Click handler (also wired to onEnterPress if onEnterPress is not provided) */
  onClick?: () => void;
}

/**
 * Generic focusable wrapper that encapsulates the spatial navigation pattern:
 *  - useSpatialFocusable() for D-pad / keyboard focus
 *  - mouse hover -> focusSelf (bridging mouse + keyboard)
 *  - conditional focus ring via showFocusRing
 *  - render-prop pattern so children can react to focus state
 */
export function FocusableElement({
  focusKey,
  onEnterPress,
  className = '',
  focusedClassName = '',
  children,
  as: Component = 'div',
  onClick,
}: FocusableElementProps) {
  const enterHandler = useCallback(() => {
    if (onEnterPress) {
      onEnterPress();
    } else {
      onClick?.();
    }
  }, [onEnterPress, onClick]);

  const { ref, focused, showFocusRing, focusProps } = useSpatialFocusable({
    focusKey,
    onEnterPress: enterHandler,
  });

  const resolvedClassName = [
    className,
    showFocusRing ? focusedClassName : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      ref={ref}
      {...focusProps}
      onClick={onClick}
      className={resolvedClassName || undefined}
    >
      {typeof children === 'function' ? children(focused) : children}
    </Component>
  );
}
