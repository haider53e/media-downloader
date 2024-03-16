import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import useExpressInVite from "./src/server/utils/useExpressInVite";
import { vitePlugin as multipageFallback } from "multipage-fallback";

const base = ["/", "/media_downloader/"][0];
const proxy = [false, "/media_downloader/proxy.php"][0];
const server = ["/", "http://159.223.36.123:3001/"][0];

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
    BASE: JSON.stringify(base),
    PROXY: JSON.stringify(proxy),
    SERVER: JSON.stringify(server),
  },
});
