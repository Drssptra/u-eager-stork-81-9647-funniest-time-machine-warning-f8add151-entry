// Funniest Time Machine Warning Label — make.fun entry.
//
// The entry is one fixed warning label. This program writes that exact
// label, with no trailing newline, to entry.txt inside the output
// directory, and prints the same label followed by one newline to stdout.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LABEL =
  "WARNING: Time travel may cause you to meet yourself. " +
  "Do not lend yourself money. You will not pay it back.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputFile = join(outputDir, "entry.txt");

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, LABEL, "utf8");
process.stdout.write(LABEL + "\n");
