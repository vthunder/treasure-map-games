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
    { id: "zoo", name: "Animal Math", stars: 2, icon: "cow", steps: 5, words: "animals",
      blurb: "Read animal words and add up animals!",
      text: { stop: "Animal stop {i} of {n}!", finLead: "You read and added like a pro!" },
      /* Mix of word questions and animal addition puzzles (about 2 in 5 are math, always at least one of each). */
      makeRounds(n){
        const animals = WORDS.animals, rounds = [];
        const mathAt = new Set(shuffle([...Array(n).keys()]).slice(0, Math.max(1, Math.round(n * 0.4))));
        if(mathAt.size === n) mathAt.delete(0);
        const words = shuffle(animals.slice());
        for(let i = 0; i < n; i++){
          if(mathAt.has(i)){
            const a = 1 + Math.floor(Math.random() * 4), b = 1 + Math.floor(Math.random() * 4), sum = a + b;
            const pet = animals[Math.floor(Math.random() * animals.length)];
            const wrong = shuffle([sum - 2, sum - 1, sum + 1, sum + 2].filter(x => x >= 1)).slice(0, 2);
            const pl = k => k === 1 ? pet : ({ sheep: "sheep", fox: "foxes" }[pet] || pet + "s");
            const icons = k => `<span class="mgroup">${IMG[pet].repeat(k)}</span>`;
            rounds.push({
              target: [`${a} + ${b}`], answer: String(sum), speak: `${a} ${pl(a)} plus ${b} ${pl(b)}`,
              pic: `<div class="mathpic">${icons(a)}<b>+</b>${icons(b)}</div>`, choiceLabel: "Number choice",
              options: shuffle([sum, ...wrong]).map(x => [String(x), `<span class="num">${x}</span>`])
            });
          } else {
            const w = words.pop(), others = shuffle(animals.filter(x => x !== w)).slice(0, 2);
            rounds.push({ target: [w], options: shuffle([w, ...others]).map(picture) });
          }
        }
        return rounds;
      } },
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
