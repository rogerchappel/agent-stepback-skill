# Security Policy

## Supported Versions

`agent-stepback-skill` is pre-1.0. Security fixes target the latest `main` branch until a tagged release line exists.

## Reporting a Vulnerability

Please use GitHub private vulnerability reporting when available. If you open a public issue, keep the report minimal and do not include private run notes, credentials, customer data, or exploit details.

## Scope

The CLI reads one explicit local notes file, redacts secret-looking values, and writes a checkpoint report to stdout. It should not call models, browse, send messages, write repositories, or contact external APIs.
