#!/usr/bin/env bash
#
# One-shot Lighthouse runner.
#   ./scripts/lighthouse.sh            # audits http://localhost:<port>/
#   URL_PATH=/feedback ./scripts/lighthouse.sh
#   PORT=4001 ./scripts/lighthouse.sh
#
# Builds the app, serves the production bundle, runs Lighthouse for BOTH mobile
# and desktop (twice each — discards the cold run so the GitHub-release fetch in
# the banner doesn't skew LCP/TBT), then writes:
#   lighthouse-report/findings.md   <- human/AI-readable summary of what to fix
#   lighthouse-report/*.json        <- raw reports
#
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-3100}"
URL_PATH="${URL_PATH:-/}"
URL="http://localhost:${PORT}${URL_PATH}"
OUT="lighthouse-report"
mkdir -p "$OUT"

log() { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }

log "Building production bundle (npm run build)…"
npm run build

log "Starting production server on :${PORT}…"
npx next start -p "$PORT" >"$OUT/server.log" 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT

log "Waiting for server to respond…"
for i in $(seq 1 60); do
  if curl -sf -o /dev/null "$URL"; then echo "  up after ${i}s"; break; fi
  sleep 1
  if [ "$i" -eq 60 ]; then echo "  server never came up — see $OUT/server.log"; exit 1; fi
done

run_lh() {
  local form=$1 preset_args=$2
  # Warm run (thrown away) so the first cold banner fetch doesn't taint scores.
  npx --yes lighthouse "$URL" $preset_args --quiet \
    --chrome-flags="--headless=new --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path="$OUT/_warm-${form}.json" >/dev/null 2>&1 || true
  log "Lighthouse (${form}) — measured run…"
  npx --yes lighthouse "$URL" $preset_args --quiet \
    --chrome-flags="--headless=new --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output=html \
    --output-path="$OUT/report-${form}" >/dev/null 2>&1 || true
}

run_lh mobile ""
run_lh desktop "--preset=desktop"
rm -f "$OUT"/_warm-*.json

log "Distilling findings → $OUT/findings.md"
node scripts/lighthouse-summarize.mjs "$URL" "$OUT" > "$OUT/findings.md"

log "Done."
echo "  Summary : $OUT/findings.md"
echo "  Reports : $OUT/report-mobile.report.html  ·  $OUT/report-desktop.report.html"
