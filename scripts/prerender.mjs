// Turns the client build into static HTML: one file per page, so the content
// is readable before (or without) JavaScript. Also writes sitemap.xml and robots.txt.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const template = await readFile(join(dist, "index.html"), "utf8");
const { renderAll, SITE } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
const pages = renderAll();

for (const page of pages) {
  const isFile = page.path.endsWith(".html");
  const htmlTag = page.indexable ? `<html lang="${page.lang}">` : `<html lang="${page.lang}" data-not-found>`;
  const html = template
    .replace('<html lang="en">', htmlTag)
    .replace("<!--app-head-->", page.head)
    .replace("<!--app-html-->", page.html);
  const file = isFile ? join(dist, page.path) : join(dist, page.path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`prerendered ${page.path} (${(html.length / 1024).toFixed(1)} kB)`);
}

const urls = pages.filter((page) => page.indexable).map((page) => `  <url><loc>${SITE}${page.path}</loc></url>`);
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

await rm(ssrDir, { recursive: true, force: true });
