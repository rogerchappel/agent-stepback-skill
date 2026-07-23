const REDACTIONS = [
  /\b(?:Authorization\s*:\s*)?Bearer\s+(?=[A-Za-z0-9._~+/=-]*[0-9._~+/=-])[A-Za-z0-9][A-Za-z0-9._~+/=-]{10,}[A-Za-z0-9_~+/=-]/gi,
  /\b(?:github_pat|sk|ghp|gho|xoxb|xoxp)_[A-Za-z0-9_=-]{12,}\b/g,
  /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{2,}\b/g,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  /\b(?:api[_-]?key|token|secret|password)\s*[:=]\s*["']?[^"'\s]+/gi
];

export function redact(text) {
  return REDACTIONS.reduce((value, pattern) => value.replace(pattern, "[REDACTED]"), text);
}
