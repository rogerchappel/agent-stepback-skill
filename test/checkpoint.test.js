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

test("formatters include handoff data", async () => {
  const transcript = await readFile("fixtures/run-notes.md", "utf8");
  const checkpoint = createCheckpoint(transcript, { source: "fixture", maxItems: 2 });

  assert.match(formatMarkdown(checkpoint), /Agent Stepback Checkpoint/);
  assert.equal(JSON.parse(formatJson(checkpoint)).source, "fixture");
});
