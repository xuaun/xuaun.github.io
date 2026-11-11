import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // react-aria and motion ship ESM that must be bundled into the prerender build.
  ssr: { noExternal: true },
});
