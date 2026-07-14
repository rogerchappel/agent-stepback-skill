import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const pkg = JSON.parse(await readFile("package.json", "utf8"));
for (const field of ["name", "version", "description", "bin", "exports", "license"]) {
  if (!pkg[field]) throw new Error(`package.json missing ${field}`);
}

for (const path of ["README.md", "SKILL.md", "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "docs/PRD.md", "docs/TASKS.md", "docs/ORCHESTRATION.md"]) {
  await access(path);
}

const pack = spawnSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

if (pack.status !== 0) {
  process.stderr.write(pack.stderr);
  process.exit(pack.status ?? 1);
}

const [{ files }] = JSON.parse(pack.stdout);
const packed = new Set(files.map((file) => file.path));
const required = [
  "bin/agent-stepback.js",
  "src/index.js",
  "src/checkpoint.js",
  "fixtures/run-notes.md",
  "docs/RC_VERIFICATION.md",
  "SKILL.md",
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  "package.json",
];
const missing = required.filter((path) => !packed.has(path));

if (missing.length > 0) {
  throw new Error(`npm pack is missing required files: ${missing.join(", ")}`);
}

console.log("package metadata, docs, and pack contents ok");
