import type { ReactNode } from "react";

interface DesktopLayoutProps {
  children: ReactNode;
}

/**
 * Desktop layout — passthrough wrapper.
 * The actual layout (TopNav + main) is handled by _authenticated.lazy.tsx.
 * NO CSS transform on wrapper (AC-01).
 */
export function DesktopLayout({ children }: DesktopLayoutProps) {
  return <>{children}</>;
}
