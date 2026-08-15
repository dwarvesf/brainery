#!/usr/bin/env python3
"""Render the Elixir ecosystem figure (top Elixir-language GitHub repos by stars).

Dependency-free: emits an SVG by hand, then converts raster PNG via rsvg-convert
if present (else keeps the SVG). Data is the GitHub API snapshot from 2026-08-15.
Light theme: #ffffff bg, #111827 text, #374151 border, one muted accent (#4f46e5).
"""
import subprocess, pathlib, sys

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets"
OUT.mkdir(parents=True, exist_ok=True)

# (label, stars_k) from the 2026-08-15 GitHub API top-Elixir-language repos
DATA = [
    ("anoma/anoma", 33.7),
    ("plausible/analytics", 28.5),
    ("phoenixframework/phoenix", 23.1),
    ("firezone/firezone", 9.0),
    ("supabase/realtime", 7.6),
    ("livebook-dev/livebook", 5.8),
    ("rrrene/credo", 5.2),
    ("blockscout/blockscout", 4.6),
    ("absinthe-graphql/absinthe", 4.4),
    ("ueberauth/guardian", 3.5),
    ("bitwalker/distillery", 3.0),
    ("elixir-nx/nx", 2.9),
    ("elixir-broadway/broadway", 2.7),
    ("nerves-project/nerves", 2.5),
    ("ash-project/ash", 2.5),
]

W, H = 1040, 660
BG = "#ffffff"
TXT = "#111827"
ACCENT = "#4f46e5"
MUTED = "#6b7280"
GRID = "#e5e7eb"
LABEL_X = 300
BAR_X = 318
BAR_MAX = 900
MAX_K = 34.0
top = 40
row = 40
bar_h = 24

svg = []
svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
svg.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')
svg.append(f'<text x="{BAR_X}" y="{top-12}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="{MUTED}">GitHub stars (thousands), Elixir-language repos, 2026-08-15</text>')

for i, (label, k) in enumerate(DATA):
    y = top + i * row
    bw = (BAR_MAX - BAR_X) * (k / MAX_K)
    svg.append(f'<text x="{LABEL_X}" y="{y+16}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="{TXT}">{label}</text>')
    svg.append(f'<line x1="{BAR_X}" y1="{y+bar_h/2}" x2="{BAR_MAX}" y2="{y+bar_h/2}" stroke="{GRID}" stroke-width="1"/>')
    svg.append(f'<rect x="{BAR_X}" y="{y}" width="{bw}" height="{bar_h}" rx="3" fill="{ACCENT}"/>')
    vx = BAR_X + bw + 8
    svg.append(f'<text x="{vx}" y="{y+17}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="{MUTED}">{k:.1f}k</text>')

for tick in (0, 10, 20, 30):
    tx = BAR_X + (BAR_MAX - BAR_X) * (tick / MAX_K)
    svg.append(f'<text x="{tx}" y="{top + len(DATA)*row + 18}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="{MUTED}">{tick}</text>')

svg.append("</svg>")
svg_path = OUT / "fig1-ecosystem-stars.svg"
svg_path.write_text("\n".join(svg), encoding="utf-8")
print("wrote", svg_path)

import shutil
png_path = OUT / "fig1-ecosystem-stars.png"
conv = None
for c in ("rsvg-convert", "magick", "convert"):
    if shutil.which(c):
        conv = c
        break
if conv:
    if conv == "rsvg-convert":
        subprocess.run([conv, str(svg_path), "-o", str(png_path)], check=True)
    else:
        subprocess.run([conv, str(svg_path), str(png_path)], check=True)
    print("wrote", png_path)
else:
    print("no svg->png converter found; kept svg only", file=sys.stderr)
