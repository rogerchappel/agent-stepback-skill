#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createCheckpoint, formatJson, formatMarkdown } from "../src/index.js";

const USAGE_EXIT_CODE = 2;
const RUNTIME_EXIT_CODE = 1;
class CliError extends Error {}
class UsageError extends CliError {}
class InputError extends CliError {}

try {
  await main(process.argv.slice(2));
} catch (error) {
  const status = error instanceof UsageError ? USAGE_EXIT_CODE : RUNTIME_EXIT_CODE;
  const message = error instanceof CliError ? error.message : "unexpected failure";
  process.stderr.write(`agent-stepback: ${message}\n`);
  process.exitCode = status;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.path) throw new UsageError("missing transcript file; run with --help for usage");

  let transcript;
  try {
    transcript = await readFile(args.path, "utf8");
  } catch {
    throw new InputError(`cannot read ${args.path}`);
  }

  const checkpoint = createCheckpoint(transcript, {
    source: args.path,
    maxItems: args.maxItems
  });
  process.stdout.write(args.format === "json" ? formatJson(checkpoint) : formatMarkdown(checkpoint));
}

function parseArgs(argv) {
  const parsed = { path: null, format: "markdown", maxItems: 5, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg === "--format") parsed.format = choice(optionValue(argv, ++index, "--format"), ["markdown", "json"], "--format");
    else if (arg.startsWith("--format=")) parsed.format = choice(inlineValue(arg.slice(9), "--format"), ["markdown", "json"], "--format");
    else if (arg === "--max-items") parsed.maxItems = positiveInt(optionValue(argv, ++index, "--max-items"), "--max-items");
    else if (arg.startsWith("--max-items=")) parsed.maxItems = positiveInt(inlineValue(arg.slice(12), "--max-items"), "--max-items");
    else if (arg.startsWith("-")) throw new UsageError(`unknown option: ${arg}`);
    else if (!parsed.path) parsed.path = arg;
    else throw new UsageError(`unexpected argument: ${arg}`);
  }
  return parsed;
}

function choice(value, choices, flag) {
  if (!choices.includes(value)) throw new UsageError(`${flag} must be one of: ${choices.join(", ")}`);
  return value;
}

function positiveInt(value, flag) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new UsageError(`${flag} must be a positive integer`);
  return parsed;
}

function optionValue(argv, index, flag) {
  const value = argv[index];
  if (value === undefined || value.startsWith("--")) throw new UsageError(`${flag} requires a value`);
  return value;
}

function inlineValue(value, flag) {
  if (value === "") throw new UsageError(`${flag} requires a value`);
  return value;
}

function printHelp() {
  process.stdout.write(`Usage: agent-stepback [options] <transcript.md>

Options:
  --format markdown|json   Output format. Defaults to markdown.
  --max-items N            Max items per section. Defaults to 5.
  -h, --help               Show this help.
`);
}
