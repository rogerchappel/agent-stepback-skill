import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

test("CLI emits JSON checkpoint", () => {
  const result = spawnSync(
    process.execPath,
    ["bin/agent-stepback.js", "fixtures/run-notes.md", "--format", "json", "--max-items", "1"],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.sections.facts.length, 1);
  assert.equal(parsed.summary.redacted, true);
});

test("CLI emits Markdown by default", () => {
  const result = spawnSync(process.execPath, ["bin/agent-stepback.js", "fixtures/quiet-notes.md"], {
    encoding: "utf8"
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /# Agent Stepback Checkpoint/);
});
