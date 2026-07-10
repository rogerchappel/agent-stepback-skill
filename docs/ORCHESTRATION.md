# Orchestration

## Agent Flow

1. Pause after a long run, repeated failures, or conflicting evidence.
2. Save recent notes or transcript excerpts to a local file.
3. Run `agent-stepback <file> --format markdown`.
4. Continue only after reading blockers, assumptions, and next safe actions.

## Boundaries

The tool reads one explicit local transcript file and writes only to stdout. It does not call models, browse the web, send messages, or mutate repositories.

## Failure Handling

- Missing files are input errors.
- Empty reports are valid when notes lack classified signal.
- Redaction should prefer hiding suspicious secrets over preserving exact text.
