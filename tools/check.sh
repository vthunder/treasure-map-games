#!/usr/bin/env bash
# Self-check: plays the game in headless Chrome (about 10x faster than real time)
# and prints PASS or FAIL.
#   tools/check.sh              every level
#   tools/check.sh demo,space   only these level ids
# Starts its own temporary server, so it works whether or not the dev server is running.
cd "$(dirname "$0")/.." && exec node tools/check.mjs "$@"
