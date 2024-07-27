/*
  MIT License

  Copyright (c) 2020-2024 Shir Bar Lev

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import MagicString from "magic-string";
import {
  CompilerHost as ngCompilerHost,
  CompilerOptions as ngCompilerOptions,
  createCompilerHost,
  createProgram,
  NgtscProgram,
  readConfiguration,
} from "@angular/compiler-cli";
import ts, { SourceFile } from "typescript";
import { readFileSync } from "node:fs";

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

export default class AngularBuilder {
  isDev = false;
  compilerHost: ngCompilerHost;
  compilerOptions: ngCompilerOptions;
  currentAngularProgram: NgtscProgram | undefined = undefined;
  tsHost: ts.CompilerHost;
  builder: ts.BuilderProgram;
  rootFiles: string[];
  tsConfigPath: string;

  /**
   * Creates a new AngularBuilder.
   * @param isDev - Whether we're in development.
   * @param tsConfigPath - the path to the tsconfig.json file.
   */
  constructor(isDev: boolean, tsConfigPath: string) {
    const { options, rootNames: parsedFiles } = readConfiguration(tsConfigPath, {
      noEmit: false,
    });
    this.compilerOptions = options;
    this.rootFiles = parsedFiles;
    this.isDev = isDev;
    this.tsConfigPath = tsConfigPath;
  }

  /**
   * Sets up the TypeScript compiler host and the Angular compiler host.
   */
  async setupCompilerHost() {
    const tsConfig = readFileSync(this.tsConfigPath, { encoding: "utf-8" });
    const tsConfigJson = JSON.parse(tsConfig);
    this.tsHost = ts.createCompilerHost(tsConfigJson["compilerOptions"] as any);
    const originalReadFile = this.tsHost.readFile;
    // Override the host's readFile function to add an HMR handler
    // to the main.ts file.
    this.tsHost.readFile = (name) => {
      let res: string | undefined = originalReadFile.call(this.tsHost, name);

      if (name.includes("main.ts") && res && this.isDev) {
        // The global app variable allows us to update the DOM
        // and the angular app whenever a file changes
        res = res.replace(/bootstrapApplication\([a-zA-Z]+, [a-zA-Z]+?\)/, (value) => {
          return `${value}.then((app) => {
            globalThis.__app = app;
          })`;
        });
      }

      return res;
    };
    this.compilerHost = createCompilerHost({
      options: { ...this.compilerOptions },
      tsHost: this.tsHost,
    });
  }

  /**
   * Creates the Angular program and the TypeScript builder.
   */
  setupAngularProgram() {
    this.currentAngularProgram = createProgram({
      rootNames: this.rootFiles,
      options: this.compilerOptions,
      host: this.compilerHost,
      oldProgram: this.currentAngularProgram,
    }) as NgtscProgram;

    // Credit to @nitedani for the next two lines
    // https://github.com/nitedani/vite-plugin-angular
    const typeScriptProgram = this.currentAngularProgram.getTsProgram();
    this.builder = ts.createAbstractBuilder(typeScriptProgram, this.tsHost);
  }

  /**
   * Validates the app using the Angular Compiler.
   * @returns the Angular Compiler's analysis result.
   *
   * Credit to nitedani for most of the transform
   * https://github.com/nitedani/vite-plugin-angular
   */
  async validateFiles() {
    if (!this.currentAngularProgram) return;

    await this.currentAngularProgram.compiler.analyzeAsync();
    const diagnostics = this.currentAngularProgram.compiler.getDiagnostics();
    const res = ts.formatDiagnosticsWithColorAndContext(diagnostics, this.tsHost);

    if (res) console.warn(res);

    return res;
  }

  /**
   * Compiles the given file using the Angular compiler.
   * @param fileId the ID of the file to compile.
   * @returns a MagicString with the transform result and a source map.
   */
  buildFile(fileId: string) {
    // Credit to @nitedani for the next four lines
    // https://github.com/nitedani/vite-plugin-angular
    const transformers = this.currentAngularProgram!.compiler.prepareEmit();
    let output: string = "";

    if (!/\.[cm]?tsx?$/.test(fileId)) return;

    let sourceFile = this.builder.getSourceFile(fileId);

    if (!sourceFile) return;

    const magicString = new MagicString(sourceFile.text);

    // If you want to try the Babel Linker in development, comment out the
    // the condition below and the line setting the AngularLinkerPlugin
    // to run in build only.
    // Note: it's REALLY slow.
    if (fileId.includes("main.ts")) {
      if (this.isDev) magicString.prepend("import '@angular/compiler';");
      else magicString.prepend("import('./polyfills.ts');\n");
    }

    // Credit to @nitedani for this
    // https://github.com/nitedani/vite-plugin-angular
    this.builder.emit(
      sourceFile,
      (_filename, data) => {
        if (data) output = data;
      },
      undefined,
      undefined,
      transformers.transformers,
    );

    return this.addHmrFooter(fileId, output, sourceFile, magicString);
  }

  /**
   * Adds the HMR footer to the end of the file (if the file is
   * a component file).
   * @param fileId - the ID of the file to process.
   * @param output - the output of the TypeScript builder.
   * @param sourceFile - the TypeScript SourceFile object for the current file.
   * @param magicString - the current MagicString object for the transform.
   * @returns a MagicString with the transform result and a source map.
   */
  private addHmrFooter(
    fileId: string,
    output: string,
    sourceFile: SourceFile,
    magicString: MagicString,
  ) {
    if (fileId.endsWith("component.ts") && this.isDev) {
      // Fetches the selector and the class name from the code to add to the mapping.
      // This is used to replace components using HMR.
      const componentSelectorMatch = sourceFile.text.match(/selector:( )?("|')(.*)("|'),/);
      const componentNameMatch = sourceFile.text.match(
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

      magicString.overwrite(0, magicString.length(), `${output}${fullFooter}`);
    } else {
      magicString.overwrite(0, magicString.length(), output);
    }

    return magicString;
  }
}
