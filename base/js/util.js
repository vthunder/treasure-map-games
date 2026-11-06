/* Small helpers shared by every file. */
const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const show = (id, on) => { $(id).hidden = !on; };

function shuffle(a){
  for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
