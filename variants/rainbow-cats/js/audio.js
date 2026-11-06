/* Voice (reads the word aloud) and little sound effects. */
let voice = null;
function pickVoice(){
  try{
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => /en-US/i.test(v.lang) && /female|samantha|google/i.test(v.name))
         || vs.find(v => /en-US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  }catch(e){}
}
if("speechSynthesis" in window){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

function say(text){
  try{
    if(!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = CONFIG.speechRate; if(voice) u.voice = voice;
    speechSynthesis.speak(u);
  }catch(e){}
}

let ac = null;
function tone(freqs, type, vol){
  try{
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = ac.currentTime;
    freqs.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain(), t = t0 + i * 0.12;
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + 0.35);
    });
  }catch(e){}
}
const happy   = () => tone([523, 659, 784], "sine", 0.2);
const oops    = () => tone([247, 208], "triangle", 0.12);
const fanfare = () => { tone([523, 659, 784, 1047], "triangle", 0.22); setTimeout(() => tone([1047, 1319, 1568], "sine", 0.12), 450); };
function jingle(times){
  let n = 0;
  const iv = setInterval(() => { tone([1319 + Math.random() * 500, 1760], "square", 0.04); if(++n >= times) clearInterval(iv); }, 160);
}
