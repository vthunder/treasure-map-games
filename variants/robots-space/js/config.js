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
    { id: "robots", name: "Level 3000: Robots in Space", stars: 3, icon: "robot", steps: 5, words: "space",
      blurb: "Robots, chickens and bananas!",
      text: { stop: "Space stop {i} of {n}! Beep boop!", chestStop: "The space treasure!", finWin: "Beep boop! Mission complete!", finLead: "Robot read {n} space words!" },
      buddies: ["spacechicken", "bananabuddy"],
      hero: '<rect x="19" y="2" width="6" height="7" fill="#5A6872"/><circle cx="22" cy="3" r="3" fill="#E0483E"/><rect x="10" y="8" width="24" height="17" rx="5" fill="#C5D0D8" stroke="#5A6872" stroke-width="2.5"/><rect x="14" y="12" width="16" height="8" rx="3" fill="#16385A"/><circle cx="18.5" cy="16" r="2.3" fill="#5BE3FF"/><circle cx="25.5" cy="16" r="2.3" fill="#5BE3FF"/><rect x="9" y="27" width="26" height="18" rx="4" fill="#3B7DDD" stroke="#1F4E9A" stroke-width="2.5"/><circle cx="22" cy="35" r="4" fill="#FFC93C" stroke="#B88A00" stroke-width="1.5"/><rect x="2" y="28" width="6" height="13" rx="3" fill="#A9B7C2" stroke="#5A6872" stroke-width="2"/><rect x="36" y="28" width="6" height="13" rx="3" fill="#A9B7C2" stroke="#5A6872" stroke-width="2"/><rect x="12" y="45" width="7" height="9" fill="#5A6872"/><rect x="25" y="45" width="7" height="9" fill="#5A6872"/><rect x="9" y="52" width="12" height="5" rx="2" fill="#2B333B"/><rect x="23" y="52" width="12" height="5" rx="2" fill="#2B333B"/>',
      map: { name: "space", background: '<rect width="400" height="560" fill="#0F1630"/><g opacity=".45"><ellipse cx="90" cy="150" rx="110" ry="50" fill="#5B3399"/><ellipse cx="320" cy="380" rx="120" ry="55" fill="#1F4E9A"/><ellipse cx="160" cy="500" rx="100" ry="40" fill="#8E2F6E"/></g><g fill="#fff"><circle cx="0" cy="17" r="1.0"/><circle cx="97" cy="78" r="1.6"/><circle cx="194" cy="139" r="2.2"/><circle cx="291" cy="200" r="1.0"/><circle cx="388" cy="261" r="1.6"/><circle cx="85" cy="322" r="2.2"/><circle cx="182" cy="383" r="1.0"/><circle cx="279" cy="444" r="1.6"/><circle cx="376" cy="505" r="2.2"/><circle cx="73" cy="6" r="1.0"/><circle cx="170" cy="67" r="1.6"/><circle cx="267" cy="128" r="2.2"/><circle cx="364" cy="189" r="1.0"/><circle cx="61" cy="250" r="1.6"/><circle cx="158" cy="311" r="2.2"/><circle cx="255" cy="372" r="1.0"/><circle cx="352" cy="433" r="1.6"/><circle cx="49" cy="494" r="2.2"/><circle cx="146" cy="555" r="1.0"/><circle cx="243" cy="56" r="1.6"/><circle cx="340" cy="117" r="2.2"/><circle cx="37" cy="178" r="1.0"/><circle cx="134" cy="239" r="1.6"/><circle cx="231" cy="300" r="2.2"/><circle cx="328" cy="361" r="1.0"/><circle cx="25" cy="422" r="1.6"/><circle cx="122" cy="483" r="2.2"/><circle cx="219" cy="544" r="1.0"/><circle cx="316" cy="45" r="1.6"/><circle cx="13" cy="106" r="2.2"/><circle cx="110" cy="167" r="1.0"/><circle cx="207" cy="228" r="1.6"/><circle cx="304" cy="289" r="2.2"/><circle cx="1" cy="350" r="1.0"/><circle cx="98" cy="411" r="1.6"/><circle cx="195" cy="472" r="2.2"/><circle cx="292" cy="533" r="1.0"/><circle cx="389" cy="34" r="1.6"/><circle cx="86" cy="95" r="2.2"/><circle cx="183" cy="156" r="1.0"/><circle cx="280" cy="217" r="1.6"/><circle cx="377" cy="278" r="2.2"/><circle cx="74" cy="339" r="1.0"/><circle cx="171" cy="400" r="1.6"/><circle cx="268" cy="461" r="2.2"/><circle cx="365" cy="522" r="1.0"/><circle cx="62" cy="23" r="1.6"/><circle cx="159" cy="84" r="2.2"/><circle cx="256" cy="145" r="1.0"/><circle cx="353" cy="206" r="1.6"/><circle cx="50" cy="267" r="2.2"/><circle cx="147" cy="328" r="1.0"/><circle cx="244" cy="389" r="1.6"/><circle cx="341" cy="450" r="2.2"/><circle cx="38" cy="511" r="1.0"/><circle cx="135" cy="12" r="1.6"/><circle cx="232" cy="73" r="2.2"/><circle cx="329" cy="134" r="1.0"/><circle cx="26" cy="195" r="1.6"/><circle cx="123" cy="256" r="2.2"/><circle cx="220" cy="317" r="1.0"/><circle cx="317" cy="378" r="1.6"/><circle cx="14" cy="439" r="2.2"/><circle cx="111" cy="500" r="1.0"/><circle cx="208" cy="1" r="1.6"/><circle cx="305" cy="62" r="2.2"/><circle cx="2" cy="123" r="1.0"/><circle cx="99" cy="184" r="1.6"/><circle cx="196" cy="245" r="2.2"/><circle cx="293" cy="306" r="1.0"/></g><circle cx="330" cy="90" r="26" fill="#F2E9C9" opacity=".9"/>',
        decor: [["ringplanet", 60, 110, 1.3], ["satellite", 350, 250, 1], ["tinystar", 150, 300, 1], ["tinystar", 40, 420, .9], ["ringplanet", 352, 480, .9], ["satellite", 236, 452, .8], ["tinystar", 200, 60, 1]] } },
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
