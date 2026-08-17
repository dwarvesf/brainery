#!/usr/bin/env python3
"""Append each moved file's OLD live URL to its `redirect:` frontmatter list.

Run from the registers-moves worktree root. Reads the rename map from git
(origin/main...HEAD), computes the old URL (path sans .md, /readme + /_index
stripped, README.md -> parent), and inserts it into the YAML frontmatter's
redirect list (creating the key if absent). Skips files with no frontmatter.
"""
import subprocess, sys, re, pathlib

diff = subprocess.run(
    ["git", "diff", "--name-status", "-M", "origin/main...HEAD"],
    capture_output=True, text=True, check=True).stdout

renames = []
for line in diff.splitlines():
    parts = line.split("\t")
    if len(parts) == 3 and parts[0].startswith("R") and parts[2].endswith(".md"):
        renames.append((parts[1], parts[2]))

def old_url(path: str) -> str:
    p = path[:-3]  # strip .md
    base = pathlib.PurePosixPath(p)
    if base.name.lower() in ("readme", "_index"):
        p = str(base.parent)
    return "/" + p.strip("/")

changed = skipped = already = 0
for old, new in renames:
    f = pathlib.Path(new)
    if not f.exists():
        continue
    text = f.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        skipped += 1
        continue
    end = text.index("\n---", 4)
    fm = text[4:end]
    url = old_url(old)
    if url in fm:
        already += 1
        continue
    if re.search(r"^redirect:\s*$", fm, re.M):
        fm2 = re.sub(r"^redirect:\s*$", f"redirect:\n  - {url}", fm, count=1, flags=re.M)
    elif re.search(r"^redirect:", fm, re.M):
        fm2 = re.sub(r"^(redirect:.*)$", rf"\1\n  - {url}", fm, count=1, flags=re.M)
    else:
        fm2 = fm + f"\nredirect:\n  - {url}"
    f.write_text("---\n" + fm2 + text[end:], encoding="utf-8")
    changed += 1

print(f"renamed md files: {len(renames)}, redirect-added: {changed}, "
      f"already-had: {already}, no-frontmatter: {skipped}")
