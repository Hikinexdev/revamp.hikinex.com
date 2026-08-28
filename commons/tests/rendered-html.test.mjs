import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders a branded H!KINEX portal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /H!KINEX/i);
  assert.match(html, /Employee|Manager|Admin/i);
  assert.doesNotMatch(html, /Building your site|taking shape/i);
});

test("keeps role navigation, official departments and safe actions", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const department of ["H!KINEX", "Sales", "Recruiting", "Marketing", "IT", "DogFoodDev"]) assert.match(page, new RegExp(department));
  assert.match(page, /role === "Admin"|role === "Manager"/);
  assert.match(page, /navigate\("Apps"\)|setView\("Apps"\)/);
  assert.match(page, /illustrative|prototype/i);
});

test("uses the approved app catalog and immediate Add an App language", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const application of ["Mission Control", "TimeKeeper", "REET", "TalentDirector", "InvSync", "SoftwareTracker", "RegEv · ATS", "DFD TimeKeeper"]) assert.match(page, new RegExp(application));
  assert.match(page, /Add an App/);
  assert.doesNotMatch(page, /Request an App/);
  assert.match(page, /target="_blank"/);
  assert.match(page, /noopener noreferrer/);
});

test("keeps role defaults separate and enforces authenticated roles", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /Manager: \[\.\.\.employeeDefaults, "reet", "talentdirector"\]/);
  assert.match(page, /Admin: \[\.\.\.employeeDefaults, "invsync", "softwaretracker"\]/);
  assert.match(page, /Employee: \[\.\.\.employeeDefaults, \.\.\.sharedOptionalApps\]/);
  assert.match(page, /Manager: \[\.\.\.employeeDefaults, "reet", "talentdirector", \.\.\.sharedOptionalApps\]/);
  assert.match(page, /Admin: \[\.\.\.employeeDefaults, "invsync", "softwaretracker", \.\.\.sharedOptionalApps\]/);
  assert.match(page, /roleCatalogApps\[role\]\.includes\(app\.id\)/);
  assert.match(page, /profiles"\)\.select\("role"\)/);
  assert.match(page, /role === "Manager" && \(view === "Team" \|\| view === "Requests"\)/);
  assert.match(page, /role === "Admin" && view === "Admin"/);
  assert.doesNotMatch(page, /Preview role/);
  assert.doesNotMatch(page, /Public read-only review/);
  assert.doesNotMatch(page, /localStorage/);
});
