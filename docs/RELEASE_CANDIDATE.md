# Release Candidate Notes

## Classification

incubate

## Included

- local-first checkpoint CLI/library
- deterministic Markdown and JSON output
- redaction for token-like, email-like, and key-value secrets
- fixtures, tests, smoke, and validation scripts

## Package-content acceptance

The release check runs `node scripts/check-package.js`, which uses `npm pack --dry-run --json` to inspect the actual tarball file list. The required set is asserted in `scripts/check-package.js`: the `agent-stepback` CLI (`bin/agent-stepback.js`), public library entry point and implementation (`src/index.js`, `src/checkpoint.js`), runnable fixture (`fixtures/run-notes.md`), release verification notes (`docs/RC_VERIFICATION.md`), and the contributor-facing `SKILL.md`, `README.md`, and `package.json`, along with the included license and project policy/changelog files. The check fails with the names of every missing required artifact.

Reproduce it from the repository root with:

```sh
npm run check
```

To inspect the full dry-run archive manifest independently, run:

```sh
npm pack --dry-run --json
```

## Known Limitations

- Keyword classification can miss implicit facts or blockers.
- The tool does not summarize with an LLM.
- It reads one transcript file at a time.
