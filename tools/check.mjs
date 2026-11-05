// Self-check driver (run through tools/check.sh). Starts a temporary dev server and a
// headless Chrome, opens index.html?selftest, waits for tools/selftest.js to finish, and
// prints the result. Uses only Node built-ins (Node 22+: fetch and WebSocket).
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const levels = process.argv[2] || "all";
const LIMIT_MS = 120000;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const freePort = () => new Promise(res => { const s = createServer(); s.listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => res(p)); }); });

const port = await freePort();
const prof = mkdtempSync(join(tmpdir(), "wtm-check-"));
const procs = [];
const cleanup = () => { for (const p of procs) { try { p.kill("SIGKILL"); } catch {} } try { rmSync(prof, { recursive: true, force: true }); } catch {} };
process.on("exit", cleanup);
const fail = msg => { console.log("FAIL: " + msg); process.exit(1); };

if (!existsSync(CHROME)) { console.log("Chrome not found at " + CHROME + " (set CHROME=...)"); process.exit(2); }

procs.push(spawn("python3", [join(ROOT, "tools/serve.py"), "--port", String(port), "--no-watch"], { stdio: "ignore" }));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--mute-audio",
  "--remote-debugging-port=0", `--user-data-dir=${prof}`, "--window-size=800,900", "about:blank"], { stdio: "ignore" });
procs.push(chrome);

// Wait for the server and for Chrome's debugging port.
let ok = false;
for (let i = 0; i < 100 && !ok; i++) { try { ok = (await fetch(`http://127.0.0.1:${port}/`)).ok; } catch { await sleep(50); } }
if (!ok) fail("dev server did not start");
let dbg = null;
for (let i = 0; i < 100 && !dbg; i++) { try { dbg = readFileSync(join(prof, "DevToolsActivePort"), "utf8").split("\n")[0]; } catch { await sleep(50); } }
if (!dbg) fail("Chrome did not start");
let page = null;
for (let i = 0; i < 50 && !page; i++) {
  try { page = (await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json()).find(t => t.type === "page"); } catch {}
  if (!page) await sleep(50);
}
if (!page) fail("no Chrome tab");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const waiting = new Map();
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && waiting.has(d.id)) { waiting.get(d.id)(d); waiting.delete(d.id); } };
const send = (method, params = {}) => new Promise(res => { const n = ++id; waiting.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async expr => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;

await send("Page.enable");
await send("Page.navigate", { url: `http://127.0.0.1:${port}/index.html?selftest=${encodeURIComponent(levels)}` });

const t0 = Date.now();
let raw = null;
while (Date.now() - t0 < LIMIT_MS) {
  await sleep(250);
  raw = await evaluate(`(document.getElementById("selftest-result")||{}).textContent || null`);
  if (raw) break;
}
if (!raw) {
  const errs = await evaluate(`JSON.stringify(window.__errors||[])`);
  fail(`the self-check did not finish within ${LIMIT_MS / 1000}s` + (errs && errs !== "[]" ? " - errors: " + errs : ""));
}
const r = JSON.parse(raw);
for (const l of r.levels) console.log((l.ok ? "  ok   " : "  FAIL ") + `${l.id}: ${l.stops} stops` + (l.error ? " - " + l.error : ""));
for (const e of r.errors) console.log("  error: " + e);
console.log((r.pass ? "PASS" : "FAIL") + ` (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
ws.close();
process.exit(r.pass ? 0 : 1);
