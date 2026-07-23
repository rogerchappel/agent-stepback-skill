# Security Policy

## Supported Versions

`agent-stepback-skill` is pre-1.0. Security fixes target the latest `main` branch until a tagged release line exists.

## Reporting a Vulnerability

Please use GitHub private vulnerability reporting when available. If you open a public issue, keep the report minimal and do not include private run notes, credentials, customer data, or exploit details.

## Scope

The CLI reads one explicit local notes file, redacts supported secret-looking values before
classification, and writes a checkpoint report to stdout. Supported forms include common
provider-prefixed tokens, GitHub fine-grained PATs, Bearer credentials, compact JWT-style
values, email addresses, and named key-value secrets. See
[the redaction documentation](docs/REDACTION.md) for the exact coverage and limitations.

The CLI should not call models, browse, send messages, write repositories, or contact external
APIs. Redaction is best-effort and is not a substitute for keeping sensitive notes out of
untrusted systems.
