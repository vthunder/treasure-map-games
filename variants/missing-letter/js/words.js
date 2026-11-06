/* ==========================================================
   WORDS - edit these lists to change what children read.
   Every word needs a picture of the same name in IMG (images.js).

   * A flat list of words  -> each round picks a target and 2 random
                              other words from the list as wrong answers.
   * A list of groups      -> each round picks one group; all 3 words in
                              the group are the choices (so choose
                              look-alike words to make it harder).
   ========================================================== */
const WORDS = {
  easy: [
    "cat","dog","sun","pig","hat","bed","cup","fox","bus","egg","bee","car","cow","bat","box","hen","pen","key"
  ],

  medium: [
    ["clock","cloud","clown"],  ["plane","plate","plant"],   ["coat","goat","boat"],     ["ship","sheep","shell"],
    ["train","tree","truck"],   ["snail","snake","snowman"], ["chair","cheese","chick"], ["whale","wheel","wheat"],
    ["brush","bread","bridge"], ["rainbow","rabbit","rocket"], ["shark","barn","horse"]
  ],

  hard: [
    ["pencil","penguin","pumpkin"], ["basket","bucket","button"],  ["castle","candle","camel"],
    ["dragon","donkey","dolphin"],  ["spider","spoon","sponge"],   ["turtle","tiger","tractor"],
    ["monkey","mitten","mountain"], ["robot","ribbon","rainbow"],  ["giraffe","guitar","grapes"],
    ["elephant","envelope","eagle"]
  ]
};
