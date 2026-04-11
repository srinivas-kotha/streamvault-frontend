import React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "@shared/components/ErrorBoundary";
import { ToastContainer } from "@shared/components/Toast";
import { NetworkBanner } from "@shared/components/NetworkBanner";
import { InputModeProvider } from "@/providers/InputModeProvider";
import { LayoutSelector } from "@/layouts/LayoutSelector";
import { useDeviceContext } from "@/hooks/useDeviceContext";
import { useServiceWorkerUpdate } from "@/hooks/useServiceWorkerUpdate";
import { SkipToContent } from "@shared/components/SkipToContent";
import { RouteAnnouncer } from "@shared/components/RouteAnnouncer";
import { useReducedMotion } from "@shared/hooks/useReducedMotion";
import { useEffect } from "react";

const PlayerShell = React.lazy(() =>
  import("@features/player/components/PlayerShell").then((m) => ({
    default: m.PlayerShell,
  }))
);

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { isTVMode } = useDeviceContext();
  useServiceWorkerUpdate();
  const reducedMotion = useReducedMotion();

  // Apply reduced-motion class to <html> so CSS @media rules and Tailwind
  // `motion-reduce:` utilities work correctly, and page transitions are skipped.
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add("motion-reduced");
    } else {
      root.classList.remove("motion-reduced");
    }
  }, [reducedMotion]);

  return (
    <InputModeProvider>
      {/* Skip-to-content must be the very first focusable element */}
      <SkipToContent />
      {/* Screen reader route change announcements */}
      <RouteAnnouncer />
      {!isTVMode && <div className="grain-overlay" />}
      <NetworkBanner />
      <ErrorBoundary>
        <LayoutSelector>
          <Outlet />
        </LayoutSelector>
      </ErrorBoundary>
      {/* PlayerShell OUTSIDE LayoutSelector — AC-01: no CSS transform ancestors */}
      <React.Suspense fallback={null}>
        <PlayerShell />
      </React.Suspense>
      <ToastContainer />
    </InputModeProvider>
  );
}
