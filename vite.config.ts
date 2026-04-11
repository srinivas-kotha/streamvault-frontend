import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    ...(process.env.ANALYZE === "true"
      ? [visualizer({ open: true, gzipSize: true, brotliSize: true })]
      : []),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "tests/e2e/**"],
  },
  build: {
    target: ["es2019", "chrome69"],
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Performance budget: <500KB gzipped total, <300KB initial load.
        // vendor-hls and vendor-mpegts are deferred (dynamic import in VideoElement/VideoPlayer)
        // and excluded from the initial load budget.
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-tanstack";
          }
          if (id.includes("node_modules/hls.js")) {
            return "vendor-hls";
          }
          if (id.includes("node_modules/mpegts")) {
            return "vendor-mpegts";
          }
          if (id.includes("node_modules/@noriginmedia")) {
            return "vendor-spatial-nav";
          }
          if (id.includes("node_modules/zustand")) {
            return "vendor-zustand";
          }
        },
      },
    },
  },
} as UserConfig & { test: unknown });
