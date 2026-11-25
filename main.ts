// Funniest Time Machine Warning Label — make.fun entry (v2, revised).
//
// This program assembles the warning label from its spoken fragments,
// checks it against the competition gate (1–120 characters, single line,
// not only whitespace), and writes it — with no trailing newline — to
// entry.txt inside the output directory. The same label, followed by one
// newline, is printed to stdout.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// The label, kept as the fragments a sign-painter would lay out one
// line at a time. Joining with single spaces is the only assembly step.
const FRAGMENTS = [
  "WARNING:",
  "If you arrive before you left,",
  "please proceed to Lost and Found.",
  "You are the lost item.",
];

const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 120;

function assembleLabel(fragments: readonly string[]): string {
  return fragments.join(" ");
}

function checkGate(label: string): void {
  const length = [...label].length;
  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(
      `label is ${length} characters, outside the ${GATE_MIN_CHARS}–${GATE_MAX_CHARS} gate`,
    );
  }
  if (label.trim().length === 0) {
    throw new Error("label must not be only whitespace");
  }
  if (label !== label.trim()) {
    throw new Error("label must not start or end with whitespace");
  }
  if (label.includes("\n") || label.includes("\r")) {
    throw new Error("label must be a single line");
  }
}

async function main(): Promise<void> {
  const label = assembleLabel(FRAGMENTS);
  checkGate(label);

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outputFile = join(outputDir, "entry.txt");
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, label, "utf8");

  // Read back what was written and refuse to report success unless the
  // file is byte-for-byte the label that passed the gate.
  const written = await readFile(outputFile, "utf8");
  if (written !== label) {
    throw new Error("entry.txt does not match the label that passed the gate");
  }

  process.stdout.write(label + "\n");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
