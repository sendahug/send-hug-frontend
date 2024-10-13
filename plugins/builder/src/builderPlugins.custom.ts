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

interface IconReplacement {
  originalIcon: string;
  replacementSet: string;
  replacementIcon: string;
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
 */
export function ProvideFontAwesomeProPlugin(
  iconReplacements: IconReplacement[],
  extension: string,
): BuilderPlugin {
  return {
    name: "font-awesome-pro-provider",
    apply: ["dev", "production"],

    /**
     * Used to replace the free icons in the code with the Pro icons (if they're available).
     */
    read(_id, code) {
      if (!code) return;

      // Try to load the Send A Hug Font Awesome kit.
      // If it's available, we're good to use Pro icons.
      try {
        import("@awesome.me/kit-5fefbbc637");

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
        // Otherwise, leave it as is
      } catch (error) {
        console.log(error);
        return code;
      }
    },
  };
}
