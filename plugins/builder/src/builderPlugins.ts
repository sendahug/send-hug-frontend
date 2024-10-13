/*
  MIT License

  Copyright (c) 2020-2024 Shir Bar Lev
  Source: https://github.com/shirblc/vite-angular/blob/main/plugins/ubilder/builderPlugins.ts

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import { createFilter } from "@rollup/pluginutils";
import { transformSync } from "@babel/core";
import { BuilderPlugin } from "./builder.base";
import { resolve } from "node:path";

export interface CoverageConfig {
  include: string[];
  exclude: string[];
}

const nameTemplate = "<compName>";
const selectorTemplate = "<compSelector>";
const hmrFooter = `\n\n
import { APP_BOOTSTRAP_LISTENER, createComponent } from "@angular/core";

if (import.meta.hot) {
  if (!globalThis.__componentSelectorMapping) globalThis.__componentSelectorMapping = new Map();
  globalThis.__componentSelectorMapping.set("${nameTemplate}", "${selectorTemplate}");

  import.meta.hot.accept((newModule) => {
    if (!(newModule && globalThis.__app)) return;
    const currentModuleName = Object.keys(newModule)[0];
    const updatedModule = newModule[currentModuleName];
    const currentModuleSelector =
      globalThis.__componentSelectorMapping.get(currentModuleName) ?? "app-root";
    const currentNodes = document.querySelectorAll(currentModuleSelector);

    currentNodes.forEach((node) => {
      const parentElement = node.parentElement;
      const newElement = document.createElement(currentModuleSelector);
      // for(const attr in node.attributes) {
      //   const currentAttr = node.attributes.item(Number(attr));
      //   if (!currentAttr) continue;
      //   newElement.setAttribute(currentAttr.name, currentAttr.value ?? “”);
      // }
      parentElement?.removeChild(node);
      parentElement?.appendChild(newElement);
      const newInstance = createComponent(updatedModule, {
        environmentInjector: globalThis.__app!.injector,
        hostElement: newElement as Element,
      });
      globalThis.__app!.attachView(newInstance.hostView);
      globalThis.__app!.tick();
      globalThis.__app!.components.push(newInstance);
      const listeners = globalThis.__app!.injector.get(APP_BOOTSTRAP_LISTENER, []);
      listeners.forEach((listener) => listener(newInstance));
    });
  });
}
`;

/**
 * Plugin for adding the HMR footer to the end of the file (if the file is
 * a component file) and adding an HMR handler to the main.ts file.
 */
export function hmrPlugin(): BuilderPlugin {
  return {
    name: "hmr-plugin",
    apply: "dev",

    /**
     * Read hook. Adds an HMR handler to the main.ts file.
     */
    read(fileId, code) {
      if (!fileId.includes("main.ts") || !code) return code;

      // The global app variable allows us to update the DOM
      // and the angular app whenever a file changes
      return code.replace(/bootstrapApplication\([a-zA-Z]+, [a-zA-Z]+?\)/, (value) => {
        return `${value}.then((app) => {
          globalThis.__app = app;
        })`;
      });
    },

    /**
     * Transform hook.
     */
    transform(fileId: string, code: string | undefined) {
      if (!code || !fileId.endsWith("component.ts")) return code;

      // Fetches the selector and the class name from the code to add to the mapping.
      // This is used to replace components using HMR.
      const componentSelectorMatch = code.match(/selector:( )?("|')(.*)("|'),/);
      const componentNameMatch = code.match(
        /export class [a-zA-Z]* (extends (.*) )?(implements (.*) )?{/,
      );
      const componentSelectorParts = componentSelectorMatch![0].includes('"')
        ? componentSelectorMatch![0].split('"')
        : componentSelectorMatch![0].split("'");
      const classIndex = componentNameMatch![0].indexOf("class");
      const componentNameParts = componentNameMatch![0].substring(classIndex + 6).split(" ");
      const fullFooter = hmrFooter
        .replace(nameTemplate, componentNameParts[0])
        .replace(selectorTemplate, componentSelectorParts[1]);

      return `${code}${fullFooter}`;
    },
  };
}

/**
 * Plugin for adding instrumenting files in tests (for coverage).
 */
export function instrumentFilesPlugin(config: CoverageConfig): BuilderPlugin {
  let filter: (id: string | undefined) => boolean;

  return {
    name: "instrument-files",
    apply: "test",
    setup(_env) {
      filter = createFilter(config.include, config.exclude);
    },
    read(fileId, code) {
      // Filter out files that don't need to be instrumented
      if (!filter(fileId) || !code) return code;

      const instrumentedRes = transformSync(code, {
        filename: fileId,
        plugins: [
          ["istanbul"],
          ["@babel/plugin-syntax-decorators", { decoratorsBeforeExport: true }],
          ["@babel/plugin-syntax-typescript"],
        ],
        sourceMaps: "inline",
      })?.code;

      return instrumentedRes || undefined;
    },
  };
}

/**
 * A plugin for replacing the SVG URL imports with the raw URLs in tests. The
 * URL import is handled by Vite, and since we don't use Vite in tests, it
 * confuses Babel during intrumentation.
 */
export function processSVGUrlsPlugin(): BuilderPlugin {
  return {
    name: "process-svg-urls",
    apply: "test",
    read(_fileId, code) {
      if (!code) return;

      // Replace any asset imports with the relevant paths.
      const matches = code.matchAll(/import ([a-zA-Z]+) from "(.*)\.svg";/g);
      let result = code;

      [...matches].forEach((element) => {
        result = result.replace(element[0], "");
        result = result.replace(
          `= ${element[1]};`,
          `= "${resolve(element[2].replace("@/", "./src/"))}.svg";`,
        );
      });

      return result;
    },
  };
}

/**
 * Imports the compiler to the code in development. This replaces the
 * angular linker vite plugin in development as it's considerably faster.
 */
export function addCompilerPlugin(): BuilderPlugin {
  return {
    name: "add-compiler",
    apply: "dev",
    transform(fileId, code) {
      if (!fileId.includes("main.ts") || !code) return code;

      return `import '@angular/compiler';\n${code}`;
    },
  };
}

/**
 * Adds an import for the polyfills file to the main.ts file in the
 * production build.
 */
export function addPolyfillsPlugin(): BuilderPlugin {
  return {
    name: "add-polyfills",
    apply: "production",
    transform(fileId, code) {
      if (!fileId.includes("main.ts") || !code) return code;

      return `import('./polyfills.ts');\n${code}`;
    },
  };
}
