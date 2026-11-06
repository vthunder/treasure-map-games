/* ==========================================================
   CONFIG - the knobs you're most likely to change.
   (Word lists live in words.js, artwork in images.js.)
   ========================================================== */
const CONFIG = {
  rounds: 10,                 // default number of stops (= questions = keys) when a level does not set `steps`

  /* Level buttons on the opening screen. `icon` is a name from IMG (images.js). */
  /* Optional per-level settings: `steps` = number of stops/keys (default = rounds),
     `words` = which list in words.js to use (default = the level id), `hero` = player SVG or a function returning it, `randomRain: true` = random pictures fly out of the chest,
     `text` = overrides for CONFIG.text, `makeRounds(n)` = build the questions in code instead of
     from words.js (see buildRounds in game.js). `icon` may also be an emoji or short text,
     `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "zoo2000", name: "Level 500 Googol: Wild Colors", stars: 3, icon: "chameleon", steps: 5, randomRain: true,
      /* The player is the chameleon picture, flipped to face right (a function, because pictures load after this file). */
      hero: () => '<g transform="translate(44 0) scale(-1 1)">' + IMG.chameleon.replace("<svg ", '<svg x="-4" y="10" width="52" height="48" ') + '</g>',
      blurb: "You are a chameleon! Tricky animal names!",
      text: { stop: "Wild stop {i} of {n}!", chestStop: "The jungle treasure!", finWin: "Surprise! Random stuff!", finLead: "You named {n} tricky animals!" },
      /* 6th-grade animal names, 4 pictures per stop; distractors from the same tricky pool. */
      makeRounds(n){
        const hard = ["flamingo","peacock","chameleon","toucan","jellyfish","ladybug"], pool = hard.concat(["elephant","giraffe","dolphin","penguin","turtle","camel","donkey","eagle"]);
        return shuffle(hard.slice()).slice(0, n).map(w => ({ target: [w], options: shuffle([w, ...shuffle(pool.filter(x => x !== w)).slice(0, 3)]).map(picture) }));
      },
      map: { name: "zoo", background: '<defs><linearGradient id="zbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FDE68A"/><stop offset=".35" stop-color="#FDBA74"/><stop offset=".7" stop-color="#F9A8D4"/><stop offset="1" stop-color="#A5B4FC"/></linearGradient></defs><rect width="400" height="560" fill="url(#zbg)"/><g opacity=".55"><circle cx="70" cy="130" r="60" fill="#86EFAC"/><circle cx="330" cy="300" r="70" fill="#67E8F9"/><circle cx="150" cy="470" r="70" fill="#C4B5FD"/><circle cx="320" cy="60" r="40" fill="#FCA5A5"/></g>',
        decor: [["bigleaf", 56, 106, 1.3], ["flowerdot", 150, 168, 1], ["bigleaf", 352, 345, 1.2], ["flowerdot", 46, 440, 1], ["flowerdot", 236, 452, .9], ["bigleaf", 362, 204, 1], ["flowerdot", 200, 300, .8]] } },
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
