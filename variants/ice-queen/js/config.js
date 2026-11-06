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
     `hero` = SVG (44x58 viewBox inner) for the player, `iceRain: true` = icicles and snowflakes burst from the chest, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "icequeen", name: "Level 20: Ice Cream World", stars: 2, icon: "cone", steps: 5, iceRain: true,
      blurb: "Yummy words and ice cream math!",
      text: { stop: "Scoop stop {i} of {n}!", chestStop: "The ice cream treasure!", finWin: "Brain freeze! You did it!", finLead: "You read and added like a pro!" },
      /* Ice cream words mixed with addition puzzles (about 2 in 5 are math, always at least one of each). */
      makeRounds(n){
        const list = WORDS.ice, words = shuffle(list.slice()), rounds = [];
        const mathAt = new Set(shuffle([...Array(n).keys()]).slice(0, Math.max(1, Math.round(n * 0.4))));
        for(let i = 0; i < n; i++){
          if(mathAt.has(i)){
            const a = 1 + Math.floor(Math.random() * 4), b = 1 + Math.floor(Math.random() * 4), sum = a + b;
            const wrong = shuffle([sum - 2, sum - 1, sum + 1, sum + 2].filter(x => x >= 1)).slice(0, 2);
            const group = k => `<span class="mgroup">${IMG.cone.repeat(k)}</span>`;
            rounds.push({ target: [`${a} + ${b}`], answer: String(sum), speak: `${a} ice cream${a > 1 ? "s" : ""} plus ${b} ice cream${b > 1 ? "s" : ""}`,
              pic: `<div class="mathpic">${group(a)}<b>+</b>${group(b)}</div>`, choiceLabel: "Number choice",
              options: shuffle([sum, ...wrong]).map(x => [String(x), `<span class="num">${x}</span>`]) });
          } else {
            const w = words.pop(), others = shuffle(list.filter(x => x !== w)).slice(0, 2);
            rounds.push({ target: [w], options: shuffle([w, ...others]).map(picture) });
          }
        }
        return rounds;
      },
      hero: '<path d="M8 56L14 28h16l6 28z" fill="#7CC8F2" stroke="#3A8FC4" stroke-width="2" stroke-linejoin="round"/><path d="M10 50q12 4 24 0" stroke="#DDF1FA" stroke-width="2" fill="none"/><path d="M30 30q10 10 8 26" fill="#BFE6F7" fill-opacity=".7" stroke="#9ED3E8" stroke-width="1.5"/><rect x="15" y="22" width="14" height="10" rx="3" fill="#5BB4F0" stroke="#3A8FC4" stroke-width="2"/><rect x="6" y="24" width="6" height="12" rx="3" fill="#FFE8D6"/><rect x="32" y="24" width="6" height="12" rx="3" fill="#FFE8D6"/><path d="M12 12q2-10 10-10t10 10v8q4 10-2 22l-4-2 2-18H16z" fill="#F4E9C8"/><circle cx="22" cy="15" r="9" fill="#FFE8D6"/><path d="M13 13q9-9 18-1" fill="#F4E9C8"/><path d="M15 7l2-6 3 4 2-5 2 5 3-4 2 6z" fill="#DDF1FA" stroke="#5BA8CC" stroke-width="1.2" stroke-linejoin="round"/><circle cx="19" cy="15" r="1.4" fill="#2E4A7A"/><circle cx="25" cy="15" r="1.4" fill="#2E4A7A"/><path d="M19.5 19q2.5 2 5 0" fill="none" stroke="#C2413A" stroke-width="1.3" stroke-linecap="round"/><path d="M38 26l3-3M38 22l4 1M36 20l1-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
      map: { name: "ice", background: '<defs><linearGradient id="cbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE7F3"/><stop offset=".5" stop-color="#E0F2FE"/><stop offset="1" stop-color="#ECFCCB"/></linearGradient></defs><rect width="400" height="560" fill="url(#cbg)"/><path d="M0 210q40-40 80-10t80-10 80 10 80-10 80 10v30H0z" fill="#F9A8D4" opacity=".8"/><path d="M0 220q30 20 60 0t60 0 60 0 60 0 60 0 60 0 40 0" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/><g fill="#fff" opacity=".9"><ellipse cx="90" cy="320" rx="80" ry="26"/><ellipse cx="320" cy="430" rx="90" ry="28"/></g><g fill="#A7F3D0" stroke="#059669" stroke-width="3"><circle cx="350" cy="270" r="22"/></g><g fill="#FEF3C7" stroke="#D97706" stroke-width="3"><circle cx="60" cy="470" r="24"/></g>',
        decor: [["icecastle", 300, 108, 1.4], ["icetree", 56, 236, 1.2], ["icetree", 352, 330, 1], ["icetree", 40, 400, 1], ["icetree", 236, 452, .9], ["icetree", 150, 170, .9]] } },
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
