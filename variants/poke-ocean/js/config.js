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
     `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "poke", name: "Pok\u00e9 Ocean", stars: 2, icon: "pokeball", steps: 4, words: "ocean", cannon: true, shark: true,
      blurb: "Catch sea creatures. Watch out for the shark!",
      text: { stop: "Wild creature {i} of {n}!", chestStop: "The last wild creature!", finWin: "You caught them all!", finLead: "You caught {n} ocean creatures!" },
      map: { name: "ocean", background: '<rect width="400" height="560" fill="#2E86C9"/><g fill="#3B9BE0" opacity=".7"><ellipse cx="90" cy="140" rx="70" ry="28"/><ellipse cx="320" cy="300" rx="80" ry="30"/><ellipse cx="170" cy="460" rx="90" ry="26"/></g><g fill="none" stroke="#9FD3F5" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M40 80q10-8 20 0t20 0"/><path d="M250 110q10-8 20 0t20 0"/><path d="M150 200q10-8 20 0t20 0"/><path d="M290 420q10-8 20 0t20 0"/><path d="M40 320q10-8 20 0t20 0"/><path d="M190 330q10-8 20 0t20 0"/></g><ellipse cx="40" cy="530" rx="48" ry="22" fill="#F2D38A" stroke="#C9A55A" stroke-width="2"/><ellipse cx="300" cy="170" rx="56" ry="24" fill="#F2D38A" stroke="#C9A55A" stroke-width="2"/>',
        decor: [["island", 56, 236, 1.2], ["island", 352, 505, 1], ["bubbles", 130, 92, 1], ["bubbles", 352, 262, 1], ["bubbles", 200, 300, .8], ["sailboat", 372, 34, 1], ["crab", 236, 452, .9], ["wave", 26, 34, .9]] } },
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
