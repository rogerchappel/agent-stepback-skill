# Product Requirements

## Goal

`agent-stepback-skill` helps an agent pause during a long run and produce a compact recovery checkpoint from notes or transcript text.

## Users

- agents recovering from tool churn
- reviewers checking what happened in a run
- handoff workflows that need a concise continuation note

## MVP Requirements

- Accept one local text or Markdown transcript.
- Extract facts observed, decisions made, blockers, risky assumptions, and next safe actions.
- Redact obvious tokens, secrets, and API keys.
- Emit Markdown by default and JSON on request.
- Support `--max-items` to keep reports short.
- Avoid network access and external account writes.

## Non-Goals

- Summarizing with an LLM.
- Executing recovery actions.
- Reading chat history from external services.

## Success Criteria

- A transcript fixture produces deterministic sections.
- Secret-looking strings are redacted in every output format.
- Another agent can use the JSON report as a handoff seed.
