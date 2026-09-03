import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "github-pages");
const projectRoot = path.join(root, "commons");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(projectRoot, "dist/client"), output, { recursive: true });

const workerUrl = pathToFileURL(path.join(projectRoot, "dist/server/index.js"));
workerUrl.searchParams.set("static-export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);
if (!response.ok) throw new Error(`Failed to render H!KINEX Commons: ${response.status}`);

let html = await response.text();
html = html
  .replaceAll('"/_next/', '"./_next/')
  .replaceAll("'/_next/", "'./_next/")
  .replaceAll('href="/favicon.svg"', 'href="./favicon.svg"')
  .replaceAll('href="/og.jpg"', 'href="./og.jpg"');

const notFound = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0;url=/revamp.hikinex.com/">
<title>Opening H!KINEX Commons</title></head><body>
<p>Opening <a href="/revamp.hikinex.com/">H!KINEX Commons</a>…</p>
</body></html>`;

await writeFile(path.join(output, "index.html"), html);
await writeFile(path.join(output, "404.html"), notFound);
await writeFile(path.join(output, ".nojekyll"), "");
