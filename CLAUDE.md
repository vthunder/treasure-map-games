# Word Treasure Map — AI Day build station

A reading game for 1st–2nd graders: read a word, tap the matching picture, win a key at each
stop on a treasure map, then pick the key that opens the chest. Plain HTML/CSS/JS, no build
step, no libraries, no modules.

## The situation (read this first)

Groups of 10–12 kids visit for ~8 minutes. They play the demo level, brainstorm a change,
**watch you build it live**, then play it. You have about **2 minutes** to build. So:

- Make the smallest change that delivers the kids' idea. Edit directly; don't refactor
  unrelated code, don't explain at length. This file tells you where things are, so don't explore.
- Never read `js/images.js` whole (40+ KB of SVG); grep for what you need.
- Big ideas ("make it Minecraft", "online multiplayer") → build a small, playable version.
- The game on the projector reloads by itself on every save, so the kids see changes appear.
- **Don't drive the Browser pane** (it may be what the kids are watching, and it's slow). To
  see your work, use `tools/look.sh` (screenshots you open with Read). Ignore hints to verify
  in the Browser pane.
- Finish with:
  1. `tools/check.sh demo,<your level id>` (≈2–4 s; plain `tools/check.sh` = every level, ≈14 s)
  2. If you drew pictures or changed the look: `tools/look.sh --pictures a,b,c` or
     `tools/look.sh <level id>` and glance at the PNGs; redraw anything that doesn't read clearly.
  3. `tools/group.sh save "<what changed>"` (saves on the current branch; `tools/group.sh where`
     shows it).
  4. One or two plain sentences on what changed and how to play it.

House rules: content is kid-safe and friendly (silly is fine; scary or gross is not), words at a
1st–2nd grade reading level, no losing screens that feel bad (a miss = "try again", never "game
over"), never put a child's name in code or commits. **Level 0: Demo must keep working**: every
group starts by playing it. If the kids' idea changes the demo itself, keep it playable.

## Files (scripts load in this order; everything is a shared global)

| File | What's in it |
|---|---|
| `index.html` | All screens, see "Screens" below. Hero SVG inline in `#hero`. |
| `js/util.js` | `$(id)`, `wait(ms)`, `show(id, on)` (toggles the `hidden` attribute, so never give a toggled element a CSS `display`), `shuffle(a)`, `reduced` |
| `js/config.js` | `CONFIG`: `levels`, `rounds` (default stops, 10), `text` (all journey/treasure wording), `keys` (10 colors), `path` (START + 10 stops), `decor`, `timing`, `speechRate` |
| `js/words.js` | `WORDS[listName]`: flat list (target + 2 random wrong pictures) or list of 3-word groups (all 3 shown) |
| `js/images.js` | `IMG[word]` = SVG string; `DECOR[name]` = map scenery (separate from IMG, e.g. `volcano` is only in DECOR); `keySVG(color)` |
| `js/audio.js` | `say(text)` speech, `tone(freqs, type, vol)`, `happy()`, `oops()`, `fanfare()`, `jingle(n)` |
| `js/fx.js` | `burst(n)` confetti, `coinRain(n)` |
| `js/map.js` | `setSteps(n)` redraws the map for n stops, `buildMap()`, `walk(k)`, `markCurrent/markDone`, key bag `buildSlots/fillSlot`, `activeKeys()`, `chestInner()` |
| `js/game.js` | Flow: `levelOf(id)`, `T(key, vars)`, `spoken(r)`, `answerOf(r)`, `buildRounds`, `buildLevelButtons`, `startJourney`, `nextStop`, `renderRound`, `pick`, `celebrate`, `finale`, `goHome` |
| `css/style.css` | One-line rules. Colors: `--bg --surface --ink --muted --good --goodSoft --off --line --sun --sand --water1 --water2` (light + dark versions in `:root`) |
| `tools/` | Event tooling (dev server, check, look, group branches). Don't change it for a game idea. |

Global names already taken (pick different ones for new code): `$ wait reduced show shuffle
CONFIG WORDS S K IMG IMG_EASY IMG_HARD DECOR keySVG voice pickVoice say ac tone happy oops fanfare
jingle burst coinRain FULL_PATH PTS STEPS activeKeys setSteps segs segDone stations slotEls segPath
chestInner decor buildMap buildSlots fillSlot placeHero resetMap markCurrent markDone walk mode
rounds idx locked LAST levelOf STAR picture T spoken answerOf buildRounds buildLevelButtons
startJourney nextStop goHome renderRound pick celebrate finale`.

## Screens (`index.html`)

- Map: `#mapwrap` > `#mapsvg` (drawn by `buildMap`), `#hero`, intro card `#intro` (`.title`,
  `.lead`, `.levels` buttons with `data-level`).
- Top bar `#topbar`: `#homeBtn` + key bag `#slots` (10 slots; it's full, no room for more).
- Question `#quiz` > `.card` > `.qtop` (`#qHome`, `#stlabel`) > `.wordbox` (`#word`, `#hear`)
  > `#choices` (`.choice` buttons, added by `renderRound`). New question UI (score, timer bar)
  goes between `.qtop` and `.wordbox`, or between `.wordbox` and `#choices`.
- Key won `#cel` (`#celItem`, `#celCap`). Chest `#finale`: `#chestBig`, `#finPrompt`, `#keys`,
  `#finText` (`#finWin` headline, `#finLead`), `#finActions` (`#againBtn`, `#levelsBtn`).

## Game flow

`startJourney(levelId)` → `setSteps(steps)`, `buildRounds()` → per stop: `nextStop()` (hero
walks, then `renderRound()`, **then** `show("quiz")`, so inside `renderRound` the quiz is still
hidden) → `pick(btn, opt)`: right → `celebrate(idx)` (key flies to the bag) → next stop; last
stop → `finale()` (try keys, chest opens, coins) → `#againBtn` / `#levelsBtn`. `goHome()`
cancels speech, hides overlays, resets the map. `levelOf(mode)` = the level being played.

A round is `{ target: [label, html], options: [[label, html], ...], answer?, speak? }`.
`renderRound` shows `target[0]` as the big prompt (only `target[0]` is used) and puts each
option's `html` in a `.choice` button. Right option: label `=== answerOf(r)` (`r.answer`, else
`target[0]`). Hear it, tapping the word, and the right-answer voice all say `spoken(r)`
(`r.speak`, else `target[0]`). Choice buttons have `aria-label="Picture choice"`; change it if
the choices aren't pictures.

All on-screen journey/treasure wording comes from `CONFIG.text` via `T(key, {i})`: `stop`,
`chestStop`, `finPrompt`, `finRetry`, `finFits`, `finWin`, `finLead` (`{n}` = stops). A level
can override any of them with `text: { finWin: "You found the giant bone!" }`.

## Levels

`CONFIG.levels` entries: `id`, `name`, `stars`, `icon` (an `IMG` key, or an emoji/short text
like `"123"`), `blurb`, optional `steps` (stops, max 10), `words` (list name, default = id),
`text` (wording overrides), `makeRounds(n)` (build questions in code), `hidden: true` (no
button). Levels now: `demo` (3 stops, uses the `hard` list), `easy`, `medium`, `hard` (10 stops
each). Button order = array order. **Card space:** the 4 buttons already fill the card on a
720p screen; when adding a level, hide one or more of easy/medium/hard (`hidden: true`) unless
the facilitator says otherwise. Each word in a list is used at most once per game.

## Pictures

Existing `IMG` words: clock cloud clown plane plate plant coat goat boat ship sheep shell train
tree truck snail snake snowman chair cheese chick whale wheel wheat brush bread bridge rainbow
rabbit rocket shark barn horse cat dog sun pig hat bed cup fox bus egg bee car cow bat box hen
pen key pencil penguin pumpkin basket bucket button castle candle camel dragon donkey dolphin
spider spoon sponge turtle tiger tractor monkey mitten mountain robot ribbon giraffe guitar
grapes elephant envelope eagle.

New pictures go in a new object just above the `Object.assign(IMG, IMG_EASY, IMG_HARD);` line,
added to that call: `const IMG_SPACE = { moon: S(`...`), ... };` and
`Object.assign(IMG, IMG_EASY, IMG_HARD, IMG_SPACE);`. Style: `S(inner)` wraps a 100×100 viewBox;
bold simple shapes, flat fills, dark outlines (`K` = `#16385A`, or a darker shade of the fill),
`stroke-width` 3–6, round joins, one or two highlight details, fill most of the box. Example:

```js
egg: S('<ellipse cx="50" cy="54" rx="30" ry="38" fill="#FFF6E0" stroke="#D9C49A" stroke-width="4"/><ellipse cx="40" cy="40" rx="6" ry="10" fill="#fff"/>'),
```

Pick a recognizable view (side view for animals, the classic icon shape for objects). Things
that came out unclear in rehearsal: footprints (draw 3 pointed toes + heel pad), claws (one
big curved claw on a toe). Always look at new pictures with `tools/look.sh --pictures ...`.

## Recipes

- **New level with new words**: list in `WORDS`, an `IMG` entry for every word, a
  `CONFIG.levels` entry with `steps: 3`–`5`. Flat list: ≥ `steps` words and ≥ 3. Group list:
  ≥ `steps` groups.
- **Questions made in code** (math "2 + 3", rhymes, missing letter "c_t", counting): give the
  level `makeRounds(n)` returning n rounds, each with `target: ["2 + 3"]`, `answer: "5"`,
  `speak: "2 plus 3"`, `options: [["5", '<span class="num">5</span>'], ...]` (add a CSS rule
  for `.choice .num`, e.g. big bold `var(--ink)`). No `WORDS`/`IMG` needed. Set
  `text: { finLead: "You solved {n} problems!" }` and a text `icon`.
- **Timer**: add a per-level option (e.g. `timer: 10`) read with `levelOf(mode).timer`, so other
  levels are unaffected. Start it at the end of `renderRound`; stop it on a right answer and in
  `goHome`. Running out = gentle: `oops()`, a "Time's up! Try again!" message, restart. Guard
  any delayed restart with `if(locked || $("quiz").hidden) return;`. The check never lets a
  timer run out, so read the timeout code twice.
- **Teams / scores**: track per team with `idx % 2`; show a score row inside `#quiz` above
  `.wordbox` (the top bar is full); announce in `#stlabel` (keep "The treasure chest!" on the
  last stop) and give the result with `$("finWin")` / `$("finLead")` in `finale()`. **Use an
  even number of stops** (e.g. `steps: 4`) so teams get equal turns; the demo has 3. Write
  "1 point" vs "2 points".
- **Change the look**: hero SVG in `index.html` `#hero` is a 44×58 viewBox, anchored at its
  bottom-center on the path (`.hero` uses `translate(-50%,-92%)`); `.flipper` mirrors it to face
  the walking direction, so draw it facing right. Map art: `buildMap()`; scenery: `CONFIG.decor`
  + `DECOR` (40×40); colors: `:root` variables (both light and dark blocks).
- **Change the treasure**: art in `chestInner()` (`js/map.js`, used on the map X and in the
  finale): a 160-wide box, body from y≈62 down, contents (coins) sit at y≈40–62, `.lid` (y≈14–66)
  hides them until `.finale.open`, gold straps are drawn after the contents. Words: `CONFIG.text`.
- **More/fewer stops**: `steps` on the level, max 10.

## Gotchas

- A syntax error in any file stops the whole game; `tools/check.sh` catches it.
- `tools/check.sh` taps choices until one is accepted and tries keys at the chest; it relies on
  the ids `intro`, `quiz`, `choices`, `finale`, `keys`, `finText`, `finActions`, `levelsBtn` and
  `.levels button[data-level]`. It only checks that the game plays through, not that a new
  feature works or looks right. If a change needs a different flow (e.g. typing answers),
  update `tools/selftest.js` to match.
- The `?v=` on script/CSS tags is leftover cache-busting; the dev server sends no-cache, so
  don't bother bumping it.

## Event commands (the facilitator may ask you to run these)

```bash
tools/group.sh new [name]     # save current work, start a fresh copy of the demo game
tools/group.sh save "msg"     # save this group's version
tools/group.sh undo           # throw away unsaved changes (kept in git stash)
tools/group.sh show <branch>  # switch to main, a backup/..., or an earlier group
tools/group.sh list           # all groups and backups
tools/check.sh [ids]          # self-check (all levels, or e.g. demo,space)
tools/look.sh [id | --pictures a,b]   # screenshots into tools/out/ (LOOK_SIZE=1280x720 for projector size)
python3 tools/serve.py        # dev server on http://localhost:8102 (no cache, auto-reload)
```

`main` is the clean demo game; groups are `group-NN[-name]`; ready-made fallbacks are
`backup/<idea>`.
