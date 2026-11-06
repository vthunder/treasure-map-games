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
     `hero` = SVG (44x58 viewBox inner) for the player, `slimeRain: true` = slime and monsters burst from the chest, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "slime", name: "Level 110: Slime Swamp", stars: 2, icon: "slime", steps: 5, slimeRain: true,
      /* Sports math in the swamp: count basketballs or soccer balls, add them up (sums 2 to 12). */
      makeRounds(n){
        const balls = [["basketball", "basketballs"], ["soccerball", "soccer balls"]];
        return Array.from({ length: n }, (_, i) => {
          const [key, word] = balls[i % 2];
          const a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6), sum = a + b;
          const wrong = shuffle([sum - 2, sum - 1, sum + 1, sum + 2].filter(x => x >= 1)).slice(0, 3);
          const group = k => `<span class="mgroup">${IMG[key].repeat(k)}</span>`;
          return { target: [`${a} + ${b}`], answer: String(sum), speak: `${a} plus ${b} ${word}`,
            pic: `<div class="mathpic">${group(a)}<b>+</b>${group(b)}</div>`, choiceLabel: "Number choice",
            options: shuffle([sum, ...wrong]).map(x => [String(x), `<span class="num">${x}</span>`]) };
        });
      },
      blurb: "Silly swamp sports math!",
      text: { stop: "Slime game {i} of {n}!", chestStop: "The gooey treasure!", finWin: "SPLAT! Slime and monsters!", finLead: "Capybara scored {n} math points!" },
      hero: '<rect x="10" y="48" width="7" height="8" rx="2" fill="#7A4E2C"/><rect x="27" y="48" width="7" height="8" rx="2" fill="#7A4E2C"/><ellipse cx="22" cy="38" rx="17" ry="13" fill="#B07A4C" stroke="#6E4524" stroke-width="2"/><rect x="14" y="10" width="22" height="20" rx="9" fill="#B07A4C" stroke="#6E4524" stroke-width="2"/><ellipse cx="17" cy="10" rx="3" ry="2.5" fill="#8A5A34"/><ellipse cx="31" cy="10" rx="3" ry="2.5" fill="#8A5A34"/><rect x="26" y="18" width="12" height="11" rx="5" fill="#9A6A3E" stroke="#6E4524" stroke-width="1.5"/><circle cx="34" cy="22" r="1.3" fill="#3A2414"/><circle cx="37" cy="22" r="1.2" fill="#3A2414"/><path d="M20 17q2-1.5 4 0" stroke="#3A2414" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M28 17q2-1.5 4 0" stroke="#3A2414" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M14 6q6-4 12 0" stroke="#7CFC6A" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="4" r="3" fill="#7CFC6A" stroke="#2E9A1E" stroke-width="1"/>',
      map: { name: "slime", background: '<rect width="400" height="560" fill="#C9F2B8"/><g fill="#A6E890" opacity=".8"><ellipse cx="90" cy="150" rx="100" ry="40"/><ellipse cx="320" cy="320" rx="100" ry="45"/><ellipse cx="150" cy="470" rx="120" ry="40"/></g><path d="M0 0h400v30q-20 0-20 20t-20-10-30 30-30-30-40 20-30-20-40 30-40-30-30 10-40-20-30 20-30-20V0z" fill="#7CFC6A" stroke="#2E9A1E" stroke-width="3"/><g fill="#7CFC6A" stroke="#2E9A1E" stroke-width="2.5"><ellipse cx="300" cy="190" rx="70" ry="20"/><ellipse cx="80" cy="370" rx="60" ry="18"/><ellipse cx="40" cy="530" rx="50" ry="18"/></g><path d="M-10 400q80-40 150 0t140-20 140 10" fill="none" stroke="#5BB4F0" stroke-width="18" stroke-linecap="round" opacity=".85"/><path d="M-10 400q80-40 150 0t140-20 140 10" fill="none" stroke="#BFE6F7" stroke-width="4" stroke-dasharray="10 14" stroke-linecap="round"/><path d="M260 220q30 30 10 70" fill="none" stroke="#5BB4F0" stroke-width="12" stroke-linecap="round" opacity=".8"/><g fill="#fff" opacity=".6"><circle cx="280" cy="186" r="4"/><circle cx="70" cy="366" r="3.5"/></g>',
        decor: [["hoop", 56, 236, 1.4], ["smiley", 150, 120, 1], ["goal", 352, 330, 1.4], ["cutepoop", 40, 430, 1.1], ["trashcan", 236, 452, 1.1], ["hoop", 360, 500, 1.1], ["peel", 200, 300, 1], ["smiley", 340, 230, .9], ["cutepoop", 120, 360, .9], ["bottle", 300, 420, .9], ["minibb", 60, 160, .9]] } },
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
