import { SECTIONS } from "./classifiers.js";

export function formatJson(checkpoint) {
  return `${JSON.stringify(checkpoint, null, 2)}\n`;
}

export function formatMarkdown(checkpoint) {
  const lines = ["# Agent Stepback Checkpoint", "", `Source: ${checkpoint.source}`, ""];
  lines.push(
    `Input lines: ${checkpoint.summary.inputLines}; max items: ${checkpoint.summary.maxItems}; redacted: ${checkpoint.summary.redacted ? "yes" : "no"}.`,
    ""
  );
  for (const section of SECTIONS) {
    lines.push(`## ${section.title}`, "");
    const items = checkpoint.sections[section.key];
    if (items.length === 0) lines.push("- None captured.");
    else for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  }
  lines.push("## Handoff", "", checkpoint.handoff, "");
  return lines.join("\n");
}
