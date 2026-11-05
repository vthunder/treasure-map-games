#!/usr/bin/env bash
# Group workflow for the AI Day event. Every group gets its own git branch,
# started from `main` (the clean demo game). Nothing here deletes work:
# switching always saves first, and `undo` stashes (recoverable with `git stash list`).
#
#   tools/group.sh new [name]   save current work, start a fresh branch from main (group-01, group-02, ...)
#   tools/group.sh save [msg]   commit everything on the current branch
#   tools/group.sh undo         put aside uncommitted changes (back to the last save)
#   tools/group.sh show <branch> save current work, switch to another branch (main, backup/math, group-03, ...)
#   tools/group.sh list         list groups and backups with their last save
#   tools/group.sh where        print the current branch
set -euo pipefail
cd "$(dirname "$0")/.."

cur() { git rev-parse --abbrev-ref HEAD; }

autosave() {
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -q -m "${1:-Auto-save before switching}"
    echo "Saved changes on $(cur)."
  fi
}

case "${1:-}" in
  new)
    autosave
    n=$(git branch --list 'group-*' --format='%(refname:short)' | sed -E 's/^group-([0-9]+).*/\1/' | sort -n | tail -1)
    n=$(printf '%02d' $(( 10#${n:-0} + 1 )))
    name="group-$n${2:+-$(echo "$2" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9-')}"
    git switch -q -c "$name" main
    echo "Now on $name (fresh copy of the demo game)."
    ;;
  save)
    if [ -z "$(git status --porcelain)" ]; then echo "Nothing to save on $(cur)."; exit 0; fi
    autosave "${2:-Save}"
    ;;
  undo)
    if [ -z "$(git status --porcelain)" ]; then echo "Nothing to undo on $(cur)."; exit 0; fi
    git stash push -q -u -m "undo on $(cur) $(date +%H:%M:%S)"
    echo "Back to the last save on $(cur). (Changes kept in 'git stash list'.)"
    ;;
  show)
    [ -n "${2:-}" ] || { echo "usage: tools/group.sh show <branch>"; exit 1; }
    autosave
    git switch -q "$2"
    echo "Now on $2."
    ;;
  list)
    git for-each-ref --sort=refname --format='%(refname:short)|%(committerdate:format:%H:%M)|%(subject)' refs/heads |
      awk -F'|' -v c="$(cur)" '{ printf "%s %-28s %s  %s\n", ($1==c?"*":" "), $1, $2, $3 }'
    ;;
  where) cur ;;
  *) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
