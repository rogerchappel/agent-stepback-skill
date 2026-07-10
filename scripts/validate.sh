#!/usr/bin/env bash
set -euo pipefail

npm test
npm run check
npm run build
npm run smoke
node bin/agent-stepback.js fixtures/run-notes.md --format json --max-items 2 >/tmp/agent-stepback-smoke.json
echo "validation ok"
