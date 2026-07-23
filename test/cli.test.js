import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

test("CLI redacts credentials from JSON and Markdown output", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "agent-stepback-redaction-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const transcriptPath = join(directory, "run-notes.md");
  const githubToken = ["github", "pat", "11AA22BB33CC44DD55EE66FF"].join("_");
  const jwt = ["eyJhbGciOiJIUzI1NiJ9", "abc123", "signature456"].join(".");
  writeFileSync(
    transcriptPath,
    `Confirmed ${githubToken} remains active.\nNext, rotate Authorization: Bearer ${jwt}.\n`
  );

  for (const format of ["json", "markdown"]) {
    const result = spawnSync(
      process.execPath,
      ["bin/agent-stepback.js", transcriptPath, "--format", format],
      { encoding: "utf8" }
    );

    assert.equal(result.status, 0);
    assert.equal(result.stdout.includes(githubToken), false);
    assert.equal(result.stdout.includes(jwt), false);
    assert.match(result.stdout, /\[REDACTED\]/);
  }
});
