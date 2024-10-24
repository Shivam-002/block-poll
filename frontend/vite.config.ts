import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import webpack from "webpack";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },

  optimizeDeps:{
    exclude: ["@metamask/sdk-react-ui"],
  },

  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
