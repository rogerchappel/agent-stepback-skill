const REDACTIONS = [
  /\b(?:sk|ghp|gho|xoxb|xoxp)_[A-Za-z0-9_=-]{12,}\b/g,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  /\b(?:api[_-]?key|token|secret|password)\s*[:=]\s*["']?[^"'\s]+/gi
];

export function redact(text) {
  return REDACTIONS.reduce((value, pattern) => value.replace(pattern, "[REDACTED]"), text);
}
