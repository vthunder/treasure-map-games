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
     `hero` = SVG (44x58 viewBox inner) for the player on that level, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "dino", name: "Level 500: Dino Land", stars: 2, icon: "dinosaur", steps: 5, words: "dino",
      blurb: "You are a bunny! Hop past the dinosaurs!",
      text: { stop: "Hop {i} of {n}!", chestStop: "The dino treasure!", finWin: "Hop hop hooray!", finLead: "Bunny read {n} dino words!" },
      hero: '<ellipse cx="15" cy="10" rx="4.5" ry="11" fill="#fff" stroke="#9AA4AE" stroke-width="2" transform="rotate(-10 15 10)"/><ellipse cx="29" cy="10" rx="4.5" ry="11" fill="#fff" stroke="#9AA4AE" stroke-width="2" transform="rotate(10 29 10)"/><ellipse cx="15" cy="11" rx="2" ry="7" fill="#F9B8D3" transform="rotate(-10 15 11)"/><ellipse cx="29" cy="11" rx="2" ry="7" fill="#F9B8D3" transform="rotate(10 29 11)"/><ellipse cx="22" cy="42" rx="13" ry="12" fill="#fff" stroke="#9AA4AE" stroke-width="2"/><circle cx="34" cy="46" r="4" fill="#fff" stroke="#9AA4AE" stroke-width="1.5"/><circle cx="22" cy="25" r="11" fill="#fff" stroke="#9AA4AE" stroke-width="2"/><circle cx="18" cy="24" r="1.8" fill="#16385A"/><circle cx="26" cy="24" r="1.8" fill="#16385A"/><path d="M20.5 28h3l-1.5 2z" fill="#E88AA8"/><path d="M22 30q-2 2-4 1M22 30q2 2 4 1" fill="none" stroke="#9AA4AE" stroke-width="1.2" stroke-linecap="round"/><circle cx="15" cy="29" r="2" fill="#F9B8D3" opacity=".8"/><circle cx="29" cy="29" r="2" fill="#F9B8D3" opacity=".8"/><ellipse cx="16" cy="54" rx="6" ry="3.5" fill="#fff" stroke="#9AA4AE" stroke-width="2"/><ellipse cx="28" cy="54" rx="6" ry="3.5" fill="#fff" stroke="#9AA4AE" stroke-width="2"/>',
      map: { name: "dino", background: '<rect width="400" height="560" fill="#BFE3A0"/><g fill="#A8D58A"><ellipse cx="80" cy="160" rx="90" ry="40"/><ellipse cx="320" cy="320" rx="100" ry="45"/><ellipse cx="150" cy="470" rx="110" ry="40"/></g><path d="M250 60l40-50 40 50z" fill="#8B5A3C" stroke="#5A3516" stroke-width="3" stroke-linejoin="round"/><path d="M280 22q10-12 20 0" fill="#E0483E"/><g fill="#C8C8C8" opacity=".8"><circle cx="292" cy="6" r="8"/><circle cx="304" cy="-2" r="6"/></g><path d="M60 380q30-20 60 0" fill="none" stroke="#7FB8D0" stroke-width="10" stroke-linecap="round"/><path d="M200 140q40-14 70 4" fill="none" stroke="#7FB8D0" stroke-width="8" stroke-linecap="round"/>',
        decor: [["fern", 56, 106, 1.2], ["palm", 150, 168, 1], ["volcano", 362, 204, 1], ["dinoegg", 352, 345, 1], ["fern", 46, 440, 1], ["dinoegg", 236, 452, .9], ["palm", 352, 500, 1], ["fern", 210, 300, .9]] } },
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
