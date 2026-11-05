# Word Treasure Map — AI Day build station

A reading game for 1st–2nd graders: read a word, tap the matching picture, win a key at each
stop on a treasure map, then pick the key that opens the chest. Plain HTML/CSS/JS, no build
step, no libraries, no modules.

## The situation (read this first)

Groups of 10–12 kids visit for ~8 minutes. They play the demo level, brainstorm a change,
**watch you build it live**, then play it. You have about **2 minutes** to build. So:

- Make the smallest change that delivers the kids' idea. Edit directly; don't refactor
  unrelated code, don't add files unless it helps, don't explain at length.
- Don't explore: this file tells you where things are. Never read `js/images.js` whole
  (41 KB of SVG); grep for the entry you need.
- Big ideas ("make it Minecraft", "online multiplayer") → build a small, playable version.
- The page on the projector reloads by itself on every save, so the kids see changes appear.
  A half-finished edit shows up too; that's fine.
- When done: run `tools/check.sh` (≈2–15 s), fix anything it reports, then
  `tools/group.sh save "<what changed>"`. Then say in one or two plain sentences what changed.

House rules: content is kid-safe and friendly (no scary or gross stuff beyond silly), words
stay at a 1st–2nd grade reading level, no losing screens that feel bad (a miss = "try again",
never "game over"), never put a child's name in code or commits. **Level 0: Demo must keep
working** — every group starts by playing it.

## Files (scripts load in this order; all share globals)

| File | What's in it |
|---|---|
| `index.html` | All screens: map + intro card (`#intro`, `.levels`), top bar (`#slots` key bag), question (`#quiz`: `#stlabel`, `#word`, `#hear`, `#choices`), key won (`#cel`), chest (`#finale`: `#keys`, `#finText`, `#finLead`, `#againBtn`, `#levelsBtn`), effects layer `#fx` |
| `js/util.js` | `$(id)`, `wait(ms)`, `show(id, on)`, `shuffle(a)`, `reduced` (prefers-reduced-motion) |
| `js/config.js` | `CONFIG`: `levels` (id, name, stars, icon, blurb, optional `steps`, optional `words` = which list), `rounds` (default stops, 10), `keys` (10 colors), `path` (11 map points: START + 10 stops), `decor`, `timing`, `speechRate` |
| `js/words.js` | `WORDS[listName]`: flat list (target + 2 random wrong pictures) or list of 3-word groups (all 3 shown) |
| `js/images.js` | `IMG[word]` = SVG string (100×100 via `S(inner)`, outline color `K`); split across `IMG`, `IMG_EASY`, `IMG_HARD`, merged with `Object.assign`. `DECOR[name]` = map scenery (40×40) |
| `js/audio.js` | `say(text)` speech, `tone(freqs, type, vol)`, `happy()`, `oops()`, `fanfare()`, `jingle(n)` |
| `js/fx.js` | `burst(n)` confetti, `coinRain(n)` |
| `js/map.js` | `setSteps(n)` redraws the map for n stops, `buildMap()`, `walk(k)`, `markCurrent/markDone`, key bag `fillSlot`, `activeKeys()`, `keySVG(color)`, `chestInner()`, globals `PTS`, `STEPS` |
| `js/game.js` | Flow + globals `mode`, `rounds`, `idx`, `locked`, `LAST`; `levelOf(id)`, `buildRounds`, `buildLevelButtons`, `startJourney`, `nextStop`, `renderRound`, `pick`, `celebrate`, `finale`, `goHome` |
| `css/style.css` | All styling; one-line rules; theme colors are CSS variables in `:root` (light + dark) |
| `tools/` | Event tooling (dev server, self-check, group branches). Don't change it for a game idea. |

## Game flow

`startJourney(levelId)` → `setSteps(steps)`, `buildRounds()` → per stop: `nextStop()` (hero
walks) → `renderRound()` shows `#quiz` → `pick(btn, opt)`: right answer → `celebrate(idx)`
(key flies to the bag) → next stop; last stop → `finale()` (try keys, chest opens, coins) →
`#againBtn` / `#levelsBtn`. `goHome()` cancels speech, hides overlays, resets the map.

A round is `{ target: [label, html], options: [[label, html], ...] }`. `renderRound` shows
`target[0]` as the big word (the `#word` button and **Hear it** both `say()` it) and puts each
option's `html` in a `.choice` button. `pick` compares `opt[0] === r.target[0]`.

## Recipes

- **New level with new words**: add a list to `WORDS`, an `IMG` entry for every word (same
  key as the word; draw a simple, bold, flat SVG in the house style), and a `CONFIG.levels`
  entry (`icon` must be an `IMG` key). Use `steps: 3`–`5` so it plays fast. Group lists need
  at least `steps` groups; flat lists need at least `steps` words (and at least 3).
- **Prompt ≠ answer** (math "2 + 3" → 5, rhymes, missing letter "c_t", "which one is
  bigger?"): give the round an `answer` label, make `pick` compare against
  `r.answer ?? r.target[0]`, and make options text/number HTML (e.g.
  `<span class="num">5</span>` + a CSS rule). Have Hear it read something sensible.
- **Timer / speed**: start it in `renderRound`, stop it on a right answer and in `goHome`
  (and before `finale`). Running out should be gentle: hint, shake, or just a new try.
- **Change the look** (hero, map colors, scenery, chest): hero SVG is inline in `index.html`
  (`#hero`); map art in `buildMap()`; scenery via `CONFIG.decor` + `DECOR`; colors in `:root`.
- **More/fewer stops**: `steps` on the level, max 10 (the map path has 10 stops, 10 key colors).

## Gotchas

- No modules: every top-level `const`/`let`/function is shared across files. A syntax error in
  any file stops the whole game — that's what `tools/check.sh` catches.
- `CONFIG.levels` order = button order on the intro card; the 4 existing buttons already
  nearly fill the card, so for a 5th level consider tightening `.level` padding.
- The `?v=` on script/CSS tags is leftover cache-busting; the dev server sends no-cache, so
  don't bother bumping it.
- Speech (`say`) and sounds need a user tap first in some browsers; the game already only
  speaks after taps.
- `tools/check.sh` plays every level by tapping choices until one is accepted, then tries
  keys at the chest. It relies on the ids `intro`, `quiz`, `choices`, `finale`, `keys`,
  `finText`, `finActions`, `levelsBtn` and `.levels button`. If a change needs a different
  flow (e.g. typing answers), update `tools/selftest.js` to match, or check in the browser.

## Event commands (the facilitator may ask you to run these)

```bash
tools/group.sh new [name]     # save current work, start a fresh copy of the demo game
tools/group.sh save "msg"     # save this group's version
tools/group.sh undo           # throw away unsaved changes (kept in git stash)
tools/group.sh show <branch>  # switch to main, a backup/..., or an earlier group
tools/group.sh list           # all groups and backups
tools/check.sh [ids]          # self-check (all levels, or e.g. demo,space)
python3 tools/serve.py        # dev server on http://localhost:8102 (no cache, auto-reload)
```

`main` is the clean demo game; groups are `group-NN[-name]`; ready-made fallbacks are
`backup/<idea>`.
