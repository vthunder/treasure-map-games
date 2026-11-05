/* Self-check runner. tools/serve.py injects it into index.html?selftest[=id,id] and
   tools/check.sh opens that page in headless Chrome.

   It plays each level like a (very fast) child who doesn't know the answers: on every
   question it taps the choices one by one until one is accepted, then wins the key,
   and at the chest tries keys until one opens it. It only relies on these element ids:
   intro, quiz, choices, finale, keys, finText, finActions, levelsBtn, and .levels buttons.
   If a change renames or replaces those, update this file to match. */
(async function () {
  /* Fast-forward the game: its timers and animations run WARP times faster.
     (This runner keeps the real clock for its own waits.) */
  const WARP = 10;
  const realTimeout = window.setTimeout.bind(window), realInterval = window.setInterval.bind(window);
  window.setTimeout = (fn, ms, ...a) => realTimeout(fn, (+ms || 0) / WARP, ...a);
  window.setInterval = (fn, ms, ...a) => realInterval(fn, (+ms || 0) / WARP, ...a);
  const realAnimate = Element.prototype.animate;
  Element.prototype.animate = function (frames, o) {
    if (typeof o === "number") o /= WARP;
    else if (o) { o = { ...o }; if (o.duration) o.duration /= WARP; if (o.delay) o.delay /= WARP; }
    return realAnimate.call(this, frames, o);
  };

  const out = { pass: false, errors: [], levels: [] };
  const sleep = ms => new Promise(r => realTimeout(r, ms));
  const el = id => document.getElementById(id);
  const shown = e => !!e && !e.closest("[hidden]");
  const until = async (fn, ms) => {
    const t = performance.now();
    while (performance.now() - t < ms) { try { if (fn()) return true; } catch (e) {} await sleep(20); }
    return false;
  };
  const state = () => ["intro", "quiz", "cel", "finale"].filter(id => shown(el(id))).join(",") || "nothing visible";

  function finish() {
    out.errors = (window.__errors || []).concat(out.errors);
    out.pass = out.errors.length === 0 && out.levels.length > 0 && out.levels.every(l => l.ok);
    const pre = document.createElement("pre");
    pre.id = "selftest-result"; pre.hidden = true;
    pre.textContent = JSON.stringify(out);
    document.body.appendChild(pre);
    document.title = out.pass ? "SELFTEST PASS" : "SELFTEST FAIL";
  }

  try {
    await sleep(300);
    if (typeof CONFIG === "undefined") throw new Error("CONFIG is not defined (a script probably failed to load)");
    if (CONFIG.timing) for (const k in CONFIG.timing) CONFIG.timing[k] = Math.min(CONFIG.timing[k], 60);

    const want = (new URLSearchParams(location.search).get("selftest") || "all").split(",").filter(Boolean);
    const levels = (CONFIG.levels || []).map((l, i) => ({ id: l.id, name: l.name, i }))
      .filter(l => want.includes("all") || want.includes(l.id));
    if (!levels.length) throw new Error("no levels matched: " + want.join(","));

    for (const lv of levels) {
      const r = { id: lv.id, ok: false, stops: 0, labels: [] };
      out.levels.push(r);
      const t0 = performance.now();
      try {
        if (!shown(el("intro"))) { if (typeof goHome === "function") goHome(); await until(() => shown(el("intro")), 3000); }
        const btn = document.querySelectorAll(".levels button")[lv.i];
        if (!btn) throw new Error("no level button #" + lv.i);
        btn.click();

        for (let guard = 0; guard < 40; guard++) {
          const errs = () => (window.__errors || []).length > 0;
          await until(() => shown(el("quiz")) || shown(el("finale")) || errs(), 12000);
          if (!shown(el("quiz")) && !shown(el("finale")) && errs()) await until(() => shown(el("quiz")) || shown(el("finale")), 1500);
          if (!shown(el("quiz")) && !shown(el("finale")))
            throw new Error(`stuck after ${r.stops} stops: no question or chest appeared (showing: ${state()})`);
          if (shown(el("finale"))) break;
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
          if (!await until(() => !shown(el("quiz")), 8000)) throw new Error(`stop ${r.stops}: every choice got used up but the question never went away (is the right answer accepted?)`);
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
          throw new Error("chest never opened (no 'You found the treasure!')");
        r.ok = true;
        el("levelsBtn").click();
      } catch (e) {
        r.error = String(e && e.message || e);
      }
      r.seconds = Math.round((performance.now() - t0) / 100) / 10;
    }
  } catch (e) {
    out.errors.push(String(e && e.message || e));
  }
  finish();
})();
