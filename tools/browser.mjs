// Shared helper for tools/check.mjs and tools/look.mjs: starts a temporary dev server and a
// headless Chrome, and gives back a tiny DevTools client. Node built-ins only (Node 22+).
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const sleep = ms => new Promise(r => setTimeout(r, ms));
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const freePort = () => new Promise(res => { const s = createServer(); s.listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => res(p)); }); });

export function fail(msg) { console.log("FAIL: " + msg); process.exit(1); }

export async function openBrowser({ width = 800, height = 900, scheme = "light" } = {}) {
  if (!existsSync(CHROME)) { console.log("Chrome not found at " + CHROME + " (set CHROME=...)"); process.exit(2); }
  const port = await freePort();
  const prof = mkdtempSync(join(tmpdir(), "wtm-"));
  const procs = [];
  process.on("exit", () => { for (const p of procs) { try { p.kill("SIGKILL"); } catch {} } try { rmSync(prof, { recursive: true, force: true }); } catch {} });

  procs.push(spawn("python3", [join(ROOT, "tools/serve.py"), "--port", String(port), "--no-watch"], { stdio: "ignore" }));
  procs.push(spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--mute-audio",
    "--hide-scrollbars", "--remote-debugging-port=0", `--user-data-dir=${prof}`, `--window-size=${width},${height}`, "about:blank"], { stdio: "ignore" }));

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
  const evaluate = async expr => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] });
  return {
    base: `http://127.0.0.1:${port}`,
    send, evaluate,
    open: url => send("Page.navigate", { url: `http://127.0.0.1:${port}${url}` }),
    async waitFor(expr, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await evaluate(expr); if (v) return v; await sleep(150); } return null; },
    async screenshot() { return Buffer.from((await send("Page.captureScreenshot", { format: "png" })).result.data, "base64"); },
    close() { try { ws.close(); } catch {} }
  };
}
