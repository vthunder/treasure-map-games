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
     `hero` = SVG (44x58 viewBox inner) for the player, `starRain: true` = stars and spaceships burst from the chest, `hidden: true` = keep the level but leave its button off the card. */
  levels: [
    { id: "demo",   name: "Level 0: Demo",   stars: 0, icon: "penguin", steps: 3, words: "hard", blurb: "Just 3 stops, with Level 3 words" },
    { id: "alien", name: "Level 10: Alien Space", stars: 3, icon: "alien", steps: 5, words: "space", starRain: true,
      blurb: "You are an alien! Zoom through space!",
      text: { stop: "Planet {i} of {n}!", chestStop: "The cosmic treasure!", finWin: "Stars and spaceships!", finLead: "The alien read {n} space words!" },
      hero: '<path d="M15 12L9 3M29 12l6-9" stroke="#3E9B4F" stroke-width="2.5" stroke-linecap="round"/><circle cx="9" cy="3" r="2.8" fill="#FFD93C"/><circle cx="35" cy="3" r="2.8" fill="#FFD93C"/><rect x="13" y="50" width="6" height="6" rx="2" fill="#3E9B4F"/><rect x="25" y="50" width="6" height="6" rx="2" fill="#3E9B4F"/><path d="M12 34q10-6 20 0v14q-10 6-20 0z" fill="#8E5BD9" stroke="#5B3399" stroke-width="2"/><rect x="5" y="34" width="6" height="11" rx="3" fill="#7ED957"/><rect x="33" y="34" width="6" height="11" rx="3" fill="#7ED957"/><ellipse cx="22" cy="21" rx="16" ry="14" fill="#7ED957" stroke="#3E9B4F" stroke-width="2.5"/><ellipse cx="16" cy="20" rx="4.5" ry="5.5" fill="#fff" stroke="#16385A" stroke-width="1.2"/><ellipse cx="28" cy="20" rx="4.5" ry="5.5" fill="#fff" stroke="#16385A" stroke-width="1.2"/><circle cx="16.5" cy="21" r="2.5" fill="#16385A"/><circle cx="28.5" cy="21" r="2.5" fill="#16385A"/><path d="M18 28q4 3 8 0" fill="none" stroke="#2E6E2E" stroke-width="1.8" stroke-linecap="round"/>',
      map: { name: "space", background: '<rect width="400" height="560" fill="#0B0F26"/><g opacity=".5"><ellipse cx="300" cy="140" rx="120" ry="55" fill="#1F4E9A"/><ellipse cx="90" cy="360" rx="110" ry="50" fill="#5B3399"/><ellipse cx="260" cy="500" rx="120" ry="40" fill="#0F6E6E"/></g><g fill="#fff"><circle cx="0" cy="23" r="1.0"/><circle cx="89" cy="90" r="1.6"/><circle cx="178" cy="157" r="2.2"/><circle cx="267" cy="224" r="1.0"/><circle cx="356" cy="291" r="1.6"/><circle cx="45" cy="358" r="2.2"/><circle cx="134" cy="425" r="1.0"/><circle cx="223" cy="492" r="1.6"/><circle cx="312" cy="559" r="2.2"/><circle cx="1" cy="66" r="1.0"/><circle cx="90" cy="133" r="1.6"/><circle cx="179" cy="200" r="2.2"/><circle cx="268" cy="267" r="1.0"/><circle cx="357" cy="334" r="1.6"/><circle cx="46" cy="401" r="2.2"/><circle cx="135" cy="468" r="1.0"/><circle cx="224" cy="535" r="1.6"/><circle cx="313" cy="42" r="2.2"/><circle cx="2" cy="109" r="1.0"/><circle cx="91" cy="176" r="1.6"/><circle cx="180" cy="243" r="2.2"/><circle cx="269" cy="310" r="1.0"/><circle cx="358" cy="377" r="1.6"/><circle cx="47" cy="444" r="2.2"/><circle cx="136" cy="511" r="1.0"/><circle cx="225" cy="18" r="1.6"/><circle cx="314" cy="85" r="2.2"/><circle cx="3" cy="152" r="1.0"/><circle cx="92" cy="219" r="1.6"/><circle cx="181" cy="286" r="2.2"/><circle cx="270" cy="353" r="1.0"/><circle cx="359" cy="420" r="1.6"/><circle cx="48" cy="487" r="2.2"/><circle cx="137" cy="554" r="1.0"/><circle cx="226" cy="61" r="1.6"/><circle cx="315" cy="128" r="2.2"/><circle cx="4" cy="195" r="1.0"/><circle cx="93" cy="262" r="1.6"/><circle cx="182" cy="329" r="2.2"/><circle cx="271" cy="396" r="1.0"/><circle cx="360" cy="463" r="1.6"/><circle cx="49" cy="530" r="2.2"/><circle cx="138" cy="37" r="1.0"/><circle cx="227" cy="104" r="1.6"/><circle cx="316" cy="171" r="2.2"/><circle cx="5" cy="238" r="1.0"/><circle cx="94" cy="305" r="1.6"/><circle cx="183" cy="372" r="2.2"/><circle cx="272" cy="439" r="1.0"/><circle cx="361" cy="506" r="1.6"/><circle cx="50" cy="13" r="2.2"/><circle cx="139" cy="80" r="1.0"/><circle cx="228" cy="147" r="1.6"/><circle cx="317" cy="214" r="2.2"/><circle cx="6" cy="281" r="1.0"/><circle cx="95" cy="348" r="1.6"/><circle cx="184" cy="415" r="2.2"/><circle cx="273" cy="482" r="1.0"/><circle cx="362" cy="549" r="1.6"/><circle cx="51" cy="56" r="2.2"/><circle cx="140" cy="123" r="1.0"/><circle cx="229" cy="190" r="1.6"/><circle cx="318" cy="257" r="2.2"/><circle cx="7" cy="324" r="1.0"/><circle cx="96" cy="391" r="1.6"/><circle cx="185" cy="458" r="2.2"/><circle cx="274" cy="525" r="1.0"/><circle cx="363" cy="32" r="1.6"/><circle cx="52" cy="99" r="2.2"/><circle cx="141" cy="166" r="1.0"/><circle cx="230" cy="233" r="1.6"/><circle cx="319" cy="300" r="2.2"/><circle cx="8" cy="367" r="1.0"/><circle cx="97" cy="434" r="1.6"/><circle cx="186" cy="501" r="2.2"/><circle cx="275" cy="8" r="1.0"/><circle cx="364" cy="75" r="1.6"/><circle cx="53" cy="142" r="2.2"/><circle cx="142" cy="209" r="1.0"/><circle cx="231" cy="276" r="1.6"/></g><circle cx="70" cy="80" r="34" fill="#E8E2CF"/><g fill="#CFC8B0"><circle cx="60" cy="72" r="7"/><circle cx="82" cy="92" r="9"/></g><ellipse cx="40" cy="532" rx="54" ry="22" fill="#9A93B8"/><ellipse cx="300" cy="172" rx="56" ry="20" fill="#9A93B8"/>',
        decor: [["ringplanet", 340, 330, 1.3], ["satellite", 150, 200, 1], ["tinystar", 220, 310, 1], ["tinystar", 40, 430, .9], ["ringplanet", 352, 490, .9], ["satellite", 236, 452, .8], ["tinystar", 200, 60, 1]] } },
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
