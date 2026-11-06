#!/usr/bin/env bash
# Copy a branch's game into variants/<name>/ and hook it up to the landing page.
#   tools/import-variant.sh <branch> [name]     e.g. tools/import-variant.sh backup/fox-forest
# Then add an entry for it in games.js (the landing page list).
set -euo pipefail
cd "$(dirname "$0")/.."
branch="$1"; name="${2:-${branch##*/}}"
dest="variants/$name"
rm -rf "$dest"; mkdir -p "$dest"
git archive "$branch" index.html css js | tar -x -C "$dest"
python3 - "$dest/index.html" <<'PY'
import sys
p = sys.argv[1]; s = open(p).read()
tag = '<script src="../../shared/back.js" data-home="../../"></script>\n'
if 'shared/back.js' not in s:
    i = s.rfind('</body>')
    s = s[:i] + tag + s[i:] if i >= 0 else s + tag
open(p, 'w').write(s)
PY
echo "Imported $branch -> $dest"
