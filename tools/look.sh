#!/usr/bin/env bash
# Screenshots for checking art and layout (≈3-6 s). Look at the PNGs it prints with the Read tool.
#   tools/look.sh                    intro screen (map + level buttons)
#   tools/look.sh <levelId>          intro, first question, and the open chest for that level
#   tools/look.sh --pictures a,b,c   a labeled sheet of those pictures ("all" = every picture)
cd "$(dirname "$0")/.." && exec node tools/look.mjs "$@"
