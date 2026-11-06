/* Game flow: pick a level -> walk to a stop -> answer -> win a key -> ... -> chest finale. */
let mode = "easy", rounds = [], idx = 0, locked = false;
let LAST = CONFIG.rounds - 1;
const levelOf = id => CONFIG.levels.find(l => l.id === id);
const STAR = '<svg class="star" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1l2.7 6.2 6.8.6-5.1 4.5 1.5 6.6L10 15.4l-5.9 3.5 1.5-6.6L.5 7.8l6.8-.6z" fill="#F2A900" stroke="#B87A00" stroke-width="1"/></svg>';
const picture = w => [w, IMG[w]];
/* Text from CONFIG.text, overridable per level (level.text). T("stop", {i: 2}) -> "Stop 2 of 3". */
const T = (key, vars = {}) => {
  const lv = levelOf(mode) || {}, s = (lv.text && lv.text[key]) ?? CONFIG.text[key];
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : k === "n" ? STEPS : m));
};
/* What a round reads aloud, and which option is right (default: the target word itself). */
const spoken = r => r.speak ?? r.target[0];
const answerOf = r => r.answer ?? r.target[0];

/* ---------- Building the questions ----------
   A round: { target: [label, html], options: [[label, html], ...], answer?, speak?, pic?, choiceLabel? }.
   pic = SVG/HTML shown above the prompt; choiceLabel = screen-reader label for the choice buttons.
   target[0] is the big prompt text; each option's html goes in a choice button; the option whose
   label equals answerOf(round) is right; spoken(round) is what Hear it says. */
function buildRounds(m){
  const lv = levelOf(m);
  if(lv.makeRounds) return lv.makeRounds(STEPS);      // questions made in code (math, rhymes, ...)
  const list = WORDS[lv.words || m];
  if(Array.isArray(list[0])){                         // groups of look-alike words
    return shuffle(list.slice()).slice(0, STEPS).map(g => {
      const pics = g.map(picture);
      return { target: pics[Math.floor(Math.random() * pics.length)], options: shuffle(pics.slice()) };
    });
  }
  return shuffle(list.slice()).slice(0, STEPS).map(w => {   // flat list: random wrong answers
    const others = shuffle(list.filter(x => x !== w)).slice(0, 2);
    return { target: picture(w), options: shuffle([w, ...others].map(picture)) };
  });
}

/* ---------- Screens ---------- */
function buildLevelButtons(){
  const box = document.querySelector(".levels");
  CONFIG.levels.filter(l => !l.hidden).forEach(l => {
    const b = document.createElement("button");
    b.className = "level"; b.dataset.level = l.id;
    b.innerHTML = `<span class="pic">${IMG[l.icon] || `<span class="txticon">${l.icon}</span>`}</span><span>${l.name} <span class="stars">${STAR.repeat(l.stars)}</span><small>${l.blurb}</small></span>`;
    b.addEventListener("click", () => startJourney(l.id));
    box.appendChild(b);
  });
}

function startJourney(m){
  mode = m;
  setSteps(levelOf(m).steps || CONFIG.rounds, levelOf(m).map);
  LAST = STEPS - 1;
  rounds = buildRounds(m); idx = -1;
  show("intro", false); show("topbar", true); show("finale", false);
  $("fx").innerHTML = "";
  nextStop();
}

async function nextStop(){
  idx++;
  await wait(250);
  await walk(idx + 1);
  markCurrent(idx);
  await wait(250);
  renderRound();
  show("quiz", true);
}

function goHome(){
  try{ speechSynthesis.cancel(); }catch(e){}
  ["quiz", "cel", "finale", "topbar"].forEach(id => show(id, false));
  $("fx").innerHTML = "";
  setSteps(CONFIG.rounds);
  show("intro", true);
  idx = -1;
}

/* ---------- A question ---------- */
function renderRound(){
  locked = false;
  const r = rounds[idx];
  $("word").textContent = r.target[0];
  $("qpic").innerHTML = r.pic || ""; show("qpic", !!r.pic);   // optional picture above the prompt
  document.querySelectorAll(".catchball, .biteshark").forEach(b => b.remove());
  show("cannon", !!levelOf(mode).cannon);
  $("stlabel").textContent = idx === LAST ? T("chestStop") : T("stop", { i: idx + 1 });
  const box = $("choices"); box.innerHTML = "";
  box.style.gridTemplateColumns = `repeat(${Math.min(r.options.length, 4)}, 1fr)`;
  r.options.forEach(opt => {
    const b = document.createElement("button");
    b.className = "choice"; b.innerHTML = opt[1];
    b.setAttribute("aria-label", r.choiceLabel || "Picture choice");
    b.addEventListener("click", () => pick(b, opt));
    box.appendChild(b);
  });
}

function pick(btn, opt){
  if(locked || btn.disabled) return;
  const r = rounds[idx];
  if(opt[0] === answerOf(r)){
    locked = true;
    btn.classList.add("yes");
    [...$("choices").children].forEach(b => b.disabled = true);
    happy();
    if(levelOf(mode).cannon && !reduced) fireCannon(btn);
    setTimeout(() => say(spoken(r)), 250);
    setTimeout(() => { show("quiz", false); celebrate(idx); }, CONFIG.timing.afterCorrectMs);
  } else {
    btn.classList.add("no"); btn.disabled = true;
    oops();
    if(levelOf(mode).shark && !reduced) sharkBite(btn);
  }
}

/* ---------- Cannon (levels with cannon: true): fire a catch ball at the right picture ----------
   The ball arcs from the cannon to the picture, the picture shrinks into it, the ball wiggles
   twice and pings. All of it fits inside CONFIG.timing.afterCorrectMs (1.1 s of 1.3 s). */
function fireCannon(btn){
  const card = document.querySelector("#quiz .card"), cannon = $("cannonsvg");
  const from = cannon.getBoundingClientRect(), to = btn.getBoundingClientRect(), base = card.getBoundingClientRect();
  tone([98, 73], "square", 0.25);
  cannon.animate([{ transform: "translateY(0)" }, { transform: "translateY(7px)" }, { transform: "translateY(0)" }], { duration: 300 });
  const size = Math.min(76, to.width * 0.62), ball = document.createElement("div");
  ball.className = "catchball"; ball.innerHTML = IMG.pokeball;
  ball.style.width = ball.style.height = size + "px";
  const x0 = from.left + from.width / 2 - base.left - size / 2, y0 = from.top - base.top - size / 2;
  const dx = to.left + to.width / 2 - base.left - size / 2 - x0, dy = to.top + to.height / 2 - base.top - size / 2 - y0;
  ball.style.left = x0 + "px"; ball.style.top = y0 + "px";
  card.appendChild(ball);
  const at = `translate(${dx}px,${dy}px)`, pic = btn.querySelector("svg");
  ball.animate([
    { transform: "translate(0,0) scale(.5) rotate(0)" },
    { transform: `translate(${dx * .5}px,${dy * .5 - 70}px) scale(1) rotate(360deg)` },
    { transform: `${at} scale(1) rotate(720deg)` }
  ], { duration: 450, easing: "ease-out", fill: "forwards" }).onfinish = () => {
    if(pic) pic.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(0)", opacity: 0 }], { duration: 220, fill: "forwards" });
    ball.animate([{ transform: `${at} rotate(0)` }, { transform: `${at} rotate(-20deg)` }, { transform: `${at} rotate(20deg)` }, { transform: `${at} rotate(0)` }],
      { duration: 200, delay: 240, iterations: 2, fill: "forwards" }).onfinish = () => { tone([1047, 1319, 1568], "sine", 0.15); burst(14); };
  };
}

/* ---------- Shark (levels with shark: true): a miss gets a CHOMP and one step back ----------
   The shark swims across the card to the wrong picture and chomps, the hero is pushed back one
   stop on the map, then swims forward again to the same question (wrong picture stays greyed). */
async function sharkBite(btn){
  locked = true;
  const card = document.querySelector("#quiz .card"), to = btn.getBoundingClientRect(), base = card.getBoundingClientRect();
  const size = Math.min(150, to.width * 1.15), s = document.createElement("div");
  s.className = "biteshark"; s.innerHTML = `<div class="sharkpic">${IMG.shark}</div><b>CHOMP!</b>`;
  s.style.width = s.style.height = size + "px";
  const x1 = to.left + to.width / 2 - base.left - size / 2, y = to.top + to.height / 2 - base.top - size / 2;
  s.style.left = -size * 0.6 + "px"; s.style.top = y + "px";
  card.appendChild(s);
  const dx = x1 + size * 0.6, at = `translateX(${dx}px)`;
  await s.animate([{ transform: "translateX(0)" }, { transform: at }], { duration: 420, easing: "ease-out", fill: "forwards" }).finished;
  s.classList.add("chomping");
  tone([180, 110], "sawtooth", 0.18); setTimeout(() => tone([170, 100], "sawtooth", 0.18), 220);
  say("Chomp!");
  await s.animate([{ transform: `${at} scale(1)` }, { transform: `${at} scale(1.2) rotate(-6deg)` }, { transform: `${at} scale(.95)` },
    { transform: `${at} scale(1.15) rotate(6deg)` }, { transform: `${at} scale(1)` }], { duration: 480, fill: "forwards" }).finished;
  await wait(250);
  s.remove();
  const still = () => !$("topbar").hidden;          // stop if the kids went back to the levels
  if(!still()) return;
  show("quiz", false);
  (idx < stations.length ? stations[idx] : document.querySelector(".ring10")).classList.remove("cur");
  await walkBack(idx + 1);
  await wait(450);
  if(!still()) return;
  await walk(idx + 1);
  markCurrent(idx);
  await wait(200);
  if(!still()) return;
  show("quiz", true);
  locked = false;
}

/* Hero slides back from stop k to stop k-1 (the reverse of walk(k)). */
function walkBack(k){
  return new Promise(res => {
    const p = segs[k - 1], L = p.getTotalLength(), dur = CONFIG.timing.walkMs * 0.6, hero = $("hero");
    $("flipper").classList.toggle("flip", PTS[k - 1][0] < PTS[k][0]);
    segDone[k - 1].classList.remove("on");
    hero.classList.remove("idle"); hero.classList.add("walking");
    const t0 = performance.now();
    (function f(t){
      const u = Math.min(1, (t - t0) / dur), pt = p.getPointAtLength(L * (1 - u * (2 - u)));
      placeHero(pt.x, pt.y);
      if(u < 1) requestAnimationFrame(f); else { hero.classList.remove("walking"); hero.classList.add("idle"); res(); }
    })(t0);
  });
}

/* ---------- Winning a key ---------- */
function celebrate(i){
  const key = activeKeys()[i], cap = $("celCap");
  $("celItem").innerHTML = keySVG(key[0]);
  cap.textContent = i === LAST ? `The ${key[1]} key! That's all ${STEPS} keys!` : `You found the ${key[1]} key!`;
  cap.style.opacity = "";
  $("celFly").getAnimations().forEach(a => a.cancel());
  show("cel", true);
  fanfare(); burst(34);
  setTimeout(() => {
    const item = $("celFly"), slot = slotEls[i];
    const a = item.getBoundingClientRect(), b = slot.getBoundingClientRect();
    const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    const sc = Math.max(.1, b.width / a.width);
    cap.style.opacity = "0";
    const done = () => {
      show("cel", false);
      fillSlot(i);
      if(i < LAST) markDone(i);
      tone([880, 1175], "sine", 0.12);
      if(i < LAST) nextStop(); else finale();
    };
    if(reduced){ done(); return; }
    item.animate([{ transform: "none" }, { transform: `translate(${dx}px,${dy}px) scale(${sc})` }],
      { duration: 700, easing: "cubic-bezier(.5,0,.8,.4)", fill: "forwards" }).onfinish = done;
  }, CONFIG.timing.celebrationMs);
}

/* ---------- Finale: pick the right key, open the chest, coin rain ---------- */
async function finale(){
  const f = $("finale"), chest = $("chestBig"), box = $("keys");
  f.classList.remove("open"); chest.classList.remove("shake");
  chest.innerHTML = `<svg viewBox="0 -40 160 180" aria-label="Treasure chest">${chestInner()}</svg>`;
  show("finText", false); show("finActions", false);
  $("finPrompt").textContent = T("finPrompt");
  show("finPrompt", true);
  box.innerHTML = ""; show("keys", true);
  box.style.gridTemplateColumns = `repeat(${Math.min(STEPS, 5)}, 1fr)`;
  $("finLead").textContent = T("finLead");
  $("finWin").textContent = T("finWin");
  show("finale", true);
  document.querySelector(".ring10").classList.remove("cur");

  const winner = Math.floor(Math.random() * STEPS);
  await new Promise(res => {
    activeKeys().forEach((k, j) => {
      const b = document.createElement("button");
      b.className = "keybtn"; b.innerHTML = keySVG(k[0]); b.setAttribute("aria-label", k[1] + " key");
      b.addEventListener("click", () => {
        if(b.disabled) return;
        if(j === winner){ [...box.children].forEach(x => x.disabled = true); b.classList.add("yes"); happy(); res(); }
        else { b.disabled = true; b.classList.add("no"); oops(); $("finPrompt").textContent = T("finRetry"); }
      });
      box.appendChild(b);
    });
  });

  $("finPrompt").textContent = T("finFits");
  await wait(900);
  show("keys", false); show("finPrompt", false);
  if(!reduced) chest.classList.add("shake");
  tone([196, 175], "triangle", 0.12);
  await wait(reduced ? 200 : 900);
  chest.classList.remove("shake");
  f.classList.add("open");
  fanfare(); burst(70); coinRain(80); jingle(14);
  await wait(1800);
  coinRain(60); jingle(10);
  await wait(1200);
  show("finText", true); show("finActions", true);
}

/* ---------- Start up ---------- */
$("word").addEventListener("click", () => say(spoken(rounds[idx])));
$("hear").addEventListener("click", () => say(spoken(rounds[idx])));
$("homeBtn").addEventListener("click", goHome);
$("qHome").addEventListener("click", goHome);
$("againBtn").addEventListener("click", () => startJourney(mode));
$("levelsBtn").addEventListener("click", goHome);

buildLevelButtons();
setSteps(CONFIG.rounds);
