import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "github-pages");
const projects = [
  { source: "portal-concepts", slug: "portal-concepts", title: "Portal Concept Comparison" },
  { source: "navigator", slug: "navigator", title: "H!KINEX Navigator" },
  { source: "commons", slug: "commons", title: "H!KINEX Commons" },
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const project of projects) {
  const projectRoot = path.join(root, project.source);
  const destination = path.join(output, project.slug);
  await mkdir(destination, { recursive: true });
  await cp(path.join(projectRoot, "dist/client"), destination, { recursive: true });

  const workerUrl = pathToFileURL(path.join(projectRoot, "dist/server/index.js"));
  workerUrl.searchParams.set("static-export", Date.now().toString());
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  if (!response.ok) throw new Error(`Failed to render ${project.title}: ${response.status}`);

  let html = await response.text();
  html = html
    .replaceAll('"/_next/', '"./_next/')
    .replaceAll("'/_next/", "'./_next/")
    .replaceAll('href="/favicon.svg"', 'href="./favicon.svg"')
    .replaceAll('href="/og.jpg"', 'href="./og.jpg"');
  await writeFile(path.join(destination, "index.html"), html);
}

const landing = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>H!KINEX Employee Hub Concepts</title>
<style>
:root{font-family:Inter,Arial,sans-serif;color:#0a2e30;background:#f4f9f8}*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:radial-gradient(circle at 80% 0,#04e6ea22,transparent 32%),#f4f9f8}
header{background:#0a2e30;color:white;padding:24px 7%;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:24px;font-weight:800;letter-spacing:.04em}.logo span{color:#04e6ea}.logo small{display:block;font-size:10px;letter-spacing:.18em;color:#b9d4d3}
main{max-width:1120px;margin:auto;padding:72px 28px}.eyebrow{color:#018f93;font-weight:800;letter-spacing:.16em;font-size:12px}
h1{font-size:clamp(38px,7vw,72px);line-height:1;max-width:780px;margin:14px 0 22px}p{color:#526d6e;line-height:1.65}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
a{display:flex;min-height:220px;flex-direction:column;justify-content:space-between;padding:28px;border-radius:22px;background:white;color:#0a2e30;text-decoration:none;border:1px solid #d8e8e7;box-shadow:0 18px 45px #0a2e3010}
a:hover,a:focus-visible{transform:translateY(-4px);border-color:#01ced1;outline:3px solid #01ced133}a b{font-size:24px}a span{color:#018f93;font-weight:800}
@media(max-width:760px){.grid{grid-template-columns:1fr}main{padding-top:48px}}
</style></head><body><header><div class="logo"><span>H!</span>KINEX<small>EMPLOYEE HUB</small></div><span>Interactive concepts</span></header>
<main><div class="eyebrow">PORTAL DESIGN REVIEW</div><h1>Three ways to bring work, company and community together.</h1>
<p>Select a concept to explore its layouts, role views and navigation.</p><div class="grid">
<a href="./portal-concepts/"><b>Portal Concept Comparison</b><p>Seven visual directions with Employee, Manager and Admin experiences.</p><span>Explore concepts →</span></a>
<a href="./navigator/"><b>H!KINEX Navigator</b><p>A practical, work-first portal focused on speed and clarity.</p><span>Open Navigator →</span></a>
<a href="./commons/"><b>H!KINEX Commons</b><p>A community-first portal connecting people, company news and tools.</p><span>Open Commons →</span></a>
</div></main></body></html>`;

await writeFile(path.join(output, "index.html"), landing);
await writeFile(path.join(output, "404.html"), landing);
await writeFile(path.join(output, ".nojekyll"), "");
