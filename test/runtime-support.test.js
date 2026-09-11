import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

async function loadContext() {
  const [pkgText, ci, readme, skill] = await Promise.all([
    readFile("package.json", "utf8"),
    readFile(".github/workflows/ci.yml", "utf8"),
    readFile("README.md", "utf8"),
    readFile("SKILL.md", "utf8"),
  ]);
  const pkg = JSON.parse(pkgText);
  const engines = pkg.engines.node;
  const floor = Number(engines.replace(">=", ""));
  const matrix = ci
    .match(/node-version:\s*\[([^\]]+)\]/)[1]
    .split(",")
    .map((value) => Number(value.trim()));
  return { engines, floor, matrix, readme, skill };
}

test("CI matrix covers Node 26 alongside the maintained LTS lines", async () => {
  const { matrix } = await loadContext();
  assert.deepEqual(matrix, [22, 24, 26]);
});

test("engines floor excludes EOL runtimes and matches the oldest CI-tested major", async () => {
  const { engines, floor, matrix } = await loadContext();
  // Node.js 20 reached end of life on 2026-04-30 (https://endoflife.date/nodejs).
  assert.equal(engines, ">=22");
  assert.ok(
    matrix.every((version) => version >= floor),
    `every CI runtime must satisfy engines ${engines}`,
  );
  assert.equal(Math.min(...matrix), floor);
});

test("README and SKILL state the same runtime support range as CI and engines", async () => {
  const { readme, skill, floor } = await loadContext();
  assert.match(skill, new RegExp(`Node\\.js ${floor} or newer`));
  assert.doesNotMatch(readme, /gate on Node\.js 20/);
  assert.match(readme, /Node\.js 22/);
  assert.match(readme, /Node\.js 26/);
});
