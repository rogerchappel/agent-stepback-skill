# Redaction

The checkpoint pipeline redacts before classification and output.

## Covered Patterns

- token-like values with common prefixes such as `ghp_`, `gho_`, `sk_`, `xoxb_`, and `xoxp_`
- email addresses
- key-value secrets such as `token=...`, `api_key=...`, `password=...`, and `secret=...`

## Guidance

Prefer false-positive redaction over leaking sensitive transcript content. Add fixtures whenever redaction patterns change.
