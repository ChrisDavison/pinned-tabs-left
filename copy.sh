#!/usr/bin/env bash
set -euo pipefail
DESTINATION="${1:-$HOME/notes}/.obsidian/plugins/pinned-tabs-left"
mkdir -p "$DESTINATION"
cp main.js manifest.json "$DESTINATION"
echo "Copied into $DESTINATION"
