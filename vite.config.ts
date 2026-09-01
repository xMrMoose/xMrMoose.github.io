import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User-site GitHub Pages repo (xMrMoose.github.io) deploys at the domain
// root, so the default base "/" is correct — no subpath trick needed here
// (unlike a project-site repo, which would need base: "./").
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
