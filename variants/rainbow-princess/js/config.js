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
     `hero` = SVG (44x58 viewBox inner) for the player, `keyRain: true` = keys rain down when the chest opens, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "princess", name: "Rainbow Princess", stars: 3, icon: "crown", steps: 4, words: "princess", keyRain: true,
      blurb: "Super hard words for a brave princess!",
      text: { stop: "Rainbow stop {i} of {n}!", chestStop: "The royal treasure!", finWin: "It\u2019s raining keys!", finLead: "The princess read {n} words!" },
      hero: '<path d="M10 54L16 30h12l6 24z" fill="#F06CA8" stroke="#B83A78" stroke-width="2" stroke-linejoin="round"/><path d="M12 46q10 4 20 0" stroke="#FFD93C" stroke-width="2" fill="none"/><rect x="15" y="22" width="14" height="10" rx="3" fill="#F06CA8" stroke="#B83A78" stroke-width="2"/><rect x="6" y="24" width="6" height="12" rx="3" fill="#FFE0BD"/><rect x="32" y="24" width="6" height="12" rx="3" fill="#FFE0BD"/><path d="M9 22q-2-16 13-17 15 1 13 17v8H9z" fill="#8B4A22"/><circle cx="22" cy="15" r="9" fill="#FFE0BD"/><path d="M13 13q9-8 18 0" fill="#8B4A22"/><path d="M15 7l2-6 3 4 2-5 2 5 3-4 2 6z" fill="#FFD93C" stroke="#B88A00" stroke-width="1.2" stroke-linejoin="round"/><circle cx="19" cy="15" r="1.4" fill="#16385A"/><circle cx="25" cy="15" r="1.4" fill="#16385A"/><path d="M19.5 19q2.5 2 5 0" fill="none" stroke="#C2413A" stroke-width="1.3" stroke-linecap="round"/><circle cx="16.5" cy="18" r="1.5" fill="#F9B8D3"/><circle cx="27.5" cy="18" r="1.5" fill="#F9B8D3"/>',
      map: { name: "rainbow", background: '<defs><linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE3F1"/><stop offset=".5" stop-color="#E8E1FF"/><stop offset="1" stop-color="#DFF7FF"/></linearGradient></defs><rect width="400" height="560" fill="url(#pbg)"/><path d="M-40 420A240 240 0 0 1 440 420" fill="none" stroke="#FF5A5F" stroke-width="22" transform="translate(0 0)" opacity=".55"/><path d="M-40 420A240 240 0 0 1 440 420" fill="none" stroke="#FF9F1C" stroke-width="22" transform="translate(0 22)" opacity=".55"/><path d="M-40 420A240 240 0 0 1 440 420" fill="none" stroke="#FFE066" stroke-width="22" transform="translate(0 44)" opacity=".55"/><path d="M-40 420A240 240 0 0 1 440 420" fill="none" stroke="#4ADE80" stroke-width="22" transform="translate(0 66)" opacity=".55"/><path d="M-40 420A240 240 0 0 1 440 420" fill="none" stroke="#38BDF8" stroke-width="22" transform="translate(0 88)" opacity=".55"/><path d="M-40 420A240 240 0 0 1 440 420" fill="none" stroke="#A78BFA" stroke-width="22" transform="translate(0 110)" opacity=".55"/><g fill="#fff" opacity=".9"><ellipse cx="70" cy="110" rx="40" ry="16"/><ellipse cx="330" cy="250" rx="44" ry="16"/></g>',
        decor: [["heart", 60, 200, 1], ["heart", 350, 470, .9], ["sparkle", 140, 70, 1], ["sparkle", 360, 300, .8], ["sparkle", 200, 300, .7], ["sparkle", 40, 420, .8], ["heart", 240, 450, .7]] } },
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
