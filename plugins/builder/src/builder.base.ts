/*
  MIT License

  Copyright (c) 2020-2024 Shir Bar Lev
  Source: https://github.com/shirblc/vite-angular/blob/main/plugins/ubilder/builder.base.ts

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

import MagicString from "magic-string";
import {
  CompilerHost as ngCompilerHost,
  CompilerOptions as ngCompilerOptions,
  createCompilerHost,
  createProgram,
  NgtscProgram,
  readConfiguration,
} from "@angular/compiler-cli";
import ts from "typescript";
import { readFileSync } from "node:fs";

export type ApplyAt = "read" | "post-transform";
export type Environment = "dev" | "production" | "test";

export interface BuilderPlugin {
  name: string;
  apply: Environment;
  setup?: (env: Environment) => undefined;
  read?: (fileId: string, code: string | undefined) => string | undefined;
  transform?: (fileId: string, code: string | undefined) => string | undefined;
}

export default class AngularBuilder {
  env: Environment = "dev";
  testEnv: "dev" | "production";
  compilerHost: ngCompilerHost | undefined;
  compilerOptions: ngCompilerOptions;
  currentAngularProgram: NgtscProgram | undefined = undefined;
  tsHost: ts.CompilerHost | undefined;
  builder: ts.BuilderProgram | undefined;
  rootFiles: string[];
  tsConfigPath: string;
  pluginMapping: {
    dev: BuilderPlugin[];
    production: BuilderPlugin[];
    test: BuilderPlugin[];
  };

  /**
   * Creates a new AngularBuilder.
   * @param env - The current environment.
   * @param testEnv - Which environment to use as a base for tests. The selected environment's plugins will be copied to the test plugins and run as part of the test build.
   * @param tsConfigPath - the path to the tsconfig.json file.
   * @param plugins - a list of plugins to apply during the build.
   */
  constructor(
    env: Environment,
    testEnv: "dev" | "production",
    tsConfigPath: string,
    plugins: BuilderPlugin[] = [],
  ) {
    const { options, rootNames: parsedFiles } = readConfiguration(tsConfigPath, {
      noEmit: false,
    });
    this.compilerOptions = options;
    this.rootFiles = parsedFiles;
    this.env = env;
    this.testEnv = testEnv;
    this.tsConfigPath = tsConfigPath;
    this.pluginMapping = {
      dev: [],
      production: [],
      test: [],
    };

    plugins.forEach((plugin) => {
      if (plugin.apply == this.env || (this.env == "test" && plugin.apply == this.testEnv)) {
        this.pluginMapping[plugin.apply].push(plugin);
        if (plugin.apply == this.testEnv) this.pluginMapping["test"].push(plugin);
        if (plugin.setup) plugin.setup(env);
      }
    });

    this.setupCompilerHost();
  }

  /**
   * Sets up the TypeScript compiler host and the Angular compiler host.
   */
  setupCompilerHost() {
    const tsConfig = readFileSync(this.tsConfigPath, { encoding: "utf-8" });
    const tsConfigJson = JSON.parse(tsConfig);
    this.tsHost = ts.createCompilerHost(tsConfigJson["compilerOptions"] as any);
    const originalReadFile = this.tsHost.readFile;
    // Override the host's readFile function to edit the file before it goes through
    // the TypeScript compiler.
    this.tsHost.readFile = (name) => {
      let res: string | undefined = originalReadFile.call(this.tsHost, name);

      this.pluginMapping[this.env].forEach((plugin) => {
        let pluginOutput;

        if (plugin.read) pluginOutput = plugin.read(name, res);
        if (pluginOutput) res = pluginOutput;
      });

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
    if (!this.compilerHost) {
      throw new Error(
        "The compiler host must be initialised before the Angular program is set up. Did you forget to call `builder.setupCompilerHost`?",
      );
    }

    if (!this.tsHost) {
      throw new Error(
        "The TypeScript host must be initialised before the Angular program is set up. Did you forget to call `builder.setupCompilerHost`?",
      );
    }

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

    if (!this.tsHost) {
      throw new Error(
        "The TypeScript host must be initialised before the Angular program is set up. Did you forget to call `builder.setupCompilerHost`?",
      );
    }

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

    let sourceFile = this.builder?.getSourceFile(fileId);

    if (!sourceFile) return;

    const magicString = new MagicString(sourceFile.text);

    // Credit to @nitedani for this
    // https://github.com/nitedani/vite-plugin-angular
    this.builder?.emit(
      sourceFile,
      (_filename, data) => {
        if (data) output = data;
      },
      undefined,
      undefined,
      transformers.transformers,
    );

    this.pluginMapping[this.env].forEach((plugin) => {
      if (plugin.transform) {
        const result = plugin.transform(fileId, output);
        if (result) output = result;
      }
    });

    magicString.overwrite(0, magicString.length(), output);

    return magicString;
  }
}
