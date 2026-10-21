#!/bin/bash
# Re-render the fieldnote figures on site/memo-features.md from their sources here.
# Edit a figN-*.js source, then run: bash _meta/memo-features/figures/build.sh
# Needs the fieldnote kit (ops-toolkit tools/fieldnote) and uv or pyftsubset for font subsetting.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=$(cd "$HERE/../../../site/assets" && pwd)
FN=${FIELDNOTE:-$HOME/workspace/tieubao/ops-toolkit/tools/fieldnote/bin/fieldnote}

render() {
  local n=$1 name=$2 alt=$3
  "$FN" publish "$HERE/fig$n-$name.js" --dest "$OUT" --slug memo-features --fig "$n" --name "$name" --embed --alt "$alt"
}

render 1 reader-map "One memo note in the middle with the reader tools around it: Aa display settings, resume where you stopped, ask about this article, Cmd+K search, writers and Fellows."
render 2 one-door "Flow: the reader asks in the Ask drawer, Ask answers from the article and up to five related notes, a question past the page moves into Neko chat in the same thread, a team member can join, and if chat is down the reader copies the question and opens Discord."
render 3 related-notes "Before and after for related notes: before, notes were picked by shared folder; after, by links, then backlinks, then the nearest notes by embedding, with weak matches dropped."
ls -l "$OUT"/memo-features-fig*.svg
