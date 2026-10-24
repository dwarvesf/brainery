---
title: Memo media and styling standard
description: One rule set for images, figures, alt text, dark-theme safety and imported styling on Dwarves Memo, with a test for every rule and the checklist editors run before approving a post.
date: 2026-10-18
authors:
  - tieubao
tags:
  - memo
  - media
  - style-guide
slug: memo-media-standard
kind: reference
draft: false
---

This page is the single rule set for images and figures on memo. It applies to every post, whichever door it came through. [Contribute to memo](/contribute-to-memo) summarizes it in chapters 2 and 5, and the contributor skills link here instead of copying it.

Each rule names who it applies to and how to test it.

- **Everyone** covers repo posts and guest imports.
- **Repo posts** are posts written in `dwarvesf/brainery` by members and fellows, through a branch or a fork.
- **Guest imports** are posts memo converts from a writer's own site.

A rule that says target is a budget the editors check by hand. No automatic check blocks a post on a target today.

## Formats

1. **Everyone.** Draw diagrams and charts as SVG, never as a screenshot of a diagram. Test: no raster file in the post holds a diagram. From Excalidraw, export SVG with "Embed scene" turned on, so the same file reopens in Excalidraw for later edits. Test: `rg -c 'excalidraw' <f>.svg` prints a count above 0. Reason: without the scene, a later fix to a typo or a color means redrawing the figure.
2. **Everyone.** Use a raster only for photos, screenshots and scans. Use webp at quality 80, or PNG after `pngquant`, for screenshots, and jpeg or webp for photos. Test: `file <f>` reports png, webp or jpeg.
3. **Repo posts.** Reference one file per image. Do not commit a `.webp` twin beside a `.png`. Test: no two files in `assets/` share a basename. Reason: the worker does not negotiate formats, so the twin is never served.
4. **Everyone.** Use GIF or video only when motion carries meaning that a still cannot. Prefer a short mp4 to a GIF. Test: the post says in text what the motion shows.

## Byte budgets and dimensions

5. **Repo posts, target.** A single-card screenshot is about 14 KB. A dense multi-panel shot may reach 50 KB. A real terminal window capture lands at 30 to 60 KB. Past that the shot does too much, so crop it.
6. **Everyone, target.** No raster over 200 KB. Test: `stat -f%z <f>` prints 204800 or less. Reason: the compression step caps pixels and not bytes, and it passes an oversized file through. After compression, `media-sync` prints a warning for any raster still over 200 KB. The warning never fails the run.
7. **Everyone.** No raster over 1600 pixels on the long edge. Test: `identify -format "%w x %h" <f>`.
8. **Everyone, target.** A full-width raster is at least 704 pixels wide and at most 1600. Reason: the reading column is about 704 pixels, so a narrower image upscales and blurs.
9. **Everyone, target.** An SVG is 60 KB or less. Over 150 KB needs a written reason in the pull request. Reason: across the 99 SVGs in the vault, the median is 4,735 bytes and the 90th percentile is 55,684.
10. **Repo posts.** Author each SVG at a `viewBox` width of 720 to 760 with no fixed `width` or `height`, and add `style="width:100%;height:auto;max-width:<W>px;display:block"`. Test: `rg '<svg[^>]*\swidth="[0-9]+"'` finds nothing. Reason: a fixed-width SVG wider than the column overflows into the sidebar.
11. **Guest imports.** An inline SVG inside a `figure.fig` keeps a `viewBox` and sets no pixel width. Memo owns the figure box and ignores width, margin and transform rules from the writer. Test: the figure renders inside its 60rem cap with no page-level horizontal scroll.
12. **Guest imports.** Wide content scrolls inside a `<div class="fk-scroll">`. Test: the rest of the figure keeps the plate width.
13. **Everyone.** Name files `<slug>-figN-<name>.<ext>` for figures and `<slug>-<what>.<ext>` for screenshots. Test: `ls assets/` matches the pattern.

## Dark-theme safety

14. **Repo posts.** A standalone SVG embedded as an image carries an opaque background rect sized to its viewBox. Test: the first drawing element is a `rect` that covers the viewBox. Reason: a transparent SVG floats on the dark theme.
15. **Repo posts.** A standalone SVG uses no `prefers-color-scheme` block. Reason, not yet tested: an SVG loaded through `<img>` follows the operating system setting and not memo's theme toggle, so it can disagree with the page.
16. **Guest imports.** A `figure.fig` colors everything through `--fk-*` variables or `currentColor`. Test: `rg 'fill="#|stroke="#'` inside the figure finds nothing, or each hit is a deliberate data color that reads on both themes.
17. **Guest imports.** A `prefers-color-scheme` block in figure CSS is allowed. Memo maps it to its own toggle.
18. **Everyone, target.** A raster screenshot has an opaque background. Do not commit a transparent PNG of a UI. Test: `identify -format %A <f>` prints `False`, or the image is a deliberate cutout checked on both themes.
19. **Everyone.** No device chrome, browser frame or cursor in a screenshot. Test: visual check.

## Alt text, captions and the hero image

20. **Everyone, target.** Every image embed has non-empty alt text that says what the figure shows. Test: `rg '!\[\]\('` finds nothing in the post. Today 383 files in brainery contain an empty-alt image, so this is a standard to move toward.
21. **Repo posts.** Put an italic `_Fig. N: caption._` line under each figure. Test: the line follows every figure embed.
22. **Guest imports.** Use `figure.fig` with a `figcaption`, or the figure head block, for the caption. A plain `<figure><img>` loses its structure, and the caption becomes a plain paragraph. Test: the figure appears as one block on the live page.
23. **Guest imports.** An inline SVG figure has `role="img"` plus an `aria-label`, or a `<title>` and `<desc>`. Every `data-tip` states a fact already in the text and adds no new number.
24. **Everyone.** Use one hero image, and make it the first image in the body. It must still read at thumbnail size. Test: the first embed in the body is the intended hero.
25. **Repo posts.** Set `image:` only when the hero is not the first image. Use an absolute site path such as `/content/<vault-path>/assets/<file>.png`. Test: `curl -s https://memo.d.foundation/<slug> | grep og:image` shows that path and not `home_cover.webp`.
26. **Everyone, target.** A raster share image is 1200 by 630 and 300 KB or less. Never use an SVG for a third-party hotlink. Reason: Facebook, LinkedIn and X reject an SVG share image. A vault SVG is safe because the worker renders a PNG twin, and a hotlinked SVG gets none.

## Hotlinked versus re-hosted media

27. **Repo posts.** Commit all media next to the post, under `assets/`. Raster files move to the storage bucket after the merge, and SVG stays in git. Test: `relative-link-exists` is green, and `gh run list -R dwarvesf/brainery --workflow media-sync.yml --limit 1` shows success after the merge.
28. **Guest imports.** At publish, memo copies each `https` raster image (png, jpeg, webp, gif or avif, checked by file bytes) into its own storage and serves it from `memo.d.foundation/content/guest-media/`. The first copied image becomes the note's share image. Nothing is copied at submit or preview. An SVG file in an `<img>` is not copied. It stays linked to your site, with a warning, so keep it online. Inline `<svg>` rich figures are unaffected. Test: after publish, the image addresses on the note page contain `/content/guest-media/`, each returns status 200 with a matching content type, and `rg '<img[^>]*src="[^"]*\.svg'` on your source page lists every image that stays linked.
29. **Guest imports.** Serve every image over `https` from an address that stays online until the editor publishes. Memo drops `http:` and `data:` images and shows the editor a `dropped_images=N` warning. Test: `rg '<img[^>]*src="(http:|data:)'` on your source page finds nothing, and the editor preview shows no `dropped_images` warning.
30. **Guest imports, target.** Keep each image within the raster targets in rules 6 to 8. Memo does not compress it. An image over 200 KB is still copied, with an editor warning. An image over 5 MB, or any image past 25 MB or 30 images in one post, keeps its original link, so it must stay online. Test: `curl -sI <url>` shows a `content-length` of 204800 or less, and the post stays within 25 MB and 30 images.
31. **Guest imports.** Memo deletes a note's image copies when the note is taken down. After an editor re-imports an edited post, memo removes the old copies about 30 minutes later. Takedown runs once the takedown switch is on, and the guest writer report tracks that status. Test: after a takedown, a former copy address returns `404`.

## Third-party images and attribution

32. **Everyone.** Use only images you made, own or hold a licence for. Credit any other image on the line under the caption: `Image: <author>, <source link>, <licence>`. Do not scrape images. Test: every image whose origin is not the author carries a credit line.
33. **Guest imports.** A writer's consent covers memo storing a copy of the images in an imported post, and removing the post removes the copies. It does not cover a third-party image the writer has no licence for. Test: every image the writer did not make carries a credit line (rule 32).

## Interactive figures in guest posts

The contract lives at [`memo.d.foundation/figures.md`](https://memo.d.foundation/figures.md). These rules are the editor's side of it.

34. **Guest imports.** The static figure is the figure. It must read fully with no script, in RSS and with reduced motion. Test: view the page with scripts off.
35. **Guest imports.** Use `figure.fig` blocks only. Memo ignores inline `<script>` and `<style>` and every stylesheet except up to three same-host `https` sheets. Each sheet's path contains `fig`, or its tag carries `data-figkit`, and the total is at most 512 KB. Test: the figure stylesheet path matches `fig`.
36. **Guest imports.** Use only the elements and attributes that `figures.md` allows. Do not use `img`, `foreignObject`, `iframe`, `mask`, `textPath`, SMIL, `@import`, `@font-face`, any `url()` other than `url(#id)`, or `position: fixed`. Test: the editor preview of the converted note shows every figure intact.
37. **Guest imports.** Use `data-animate` plus `data-step` for motion. Nothing plays on its own, and the Play button appears by itself. Test: no autoplay in the figure.
38. **Guest imports.** Add `data-fk-zoom="touch"` to a dense diagram that fits a tablet plate but reads better full screen.

## Animation

39. **Repo posts.** Most figures get no animation. Animate only when the motion carries meaning the static frame cannot. Gate all motion behind `@media (prefers-reduced-motion: no-preference)`, and let the base attributes show the finished figure. Test: `xmllint --noout <f>.svg`, then a static render shows the complete figure.
40. **Guest imports.** Use figkit motion only (rule 37). Memo drops SMIL, so an SMIL animation silently becomes a static frame or nothing.

## Styling memo will not carry over

41. **Guest imports.** Memo loads the figure stylesheets and drops the rest of your site's styling. Plan for the cases below before you submit.

| Your site does this                          | On memo                                     | Do this instead                                                 |
| -------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| Custom web fonts (`@font-face`)              | Dropped. Fonts map to memo's sans and mono  | Set type with `--font-body`, `--fk-font` and `--fk-mono`        |
| Page-wide CSS, theme, layout                 | Not loaded. Only figure stylesheets load    | Put figure styles in a `figures.css` (the path contains `fig`)  |
| Inline `<script>` or `<style>`               | Ignored                                     | Use figkit attributes (`data-tip`, `data-animate`, `data-fk-*`) |
| Breakout widths, negative margins            | Overridden by memo's figure box             | Design for the column and the 60rem cap                         |
| `<iframe>` embeds (video, tweets, sandboxes) | Removed                                     | Link out, and add a still image with alt text                   |
| `<img>` inside a `figure.fig`                | Dropped, with a `dropped_images` warning    | Draw it as inline SVG, or put the image in a plain paragraph    |
| `<picture>` with `srcset` and sources        | Only the fallback `<img>` is kept           | Make the fallback `<img>` the best single file                  |
| `<svg>` outside `figure.fig`                 | Removed, with a `dropped_figures` warning   | Wrap it in `<figure class="fig">`                               |
| Inline `style=` on prose                     | Removed                                     | Style in figure CSS only, or accept memo's prose style          |
| `http:` or `data:` images                    | Removed, with a `dropped_images` warning    | Use `https` image addresses                                     |
| Your own share image                         | Not carried. The first copied image is used | Put the image you want on the card first in the post            |
| Header, nav, footer, aside                   | Dropped                                     | Keep the post in one `<article>`                                |

## House palette

42. **Repo posts by Dwarves authors, required.** Use the house palette and figure header: background `#12395f`, box fill `#21466a`, box stroke `#68839d`, one highlight accent `#e8c56a` (amber in dark theme, the site accent in light), text `#e8f1fa`, `#a7c0d9`, `#c3d7ea` and `#6f8fb0`, arrow `#c3d7ea`, a monospace font, and a header rule at y=36. Test: the figure uses no color outside this set.
43. **Repo posts by Dwarves authors, required.** One accent only, two line weights at most, labels that never crowd, and whitespace as structure. Split a busy mechanism into a short series of numbered figures.
44. **Guest imports, recommended.** Follow the limits in rule 43. A guest may keep their own palette, and still meets rules 1 to 41.

## Editor checklist

Run this before approving any post, repo or imported.

- [ ] Open every image address. Status 200, correct type, not an error page. On a guest import, open the memo copy after publish.
- [ ] Check bytes: raster 200 KB or less, SVG 60 KB or less (150 KB with a reason).
- [ ] Check raster width: 704 to 1600 pixels, with no blurry upscale.
- [ ] Open the page in light and dark. No transparent figure floats on the dark theme and no edge is clipped.
- [ ] Resize to a phone width. No page-level horizontal scroll, and wide parts scroll inside their own box.
- [ ] Every image has real alt text, and every figure has a caption.
- [ ] Check the hero. The first image reads at thumbnail size, and the share card is not the site default by accident.
- [ ] Confirm credit for every image the author did not make, with no scraped images.
- [ ] Guest import: read the preview warnings, including `dropped_images=N`, and ask the writer to fix `http:`, `data:` and `<img>`-in-figure cases.
- [ ] Guest import: after publish, confirm each raster image links to `content/guest-media/`. Warn the writer to keep SVG files and any image over 5 MB online, because memo keeps those original links.
- [ ] Interactive figure: view it with scripts off. The static figure must be complete.
- [ ] Repo post: run `xmllint --noout` on each SVG and `./pre-commit-hook.sh install`, and read the formatting bot's diff.
