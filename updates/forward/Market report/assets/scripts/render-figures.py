#!/usr/bin/env python3
"""arXiv-style figure: top Elixir-language repos by GitHub stars (2026-08-15).

Per the arxiv-style-figure skill: STIX serif, thin clean spines, muted academic
palette, no grid, no rounded bars, numbered caption. Reproducible: data below +
shared rcParams. Render with /tmp/figenv/bin/python.
"""
import pathlib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["STIXGeneral", "DejaVu Serif"],
    "mathtext.fontset": "stix",
    "axes.edgecolor": "#1a1a1a",
    "axes.linewidth": 0.8,
    "axes.labelsize": 11,
    "xtick.labelsize": 8,
    "ytick.labelsize": 8,
    "legend.frameon": False,
    "axes.grid": False,
    "figure.dpi": 300,
    "savefig.dpi": 300,
})

PETROL = "#1F4E5F"

# (repo, stars_k) GitHub API, 2026-08-15
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

labels = [d[0] for d in DATA]
values = [d[1] for d in DATA]

fig, ax = plt.subplots(figsize=(8.2, 6.0))
y = list(range(len(DATA)))[::-1]  # top-first
ax.barh(y, values, height=0.62, color=PETROL, zorder=3)

for yi, v in zip(y, values):
    ax.text(v + 0.5, yi, f"{v:.1f}k", va="center", fontsize=7, color="#111111")

ax.set_yticks(y)
ax.set_yticklabels(labels)
ax.set_xlabel("GitHub stars (thousands)")
ax.set_title("Elixir adoption by repository stars", fontsize=12)
ax.set_xlim(0, 37)

# thin spines: keep left + bottom, drop top/right
for sp in ("top", "right"):
    ax.spines[sp].set_visible(False)

# light baseline ticks
ax.tick_params(axis="both", length=3, color="#1a1a1a")

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets"
OUT.mkdir(parents=True, exist_ok=True)
png = OUT / "fig1-ecosystem-stars.png"
pdf = OUT / "fig1-ecosystem-stars.pdf"
fig.savefig(png, bbox_inches="tight")
fig.savefig(pdf, bbox_inches="tight")
print("wrote", png)
print("wrote", pdf)
