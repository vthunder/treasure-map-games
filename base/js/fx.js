/* Celebration effects: confetti/star burst and the gold coin rain. All drawn with CSS shapes. */
function burst(n){
  if(reduced) return;
  const fx = $("fx"), colors = ["#FFC93C", "#E0483E", "#3B7DDD", "#2FA36B", "#FF8A3D", "#fff"];
  const cx = innerWidth / 2, cy = innerHeight * 0.42;
  for(let i = 0; i < n; i++){
    const el = document.createElement("span");
    el.className = i % 2 === 0 ? "spark" : "confetti";
    el.style.left = cx + "px"; el.style.top = cy + "px";
    if(i % 2 === 0){ const s = 16 + Math.random() * 20; el.style.width = el.style.height = s + "px"; }
    else el.style.background = colors[i % colors.length];
    fx.appendChild(el);
    const ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * Math.min(innerWidth, innerHeight) * 0.5;
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist + 60;
    el.animate([
      { transform: "translate(0,0) scale(.4) rotate(0)", opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) scale(1) rotate(${Math.random() * 720 - 360}deg)`, opacity: 1, offset: .7 },
      { transform: `translate(${dx}px,${dy + 60}px) scale(.8) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
    ], { duration: 1100 + Math.random() * 700, easing: "cubic-bezier(.1,.7,.3,1)", fill: "forwards" }).onfinish = () => el.remove();
  }
}

function coinRain(n){
  if(reduced) return;
  const fx = $("fx");
  for(let i = 0; i < n; i++){
    const el = document.createElement("span");
    el.className = "coin";
    el.style.left = (Math.random() * 100) + "vw";
    el.style.setProperty("--sz", (22 + Math.random() * 26) + "px");
    el.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    el.style.setProperty("--rot", (Math.random() * 1080 - 540) + "deg");
    el.style.setProperty("--d", (2.2 + Math.random() * 2.2) + "s");
    el.style.setProperty("--dl", (Math.random() * 1.8) + "s");
    el.addEventListener("animationend", () => el.remove());
    fx.appendChild(el);
  }
}
