import { defineConfig } from "vite";
import {
  BuildAngularPlugin,
  AngularLinkerPlugin,
  ProvideStandaloneFilesPlugin,
  GlobalStylesPlugin,
} from "./plugins";
import * as path from "path";

const standaloneFiles = [
  { filePath: "src/sw.js", fileType: "text/javascript", route: "/sw.js" },
  { filePath: "src/sitemap.xml", fileType: "application/xml", route: "/sitemap.xml" },
  {
    filePath: "src/manifest.webmanifest",
    fileType: "application/manifest+json",
    route: "/manifest.webmanifest",
  },
];

export default defineConfig({
  plugins: [
    AngularLinkerPlugin(),
    BuildAngularPlugin(),
    ProvideStandaloneFilesPlugin(standaloneFiles),
    GlobalStylesPlugin("src/styles", "styles.less"),
  ],
  server: {
    port: 3000,
    watch: {
      ignored: ["**/coverage/**"],
    },
  },
  optimizeDeps: {
    exclude: ["/__web-dev-server__web-socket.js", "@web/test-runner-core"],
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/styles/styles.less";',
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("polyfill.js") || id.includes("zone.js")) {
            return "polyfills";
          } else if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@admin": path.resolve(__dirname, "./src/app/admin"),
      "@user": path.resolve(__dirname, "./src/app/user"),
      "@tests": path.resolve(__dirname, "./src/tests"),
    },
  },
});