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
    { id: "easy",   name: "Level 1: Easy",   stars: 1, icon: "cat",    blurb: "Short words: cat, dog, sun" },
    { id: "medium", name: "Level 2: Medium", stars: 2, icon: "cloud",  hidden: true, blurb: "Blends & digraphs: cloud, sheep, train" },
    { id: "hard",   name: "Level 3: Hard",   stars: 3, icon: "dragon", blurb: "Big words: elephant, giraffe, penguin" },
    { id: "spell",  name: "Spelling Game",   stars: 1, icon: "c_t",    steps: 5, blurb: "Find the missing letter: c_t",
      text: { finLead: "You spelled {n} words all by yourself!" },
      makeRounds(n){
        const real = "cot cut cit dig dug sin son peg pug hit hot hut bad bid bud cap cop fix fax bet bit but pan pin pun bun gun nun run fun bog fog hog jog log big dig fig jig wig rig bag rag tag wag sag nag hen men ten den pen pin pan pun".split(" ");
        const abc = "abcdefghijklmnopqrstuvwxyz";
        return shuffle(["cat","dog","sun","pig","hat","bed","cup","fox","bus","hen","bat","box"]).slice(0, n).map(w => {
          const gone = w[1], ok = c => c !== gone && !real.includes(w[0] + c + w[2]);
          const vowels = shuffle("aeiou".split("").filter(ok));
          const others = shuffle(abc.split("").filter(c => !"aeiou".includes(c) && ok(c)));
          const wrong = vowels.concat(others).slice(0, 2);
          return { target: [w[0] + "_" + w[2]], answer: gone, speak: w, pic: IMG[w], choiceLabel: "Letter choice",
                   options: shuffle([gone].concat(wrong)).map(c => [c, '<span class="letter">' + c + '</span>']) };
        });
      } }
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
