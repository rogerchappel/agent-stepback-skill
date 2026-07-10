# Agent Stepback

Use this skill when an agent run has become long, noisy, blocked, or uncertain and needs a compact recovery checkpoint before continuing.

## Required Inputs

- A local transcript, notes file, or copied run excerpt.
- Optional `--max-items` to cap each checkpoint section.

## Required Tools

- Node.js 20 or newer.
- Local filesystem read access to the transcript file.

## Side-Effect Boundaries

This skill only reads the explicit transcript file and prints a report. It must not call external services, browse, send messages, approve actions, or mutate project files.

## Approval Requirements

No approval is required for local read-only checkpointing. Ask the user before including sensitive transcript excerpts in shared reports.

## Examples

```bash
agent-stepback run-notes.md
agent-stepback transcript.md --format json --max-items 4
```

## Validation Workflow

Run `npm test`, `npm run check`, `npm run build`, and `npm run smoke` after changing classifiers or redaction.
