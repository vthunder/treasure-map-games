/* ==========================================================
   CONFIG - the knobs you're most likely to change.
   (Word lists live in words.js, artwork in images.js.)
   ========================================================== */
const CONFIG = {
  rounds: 10,                 // default number of stops (= questions = keys) when a level does not set `steps`

  /* Level buttons on the opening screen. `icon` is a name from IMG (images.js). */
  /* Optional per-level settings: `steps` = number of stops/keys (default = rounds),
     `words` = which list in words.js to use (default = the level id),
     `text` = overrides for CONFIG.text, `makeRounds(n)` = build the questions in code instead of
     from words.js (see buildRounds in game.js). `icon` may also be an emoji or short text,
     `hero` = SVG (44x58 viewBox inner) for the player, `moneyRain: true` = money bursts from the chest, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "bathero", name: "Level 67: Bat Hero", stars: 2, icon: "67", steps: 5, moneyRain: true,
      blurb: "Six seven! Bat Hero math!",
      text: { stop: "Mission {i} of {n}!", chestStop: "The 67 vault!", finWin: "SIX SEVEN!", finLead: "Bat Hero cracked {n} number codes!" },
      /* "67" math: every answer is 6, 7, 13 (6 + 7) or 67. Small sums show bats to count. */
      makeRounds(n){
        const bat = IMG.bat;
        const make = () => {
          const pick = Math.random();
          if(pick < .7){
            const sum = Math.random() < .5 ? 6 : 7, a = 1 + Math.floor(Math.random() * (sum - 1)), b = sum - a;
            return { a, b, sum, pic: `<div class="mathpic"><span class="mgroup">${bat.repeat(a)}</span><b>+</b><span class="mgroup">${bat.repeat(b)}</span></div>` };
          }
          if(pick < .85) return { a: 6, b: 7, sum: 13, pic: `<div class="mathpic"><span class="mgroup">${bat.repeat(6)}</span><b>+</b><span class="mgroup">${bat.repeat(7)}</span></div>` };
          const tens = [[60, 7], [50, 17], [40, 27], [30, 37], [61, 6]][Math.floor(Math.random() * 5)];
          return { a: tens[0], b: tens[1], sum: 67, pic: `<div class="big67">6<span>7</span></div>` };
        };
        return Array.from({ length: n }, () => {
          const q = make();
          const near = q.sum === 67 ? [57, 66, 68, 76, 77] : [q.sum - 2, q.sum - 1, q.sum + 1, q.sum + 2];
          const wrong = shuffle(near.filter(x => x >= 1 && x !== q.sum)).slice(0, 3);
          return { target: [`${q.a} + ${q.b}`], answer: String(q.sum), speak: `${q.a} plus ${q.b}`, pic: q.pic, choiceLabel: "Number choice",
            options: shuffle([q.sum, ...wrong]).map(x => [String(x), `<span class="num">${x}</span>`]) };
        });
      },
      hero: '<path d="M8 22q-8 16-2 32l10-8 6 6 6-6 10 8q6-16-2-32z" fill="#1E1B3A" stroke="#0B0A18" stroke-width="1.5" stroke-linejoin="round"/><rect x="13" y="48" width="7" height="8" rx="2" fill="#1E1B3A"/><rect x="24" y="48" width="7" height="8" rx="2" fill="#1E1B3A"/><rect x="12" y="24" width="20" height="25" rx="5" fill="#5A6878" stroke="#2B3440" stroke-width="2"/><path d="M16 32q6-4 12 0l-2 3-4-2-4 2z" fill="#FFD93C"/><rect x="12" y="42" width="20" height="4" fill="#FFD93C"/><rect x="5" y="25" width="6" height="13" rx="3" fill="#2B3440"/><rect x="33" y="25" width="6" height="13" rx="3" fill="#2B3440"/><path d="M11 6l3 8h16l3-8-5 5H16z" fill="#1E1B3A"/><circle cx="22" cy="16" r="10" fill="#1E1B3A"/><path d="M14 17q8 9 16 0v6q-8 4-16 0z" fill="#F1C9A0"/><path d="M15 14h5l-1 2h-3zM24 14h5l-1 2h-3z" fill="#fff"/><path d="M19 22q3 2 6 0" fill="none" stroke="#8B3A2E" stroke-width="1.3" stroke-linecap="round"/>',
      map: { name: "bat", background: '<defs><linearGradient id="gbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1230"/><stop offset="1" stop-color="#2A2350"/></linearGradient></defs><rect width="400" height="560" fill="url(#gbg)"/><circle cx="300" cy="90" r="46" fill="#FFF3B0"/><path d="M276 92q12-14 24-4 12-10 24 4-12-2-24 10-12-12-24-10z" fill="#1E1B3A"/><g fill="#fff" opacity=".7"><circle cx="0" cy="9" r="1.2"/><circle cx="83" cy="56" r="1.2"/><circle cx="166" cy="103" r="1.2"/><circle cx="249" cy="150" r="1.2"/><circle cx="332" cy="197" r="1.2"/><circle cx="15" cy="244" r="1.2"/><circle cx="98" cy="31" r="1.2"/><circle cx="181" cy="78" r="1.2"/><circle cx="264" cy="125" r="1.2"/><circle cx="347" cy="172" r="1.2"/><circle cx="30" cy="219" r="1.2"/><circle cx="113" cy="6" r="1.2"/><circle cx="196" cy="53" r="1.2"/><circle cx="279" cy="100" r="1.2"/><circle cx="362" cy="147" r="1.2"/><circle cx="45" cy="194" r="1.2"/><circle cx="128" cy="241" r="1.2"/><circle cx="211" cy="28" r="1.2"/><circle cx="294" cy="75" r="1.2"/><circle cx="377" cy="122" r="1.2"/><circle cx="60" cy="169" r="1.2"/><circle cx="143" cy="216" r="1.2"/><circle cx="226" cy="3" r="1.2"/><circle cx="309" cy="50" r="1.2"/><circle cx="392" cy="97" r="1.2"/><circle cx="75" cy="144" r="1.2"/><circle cx="158" cy="191" r="1.2"/><circle cx="241" cy="238" r="1.2"/><circle cx="324" cy="25" r="1.2"/><circle cx="7" cy="72" r="1.2"/><circle cx="90" cy="119" r="1.2"/><circle cx="173" cy="166" r="1.2"/><circle cx="256" cy="213" r="1.2"/><circle cx="339" cy="0" r="1.2"/><circle cx="22" cy="47" r="1.2"/><circle cx="105" cy="94" r="1.2"/><circle cx="188" cy="141" r="1.2"/><circle cx="271" cy="188" r="1.2"/><circle cx="354" cy="235" r="1.2"/><circle cx="37" cy="22" r="1.2"/></g><g fill="#1A1838"><rect x="0" y="440" width="50" height="120"/><rect x="48" y="390" width="40" height="170"/><rect x="86" y="460" width="60" height="100"/><rect x="144" y="360" width="36" height="200"/><rect x="178" y="420" width="58" height="140"/><rect x="234" y="380" width="44" height="180"/><rect x="276" y="450" width="70" height="110"/><rect x="344" y="400" width="56" height="160"/></g><g fill="#FFD93C" opacity=".75"><rect x="10" y="460" width="6" height="8"/><rect x="26" y="470" width="6" height="8"/><rect x="58" y="410" width="6" height="8"/><rect x="70" y="430" width="6" height="8"/><rect x="100" y="480" width="6" height="8"/><rect x="150" y="380" width="6" height="8"/><rect x="160" y="420" width="6" height="8"/><rect x="190" y="440" width="6" height="8"/><rect x="206" y="460" width="6" height="8"/><rect x="244" y="400" width="6" height="8"/><rect x="256" y="430" width="6" height="8"/><rect x="290" y="470" width="6" height="8"/><rect x="310" y="480" width="6" height="8"/><rect x="356" y="420" width="6" height="8"/><rect x="374" y="440" width="6" height="8"/></g>',
        decor: [["batsign", 56, 236, 1.3], ["batsign", 352, 300, 1], ["six7", 150, 170, 1.2], ["six7", 40, 430, 1], ["batsign", 236, 452, .9], ["six7", 352, 470, 1.1]] } },
    { id: "easy",   name: "Level 1: Easy",   stars: 1, icon: "cat",    hidden: true,    blurb: "Short words: cat, dog, sun" },
    { id: "medium", name: "Level 2: Medium", stars: 2, icon: "cloud",  blurb: "Blends & digraphs: cloud, sheep, train" },
    { id: "hard",   name: "Level 3: Hard",   stars: 3, icon: "dragon", blurb: "Big words: elephant, giraffe, penguin" }
  ],

  /* Words around the journey and the treasure. A level can override any of them with its own
     `text: { ... }`. {i} = stop number, {n} = number of stops. */
  text: {
    stop: "Stop {i} of {n}",
    chestStop: "The treasure chest!",
    finPrompt: "Which key opens the chest? Try them!",
    finRetry: "Not that one! Try another key.",
    finFits: "Click! The key fits!",
    finWin: "You found the treasure!",
    finLead: "You read {n} words all by yourself."
  },

  /* One key is won per stop. Add/remove colors to change the number of keys
     (keep it equal to `rounds`). */
  keys: [
    ["#FFC93C", "gold"],   ["#E0483E", "red"],    ["#3B7DDD", "blue"],  ["#2FA36B", "green"],  ["#8E5BD9", "purple"],
    ["#FF8A3D", "orange"], ["#F06CA8", "pink"],   ["#1FB5A8", "teal"],  ["#A9B7C2", "silver"], ["#A9693A", "brown"]
  ],

  /* Map geometry in a 400 x 560 box: first point = START, then one point per stop;
     the last point is the treasure chest. */
  path: [[40,520],[110,488],[200,512],[300,488],[345,428],[272,384],[172,402],[82,352],[108,272],[210,240],[300,150]],

  /* Scenery on the map: [artName, x, y, scale]. Art lives in DECOR (images.js). */
  decor: [
    ["compass",56,106,1.1], ["mountain",332,84,1.2], ["palm",150,168,1], ["palm",352,345,1], ["palm",46,440,1],
    ["crab",236,452,.9], ["cactus",150,304,.9], ["volcano",362,204,1],
    ["wave",26,34,.9], ["wave",372,540,.9], ["wave",206,552,.7], ["sailboat",372,34,1]
  ],

  timing: {
    afterCorrectMs: 1300,     // pause on the green answer before the celebration
    celebrationMs: 1900,      // how long the "you found a key" moment lasts
    walkMs: 1500              // hero walking time between stops
  },

  speechRate: 0.8
};
