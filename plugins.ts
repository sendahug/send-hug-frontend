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
import { Plugin } from "vite";
import {
  CompilerHost as ngCompilerHost,
  CompilerOptions as ngCompilerOptions,
  createCompilerHost,
  createProgram,
  NgtscProgram,
  readConfiguration,
} from "@angular/compiler-cli";
import { transformAsync } from "@babel/core";
import defaultLinkerPlugin from "@angular/compiler-cli/linker/babel";
import ts from "typescript";
import fs from "fs";
import * as tsconfig from "./tsconfig.json";

interface FileRouteMapping {
  filePath: string;
  route: string;
  fileType: string;
}

/**
 * A plugin that runs the Angular compiler in order to build the app.
 * @returns A Vite plugin for building the app.
 */
export function BuildAngularPlugin(): Plugin {
  let isDev = false;
  let compilerHost: ngCompilerHost;
  let compilerOptions: ngCompilerOptions;
  let currentAngularProgram: NgtscProgram;
  let tsHost: ts.CompilerHost;
  let builder: ts.BuilderProgram;
  let rootFiles: string[];

  async function validateFiles() {
    await currentAngularProgram.compiler.analyzeAsync();
    const diagnostics = currentAngularProgram.compiler.getDiagnostics();
    const res = ts.formatDiagnosticsWithColorAndContext(diagnostics, tsHost);

    if (res) console.warn(res);

    return res;
  }

  return {
    name: "vite-build-angular",
    enforce: "pre",

    /**
     * Vite's config hook. Used to handle the TypeScript config,
     * the Angular compiler config, and to perform a check for whether
     * we're in development or in production.
     */
    config(_config, env) {
      isDev = env.command == "serve";
      const { options, rootNames: parsedFiles } = readConfiguration("./tsconfig.json", {
        noEmit: false,
      });
      compilerOptions = options;
      rootFiles = parsedFiles;
    },

    /**
     * Vite's build start hook. Is used to initialise the TypeScript compiler
     * host and builder, as well as the Angular compiler.
     */
    async buildStart(_options) {
      tsHost = ts.createCompilerHost(tsconfig["compilerOptions"] as any);
      compilerHost = createCompilerHost({
        options: { ...compilerOptions },
        tsHost,
      });
      currentAngularProgram = createProgram({
        rootNames: rootFiles,
        options: compilerOptions,
        host: compilerHost,
      }) as NgtscProgram;
      // Credit to @nitedani for the next four lines
      // https://github.com/nitedani/vite-plugin-angular
      const typeScriptProgram = currentAngularProgram.getTsProgram();
      builder = ts.createAbstractBuilder(typeScriptProgram, tsHost);

      const validateResult = await validateFiles();

      if (validateResult) {
        process.exit(1);
      }
    },

    /**
     * Vite's transform hook. Performs the actual transformation of the
     * Angular code using the Compiler created in the buildStart hook.
     */
    async transform(_code, id, _options) {
      // Credit to @nitedani for most of the transform
      // https://github.com/nitedani/vite-plugin-angular
      const validateResult = await validateFiles();

      if (validateResult && !isDev) {
        process.exit(1);
      }

      const transformers = currentAngularProgram.compiler.prepareEmit();
      let output: string = "";

      if (!/\.[cm]?tsx?$/.test(id)) return;

      const sourceFile = builder.getSourceFile(id);

      if (!sourceFile) return;

      const magicString = new MagicString(sourceFile.text);

      // If the Babel Linker is too slow for you, you can uncomment
      // the three lines below and the line setting the AngularLinkerPlugin
      // to run in build only.
      if (id.includes("main.ts") && isDev) {
        magicString.prepend("import '@angular/compiler';");
      }

      builder.emit(
        sourceFile,
        (_filename, data) => {
          if (data) output = data;
        },
        undefined,
        false,
        transformers.transformers,
      );

      magicString.overwrite(0, magicString.length(), output);

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },

    /**
     * Vite's handleHotUpdate hook.
     */
    // handleHotUpdate(ctx) {
    //   // TODO: We shouldn't have to restart the server on changes to HTML.
    //   // Need to figure out a way to use Vite's module graph methods.
    //   if (ctx.file.endsWith(".html") && ctx.file.includes("src/")) {
    //     ctx.server.restart();
    //   }
    // },
  };
}

/**
 * A plugin for applying the Angular linker plugin (using Babel).
 * See https://angular.dev/tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli.
 */
export function AngularLinkerPlugin(): Plugin {
  let isDev = false;

  return {
    name: "vite-add-angular-linker",
    enforce: "pre",
    // If the Babel Linker is too slow for you, you can uncomment
    // the three lines in the plugin above and the line below.
    apply: "build",

    /**
     * Vite's config hook. Used to perform a check for whether
     * we're in development or in production.
     */
    config(_config, env) {
      isDev = env.command == "serve";
    },

    /**
     * Vite's transform hook. Used to run the Angular Linker Plugin
     * on the relevant node modules.
     */
    async transform(code, id, _options) {
      // Filter out non-node-modules files as they don't need to be linked
      if (!id.includes("node_modules")) return;

      // Add in the angular linker
      const finalResult = await transformAsync(code, {
        filename: id,
        sourceMaps: isDev,
        configFile: false,
        babelrc: false,
        compact: false,
        browserslistConfigFile: false,
        plugins: [defaultLinkerPlugin],
      });

      return {
        code: finalResult?.code ?? "",
        map: finalResult?.map,
      };
    },
  };
}



export function ProvideStandaloneFiles(files: FileRouteMapping[]): Plugin {
  const routes = files.map(mapping => mapping.route);

  return {
    name: "vite-provide-standalone-files",
    writeBundle(options, _outputBundle) {
      console.log(options.dir)
      files.forEach(file => {
        fs.copyFileSync(file.filePath, `${options.dir}${file.route}`);
      })
    },
    // Based on: https://github.com/vite-pwa/vite-plugin-pwa/blob/main/src/plugins/dev.ts
    /**
     * configureServer hook for Vite.
     * If the user chose not to inline the templates in development, serves the template
     * files when requested.
     * @param server - the Vite dev server
     */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && routes.includes(req.url)) {
          const fileData = files.find(f => f.route == req.url);
          if (!fileData) next();

          res.statusCode = 200;
          res.setHeader("Content-Type", fileData!.fileType);
          res.write(fs.readFileSync(fileData!.filePath), "utf-8");
          res.end();
        } else {
          next();
        }
      });
    },
  }
}
