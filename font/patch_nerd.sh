#!/usr/bin/env bash
# Build Error404 Mono Nerd Font (standard, not Mono: icons may span up to 2 cells; cell a2 of
# previews/nf-round1.png). Uses the official Nerd Fonts font-patcher (MIT) with every icon set.
# Needs: fontforge (apt install fontforge) and a sparse clone of ryanoasis/nerd-fonts containing
#   /font-patcher /src/glyphs/ /bin/scripts/name_parser/
# Usage: font/patch_nerd.sh /path/to/nerd-fonts
set -euo pipefail
NF="${1:?path to nerd-fonts checkout}"; HERE="$(cd "$(dirname "$0")" && pwd)"
export PYTHONIOENCODING=utf-8 LANG=C.UTF-8 LC_ALL=C.UTF-8
for w in Regular Bold; do
  (cd "$NF" && fontforge -quiet -script font-patcher --complete --careful --no-progressbars \
      --outputdir "$HERE/nerd" "$HERE/Error404Mono-$w.ttf")
done
