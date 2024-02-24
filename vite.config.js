import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import makeString from "./src/server/utils/makeString";

const base = ["/", "/media_downloader/"][0];
const proxy = [false, "https://example.com/proxy.php"][0];
const server = ["/", "https://example.com/"][0];

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: "es6",
    rollupOptions: {
      input: ["/index.html", "/classic/index.html"],
    },
  },
  define: {
    BASE: makeString(base),
    PROXY: makeString(proxy),
    SERVER: makeString(server),
  },
});
