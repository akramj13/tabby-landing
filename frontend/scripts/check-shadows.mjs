#!/usr/bin/env node
// Guard: every tabby line-shadow must use a token (--shadow-tabby* / shadow-tabby*).
// Forbids re-introducing the literal `Npx 0 var(--line)` or inline `boxShadow` in TSX.
// Run via `npm run lint:shadows`.

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

// Files allowed to render `border-2 border-line` + `shadow-tabby-*` inline.
// Every other file must use <IconTile> / <TabbyPanel> / .tabby-* CSS shells.
const ALLOW_FILES = new Set([
  "app/globals.css",
  "scripts/check-shadows.mjs",
  // Primitives that DEFINE the tile/panel pattern.
  "app/components/ui/icon-tile.tsx",
  "app/components/ui/tabby-panel.tsx",
  // <input> can't be a span/div, so it borrows the utility directly.
  "app/components/ui/mailing-list-input.tsx",
  // Framer-motion `m.div` elements that need motion props + border/shadow.
  // The IconTile/TabbyPanel `as` prop doesn't compose with motion components,
  // so this keeps inline classes referencing the shadow tokens.
  "app/components/sections/how-it-works-section.tsx",
]);

const INLINE_SHELL = /border-2 border-line[^"'`]*shadow-tabby(-[\w]+)?\b/;

const files = execSync(
  "git ls-files 'app/**/*.tsx' 'app/**/*.ts' 'app/**/*.css'",
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

const PATTERNS = [
  { re: /shadow-\[0_[0-9.]+px_0_var\(--line\)\]/, msg: "arbitrary-value tabby shadow — use `shadow-tabby[-size]`" },
  { re: /shadow-\[0_[0-9.]+px_0_rgb\(/, msg: "arbitrary colored shadow — promote the color to a --shadow-tile-* token in globals.css" },
  { re: /boxShadow\s*:\s*["'`][^"'`]*var\(--line\)/, msg: "inline boxShadow with --line — use `className=\"shadow-tabby[-size]\"`" },
  { re: /[0-9.]+px\s+0\s+var\(--line\)/, msg: "raw `Npx 0 var(--line)` literal — define/use a --shadow-tabby* token" },
  { re: INLINE_SHELL, msg: "hand-rolled border+shadow tile — use <IconTile> or <TabbyPanel>" },
];

let failed = 0;
for (const file of files) {
  if (ALLOW_FILES.has(file)) continue;
  const text = readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    for (const { re, msg } of PATTERNS) {
      if (re.test(line)) {
        console.error(`${file}:${i + 1}  ${msg}\n    ${line.trim()}`);
        failed++;
      }
    }
  });
}

if (failed) {
  console.error(`\n${failed} shadow inconsistencies. See app/globals.css for the token scale.`);
  process.exit(1);
}
console.log("shadows ok");
