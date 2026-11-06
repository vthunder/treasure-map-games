// Quick load test for the landing page and every game in games.js (run: node tools/smoke.mjs).
// For each game it opens variants/<dir>/?play=<level> and checks: no script errors, the
// "All games" link exists, and the level actually started (a question appeared).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { openBrowser, ROOT, sleep } from "./browser.mjs";

const GAMES = new Function(readFileSync(join(ROOT, "games.js"), "utf8") + ";return GAMES")();
const list = [{ dir: "../base", level: "demo", title: "base" }, ...GAMES.event, ...GAMES.practice];
const b = await openBrowser();
let bad = 0;

await b.open("/index.html");
const cards = await b.waitFor(`document.querySelectorAll(".card").length`, 8000);
console.log((cards === GAMES.event.length + GAMES.practice.length ? "  ok   " : "  FAIL ") + `landing page: ${cards} cards`);
if (cards !== GAMES.event.length + GAMES.practice.length) bad++;

for (const g of list) {
  await b.open(`/variants/${g.dir}/index.html?play=${encodeURIComponent(g.level)}`);
  await b.send("Runtime.evaluate", { expression: `window.__e=[];addEventListener("error",e=>__e.push(e.message))` });
  const started = await b.waitFor(`!document.getElementById("quiz").hidden && document.querySelectorAll("#choices button").length`, 8000);
  await sleep(200);
  const r = JSON.parse(await b.evaluate(`JSON.stringify({ back: !!document.querySelector(".allgames"), home: (document.querySelector(".allgames")||{}).href || "", errs: window.__e || [], word: (document.getElementById("word")||{}).textContent })`));
  const ok = started && r.back && r.errs.length === 0 && /\/$/.test(new URL(r.home).pathname) && !/variants|base/.test(new URL(r.home).pathname);
  if (!ok) bad++;
  console.log((ok ? "  ok   " : "  FAIL ") + `${g.dir}: ${started ? `started (${r.word})` : "did not start"}${r.back ? "" : ", no back link"}${r.errs.length ? ", errors: " + r.errs.join("; ") : ""}${ok ? "" : " home=" + r.home}`);
}
console.log(bad ? `FAIL (${bad})` : "PASS");
b.close();
process.exit(bad ? 1 : 0);
