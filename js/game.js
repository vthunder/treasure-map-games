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
  setSteps(levelOf(m).steps || CONFIG.rounds);
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
    setTimeout(() => say(spoken(r)), 250);
    setTimeout(() => { show("quiz", false); celebrate(idx); }, CONFIG.timing.afterCorrectMs);
  } else {
    btn.classList.add("no"); btn.disabled = true;
    oops();
  }
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
