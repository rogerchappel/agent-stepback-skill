#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createCheckpoint, formatJson, formatMarkdown } from "../src/index.js";

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.path) {
  printHelp();
  process.exit(args.help ? 0 : 2);
}

const transcript = await readFile(args.path, "utf8");
const checkpoint = createCheckpoint(transcript, {
  source: args.path,
  maxItems: args.maxItems
});

process.stdout.write(args.format === "json" ? formatJson(checkpoint) : formatMarkdown(checkpoint));

function parseArgs(argv) {
  const parsed = { path: null, format: "markdown", maxItems: 5, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg === "--format") parsed.format = choice(argv[++index], ["markdown", "json"], "--format");
    else if (arg.startsWith("--format=")) parsed.format = choice(arg.slice(9), ["markdown", "json"], "--format");
    else if (arg === "--max-items") parsed.maxItems = positiveInt(argv[++index], "--max-items");
    else if (arg.startsWith("--max-items=")) parsed.maxItems = positiveInt(arg.slice(12), "--max-items");
    else if (!parsed.path) parsed.path = arg;
    else throw new Error(`unexpected argument: ${arg}`);
  }
  return parsed;
}

function choice(value, choices, flag) {
  if (!choices.includes(value)) throw new Error(`${flag} must be one of: ${choices.join(", ")}`);
  return value;
}

function positiveInt(value, flag) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${flag} must be a positive integer`);
  return parsed;
}

function printHelp() {
  process.stdout.write(`Usage: agent-stepback [options] <transcript.md>

Options:
  --format markdown|json   Output format. Defaults to markdown.
  --max-items N            Max items per section. Defaults to 5.
  -h, --help               Show this help.
`);
}
