import { defineConfig } from "vite";
import { BuildAngularPlugin, AngularLinkerPlugin, ProvideStandaloneFiles } from "./plugins";
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
  plugins: [AngularLinkerPlugin(), BuildAngularPlugin(), ProvideStandaloneFiles(standaloneFiles)],
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/styles/styles.less";`,
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
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
    },
  },
});
