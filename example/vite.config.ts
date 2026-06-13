import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  base: "/i-input/",
  plugins: [react()],
  resolve: {
    alias: {
      "i-input": fileURLToPath(
        new URL("../package/src/index.ts", import.meta.url),
      ),
    },
  },
}));
