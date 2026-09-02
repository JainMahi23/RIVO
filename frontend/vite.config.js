import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// RIVO frontend build config.
// Proxy is set up so the frontend can call the backend at /api during dev
// without hard-coding a host (keeps env-specific URLs out of source).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
