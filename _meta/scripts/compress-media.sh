#!/usr/bin/env bash
# Media budget gate for the vault. Compresses one file IN PLACE when it beats
# the original by >=10%; otherwise leaves it untouched. Extension never changes,
# so links keep working. Used by .github/workflows/media-sync.yml before every
# R2 upload; authors can run it locally too: _meta/scripts/compress-media.sh <file>
#
# Budget: stills capped at 1600px on the long edge (png/jpg quantized or
# re-encoded, webp q80), gif lossy-optimized (scaled 0.8 when still over 3MB),
# video 1280px h264 crf30. Needs: imagemagick or sips, pngquant, gifsicle,
# ffmpeg, webp tools. Missing tool = that type passes through untouched.
set -uo pipefail
f="$1"
[ -f "$f" ] || exit 0
ext="${f##*.}"; ext=$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')
d=$(mktemp -d); out="$d/out.$ext"
osz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")

resize_still() { # $1 in, $2 out (png)
  if command -v magick >/dev/null; then magick "$1" -resize '1600x1600>' "$2"
  elif command -v sips >/dev/null; then /bin/cp -f "$1" "$2" && sips -Z 1600 "$2" >/dev/null 2>&1
  else /bin/cp -f "$1" "$2"; fi
}

case "$ext" in
  png)
    resize_still "$f" "$d/r.png"
    command -v pngquant >/dev/null && pngquant --quality=40-85 --speed 1 --force --output "$out" "$d/r.png" 2>/dev/null || /bin/cp -f "$d/r.png" "$out"
    ;;
  jpg|jpeg)
    if command -v magick >/dev/null; then magick "$f" -resize '1600x1600>' -quality 82 "$out"; fi
    ;;
  webp)
    if command -v dwebp >/dev/null && dwebp "$f" -o "$d/r.png" >/dev/null 2>&1; then
      resize_still "$d/r.png" "$d/r2.png"
      cwebp -q 80 -m 6 "$d/r2.png" -o "$out" >/dev/null 2>&1
    fi  # animated webp: dwebp fails, file passes through
    ;;
  gif)
    command -v gifsicle >/dev/null && gifsicle -O3 --lossy=200 --colors 128 "$f" -o "$out" 2>/dev/null
    if [ -s "$out" ] && [ "$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")" -gt 3000000 ]; then
      gifsicle -O3 --lossy=200 --colors 128 --scale 0.8 "$f" -o "$d/s.gif" 2>/dev/null && /bin/cp -f "$d/s.gif" "$out"
    fi
    ;;
  mp4|mov)
    command -v ffmpeg >/dev/null && ffmpeg -nostdin -y -i "$f" -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 30 -preset medium -c:a aac -b:a 96k -movflags +faststart "$out" >/dev/null 2>&1
    ;;
  pdf)
    command -v gs >/dev/null && gs -q -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -o "$out" "$f" 2>/dev/null
    ;;
  *) exit 0;;
esac

[ -s "$out" ] || exit 0
nsz=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")
if [ "$nsz" -lt $((osz * 90 / 100)) ]; then
  /bin/cp -f "$out" "$f"
  echo "compressed $f: $osz -> $nsz"
fi
