/* Shared by every game in this repo (base/ and variants/*):
   - adds an "All games" link to the level card, back to the landing page
   - ?play=<levelId> in the URL starts that level straight away (used by the landing page) */
(function () {
  var script = document.currentScript;
  var home = new URL(script.getAttribute("data-home") || "../../", location.href).href;
  var css = document.createElement("style");
  css.textContent = ".allgames{display:inline-block;align-self:center;width:auto;margin:0 auto .4rem;padding:.25rem .7rem;border-radius:999px;" +
    "background:#4A2E12;color:#FFF7E0;font:700 .95rem Andika,sans-serif;text-decoration:none}" +
    ".allgames:hover{background:#7A4A1E}";
  document.head.appendChild(css);
  var intro = document.getElementById("intro");
  if (intro) {
    var a = document.createElement("a");
    a.href = home; a.className = "allgames"; a.textContent = "← All games";
    intro.insertBefore(a, intro.firstChild);
  }
  var id = new URLSearchParams(location.search).get("play");
  if (id && typeof CONFIG !== "undefined") {
    var shown = CONFIG.levels.filter(function (l) { return !l.hidden; });
    var i = shown.findIndex(function (l) { return l.id === id; });
    var btn = document.querySelectorAll(".levels button")[i];
    if (btn) setTimeout(function () { btn.click(); }, 300);
  }
})();
