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
     `hero` = SVG (44x58 viewBox inner) for the player, `followers` = IMG names trailing the player, `sweetRain: true` = trees and candy burst from the chest, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "fox", name: "Level 67: Fox Forest", stars: 1, icon: "fox", steps: 5, sweetRain: true, followers: ["possum"],
      blurb: "Tricky fox math: plus and minus!",
      /* Harder puzzles: about half addition (sums up to 18), half subtraction (from up to 15).
         Subtraction shows all the animals with the ones taken away faded and crossed out. */
      makeRounds(n){
        const things = ["owl","frog","rabbit","bee","snail","deer"], names = { deer: "deer" };
        return Array.from({ length: n }, (_, i) => {
          const t = things[Math.floor(Math.random() * things.length)];
          const pl = k => k === 1 ? t : (names[t] || t + "s");
          const minus = i % 2 === 1 ? Math.random() < .8 : Math.random() < .3;
          let a, b, ans, label, speak, pic;
          if(minus){
            a = 6 + Math.floor(Math.random() * 10); b = 2 + Math.floor(Math.random() * (a - 3)); ans = a - b;
            label = `${a} \u2212 ${b}`; speak = `${a} ${pl(a)} take away ${b}`;
            pic = `<div class="mathpic"><span class="mgroup">${IMG[t].repeat(ans)}<span class="gone">${IMG[t].repeat(b)}</span></span></div>`;
          } else {
            a = 3 + Math.floor(Math.random() * 7); b = 3 + Math.floor(Math.random() * 7); ans = a + b;
            label = `${a} + ${b}`; speak = `${a} ${pl(a)} plus ${b} ${pl(b)}`;
            pic = `<div class="mathpic"><span class="mgroup">${IMG[t].repeat(a)}</span><b>+</b><span class="mgroup">${IMG[t].repeat(b)}</span></div>`;
          }
          const wrong = shuffle([ans - 3, ans - 2, ans - 1, ans + 1, ans + 2, ans + 3].filter(x => x >= 0)).slice(0, 3);
          return { target: [label], answer: String(ans), speak, pic, choiceLabel: "Number choice",
            options: shuffle([ans, ...wrong]).map(x => [String(x), `<span class="num">${x}</span>`]) };
        });
      },
      text: { stop: "Forest stop {i} of {n}!", chestStop: "The forest treasure!", finWin: "Trees and candy!", finLead: "Fox and possum solved {n} sums!" },
      hero: '<path d="M30 42q14 2 14-10-4 12-14 6z" fill="#E8742A" stroke="#A04A12" stroke-width="1.5"/><path d="M38 34l6-4" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="14" y="48" width="6" height="8" rx="2" fill="#3A2A1A"/><rect x="24" y="48" width="6" height="8" rx="2" fill="#3A2A1A"/><ellipse cx="22" cy="40" rx="12" ry="11" fill="#E8742A" stroke="#A04A12" stroke-width="2"/><ellipse cx="22" cy="43" rx="6" ry="7" fill="#FFF3E6"/><path d="M10 8l4 12 6-6zM34 8l-4 12-6-6z" fill="#E8742A" stroke="#A04A12" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 18q14-8 28 0l-14 16z" fill="#E8742A" stroke="#A04A12" stroke-width="2" stroke-linejoin="round"/><path d="M12 22q10 6 20 0l-10 12z" fill="#FFF3E6"/><circle cx="17" cy="21" r="1.8" fill="#16385A"/><circle cx="27" cy="21" r="1.8" fill="#16385A"/><circle cx="22" cy="31" r="2" fill="#2B2B2B"/>',
      map: { name: "forest", background: '<rect width="400" height="560" fill="#A7D88B"/><g fill="#8CC56E" opacity=".8"><ellipse cx="90" cy="150" rx="100" ry="40"/><ellipse cx="320" cy="320" rx="100" ry="45"/><ellipse cx="150" cy="470" rx="120" ry="40"/></g><path d="M220 60q60-30 120 10" fill="none" stroke="#7FB8D0" stroke-width="12" stroke-linecap="round"/><path d="M40 350q40 20 70 0" fill="none" stroke="#7FB8D0" stroke-width="10" stroke-linecap="round"/><g fill="#F9E27A"><circle cx="120" cy="90" r="3"/><circle cx="250" cy="250" r="3"/><circle cx="60" cy="300" r="3"/><circle cx="330" cy="460" r="3"/></g>',
        decor: [["pine", 56, 120, 1.3], ["pine", 150, 200, 1], ["mushroom", 352, 230, 1], ["pine", 340, 330, 1.2], ["mushroom", 46, 440, 1], ["pine", 236, 452, 1], ["pine", 360, 500, 1.1], ["mushroom", 200, 300, .9]] } },
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
