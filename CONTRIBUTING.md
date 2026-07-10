# Contributing

Keep changes deterministic and local-first.

## Classifier Changes

- Add fixtures for new keywords or section behavior.
- Keep section names stable unless the JSON docs are updated.
- Avoid broad patterns that turn every line into every section.

## Redaction Changes

- Add tests before changing redaction patterns.
- Prefer hiding suspicious values over preserving exact transcript text.

## Before Opening a PR

```bash
npm run validate
```
