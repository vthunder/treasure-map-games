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
     `hero` = SVG (44x58 viewBox inner) for the player, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "robodino", name: "Level 100 Thousand: Hot Soccer", stars: 3, icon: "robodino", steps: 5,
      blurb: "Sizzling soccer: hard words and math!",
      text: { stop: "Pass {i} of {n}!", chestStop: "Shoot for the goal!", finWin: "GOOOAL!", finLead: "Red-hot! You beat the robo-dinos!" },
      /* Hard words, 4 pictures per stop; distractors from the same pool. */
      makeRounds(n){
        const pool = ["robodino","skeleton","battery","magnet","dinosaur","fossil","volcano","footprint","gear","robot","tractor","telescope"].filter(w => IMG[w]);
        const targets = ["skeleton","battery","magnet","dinosaur","fossil","volcano","footprint","robot"];
        /* About 2 in 5 stops are addition puzzles with soccer balls to count. */
        const mathAt = new Set(shuffle([...Array(n).keys()]).slice(0, Math.max(1, Math.round(n * 0.4))));
        const words = shuffle(targets.slice());
        return Array.from({ length: n }, (_, i) => {
          if(!mathAt.has(i)){ const w = words.pop(); return { target: [w], options: shuffle([w, ...shuffle(pool.filter(x => x !== w)).slice(0, 3)]).map(picture) }; }
          const a = 2 + Math.floor(Math.random() * 6), b = 2 + Math.floor(Math.random() * 6), sum = a + b;
          const wrong = shuffle([sum - 2, sum - 1, sum + 1, sum + 2]).slice(0, 3);
          const group = k => `<span class="mgroup">${IMG.soccerball.repeat(k)}</span>`;
          return { target: [`${a} + ${b}`], answer: String(sum), speak: `${a} balls plus ${b} balls`,
            pic: `<div class="mathpic">${group(a)}<b>+</b>${group(b)}</div>`, choiceLabel: "Number choice",
            options: shuffle([sum, ...wrong]).map(x => [String(x), `<span class="num">${x}</span>`]) };
        });
      },
      hero: '<rect x="13" y="50" width="7" height="6" rx="2" fill="#2B2B2B"/><rect x="24" y="50" width="7" height="6" rx="2" fill="#2B2B2B"/><rect x="14" y="44" width="6" height="8" fill="#DC052D"/><rect x="24" y="44" width="6" height="8" fill="#DC052D"/><rect x="13" y="36" width="18" height="9" rx="2" fill="#fff" stroke="#B8C0C8" stroke-width="1.5"/><path d="M9 22q13-5 26 0l-1 15H10z" fill="#DC052D" stroke="#8B0018" stroke-width="2" stroke-linejoin="round"/><path d="M14 22v15M22 21v16M30 22v15" stroke="#fff" stroke-width="1.2" opacity=".6"/><text x="22" y="34" font-size="9" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">9</text><rect x="4" y="23" width="6" height="11" rx="3" fill="#DC052D"/><rect x="34" y="23" width="6" height="11" rx="3" fill="#DC052D"/><circle cx="22" cy="12" r="9" fill="#E8B48A"/><path d="M13 10q2-9 9-9t9 9q-3-4-9-4t-9 4z" fill="#5A3516"/><circle cx="19" cy="13" r="1.4" fill="#16385A"/><circle cx="25" cy="13" r="1.4" fill="#16385A"/><path d="M19.5 17q2.5 2 5 0" fill="none" stroke="#8B3A2E" stroke-width="1.3" stroke-linecap="round"/><g transform="translate(36 50)"><circle r="6" fill="#fff" stroke="#2B2B2B" stroke-width="1.5"/><path d="M0-3l3 2-1 3h-4l-1-3z" fill="#2B2B2B"/></g>',
      map: { name: "hotsoccer", background: '<defs><linearGradient id="hbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDBA74"/><stop offset=".5" stop-color="#FDE68A"/><stop offset="1" stop-color="#F5D08A"/></linearGradient></defs><rect width="400" height="560" fill="url(#hbg)"/><circle cx="320" cy="70" r="42" fill="#FFD93C" stroke="#F59E0B" stroke-width="4"/><g stroke="#F59E0B" stroke-width="4" stroke-linecap="round"><path d="M320 10v-6M320 136v6M260 70h-6M380 70h6M278 28l-4-4M362 112l4 4M362 28l4-4M278 112l-4 4"/></g><path d="M0 200q60-30 120-10t120-10 160 10v20H0z" fill="#E9A866" opacity=".8"/><rect x="40" y="250" width="320" height="240" rx="30" fill="#8BC34A" stroke="#5E8C2E" stroke-width="4"/><path d="M200 250v240" stroke="#fff" stroke-width="3" opacity=".8"/><circle cx="200" cy="370" r="40" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/><g fill="#F2C27A"><ellipse cx="60" cy="530" rx="70" ry="22"/><ellipse cx="320" cy="530" rx="80" ry="22"/></g><g fill="none" stroke="#fff" stroke-width="2" opacity=".5"><path d="M40 160q6-6 12 0t12 0"/><path d="M140 130q6-6 12 0t12 0"/></g>',
        decor: [["cactus", 56, 236, 1.2], ["goal", 300, 108, 1.4], ["palm", 352, 230, 1], ["cactus", 30, 430, 1], ["volcano", 370, 500, 1], ["palm", 150, 170, .9]] } },
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
