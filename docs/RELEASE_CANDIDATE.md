# Release Candidate Notes

## Classification

incubate

## Included

- local-first checkpoint CLI/library
- deterministic Markdown and JSON output
- redaction for token-like, email-like, and key-value secrets
- fixtures, tests, smoke, and validation scripts

## Known Limitations

- Keyword classification can miss implicit facts or blockers.
- The tool does not summarize with an LLM.
- It reads one transcript file at a time.
