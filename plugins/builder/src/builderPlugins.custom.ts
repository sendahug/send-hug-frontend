/*
  MIT License

  Copyright (c) 2020-2024 Send a Hug

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
import { BuilderPlugin } from "./builder.base";
import { createFilter } from "@rollup/pluginutils";
import { execSync } from "node:child_process";

interface IconReplacement {
  originalIcon: string;
  replacementSet: string;
  replacementIcon: string;
}

interface SvgIconReplacement {
  svgId: string;
  replacementIcon: string;
  addImportInFile: string;
}

/**
 * A plugin for replacing the Font Awesome Free Icons with Pro Icons
 * if they're available.
 * @param iconReplacements - A list of icons to replace and the replacements for them.
 *                           Each item consists of:
 *                            - originalIcon - the original (free) icon.
 *                            - replacementSet - which set (sub-package) of Font Awesome
 *                                               icons the new icon is from.
 *                            - replacementIcon - which icon to use as replacement.
 * @param extension - An extension to add to the import of the new icons. The extension
 *                    is added to the end of each import's alias (e.g., "faIcon as faIconPro").
 */
export function ProvideFontAwesomeProPlugin(
  iconReplacements: IconReplacement[],
  extension: string,
): BuilderPlugin {
  let fontAwesomeExists = false;

  return {
    name: "font-awesome-pro-provider",
    apply: ["dev", "production"],

    setup(_env) {
      // Check if the Send A Hug Font Awesome kit is installed.
      try {
        execSync("npm ls @awesome.me/kit-5fefbbc637");
        fontAwesomeExists = true;
      } catch {
        fontAwesomeExists = false;
      }
    },

    /**
     * Used to replace the free icons in the code with the Pro icons (if they're available).
     */
    read(id, code) {
      if (!code || !id.includes("src/") || !id.endsWith(".ts")) return;

      // Check if the Send A Hug Font Awesome kit is installed.
      // If it's available, we're good to use Pro icons.
      if (!fontAwesomeExists) {
        // console.debug("Font Awesome Pro not installed. Proceeding with default icons.");
        return code;
      }

      const magicString = new MagicString(code);
      const setsToImport: { [key: string]: string[] } = {};

      // Find the icons that exist in this bit of the code and update them
      iconReplacements
        .filter((i) => code.includes(i.originalIcon))
        .forEach((icon) => {
          magicString.replace(
            `${icon.originalIcon} = ${icon.originalIcon};`,
            `${icon.originalIcon} = ${icon.replacementIcon}${extension};`,
          );
          if (!setsToImport[icon.replacementSet]) setsToImport[icon.replacementSet] = [];
          setsToImport[icon.replacementSet].push(icon.replacementIcon);
        });

      let importString = "";

      Object.keys(setsToImport).forEach((set) => {
        importString += `import { ${setsToImport[set].map((icon) => `${icon} as ${icon}${extension}`).join(",")} } from "@awesome.me/kit-5fefbbc637/icons/${set}";\n`;
      });

      magicString.replace(`@Component({`, `${importString}\n\n@Component({`);

      // TODO: We should definitely clean out the unused imports, but that requires figuring
      // out how to parse and separate them

      return magicString.toString();
    },
  };
}

/**
 * A plugin for replacing the custom SVG icons we use with
 * Font Awesome Pro custom icons (if they're available).
 * @param svgIconReplacements - A list of SVGs to replace with custom icons. Each
 *                              item consists of:
 *                                - svgId - The ID of the HTML SVG element.
 *                                - replacementIcon - The name of the custom icon to import and use.
 *                                - addImportInFile - The file to replace the SVG in.
 */
export function ProvideCustomIcons(svgIconReplacements: SvgIconReplacement[]): BuilderPlugin {
  let filter: (id: string | undefined) => boolean;
  let fontAwesomeExists = false;

  return {
    name: "svg-icon-replacer",
    apply: ["dev", "production"],

    setup(_env) {
      const filesToCheck = svgIconReplacements.flatMap((svgIcon) => [
        `src/**/${svgIcon.addImportInFile}.ts`,
        `src/**/${svgIcon.addImportInFile}.html`,
      ]);
      filter = createFilter(filesToCheck);

      // Check if the Send A Hug Font Awesome kit is installed.
      try {
        execSync("npm ls @awesome.me/kit-5fefbbc637");
        fontAwesomeExists = true;
      } catch {
        fontAwesomeExists = false;
      }
    },

    read(fileId, code) {
      if (!filter(fileId) || !code) return code;

      // Check if the Send A Hug Font Awesome kit is installed.
      // If it's available, we're good to use Pro icons.
      if (!fontAwesomeExists) {
        // console.debug("Font Awesome Pro not installed. Proceeding with default icons.");
        return code;
      }

      const magicString = new MagicString(code);

      const iconsForFile = svgIconReplacements.filter((icon) =>
        fileId.includes(icon.addImportInFile),
      );

      // For TypeScript files, add the imports for the custom icons
      if (fileId.endsWith(".ts")) {
        const iconImports = iconsForFile.map((icon) => icon.replacementIcon).join(",");
        const importString = `import { ${iconImports} } from "@awesome.me/kit-5fefbbc637/icons/kit/custom";`;
        magicString.replace(`@Component({`, `${importString}\n\n@Component({`);

        const iconAssignment = iconsForFile.map(
          (icon) => `${icon.replacementIcon} = ${icon.replacementIcon};\n`,
        );
        magicString.replace(`constructor(`, `${iconAssignment.join("")}\n\nconstructor(`);

        return magicString.toString();
        // For HTML files, replace the SVG with the fa-icon
      } else if (fileId.endsWith(".html")) {
        magicString.replaceAll(/<svg (.|\n)+?(<\/svg>)/g, (svg) => {
          // Find the ID of the SVG and the details of the icon to replace it with
          const svgIdMatch = svg.match(/id="(.*?)"/);
          if (!svgIdMatch) return svg;
          const faIcon = iconsForFile.find((icon) => icon.svgId == svgIdMatch[1]);
          if (!faIcon) return svg;

          return `<fa-icon [icon]="${faIcon.replacementIcon}" class="navIcon customIcon" aria-hidden="true"></fa-icon>`;
        });

        return magicString.toString();
      } else {
        return code;
      }
    },
  };
}
