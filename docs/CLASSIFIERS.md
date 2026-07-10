# Classifier Reference

`agent-stepback` uses simple line-level classifiers:

- facts: observed, found, confirmed, verified, result, output, exists, passed, failed
- decisions: decided, chose, selected, will use, approach, strategy
- blockers: blocked, blocker, cannot, failed, error, missing, denied, rejected
- assumptions: assume, assuming, unclear, unknown, maybe, risk, likely
- next actions: next, continue, retry, run, check, inspect, verify, ask

The same line may appear in multiple sections when it contains multiple signals. This keeps evidence visible instead of forcing a lossy single-label choice.
