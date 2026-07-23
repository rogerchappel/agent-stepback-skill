import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { createCheckpoint, formatJson, formatMarkdown, redact } from "../src/index.js";

test("checkpoint extracts facts, decisions, blockers, assumptions, and actions", async () => {
  const transcript = await readFile("fixtures/run-notes.md", "utf8");
  const checkpoint = createCheckpoint(transcript, { source: "fixture", maxItems: 3 });

  assert.match(checkpoint.sections.facts[0], /Confirmed/);
  assert.match(checkpoint.sections.decisions[0], /Decided/);
  assert.match(checkpoint.sections.blockers[0], /failed/);
  assert.match(checkpoint.sections.assumptions[0], /Assumption/);
  assert.match(checkpoint.sections.nextActions[0], /Next/);
  assert.equal(checkpoint.summary.redacted, true);
});

test("redaction hides token-like and email-like values", () => {
  const value = redact("token=ghp_1234567890abcdefghijklmnop email test@example.com");

  assert.equal(value.includes("ghp_123"), false);
  assert.equal(value.includes("test@example.com"), false);
  assert.match(value, /\[REDACTED\]/);
});

test("redaction hides fine-grained GitHub tokens and bearer credentials", () => {
  const githubToken = ["github", "pat", "11AA22BB33CC44DD55EE66FF"].join("_");
  const jwt = ["eyJhbGciOiJIUzI1NiJ9", "abc123", "signature456"].join(".");
  const transcript = [
    `Confirmed ${githubToken} remains active.`,
    `Next, rotate Authorization: Bearer ${jwt}.`
  ].join("\n");

  const redacted = redact(transcript);

  assert.equal(redacted.includes(githubToken), false);
  assert.equal(redacted.includes(jwt), false);
  assert.equal(redacted.match(/\[REDACTED\]/g)?.length, 2);
});

test("redaction leaves credential-related prose and dotted identifiers intact", () => {
  const value = [
    "The github_pat_ prefix identifies fine-grained tokens.",
    "Bearer authentication uses the Authorization header.",
    "Inspect release.version.notes before publishing."
  ].join("\n");

  assert.equal(redact(value), value);
});

test("JSON and Markdown omit credentials from sections and handoff", () => {
  const githubToken = ["github", "pat", "11AA22BB33CC44DD55EE66FF"].join("_");
  const jwt = ["eyJhbGciOiJIUzI1NiJ9", "abc123", "signature456"].join(".");
  const checkpoint = createCheckpoint(
    [
      `Confirmed ${githubToken} remains active.`,
      `Next, rotate Authorization: Bearer ${jwt}.`
    ].join("\n")
  );

  for (const output of [formatJson(checkpoint), formatMarkdown(checkpoint)]) {
    assert.equal(output.includes(githubToken), false);
    assert.equal(output.includes(jwt), false);
    assert.match(output, /\[REDACTED\]/);
  }
  assert.equal(checkpoint.summary.redacted, true);
  assert.equal(checkpoint.handoff.includes(jwt), false);
});

test("formatters include handoff data", async () => {
  const transcript = await readFile("fixtures/run-notes.md", "utf8");
  const checkpoint = createCheckpoint(transcript, { source: "fixture", maxItems: 2 });

  assert.match(formatMarkdown(checkpoint), /Agent Stepback Checkpoint/);
  assert.equal(JSON.parse(formatJson(checkpoint)).source, "fixture");
});
