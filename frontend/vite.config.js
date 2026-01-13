import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
 plugins: [react()],
 resolve: {
  alias: {
   "@": path.resolve(__dirname, "./src"),
  },
 },
 css: {
  devSourcemap: true,
  preprocessorOptions: {
   scss: {
    includePaths: ["./src"],
   },
  },
 },
 server: {
  host: "0.0.0.0",
  port: 5173,
  watch: {
   usePolling: true,
   interval: 1000,
  },
  proxy: {
   "/api": {
    target: "http://backend:8080",
    changeOrigin: true,
   },
  },
 },
});
