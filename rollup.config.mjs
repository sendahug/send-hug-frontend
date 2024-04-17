import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { updateComponentTemplateUrl, updateEnvironmentVariables } from "./plugins.mjs";

export default (commandLineArgs) => {
  const currentMode = commandLineArgs.mode || "live";

  let buildConfig = {
    input: ["src/main.ts"],
    output: {
      sourcemap: currentMode == "development" ? "inline" : "hidden",
      dir: currentMode == "development" ? "localdev" : "dist",
      entryFileNames: "app.bundle.js",
    },
    plugins: [
      updateEnvironmentVariables(currentMode),
      updateComponentTemplateUrl(),
      typescript({ exclude: ["**/*.spec.ts", "e2e/**/*"] }),
      nodeResolve({
        extensions: [".js", ".ts"],
      }),
      commonjs({
        extensions: [".js", ".ts"],
        transformMixedEsModules: true,
      }),
    ],
  };

  // Only run terser in production, as it's quite a long and expensive
  // process.
  if (currentMode != "development") {
    buildConfig.output.plugins = [terser()];
  }

  return buildConfig;
};
