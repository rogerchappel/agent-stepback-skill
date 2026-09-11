# Changelog

## [Unreleased]

- Require Node.js 22 or newer: retired the EOL Node.js 20 floor, extended the CI `release:check`
  matrix to Node.js 22/24/26, and aligned README, SKILL, and package metadata on one supported
  range with regression tests and a CI-matrix/engine-floor consistency guard.
- Redact GitHub fine-grained PATs, Bearer credentials, and compact JWT-style values before checkpoint output.
- Add release-readiness checks for package metadata, pack contents, and CI verification.
All notable changes to this project will be documented in this file.

## 0.1.0 - Initial release candidate

- Added a local CLI for creating compact stepback checkpoints from run notes.
- Included redaction, keyword classification, and markdown/json output coverage.
- Added fixtures, examples, and release-candidate verification docs for local smoke testing.
