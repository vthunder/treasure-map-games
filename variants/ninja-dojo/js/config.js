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
    { id: "ninja", name: "Ninja Dojo", stars: 3, icon: "shuriken", steps: 5, keyRain: true,
      blurb: "Tough words for 5th-grade ninjas!",
      text: { stop: "Ninja trial {i} of {n}!", chestStop: "The secret scroll vault!", finWin: "Hi-yah! It\u2019s raining keys!", finLead: "You mastered {n} ninja words!" },
      /* 5th-grade words, 4 pictures per stop; wrong answers come from the same tough pool. */
      makeRounds(n){
        const pool = ["lantern","bamboo","scroll","lightning","hourglass","telescope","waterfall","shuriken","envelope","mountain","butterfly","unicorn","elephant","dolphin","tractor","penguin"];
        return shuffle(pool.slice(0, 8)).slice(0, n).map(w => ({ target: [w], options: shuffle([w, ...shuffle(pool.filter(x => x !== w)).slice(0, 3)]).map(picture) }));
      },
      hero: '<path d="M12 50l-2 6h10l2-6M24 50l2 6h10l-2-6" fill="#1B1F24"/><path d="M12 50V34h20v16z" fill="#232A33" stroke="#0E1115" stroke-width="2"/><rect x="11" y="38" width="22" height="4" fill="#E0483E"/><path d="M33 40l8 6M33 41l9 2" stroke="#E0483E" stroke-width="2.5" stroke-linecap="round"/><rect x="5" y="34" width="6" height="12" rx="3" fill="#232A33"/><rect x="33" y="34" width="6" height="12" rx="3" fill="#232A33"/><path d="M30 30l10-22" stroke="#C5D0D8" stroke-width="3" stroke-linecap="round"/><path d="M28 32l6-4" stroke="#4A2E12" stroke-width="4" stroke-linecap="round"/><circle cx="22" cy="20" r="12" fill="#232A33" stroke="#0E1115" stroke-width="2"/><rect x="11" y="16" width="22" height="7" rx="3" fill="#FFE0BD"/><circle cx="18" cy="19.5" r="1.8" fill="#16385A"/><circle cx="26" cy="19.5" r="1.8" fill="#16385A"/><path d="M15 16l5 1.5M29 16l-5 1.5" stroke="#16385A" stroke-width="1.5" stroke-linecap="round"/><path d="M10 12h24" stroke="#E0483E" stroke-width="3"/><path d="M10 12l-8 -4M10 12l-7 3" stroke="#E0483E" stroke-width="2.5" stroke-linecap="round"/>',
      map: { name: "ninja", background: '<defs><linearGradient id="nbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151B3A"/><stop offset=".6" stop-color="#2E2A5A"/><stop offset="1" stop-color="#3D2B4F"/></linearGradient></defs><rect width="400" height="560" fill="url(#nbg)"/><g fill="#fff" opacity=".8"><circle cx="0" cy="11" r="1.0"/><circle cx="97" cy="64" r="1.5"/><circle cx="194" cy="117" r="2.0"/><circle cx="291" cy="170" r="1.0"/><circle cx="388" cy="223" r="1.5"/><circle cx="85" cy="276" r="2.0"/><circle cx="182" cy="329" r="1.0"/><circle cx="279" cy="52" r="1.5"/><circle cx="376" cy="105" r="2.0"/><circle cx="73" cy="158" r="1.0"/><circle cx="170" cy="211" r="1.5"/><circle cx="267" cy="264" r="2.0"/><circle cx="364" cy="317" r="1.0"/><circle cx="61" cy="40" r="1.5"/><circle cx="158" cy="93" r="2.0"/><circle cx="255" cy="146" r="1.0"/><circle cx="352" cy="199" r="1.5"/><circle cx="49" cy="252" r="2.0"/><circle cx="146" cy="305" r="1.0"/><circle cx="243" cy="28" r="1.5"/><circle cx="340" cy="81" r="2.0"/><circle cx="37" cy="134" r="1.0"/><circle cx="134" cy="187" r="1.5"/><circle cx="231" cy="240" r="2.0"/><circle cx="328" cy="293" r="1.0"/><circle cx="25" cy="16" r="1.5"/><circle cx="122" cy="69" r="2.0"/><circle cx="219" cy="122" r="1.0"/><circle cx="316" cy="175" r="1.5"/><circle cx="13" cy="228" r="2.0"/><circle cx="110" cy="281" r="1.0"/><circle cx="207" cy="4" r="1.5"/><circle cx="304" cy="57" r="2.0"/><circle cx="1" cy="110" r="1.0"/><circle cx="98" cy="163" r="1.5"/><circle cx="195" cy="216" r="2.0"/><circle cx="292" cy="269" r="1.0"/><circle cx="389" cy="322" r="1.5"/><circle cx="86" cy="45" r="2.0"/><circle cx="183" cy="98" r="1.0"/><circle cx="280" cy="151" r="1.5"/><circle cx="377" cy="204" r="2.0"/><circle cx="74" cy="257" r="1.0"/><circle cx="171" cy="310" r="1.5"/><circle cx="268" cy="33" r="2.0"/></g><circle cx="320" cy="80" r="40" fill="#FFF3C4"/><circle cx="306" cy="70" r="6" fill="#EADFB0"/><path d="M0 420q60-60 120-20t130-30 150 20V560H0z" fill="#1E1F36" opacity=".9"/><path d="M0 480q80-40 160-10t140-20 100 10V560H0z" fill="#26283F"/>',
        decor: [["bamboostalk", 56, 120, 1.4], ["pagoda", 340, 210, 1.5], ["bamboostalk", 30, 430, 1.3], ["bamboostalk", 360, 500, 1.2], ["pagoda", 150, 300, 1], ["bamboostalk", 236, 452, 1]] } },
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
