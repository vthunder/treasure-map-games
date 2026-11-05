// Self-check driver (run through tools/check.sh): opens index.html?selftest in headless Chrome,
// waits for tools/selftest.js to finish, and prints the result.
import { openBrowser, fail } from "./browser.mjs";

const levels = process.argv[2] || "all";
const LIMIT_MS = 120000;
const b = await openBrowser();
const t0 = Date.now();
await b.open(`/index.html?selftest=${encodeURIComponent(levels)}`);
const raw = await b.waitFor(`(document.getElementById("selftest-result")||{}).textContent || null`, LIMIT_MS);
if (!raw) {
  const errs = await b.evaluate(`JSON.stringify(window.__errors||[])`);
  fail(`the self-check did not finish within ${LIMIT_MS / 1000}s` + (errs && errs !== "[]" ? " - errors: " + errs : ""));
}
const r = JSON.parse(raw);
for (const l of r.levels) console.log((l.ok ? "  ok   " : "  FAIL ") + `${l.id}: ${l.stops} stops` + (l.error ? " - " + l.error : ""));
for (const e of r.errors) console.log("  error: " + e);
console.log((r.pass ? "PASS" : "FAIL") + ` (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
b.close();
process.exit(r.pass ? 0 : 1);
