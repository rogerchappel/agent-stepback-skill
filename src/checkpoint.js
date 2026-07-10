import { SECTIONS } from "./classifiers.js";
import { redact } from "./redact.js";

export function createCheckpoint(transcript, options = {}) {
  const maxItems = Number(options.maxItems ?? 5);
  const source = options.source ?? "inline";
  const lines = redact(transcript)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);

  const checkpoint = {
    source,
    summary: {
      inputLines: lines.length,
      maxItems,
      redacted: transcript !== redact(transcript)
    },
    sections: Object.fromEntries(SECTIONS.map((section) => [section.key, []])),
    handoff: ""
  };

  for (const line of lines) {
    for (const section of SECTIONS) {
      if (checkpoint.sections[section.key].length >= maxItems) continue;
      if (section.pattern.test(line)) checkpoint.sections[section.key].push(line);
    }
  }

  checkpoint.handoff = buildHandoff(checkpoint);
  return checkpoint;
}

function buildHandoff(checkpoint) {
  const fact = checkpoint.sections.facts[0] ?? "No concrete facts captured.";
  const blocker = checkpoint.sections.blockers[0] ?? "No blocker captured.";
  const action = checkpoint.sections.nextActions[0] ?? "Inspect the transcript and choose the next safe action.";
  return `${fact} ${blocker} ${action}`;
}
