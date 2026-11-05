/* Test helpers injected by tools/serve.py (never part of the game itself):
     index.html?selftest[=id,id]  tools/check.sh: plays each level and reports PASS/FAIL
     index.html?look[=id]         tools/look.sh: stops for screenshots (intro, question, open chest)
     index.html?pictures=a,b|all  tools/look.sh --pictures: a labeled sheet of IMG pictures

   The player acts like a (very fast) child who doesn't know the answers: on every question it
   taps the choices one by one until one is accepted, then wins the key, and at the chest tries
   keys until one opens it. It relies only on these element ids: intro, quiz, choices, finale,
   keys, finText, finActions, levelsBtn, and .levels buttons. If a change renames or replaces
   those, update this file to match. */
(async function () {
  const params = new URLSearchParams(location.search);
  const MODE = params.has("pictures") ? "pictures" : params.has("look") ? "look" : "selftest";

  /* Fast-forward the game: its timers and animations run WARP times faster.
     (This runner keeps the real clock for its own waits.) */
  const WARP = MODE === "pictures" ? 1 : 10;
  const realTimeout = window.setTimeout.bind(window), realInterval = window.setInterval.bind(window);
  window.setTimeout = (fn, ms, ...a) => realTimeout(fn, (+ms || 0) / WARP, ...a);
  window.setInterval = (fn, ms, ...a) => realInterval(fn, (+ms || 0) / WARP, ...a);
  const realAnimate = Element.prototype.animate;
  Element.prototype.animate = function (frames, o) {
    if (typeof o === "number") o /= WARP;
    else if (o) { o = { ...o }; if (o.duration) o.duration /= WARP; if (o.delay) o.delay /= WARP; }
    return realAnimate.call(this, frames, o);
  };

  const sleep = ms => new Promise(r => realTimeout(r, ms));
  const el = id => document.getElementById(id);
  const shown = e => !!e && !e.closest("[hidden]");
  const until = async (fn, ms) => {
    const t = performance.now();
    while (performance.now() - t < ms) { try { if (fn()) return true; } catch (e) {} await sleep(20); }
    return false;
  };
  const state = () => ["intro", "quiz", "cel", "finale"].filter(id => shown(el(id))).join(",") || "nothing visible";
  const errs = () => (window.__errors || []).length > 0;

  /* Play one level ({id, i}) start to finish. hooks.firstQuestion() is awaited when the first question shows. */
  async function playLevel(i, r, hooks = {}) {
    if (!shown(el("intro"))) { if (typeof goHome === "function") goHome(); await until(() => shown(el("intro")), 3000); }
    const btn = document.querySelector(`.levels button[data-level="${CSS.escape(i.id)}"]`) || document.querySelectorAll(".levels button")[i.i];
    if (!btn) throw new Error("no button for level " + i.id);
    btn.click();

    for (let guard = 0; guard < 40; guard++) {
      await until(() => shown(el("quiz")) || shown(el("finale")) || errs(), 12000);
      if (!shown(el("quiz")) && !shown(el("finale")) && errs()) await until(() => shown(el("quiz")) || shown(el("finale")), 1500);
      if (!shown(el("quiz")) && !shown(el("finale")))
        throw new Error(`stuck after ${r.stops} stops: no question or chest appeared (showing: ${state()})`);
      if (shown(el("finale"))) break;
      if (r.stops === 0 && hooks.firstQuestion) await hooks.firstQuestion();
      const lab = el("stlabel"); r.labels.push(lab ? lab.textContent : "?");
      let accepted = false;
      for (const c of [...el("choices").querySelectorAll("button")]) {
        if (c.disabled) continue;
        c.click();
        await sleep(40);
        const all = [...el("choices").querySelectorAll("button")];
        if (!shown(el("quiz")) || all.every(b => b.disabled)) { accepted = true; break; }
      }
      if (!accepted) throw new Error(`stop ${r.stops + 1}: tapped every choice but none was accepted`);
      r.stops++;
      if (!await until(() => !shown(el("quiz")), 8000))
        throw new Error(`stop ${r.stops}: every choice got used up but the question never went away (is the right answer accepted?)`);
    }

    if (!await until(() => el("keys").querySelectorAll("button").length > 0, 8000))
      throw new Error("chest appeared but there were no keys to try");
    for (const k of [...el("keys").querySelectorAll("button")]) {
      if (shown(el("finText"))) break;
      if (k.disabled) continue;
      k.click();
      await sleep(40);
      if (k.classList.contains("yes")) break;
    }
    if (!await until(() => shown(el("finText")) && shown(el("finActions")), 15000))
      throw new Error("chest never opened (no finish text)");
  }

  function levelList(want) {
    if (typeof CONFIG === "undefined") throw new Error("CONFIG is not defined (a script probably failed to load)");
    return (CONFIG.levels || []).map((l, i) => ({ id: l.id, i, hidden: l.hidden })).filter(l => want.includes("all") ? !l.hidden : want.includes(l.id));
  }

  await sleep(300);
  if (MODE !== "pictures" && typeof CONFIG !== "undefined" && CONFIG.timing)
    for (const k in CONFIG.timing) CONFIG.timing[k] = Math.min(CONFIG.timing[k], 60);

  if (MODE === "pictures") {
    try {
      const want = (params.get("pictures") || "all").split(",").map(s => s.trim()).filter(Boolean);
      const names = want.includes("all") ? Object.keys(IMG) : want;
      window.__picturesMissing = names.filter(n => !IMG[n]);
      const cells = names.map(n => `<figure style="margin:0;background:#fff;border:2px solid #D8B878;border-radius:12px;padding:6px;text-align:center">
        <div style="width:96px;height:96px;margin:auto">${IMG[n] || '<div style="color:#c00;font:700 14px sans-serif;padding-top:38px">MISSING</div>'}</div>
        <figcaption style="font:600 14px Andika,sans-serif;color:#4A2E12">${n}</figcaption></figure>`).join("");
      document.body.style.background = "#F2DFB0"; document.body.innerHTML = `<div id="sheet" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;padding:12px;background:#F2DFB0">${cells}</div>`;
      document.querySelectorAll("#sheet svg").forEach(s => { s.style.width = "96px"; s.style.height = "96px"; });
      await sleep(200);
      window.__picturesHeight = document.getElementById("sheet").scrollHeight;
    } catch (e) { (window.__errors = window.__errors || []).push(String(e.message || e)); window.__picturesHeight = 200; }
    return;
  }

  if (MODE === "look") {
    try {
      if (errs()) throw new Error("page errors on load");
      document.title = "LOOK intro";
      const id = params.get("look");
      if (!id) return;
      await until(() => window.__lookGo, 60000);
      const lv = levelList([id])[0];
      if (!lv) throw new Error("no level with id " + id);
      await playLevel(lv, { stops: 0, labels: [] }, {
        firstQuestion: async () => {
          await sleep(500);
          el("quiz").hidden = true; await sleep(100);
          document.title = "LOOK map"; await until(() => window.__lookGoMap, 60000);
          el("quiz").hidden = false; await sleep(100);
          document.title = "LOOK question"; await until(() => window.__lookGo2, 60000);
        }
      });
      await sleep(900);
      document.title = "LOOK chest";
    } catch (e) { window.__lookError = String(e.message || e); document.title = "LOOK error"; }
    return;
  }

  /* selftest */
  const out = { pass: false, errors: [], levels: [] };
  try {
    const want = (params.get("selftest") || "all").split(",").filter(Boolean);
    const levels = levelList(want);
    if (!levels.length) throw new Error("no levels matched: " + want.join(","));
    for (const lv of levels) {
      const r = { id: lv.id, ok: false, stops: 0, labels: [] };
      out.levels.push(r);
      const t0 = performance.now();
      try { await playLevel(lv, r); r.ok = true; el("levelsBtn").click(); }
      catch (e) { r.error = String(e && e.message || e); }
      r.seconds = Math.round((performance.now() - t0) / 100) / 10;
    }
  } catch (e) {
    out.errors.push(String(e && e.message || e));
  }
  out.errors = (window.__errors || []).concat(out.errors);
  out.pass = out.errors.length === 0 && out.levels.length > 0 && out.levels.every(l => l.ok);
  const pre = document.createElement("pre");
  pre.id = "selftest-result"; pre.hidden = true;
  pre.textContent = JSON.stringify(out);
  document.body.appendChild(pre);
  document.title = out.pass ? "SELFTEST PASS" : "SELFTEST FAIL";
})();
