/**
 * SideNav — collapsible left sidebar navigation (SRI-19)
 *
 * Behavior:
 *   TV:      collapsed (icon-only, 52px) by default.
 *            Left-arrow from content → expands + gains focus.
 *            Right-arrow / Enter → navigates + collapses back.
 *   Desktop: expanded on hover, collapsed otherwise.
 *   Mobile:  hidden; triggered by burger button (not in scope here).
 *
 * Spatial nav:
 *   - "side-nav" container with isFocusBoundary on left/right to prevent
 *     D-pad escaping through the sidebar edges.
 *   - Each nav item is a useSpatialFocusable leaf.
 *   - On focus gained: sidebar auto-expands. On blur: collapses.
 */

import { useState, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/shared/utils/cn";
import {
  useSpatialFocusable,
  useSpatialContainer,
  FocusContext,
} from "@shared/hooks/useSpatialNav";

// ---------------------------------------------------------------------------
// Nav item definitions
// ---------------------------------------------------------------------------

interface NavItem {
  key: string;
  label: string;
  to: string;
  icon: React.ReactNode;
}

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const LiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

const MovieIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
  </svg>
);

const SeriesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const FavoritesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", to: "/", icon: <HomeIcon /> },
  { key: "live", label: "Live TV", to: "/sports", icon: <LiveIcon /> },
  {
    key: "movies",
    label: "Movies",
    to: "/language/english",
    icon: <MovieIcon />,
  },
  {
    key: "series",
    label: "Series",
    to: "/language/hindi",
    icon: <SeriesIcon />,
  },
  { key: "search", label: "Search", to: "/search", icon: <SearchIcon /> },
  {
    key: "favorites",
    label: "Favorites",
    to: "/favorites",
    icon: <FavoritesIcon />,
  },
];

// ---------------------------------------------------------------------------
// NavItem leaf component
// ---------------------------------------------------------------------------

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onNavigate: () => void;
}

function SideNavItem({ item, isActive, isExpanded, onNavigate }: NavItemProps) {
  const { ref, showFocusRing, focusProps } = useSpatialFocusable({
    focusKey: `side-nav-${item.key}`,
    onEnterPress: () => {
      onNavigate();
    },
  });

  return (
    <Link
      ref={ref}
      to={item.to as Parameters<typeof Link>[0]["to"]}
      {...focusProps}
      onClick={onNavigate}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        // Base
        "relative flex items-center gap-3 rounded-lg",
        "transition-[background-color,color,padding,box-shadow] duration-200 ease-out",
        "min-h-[48px] select-none",
        // Collapsed: icon only, centered
        !isExpanded && "justify-center px-0 w-12",
        // Expanded: icon + label with padding
        isExpanded && "px-3 w-full",
        // Active state
        isActive && !showFocusRing && "bg-accent-teal/15 text-accent-teal",
        // Focus ring (TV D-pad)
        showFocusRing &&
          "bg-accent-teal/20 text-accent-teal ring-2 ring-accent-teal ring-offset-1 ring-offset-bg-primary",
        // Default
        !isActive &&
          !showFocusRing &&
          "text-text-secondary hover-capable:hover:text-text-primary hover-capable:hover:bg-surface-raised/40",
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-accent-teal"
        />
      )}

      {/* Icon */}
      <span className="flex-shrink-0">{item.icon}</span>

      {/* Label — only visible when expanded */}
      {isExpanded && (
        <span
          className={cn(
            "text-sm font-medium whitespace-nowrap overflow-hidden",
            "transition-[opacity,max-width] duration-150 ease-out",
          )}
        >
          {item.label}
        </span>
      )}

      {/* Tooltip — shown when collapsed + focused */}
      {!isExpanded && showFocusRing && (
        <span
          aria-hidden
          className={cn(
            "absolute left-full ml-3 px-2 py-1",
            "text-xs font-medium text-text-primary whitespace-nowrap",
            "bg-surface-raised border border-border rounded-md",
            "pointer-events-none z-50",
          )}
        >
          {item.label}
        </span>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// SideNav container
// ---------------------------------------------------------------------------

interface SideNavProps {
  /** Callback — content area should re-layout when sidebar expands/collapses */
  onExpandChange?: (expanded: boolean) => void;
}

export function SideNav({ onExpandChange }: SideNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { ref: containerRef, focusKey: containerFocusKey } =
    useSpatialContainer({
      focusKey: "side-nav",
      saveLastFocusedChild: true,
      // Prevent D-pad from escaping left or right out of the sidebar
      isFocusBoundary: false,
    });

  const expand = useCallback(() => {
    setIsExpanded(true);
    onExpandChange?.(true);
  }, [onExpandChange]);

  const collapse = useCallback(() => {
    setIsExpanded(false);
    onExpandChange?.(false);
  }, [onExpandChange]);

  const handleNavigate = useCallback(() => {
    // Small delay so the link click registers before collapsing
    setTimeout(collapse, 80);
  }, [collapse]);

  // Determine active item
  const getIsActive = (item: NavItem) => {
    if (item.key === "home") return currentPath === "/";
    if (item.key === "live") return currentPath === "/sports";
    if (item.key === "movies")
      return currentPath.startsWith("/language/english");
    if (item.key === "series") return currentPath.startsWith("/language/hindi");
    if (item.key === "search") return currentPath === "/search";
    if (item.key === "favorites") return currentPath === "/favorites";
    return false;
  };

  return (
    <FocusContext.Provider value={containerFocusKey}>
      {/* Sidebar wrapper — TV safe zone: 20px from left edge */}
      <aside
        ref={containerRef}
        aria-label="Main navigation"
        onMouseEnter={expand}
        onMouseLeave={collapse}
        onFocus={expand}
        onBlur={(e) => {
          // Only collapse if focus truly left the sidebar
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            collapse();
          }
        }}
        className={cn(
          // Layout — fixed, full height, TV safe zone
          "fixed top-0 left-0 z-40 h-screen",
          "flex flex-col",
          // Width transition
          "transition-[width] duration-200 ease-out",
          isExpanded ? "w-[220px]" : "w-[52px]",
          // Visual
          "bg-bg-primary/95 border-r border-border-subtle",
          // TV safe zone: 20px left padding (overscan)
          "pl-[20px] pr-2 pt-[20px] pb-[20px]",
        )}
        data-expanded={isExpanded}
        data-testid="side-nav"
      >
        {/* Logo / Wordmark */}
        <div
          className={cn(
            "flex items-center gap-3 mb-8",
            !isExpanded && "justify-center",
            isExpanded && "px-1",
          )}
        >
          {/* Icon mark — always visible */}
          <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-4 h-4"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Wordmark — only when expanded */}
          {isExpanded && (
            <span className="text-base font-bold text-text-primary font-[family-name:var(--font-family-heading)] whitespace-nowrap">
              Stream<span className="text-accent-teal">Vault</span>
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav
          className="flex flex-col gap-1 flex-1"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <SideNavItem
              key={item.key}
              item={item}
              isActive={getIsActive(item)}
              isExpanded={isExpanded}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        {/* Bottom section: expand hint when collapsed */}
        {!isExpanded && (
          <div
            aria-hidden
            className="mt-auto pt-4 flex justify-center text-text-muted"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 opacity-40"
              aria-hidden
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </div>
        )}
      </aside>
    </FocusContext.Provider>
  );
}
