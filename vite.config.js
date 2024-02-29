import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import makeString from "./src/server/utils/makeString";
import useExpressInVite from "./src/server/utils/useExpressInVite";
import { vitePlugin as multipageFallback } from "multipage-fallback";

const base = ["/", "/media_downloader/"][0];
const proxy = [false, "https://example.com/proxy.php"][0];
const server = [false, "https://example.com"][0];

// https://vitejs.dev/config/
export default defineConfig({
  base,
  appType: "mpa",
  server: { port: 3001 },
  plugins: [
    useExpressInVite("/src/server/app.js"),
    multipageFallback(),
    react(),
  ],
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
