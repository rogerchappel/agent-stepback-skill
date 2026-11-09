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
  const matrixMatch = ci.match(/node-version:\s*\[([^\]]+)\]/);
  assert.ok(matrixMatch, "CI must define a bracketed node-version matrix");
  const matrix = matrixMatch[1]
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

test("package check reports a clear error when the CI runtime matrix is absent", async () => {
  const { spawnSync } = await import("node:child_process");
  const { mkdtemp, cp, readFile, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const root = await mkdtemp(join(tmpdir(), "stepback-matrix-"));
  const repo = process.cwd();
  try {
    await cp(repo, root, { recursive: true, filter: (source) => !source.includes("node_modules") && !source.includes(".git") });
    const workflow = join(root, ".github/workflows/ci.yml");
    await (await import("node:fs/promises")).mkdir(join(root, ".github/workflows"), { recursive: true });
    await cp(join(repo, ".github/workflows/ci.yml"), workflow);
    await writeFile(workflow, (await readFile(workflow, "utf8")).replace(/node-version:\s*\[[^\]]+\]/, "node-version: 22"));
    const result = spawnSync(process.execPath, ["scripts/check-package.js"], { cwd: root, encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /CI workflow must define node-version/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
