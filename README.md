# agent-stepback-skill

Create a compact checkpoint from agent run notes: facts, decisions, blockers, risky assumptions, next safe actions, and a short handoff.

## Quickstart

```bash
npm test
npm run smoke
npm run release:check
node bin/agent-stepback.js fixtures/run-notes.md --format json --max-items 3
```

## Library

```js
import { createCheckpoint } from "agent-stepback-skill";

const checkpoint = createCheckpoint(transcript, { source: "run.md", maxItems: 4 });
```

## Safety Notes

The CLI reads one explicit local file and prints to stdout. It does not call models, browse, send messages, or mutate repositories. Secret-looking strings are redacted before classification and output.

## Limitations

Classification is keyword-based. The checkpoint is a recovery aid, not a complete semantic summary.

## Release Verification

Run the full local release gate before publishing, tagging, or handing the package to another agent:

```bash
npm run release:check
```

The release check runs package metadata and pack-content assertions, the Node test suite, build validation, CLI smoke coverage, and a JSON fixture smoke.
