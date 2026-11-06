# Treasure Map Games

A reading game for first and second graders: read the word, tap the matching picture, win a
key at each stop on a treasure map, then pick the key that opens the chest.

At an AI Day school event, small groups of kids played the demo level, invented a new level
(themes, characters, math, what flies out of the chest...) and watched Claude build it live.
This repo collects every game they made.

## Play

Open `index.html` (the landing page) through any static web server, for example:

```bash
python3 tools/serve.py        # http://localhost:8102 (no cache, auto-reload)
```

or publish the folder as-is (GitHub Pages, Netlify, any static host). There is no build step.

## Layout

```
index.html          landing page (reads games.js)
games.js            the list of games shown on the landing page
thumbs/             one preview picture per game
base/               the original game (Level 0: Demo plus Easy, Medium, Hard)
variants/<name>/    one complete, self-contained copy of the game per kids' level
shared/back.js      used by every game: "All games" link, and ?play=<level> to start a level directly
tools/              dev server, self-check, screenshots, smoke test, import script
CLAUDE.md           notes for Claude about how the game code is organised
```

Each game folder is plain HTML/CSS/JS. They share no code except `shared/back.js`, so changing
one game can never break another.

## Adding a game

1. Make the change on a git branch (start from `base/`'s code), or copy a variant folder.
2. `tools/import-variant.sh <branch> [name]` copies the branch's game into `variants/<name>/`.
3. Add an entry to `games.js` and a thumbnail in `thumbs/` (`GAME=variants/<name> tools/look.sh <level>` makes screenshots).
4. `node tools/smoke.mjs` checks that the landing page and every game load and start.

The original per-group branches (`backup/*`) are kept in git for history.
