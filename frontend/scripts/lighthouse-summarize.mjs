// Turns Lighthouse JSON reports into a compact, AI-reviewable markdown brief.
// Usage: node scripts/lighthouse-summarize.mjs <url> <reportDir>
import { readFileSync, existsSync } from "node:fs";

const [, , url, dir] = process.argv;
const forms = ["mobile", "desktop"];

const pct = (n) => (n == null ? "—" : Math.round(n * 100));
const emoji = (s) => (s >= 0.9 ? "🟢" : s >= 0.5 ? "🟠" : "🔴");

function load(form) {
  const p = `${dir}/report-${form}.report.json`;
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
}

const out = [];
out.push(`# Lighthouse findings\n`);
out.push(`**URL:** ${url}  `);
out.push(`**Generated:** ${new Date().toISOString()}\n`);

// ---- Score table ----
out.push(`## Scores\n`);
out.push(`| Category | Mobile | Desktop |`);
out.push(`| --- | --- | --- |`);
const cats = [
  ["performance", "Performance"],
  ["accessibility", "Accessibility"],
  ["best-practices", "Best Practices"],
  ["seo", "SEO"],
];
const reports = Object.fromEntries(forms.map((f) => [f, load(f)]));
for (const [key, label] of cats) {
  const cell = (f) => {
    const c = reports[f]?.categories?.[key];
    return c ? `${emoji(c.score)} ${pct(c.score)}` : "—";
  };
  out.push(`| ${label} | ${cell("mobile")} | ${cell("desktop")} |`);
}

// ---- Core Web Vitals (mobile) ----
const m = reports.mobile;
if (m) {
  out.push(`\n## Core metrics (mobile)\n`);
  out.push(`| Metric | Value | Score |`);
  out.push(`| --- | --- | --- |`);
  const metricIds = [
    "first-contentful-paint",
    "largest-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
    "speed-index",
    "interactive",
  ];
  for (const id of metricIds) {
    const a = m.audits[id];
    if (a) out.push(`| ${a.title} | ${a.displayValue ?? "—"} | ${emoji(a.score ?? 0)} ${pct(a.score)} |`);
  }
}

// ---- Failing / sub-threshold audits, grouped, deduped across form factors ----
function failingAudits(report) {
  if (!report) return [];
  const refs = Object.values(report.categories).flatMap((c) =>
    (c.auditRefs ?? []).map((r) => ({ ...r, category: c.title })),
  );
  const seen = new Set();
  const items = [];
  for (const ref of refs) {
    const a = report.audits[ref.id];
    if (!a || a.score === null) continue; // skip informational/manual
    if (a.score >= 0.9) continue; // passing
    if (seen.has(ref.id)) continue;
    seen.add(ref.id);
    // estimated savings (perf opportunities)
    const ms = a.details?.overallSavingsMs;
    const bytes = a.details?.overallSavingsBytes;
    items.push({
      id: ref.id,
      category: ref.category,
      title: a.title,
      score: a.score,
      display: a.displayValue ?? "",
      weight: ref.weight ?? 0,
      savingsMs: ms ?? 0,
      savingsBytes: bytes ?? 0,
      description: (a.description ?? "").split("[Learn")[0].trim(),
      offenders:
        a.details?.items?.slice(0, 5).map((it) =>
          it.url || it.node?.snippet || it.source?.url || JSON.stringify(it).slice(0, 120),
        ) ?? [],
    });
  }
  return items;
}

out.push(`\n## What to fix\n`);
out.push(
  `Audits scoring below 90 on **mobile** (the stricter run), ordered by impact. ` +
    `Each lists the rule, estimated savings, why it matters, and the top offending nodes/URLs.\n`,
);

const fails = failingAudits(m).sort(
  (a, b) => b.savingsMs - a.savingsMs || b.weight - a.weight || a.score - b.score,
);

if (fails.length === 0) {
  out.push(`✅ Nothing below 90 on mobile. Check the desktop HTML report for anything minor.\n`);
} else {
  for (const f of fails) {
    out.push(`### ${emoji(f.score)} ${f.title}  \`(${f.category})\``);
    const bits = [];
    if (f.display) bits.push(`**${f.display}**`);
    if (f.savingsMs) bits.push(`~${Math.round(f.savingsMs)}ms potential savings`);
    if (f.savingsBytes) bits.push(`~${Math.round(f.savingsBytes / 1024)}KB`);
    if (bits.length) out.push(bits.join(" · "));
    if (f.description) out.push(`\n${f.description}`);
    if (f.offenders.length) {
      out.push(`\nTop offenders:`);
      for (const o of f.offenders) out.push(`- \`${String(o).replace(/\n/g, " ").slice(0, 140)}\``);
    }
    out.push("");
  }
}

out.push(`---`);
out.push(`_Full interactive reports: \`${dir}/report-mobile.report.html\`, \`${dir}/report-desktop.report.html\`._`);

process.stdout.write(out.join("\n") + "\n");
