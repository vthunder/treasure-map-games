/* The treasure map: drawing it, the bag slots, and walking the hero along the path. */
const FULL_PATH = CONFIG.path;
let PTS = FULL_PATH, STEPS = CONFIG.rounds;
const activeKeys = () => CONFIG.keys.slice(0, STEPS);

/* Re-draw the map for a game with n stops (picks n evenly spaced points; the last is always the chest). */
function setSteps(n){
  STEPS = n;
  const total = FULL_PATH.length - 1;
  PTS = [FULL_PATH[0]];
  for(let k = 1; k <= n; k++) PTS.push(FULL_PATH[Math.round(k * total / n)]);
  buildMap();
  resetMap();
}
let segs = [], segDone = [], stations = [], slotEls = [];

/* Smooth curve between stop i and i+1 (Catmull-Rom converted to a Bezier). */
function segPath(i){
  const p0 = PTS[Math.max(0, i - 1)], p1 = PTS[i], p2 = PTS[i + 1], p3 = PTS[Math.min(PTS.length - 1, i + 2)];
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
  const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return "M" + p1 + " C" + c1 + " " + c2 + " " + p2;
}

function chestInner(){
  return `<circle class="glow" cx="80" cy="56" r="76" fill="#FFE27A"/>
    <rect x="20" y="62" width="120" height="62" rx="6" fill="#8B4A22" stroke="#4E2810" stroke-width="4"/>
    <ellipse cx="80" cy="62" rx="56" ry="12" fill="#FFC93C"/>
    <g fill="#7A5A3A" stroke="#7A5A3A" stroke-width="6"><circle cx="34" cy="42" r="11"/><circle cx="34" cy="60" r="11"/><circle cx="126" cy="42" r="11"/><circle cx="126" cy="60" r="11"/><rect x="34" y="42" width="92" height="18"/></g><g fill="#FFF8E7"><circle cx="34" cy="42" r="11"/><circle cx="34" cy="60" r="11"/><circle cx="126" cy="42" r="11"/><circle cx="126" cy="60" r="11"/><rect x="34" y="42" width="92" height="18"/></g>
    <rect x="46" y="62" width="10" height="62" fill="#FFC93C" stroke="#B88A00" stroke-width="2"/>
    <rect x="104" y="62" width="10" height="62" fill="#FFC93C" stroke="#B88A00" stroke-width="2"/>
    <rect x="70" y="72" width="20" height="22" rx="3" fill="#FFC93C" stroke="#B88A00" stroke-width="3"/><circle cx="80" cy="82" r="3.5" fill="#4E2810"/>
    <g class="lid"><path d="M20 66V50Q20 14 80 14Q140 14 140 50V66Z" fill="#A9693A" stroke="#4E2810" stroke-width="4" stroke-linejoin="round"/>
    <rect x="46" y="22" width="10" height="44" fill="#FFC93C" stroke="#B88A00" stroke-width="2"/><rect x="104" y="22" width="10" height="44" fill="#FFC93C" stroke="#B88A00" stroke-width="2"/>
    <rect x="68" y="56" width="24" height="14" rx="3" fill="#FFC93C" stroke="#B88A00" stroke-width="3"/></g>`;
}

function decor(name, x, y, s){
  return `<g transform="translate(${x} ${y}) scale(${s * 1.1}) translate(-20 -20)">${DECOR[name]}</g>`;
}

function buildMap(){
  const last = PTS.length - 1, chest = PTS[last];
  let s = `<rect width="400" height="560" fill="#E6CB8C"/>
    <rect x="6" y="6" width="388" height="548" rx="14" fill="none" stroke="#B98B4A" stroke-width="3" stroke-dasharray="10 6" opacity=".6"/>
    <path d="M26 66Q58 22 200 30T378 72Q394 220 374 300T382 498Q300 548 180 541T24 520Q6 300 26 66Z" fill="#F6E7BF" stroke="#B98B4A" stroke-width="4" stroke-dasharray="2 7" stroke-linecap="round"/>
    <g fill="#BFD58A" opacity=".65"><ellipse cx="90" cy="150" rx="46" ry="26"/><ellipse cx="330" cy="260" rx="38" ry="30"/><ellipse cx="190" cy="320" rx="44" ry="22"/><ellipse cx="60" cy="460" rx="30" ry="22"/></g>`;
  CONFIG.decor.forEach(d => { s += decor(d[0], d[1], d[2], d[3]); });
  s += `<text x="40" y="548" font-size="12" font-weight="700" fill="#7A4A1E" text-anchor="middle" font-family="Andika,sans-serif">START</text>`;
  for(let i = 0; i < last; i++) s += `<path class="seg" d="${segPath(i)}"/>`;
  for(let i = 0; i < last; i++) s += `<path class="segdone" pathLength="1" d="${segPath(i)}"/>`;
  for(let i = 1; i < last; i++){
    const p = PTS[i];
    s += `<g class="station" transform="translate(${p[0]} ${p[1]})"><circle class="ring" r="19"/><circle class="dot" r="14"/><text y="5">${i}</text></g>`;
  }
  s += `<circle class="ring10" cx="${chest[0]}" cy="${chest[1] - 10}" r="36"/>
    <g transform="translate(${chest[0]} ${chest[1] + 18}) scale(.46) translate(-80 -124)">${chestInner()}</g>
    <text x="${chest[0]}" y="${chest[1] + 36}" font-size="22" font-weight="700" fill="#B3412E" text-anchor="middle" font-family="Andika,sans-serif">X</text>`;
  $("mapsvg").innerHTML = s;
  const q = sel => [...$("mapsvg").querySelectorAll(sel)];
  segs = q(".seg"); segDone = q(".segdone"); stations = q(".station");
}

function buildSlots(){
  const box = $("slots"); box.innerHTML = ""; slotEls = [];
  activeKeys().forEach(() => { const d = document.createElement("span"); d.className = "slot"; box.appendChild(d); slotEls.push(d); });
}
function fillSlot(i){ slotEls[i].innerHTML = keySVG(activeKeys()[i][0]); slotEls[i].classList.add("full"); }

function placeHero(x, y){
  const h = $("hero"); h.style.left = (x / 400 * 100) + "%"; h.style.top = (y / 560 * 100) + "%";
}

function resetMap(){
  segDone.forEach(p => p.classList.remove("on"));
  stations.forEach((g, i) => { g.classList.remove("done", "cur"); g.querySelector("text").textContent = i + 1; });
  document.querySelector(".ring10").classList.remove("cur");
  buildSlots();
  placeHero(PTS[0][0], PTS[0][1]);
  $("flipper").classList.remove("flip");
  $("hero").classList.add("idle");
}

function markCurrent(i){
  (i < stations.length ? stations[i] : document.querySelector(".ring10")).classList.add("cur");
}
function markDone(i){
  const g = stations[i]; g.classList.remove("cur"); g.classList.add("done"); g.querySelector("text").textContent = "\u2713";
}

/* Walk the hero along the path to stop k (1 = first stop). */
function walk(k){
  return new Promise(res => {
    const p = segs[k - 1], L = p.getTotalLength(), dur = reduced ? 1 : CONFIG.timing.walkMs, hero = $("hero");
    $("flipper").classList.toggle("flip", PTS[k][0] < PTS[k - 1][0]);
    segDone[k - 1].classList.add("on");
    hero.classList.remove("idle"); hero.classList.add("walking");
    const t0 = performance.now();
    (function f(t){
      const u = Math.min(1, (t - t0) / dur), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const pt = p.getPointAtLength(L * e);
      placeHero(pt.x, pt.y);
      if(u < 1) requestAnimationFrame(f); else { hero.classList.remove("walking"); hero.classList.add("idle"); res(); }
    })(t0);
  });
}
