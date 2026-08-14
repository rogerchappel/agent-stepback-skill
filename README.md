# agent-stepback-skill

Create a compact checkpoint from agent run notes: facts, decisions, blockers, risky assumptions, next safe actions, and a short handoff.

## Quickstart

```bash
npm ci
npm test
npm run smoke
npm run release:check
node bin/agent-stepback.js fixtures/run-notes.md --format json --max-items 3
```

The CLI writes checkpoint output to stdout and diagnostics prefixed with `agent-stepback:` to
stderr. Invalid options, values, or positional arguments exit with status `2`. Missing or
unreadable input and processing failures exit with status `1`. These failures do not print
JavaScript stack traces. Run `agent-stepback --help` for the complete command summary.

## Library

```js
import { createCheckpoint } from "agent-stepback-skill";

const checkpoint = createCheckpoint(transcript, { source: "run.md", maxItems: 4 });
```

`maxItems` defaults to `5` and must be a positive integer. Numeric strings are accepted for
consistency with CLI input; invalid, zero, negative, and fractional values throw a `RangeError`.
The limit applies independently to every checkpoint section.

## Verification

Run the same checks used for release-readiness before publishing or opening a release PR:

```bash
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
npm pack --dry-run
```

CI runs the complete `release:check` gate on Node.js 20, the minimum version declared by the
package, and Node.js 24, the current runtime.

## Safety Notes

The CLI reads one explicit local file and prints to stdout. It does not call models, browse, send messages, or mutate repositories. Secret-looking strings are redacted before classification and output.

## Limitations

Classification is keyword-based. The checkpoint is a recovery aid, not a complete semantic summary.

## Release Verification

Run the full local release gate before publishing, tagging, or handing the package to another agent:

```bash
npm run release:check
```

The release check runs package metadata and engine-floor assertions, pack-content assertions, the Node test suite, build validation, CLI smoke coverage, a JSON fixture smoke, and a package dry-run that verifies the npm tarball includes the support docs a downstream user needs.
