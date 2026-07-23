# Redaction

The checkpoint pipeline redacts before classification and output.

## Covered Patterns

- token-like values with common prefixes such as `github_pat_`, `ghp_`, `gho_`, `sk_`, `xoxb_`, and `xoxp_`
- Bearer credentials, including `Authorization: Bearer ...`, when the value is at least 12 characters and contains a digit or token punctuation
- compact JWT-style values with three base64url segments and a JSON-looking `eyJ` header
- email addresses
- key-value secrets such as `token=...`, `api_key=...`, `password=...`, and `secret=...`

Each complete match is replaced with `[REDACTED]` before checkpoint classification. This means
credentials copied into a section or the generated handoff are redacted at the source.

## Limitations

Redaction is best-effort, not a data-loss-prevention boundary. Unknown provider prefixes,
obfuscated or split credentials, encrypted values, and nonstandard JWTs can evade these
patterns. An alphabetic phrase after `Bearer` is left intact to avoid redacting prose such as
“Bearer authentication”; use an explicit key-value form for synthetic examples that do not
resemble a credential.

## Guidance

Prefer false-positive redaction over leaking sensitive transcript content. Add fixtures whenever redaction patterns change.
