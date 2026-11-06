// Screenshots for checking art and layout without the Browser pane (run through tools/look.sh).
//   node tools/look.mjs                 -> intro.png (map + level card)
//   node tools/look.mjs <levelId>       -> intro.png, map.png (map at the first stop), question.png, chest.png (chest open)
//   node tools/look.mjs --pictures a,b  -> pictures.png (those IMG pictures with labels; "all" = every one)
// Files go to tools/out/. LOOK_SIZE=1280x720 sets the window size (default 800x900);
// LOOK_SCHEME=dark renders the dark color scheme (default light). GAME=variants/<name> picks a game (default base). Open them with the Read tool to look at them.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { openBrowser, fail, ROOT } from "./browser.mjs";

const out = join(ROOT, "tools/out");
mkdirSync(out, { recursive: true });
const args = process.argv.slice(2);
const saved = [];
const save = async (b, name) => { const f = join(out, name); writeFileSync(f, await b.screenshot()); saved.push(f); };
const errorsOf = b => b.evaluate(`JSON.stringify(window.__errors||[])`);

if (args[0] === "--pictures") {
  const b = await openBrowser({ width: 900, height: 700 });
  await b.open(`/${process.env.GAME || "base"}/index.html?pictures=${encodeURIComponent(args[1] || "all")}`);
  const h = await b.waitFor(`window.__picturesHeight || null`, 15000);
  if (!h) fail("picture sheet did not render: " + await errorsOf(b));
  await b.send("Emulation.setDeviceMetricsOverride", { width: 900, height: Math.max(200, h), deviceScaleFactor: 1, mobile: false });
  await save(b, "pictures.png");
  const missing = await b.evaluate(`JSON.stringify(window.__picturesMissing||[])`);
  if (missing !== "[]") console.log("No picture for: " + missing);
} else {
  const level = args[0];
  const [w, h] = (process.env.LOOK_SIZE || "800x900").split("x").map(Number);
  const b = await openBrowser({ width: w, height: h, scheme: process.env.LOOK_SCHEME || "light" });
  await b.open(`/${process.env.GAME || "base"}/index.html?look=${encodeURIComponent(level || "")}`);
  if (!await b.waitFor(`document.title === "LOOK intro" || document.title === "LOOK error"`, 15000)) fail("page did not load");
  await save(b, "intro.png");
  if (level) {
    await b.evaluate(`window.__lookGo = true`);
    const tm = await b.waitFor(`/LOOK (map|error)/.test(document.title) && document.title`, 30000);
    if (tm !== "LOOK map") fail("no question appeared: " + await errorsOf(b) + " " + await b.evaluate(`window.__lookError||""`));
    await save(b, "map.png");
    await b.evaluate(`window.__lookGoMap = true`);
    const t = await b.waitFor(`/LOOK (question|error)/.test(document.title) && document.title`, 30000);
    if (t !== "LOOK question") fail("no question appeared: " + await errorsOf(b) + " " + await b.evaluate(`window.__lookError||""`));
    await save(b, "question.png");
    await b.evaluate(`window.__lookGo2 = true`);
    const t2 = await b.waitFor(`/LOOK (chest|error)/.test(document.title) && document.title`, 60000);
    if (t2 !== "LOOK chest") fail("chest never opened: " + await errorsOf(b) + " " + await b.evaluate(`window.__lookError||""`));
    await save(b, "chest.png");
  }
  const errs = await errorsOf(b);
  if (errs !== "[]") console.log("Page errors: " + errs);
}
for (const f of saved) console.log(f);
process.exit(0);
