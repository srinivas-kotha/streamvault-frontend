/**
 * AuthenticatedLayout — SRI-19: replaced horizontal GlobalNav tabs with
 * collapsible SideNav sidebar. TopNav replaced by a minimal top bar with
 * just the profile menu; branding lives in the SideNav.
 */
import { useState, useCallback } from "react";
import {
  createLazyFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { SideNav } from "@shared/components/SideNav";
import { useAuthCheck } from "@features/auth/hooks/useAuth";
import { useBackNavigation } from "@shared/hooks/useBackNavigation";
import { useTokenRefresh } from "@features/auth/hooks/useTokenRefresh";
import {
  useSpatialContainer,
  FocusContext,
  useSpatialFocusable,
} from "@shared/hooks/useSpatialNav";
import { useAuthStore } from "@lib/store";
import { useLogout } from "@features/auth/hooks/useAuth";

export const Route = createLazyFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

const SIDEBAR_COLLAPSED_PX = 52;
const SIDEBAR_EXPANDED_PX = 220;

// ---------------------------------------------------------------------------
// Minimal profile button (self-contained, no modal complexity)
// ---------------------------------------------------------------------------

function ProfileButton() {
  const username = useAuthStore((s) => s.username);
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { ref, showFocusRing, focusProps } = useSpatialFocusable({
    focusKey: "profile-btn",
    onEnterPress: () => setOpen((v) => !v),
  });

  return (
    <div className="relative">
      <button
        ref={ref}
        {...focusProps}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg min-h-[44px]
          text-text-secondary hover-capable:hover:text-text-primary
          hover-capable:hover:bg-surface-raised/50
          transition-[background-color,color] duration-150
          ${showFocusRing ? "ring-2 ring-accent-teal/60 text-text-primary" : ""}`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-sm font-bold text-bg-primary">
          {username?.[0]?.toUpperCase() ?? "U"}
        </div>
        <span className="text-sm hidden lg:block">{username}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-44 bg-surface-raised border border-border rounded-lg shadow-xl z-50 py-1"
          onClick={() => setOpen(false)}
        >
          <button
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover-capable:hover:text-text-primary hover-capable:hover:bg-surface-hover transition-colors"
            onClick={() =>
              navigate({
                to: "/settings" as Parameters<typeof navigate>[0]["to"],
              })
            }
          >
            Settings
          </button>
          <div className="my-1 border-t border-border-subtle" />
          <button
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover-capable:hover:text-text-primary hover-capable:hover:bg-surface-hover transition-colors"
            onClick={() => logoutMutation.mutate()}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root layout
// ---------------------------------------------------------------------------

function AuthenticatedLayout() {
  useAuthCheck();
  useBackNavigation();
  useTokenRefresh();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleExpandChange = useCallback((expanded: boolean) => {
    setSidebarExpanded(expanded);
  }, []);

  const { ref: contentRef, focusKey: contentFocusKey } = useSpatialContainer({
    focusKey: "main-content",
    saveLastFocusedChild: true,
  });

  const sidebarWidth = sidebarExpanded
    ? SIDEBAR_EXPANDED_PX
    : SIDEBAR_COLLAPSED_PX;

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Skip-to-content (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-accent-teal focus:text-bg-primary focus:rounded-md focus:font-semibold"
      >
        Skip to content
      </a>

      {/* Collapsible sidebar */}
      <SideNav onExpandChange={handleExpandChange} />

      {/* Main content area — offset by sidebar width */}
      <FocusContext.Provider value={contentFocusKey}>
        <div
          ref={contentRef}
          className="flex-1 min-h-screen overflow-y-auto scrollbar-hide focus:outline-none transition-[margin-left] duration-200 ease-out"
          style={{ marginLeft: sidebarWidth }}
        >
          {/* Slim top bar: profile only, branding is in SideNav */}
          <header className="sticky top-0 z-30 flex items-center justify-end px-6 h-12 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
            <ProfileButton />
          </header>

          {/* Page content */}
          <main id="main-content" tabIndex={-1} className="focus:outline-none">
            <Outlet />
          </main>
        </div>
      </FocusContext.Provider>
    </div>
  );
}
