/*
  Sitemap generator.
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

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

import { resolve } from "node:path";
import { writeFileSync } from "node:fs";

const routesFiles = ["./src/app/app.routes.ts"];
const baseUrl = "http://localhost:3000";
const outputFileName = "src/sitemap.xml";

/**
 * Reads the list of links from the provided routes files
 * and formats them into absolute URLs using the baseUrl defined above.
 */
async function readLinks() {
  console.log("Looking for routes in Angular routes paths.");

  const urls: string[] = [];

  // Importing the compiler to get around an Angular Linker error
  // due to the fact the routes file imports @angular/router.
  await import("@angular/compiler");

  for (let i in routesFiles) {
    const { routes } = await import(resolve(routesFiles[i]));
    routes.forEach((route) => {
      if (route.children) {
        const basePath = route.path;
        route.children.forEach((child) => {
          if (child.path == "") {
            urls.push(`/${basePath}`);
            // Include only the paths that don't include a parameter
          } else if (!child.path.includes(":")) {
            urls.push(`/${basePath}/${child.path}`);
          }
        });
      } else {
        // Don't include wildcard routes
        if (!route.path.includes("*")) {
          urls.push(`/${route.path}`);
        }
      }
    });
  }

  console.log(`Found URLs ${urls}`);

  return urls;
}

/**
 * Compiles the list of URLs obtained above into a sitemap
 * according to the sitemap v0.9 schema. The result is then written out
 * to the given file.
 */
function writeSitemap(urls: Array<string>) {
  console.log(`Writing out the sitemap to file ${outputFileName}.`);

  const now = new Date().toDateString();
  const mappedUrls = urls.map(
    (u) => `<url>
        <loc>${baseUrl}${u}</loc>
        <lastmod>${now}</lastmod>
      </url>`,
  );

  const finalMap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${mappedUrls.join("\n")}
    </urlset>`;

  writeFileSync(outputFileName, finalMap);
}

/**
 * Runs path reading and map generation.
 */
export default async function generateMap() {
  const urls = await readLinks();
  writeSitemap(urls);
}

generateMap();
