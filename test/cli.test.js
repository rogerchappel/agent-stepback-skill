import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

function runCli(...args) {
  return spawnSync(process.execPath, ["bin/agent-stepback.js", ...args], { encoding: "utf8" });
}

function assertCliError(result, { status, message }) {
  assert.equal(result.status, status);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, `agent-stepback: ${message}\n`);
  assert.doesNotMatch(result.stderr, /\n\s+at |node:internal|Error:/);
}

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

test("CLI reports usage errors without stack traces", () => {
  const cases = [
    { args: ["fixtures/run-notes.md", "--wat"], message: "unknown option: --wat" },
    { args: ["fixtures/run-notes.md", "--format"], message: "--format requires a value" },
    { args: ["fixtures/run-notes.md", "--format", "yaml"], message: "--format must be one of: markdown, json" },
    { args: ["fixtures/run-notes.md", "--max-items"], message: "--max-items requires a value" },
    { args: ["fixtures/run-notes.md", "--max-items", "zero"], message: "--max-items must be a positive integer" },
    { args: ["fixtures/run-notes.md", "extra.md"], message: "unexpected argument: extra.md" },
    { args: [], message: "missing transcript file; run with --help for usage" }
  ];

  for (const { args, message } of cases) {
    assertCliError(runCli(...args), { status: 2, message });
  }
});

test("CLI reports input errors without stack traces", () => {
  assertCliError(runCli("fixtures/does-not-exist.md"), {
    status: 1,
    message: "cannot read fixtures/does-not-exist.md"
  });
  assertCliError(runCli("fixtures"), {
    status: 1,
    message: "cannot read fixtures"
  });
});
