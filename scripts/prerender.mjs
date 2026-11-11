// Turns the client build into static HTML: one index.html per language,
// so the content is readable before (or without) JavaScript.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const template = await readFile(join(dist, "index.html"), "utf8");
const { renderAll } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);

for (const page of renderAll()) {
  const html = template
    .replace('<html lang="en">', `<html lang="${page.lang}">`)
    .replace("<!--app-head-->", page.head)
    .replace("<!--app-html-->", page.html);
  const file = join(dist, page.path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`prerendered ${page.path} (${(html.length / 1024).toFixed(1)} kB)`);
}

await rm(ssrDir, { recursive: true, force: true });
