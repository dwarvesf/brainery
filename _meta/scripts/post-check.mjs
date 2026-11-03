#!/usr/bin/env node
// post-check.mjs: mechanical checks for a new memo post.
// Usage: node _meta/scripts/post-check.mjs [--strict] <note.md> [<note.md> ...]
// Prints `PASS <file>` or one `WARN <id> <file:line> <message>` per finding.
// Exit 0 unless --strict and at least one WARN. No dependencies.
// Rule list and fixes: handbook/memo/post-rubric.md (part A).
// A note with `layout: talk` also gets the talk checks T1 to T8 (checkTalk below).
// Test: node --test _meta/scripts/post-check-talk.test.mjs

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { basename, dirname, join, normalize, relative } from 'node:path'

// Talk slide paths and budgets (checkTalk below).
const SLIDE_DIR = /(^|[/(])assets\/[^/]+\/slides\//
const SLIDE_MAX_BYTES = 200 * 1024
const OG_MAX_BYTES = 300 * 1024

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const files = args.filter((a) => !a.startsWith('--'))
if (!files.length) {
  if (!args.length) console.log('usage: post-check.mjs [--strict] <note.md> ...')
  process.exit(0)
}

let total = 0
for (const file of files) {
  if (!existsSync(file)) {
    console.log(`WARN file-missing ${file}:1 file not found`)
    total++
    continue
  }
  const findings = checkNote(file)
  for (const f of findings) console.log(`WARN ${f.id} ${f.file}:${f.line} ${f.msg}`)
  if (!findings.length) console.log(`PASS ${file}`)
  total += findings.length
}
process.exit(strict && total ? 1 : 0)

function checkNote(file) {
  const out = []
  const warn = (id, line, msg, f = file) => out.push({ id, file: f, line, msg })
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  const dir = dirname(file)

  // Frontmatter span.
  let bodyStart = 0
  if (lines[0]?.trim() === '---') {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---')
    if (end > 0) bodyStart = end + 1
  }

  // Mark fenced code lines and collect the fences with their language.
  const inFence = new Array(lines.length).fill(false)
  const fences = []
  let open = null
  for (let i = bodyStart; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)(`{3,}|~{3,})\s*(.*)$/)
    if (open) {
      inFence[i] = true
      if (m && m[2][0] === open.ch && m[2].length >= open.len && !m[3].trim()) {
        open.end = i
        fences.push(open)
        open = null
      }
    } else if (m) {
      open = { ch: m[2][0], len: m[2].length, start: i, info: m[3].trim() }
      inFence[i] = true
    }
  }
  if (open) {
    open.end = lines.length - 1
    fences.push(open)
  }

  const appendixAt = lines.findIndex((l, i) => i >= bodyStart && !inFence[i] && /^##\s+Appendix\b/i.test(l))
  const refsAt = lines.findIndex((l, i) => i >= bodyStart && !inFence[i] && /^##\s+References\s*$/i.test(l))
  // The "body" is everything before the appendix (or the references when there is no appendix).
  const bodyEnd = [appendixAt, refsAt, lines.length].filter((n) => n >= 0).sort((a, b) => a - b)[0]
  let refsEnd = lines.length
  if (refsAt >= 0) {
    for (let i = refsAt + 1; i < lines.length; i++) {
      if (!inFence[i] && /^##\s/.test(lines[i])) { refsEnd = i; break }
    }
  }
  const inRefs = (i) => refsAt >= 0 && i > refsAt && i < refsEnd

  const stripInline = (s) => s.replace(/`[^`\n]*`/g, '')
  const stripLinkTargets = (s) => s.replace(/\]\([^)]*\)/g, ']')

  // Frontmatter checks.
  const fm = lines.slice(0, bodyStart)
  fm.forEach((l, i) => {
    if (/[\u2013\u2014]/.test(l)) warn('dash', i + 1, 'em or en dash in frontmatter; use , : ; () or a new sentence')
  })
  const descIdx = fm.findIndex((l) => /^description:/.test(l))
  if (descIdx >= 0) {
    const desc = fm[descIdx].replace(/^description:\s*/, '').replace(/^["']|["']$/g, '')
    const sentences = desc.split(/[.!?]\s+(?=[A-Z])/).filter(Boolean)
    const words = desc.split(/\s+/).length
    if (sentences.length > 1 || words > 30)
      warn('dek-long', descIdx + 1, `description is the dek: one light sentence, under 30 words (now ${sentences.length} sentence(s), ${words} words)`)
  }

  // Body line rules.
  const seenIds = new Map()
  const figIds = new Set()
  const tblIds = new Set()
  const eqIds = new Set()
  const secIds = new Set()
  const slugCount = new Map()
  const aiTells = [
    /\bisn'?t just\b/i, /\bnot (just|merely|only) [^.]{1,60}, but\b/i, /\bhere'?s the thing\b/i, /\blet'?s dive\b/i,
    /\bdelve\b/i, /\bin today'?s\b/i, /\bgame[- ]chang/i, /\bit('?s| is) worth (noting|mentioning)\b/i,
    /^\s*(in conclusion|in summary|to sum up|to summarize)\b/i, /\bat the end of the day\b/i, /\btapestry\b/i,
    /\bunlock(s|ing)? the power\b/i, /\bseamless(ly)?\b/i,
  ]

  for (let i = bodyStart; i < lines.length; i++) {
    if (inFence[i]) continue
    const raw = lines[i]
    const ln = i + 1
    const line = stripInline(raw)

    if (/[\u2013\u2014]/.test(raw)) warn('dash', ln, 'em or en dash; use , : ; () or a new sentence')

    const h = raw.match(/^(#{1,6})\s+(.*?)\s*$/)
    if (h) {
      const title = h[2]
      if (/^(\d+(\.\d+)*[.):]\s|\d+\s+[A-Z]|(Section|Part|Step|Chapter)\s+\d+\b)/.test(title))
        warn('heading-number', ln, `heading carries a number: "${title}"; drop it, link with @sec-<slug>`)
      const slug = title.toLowerCase().replace(/\{[^}]*\}\s*$/, '').replace(/`/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-')
      const n = slugCount.get(slug) ?? 0
      slugCount.set(slug, n + 1)
      secIds.add(n ? `${slug}-${n}` : slug)
    }

    if (/\b(?:sections?|§)\s*\d+(\.\d+)?\b/i.test(line)) warn('sec-ref', ln, 'prose points at "section N"; use @sec-<heading-slug>')
    if (/^\s*[_*]{1,2}\s*Fig(?:ure)?\.?\s*\d+/i.test(raw)) warn('fig-line', ln, 'separate "_Fig. N_" line; put the caption in the image title instead')
    else if (!/!\[/.test(raw) && /\b(?:Fig\.|Figure)\s*\d+\b/.test(line)) warn('fig-prose', ln, 'prose says "Fig. N"; use @fig-<id>')

    // Bare URLs in prose (an embed URL alone on its line is allowed; References has its own rule).
    if (!inRefs(i)) {
      const t = stripLinkTargets(line)
      if (!/^\s*https?:\/\/\S+\s*$/.test(raw) && /https?:\/\/\S+/.test(t)) warn('url-bare', ln, 'bare URL in prose; link it as [Title](url) or move it to References')
    }

    if (i < bodyEnd) {
      const t = stripLinkTargets(raw).replace(/!\[[^\]]*\]/g, '')
      const hash = t.match(/(?<![\w#/])(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}(?!\w)/)
      if (hash) warn('hash-body', ln, `commit hash "${hash[0]}" in the body; move it to the appendix table`)
      const ver = t.match(/(?<![\d.\w])v?\d+\.\d+\.\d+(?:[-+][\w.]+)?(?![\d.]\d|\.\d)/)
      if (ver) warn('version-body', ln, `version string "${ver[0]}" in the body; move it to the appendix table`)
      const fl = t.match(/[\w./-]+\.[A-Za-z]{1,5}:\d+(?:-\d+)?\b|#L\d+\b/)
      if (fl) warn('fileline-body', ln, `file:line "${fl[0]}" in the body; move it to the appendix table`)
      if (!h) {
        for (const re of aiTells) {
          const m = line.match(re)
          if (m) {
            warn('ai-tell', ln, `AI tell "${m[0].trim()}"; see essays/ai-writing-tells and the voice gate`)
            break
          }
        }
      }
    }

    for (const m of line.matchAll(/\{[^}]*#((?:fig|tbl|eq)-[\w-]+)[^}]*\}/g)) {
      const id = m[1]
      if (seenIds.has(id)) warn('id-dup', ln, `id ${id} also declared on line ${seenIds.get(id)}`)
      seenIds.set(id, ln)
      if (id.startsWith('fig-')) figIds.add(id)
      else if (id.startsWith('tbl-')) tblIds.add(id)
      else eqIds.add(id)
    }
  }

  // Inline code density, per paragraph or list item, before the appendix.
  {
    let para = null
    const flush = () => {
      if (!para) return
      const n = (para.text.match(/`[^`\n]+`/g) ?? []).length
      if (n > 1) warn('inline-code', para.line, `${n} inline code spans in one paragraph (max 1); say it in words, or move the detail to a fence or the appendix`)
      para = null
    }
    for (let i = bodyStart; i < bodyEnd; i++) {
      const l = lines[i]
      if (inFence[i] || !l.trim()) { flush(); continue }
      if (/^\s*(#{1,6}\s|\||!\[|<|Table:|Source:|\$\$|\{)/.test(l)) { flush(); continue }
      if (/^\s*([-*+]|\d+\.)\s/.test(l)) flush()
      if (!para) para = { line: i + 1, text: '' }
      para.text += ' ' + l
    }
    flush()
  }

  // Fences: language and ASCII art.
  for (const f of fences) {
    const lang = f.info.split(/[\s{]/)[0]
    if (!lang) warn('fence-lang', f.start + 1, 'code fence has no language; add one (text if nothing fits)')
    if (lang === 'tree') continue
    const body = lines.slice(f.start + 1, f.end).join('\n')
    if (/[┌┐┬┴┼╔╗╦╩╬]|\+-{3,}\+|[│┃║][^\n]*[▶▼◀▲►◄]|[▶▼◀▲►◄][^\n]*[│┃║]/.test(body))
      warn('ascii-art', f.start + 1, 'box-drawing diagram in a code fence; make it a figure (SVG, or figkit when it needs to move)')
  }

  // Display math.
  for (let i = bodyStart; i < lines.length; i++) {
    if (inFence[i] || !/^\s*\$\$/.test(lines[i])) continue
    let j = i
    if (!/^\s*\$\$.+\$\$/.test(lines[i])) {
      j = i + 1
      while (j < lines.length && !/\$\$/.test(lines[j])) j++
    }
    const closing = lines[j] ?? ''
    if (!/\$\$\s*\{#eq-[\w-]+\}/.test(closing)) warn('eq-id', i + 1, 'display math without {#eq-id} after the closing $$')
    else if (!/where:/i.test(lines.slice(j + 1, j + 4).join('\n'))) warn('eq-where', i + 1, 'equation has no "where:" list of symbols right after it')
    i = j
  }

  // Images and figures.
  const mergedClean = isMergedClean(file)
  const talk = isTalk(fm)
  const svgSeen = new Set()
  for (let i = bodyStart; i < lines.length; i++) {
    if (inFence[i]) continue
    for (const m of stripInline(lines[i]).matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:'([^']*)'|"([^"]*)"))?\)/g)) {
      const ln = i + 1
      const braces = m[1].match(/\{([^}]*)\}\s*$/)
      const alt = m[1].replace(/\s*\{[^}]*\}\s*$/, '').trim()
      const src = m[2]
      const title = m[3] ?? m[4] ?? ''
      // A talk slide is not a figure: it takes no caption or fig id, and T1 to T8 own its checks.
      if (talk && SLIDE_DIR.test(src)) continue
      if (!alt) warn('fig-alt', ln, 'image has no alt text')
      if (!title) warn('fig-embed', ln, `image has no caption title; use ![Title {#fig-id}](${src} 'Short title. Caption sentence.')`)
      if (!braces || !/#fig-[\w-]+/.test(braces[1])) warn('fig-embed', ln, 'image has no {#fig-id} in its alt text')
      if (title && alt) {
        const first = title.split(/\.\s|\.$/)[0].trim().toLowerCase()
        if (first !== alt.toLowerCase().replace(/\.$/, '')) warn('fig-title', ln, "the caption's first sentence should be the same short title as the alt text before the braces")
      }
      if (/^(https?:|data:|\/)/.test(src)) continue
      const clean = src.split(/[?#]/)[0]
      if (clean !== clean.toLowerCase()) warn('asset-case', ln, `asset path has capitals (${clean}); production paths are case-sensitive, use lowercase`)
      const abs = normalize(join(dir, clean))
      if (!existsSync(abs)) {
        // media-sync moves rasters to the bucket after merge, so a merged, unchanged note legitimately lacks them.
        if (!(/\.(png|jpe?g|webp|gif|avif)$/i.test(clean) && mergedClean)) warn('asset-missing', ln, `asset not found: ${clean}`)
        continue
      }
      if (braces && /\.live\b/.test(braces[1])) {
        const twin = abs.replace(/\.[^./]+$/, '.fig.html')
        if (!existsSync(twin)) warn('live-twin', ln, `.live figure has no figkit twin beside it (${relative(dir, twin)})`)
      }
      if (/\.svg$/i.test(clean) && !svgSeen.has(abs)) {
        svgSeen.add(abs)
        checkSvg(abs, warn)
      }
    }
  }

  // Tables outside the appendix.
  for (let i = bodyStart; i < lines.length; i++) {
    if (inFence[i] || !/^\s*\|/.test(lines[i]) || !/^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) continue
    let j = i
    while (j < lines.length && /^\s*\|/.test(lines[j])) j++
    const inAppendix = appendixAt >= 0 && i > appendixAt && (refsAt < 0 || i < refsAt)
    if (!inAppendix) {
      let long = 0
      let label = 0
      for (let r = i + 2; r < j; r++) {
        const cells = lines[r].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.replace(/`/g, '').trim())
        cells.forEach((c, k) => {
          const w = c.split(/\s+/).filter(Boolean).length
          if (w > 14) long++
          if (k === 0 && w > 6) label++
        })
      }
      if (long) warn('table-cell', i + 1, `${long} cell(s) over 14 words; cut to a few words per cell`)
      if (label) warn('table-label', i + 1, `${label} first-column label(s) over 6 words; use short row labels`)
    }
    i = j - 1
  }

  // Citations and the References list.
  {
    const cited = new Set()
    let firstCite = 0
    for (let i = bodyStart; i < lines.length; i++) {
      if (inFence[i] || (refsAt >= 0 && i >= refsAt)) continue
      const l = stripInline(lines[i])
      for (const m of l.matchAll(/(?<![\w\]^])\[(\d+(?:\s*[,\u2013-]\s*\d+)*)\](?![(:[])/g)) {
        firstCite ||= i + 1
        for (const part of m[1].split(/\s*,\s*/)) {
          const r = part.split(/\s*[\u2013-]\s*/).map(Number)
          const lo = r[0]
          const hi = r[1] ?? r[0]
          for (let n = lo; n <= Math.min(hi, lo + 50); n++) cited.add(n)
        }
      }
      for (const m of l.matchAll(/\]\(#ref-(\d+)\)/g)) {
        firstCite ||= i + 1
        cited.add(Number(m[1]))
      }
    }
    if (refsAt < 0) {
      if (cited.size) warn('ref-section', firstCite, 'citations present but no "## References" list')
    } else {
      const entries = []
      let cur = null
      for (let i = refsAt + 1; i < refsEnd; i++) {
        if (inFence[i]) continue
        const m = lines[i].match(/^(\d+)\.\s+(.*)$/)
        if (m) {
          cur = { n: Number(m[1]), line: i + 1, text: m[2], sub: 0 }
          entries.push(cur)
        } else if (cur && /^\s+\S/.test(lines[i])) {
          if (/^\s+([-*+]|\d+\.)\s/.test(lines[i])) cur.sub++
          cur.text += ' ' + lines[i].trim()
        }
      }
      entries.forEach((e, k) => {
        if (e.n !== k + 1) warn('ref-order', e.line, `entry numbered ${e.n}, expected ${k + 1}`)
        if (!/^\*\*[^*]+\*\*:\s/.test(e.text)) warn('ref-format', e.line, 'entry should read "n. **Term or Name**: definition or role, date. [Title](url)."')
        const noLinks = e.text.replace(/\[[^\]]*\]\([^)]*\)/g, '').replace(/`[^`]*`/g, '')
        if (/https?:\/\/\S+|\bwww\.\S+/.test(noLinks)) warn('ref-bare-url', e.line, 'bare URL in a reference; write it as [Title](url)')
        const links = (e.text.match(/\[[^\]]+\]\([^)]+\)/g) ?? []).length
        if (links > 2 || e.text.length > 450) warn('ref-multi', e.line, `entry is too big (${links} links, ${e.text.length} chars); one source per entry (a source plus one companion link at most)`)
        if (e.sub) warn('ref-sublist', e.line, 'list nested inside an entry; drop file lists, keep one definition and one link')
        if (!cited.has(e.n)) warn('ref-unused', e.line, `reference ${e.n} is never cited in the text`)
      })
      for (const n of cited) if (n > entries.length) warn('cite-missing', firstCite, `citation [${n}] has no entry in References`)
    }
  }

  // @ references to ids.
  for (let i = bodyStart; i < lines.length; i++) {
    if (inFence[i]) continue
    const l = stripInline(lines[i])
    for (const m of l.matchAll(/(?<![\w@.])@((fig|tbl|eq|sec)-[a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
      const set = { fig: figIds, tbl: tblIds, eq: eqIds, sec: secIds }[m[2]]
      if (!set.has(m[2] === 'sec' ? m[1].slice(4) : m[1])) warn('ref-missing', i + 1, `@${m[1]} points at an id that does not exist (the build fails on this)`)
    }
  }

  if (talk) checkTalk({ file, lines, fm, bodyStart, inFence, mergedClean, warn })

  return out.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
}

// Talk checks. Contract: handbook/memo/post-rubric.md, "Talk posts".
function isTalk(fm) {
  return fm.some((l) => /^layout:\s*["']?talk["']?\s*$/.test(l))
}

// Line-based, like the CI lint: top-level `key: value`, plus the indented keys under `talk:`.
function readTalkFrontmatter(fm) {
  const unq = (v) => v.trim().replace(/^["']|["']$/g, '')
  const top = {}
  const talk = {}
  let inTalk = false
  fm.forEach((l, i) => {
    const t = l.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (t) {
      inTalk = t[1] === 'talk'
      top[t[1]] = { value: unq(t[2]), line: i + 1 }
      return
    }
    const n = inTalk && l.match(/^\s+([A-Za-z_][\w-]*):\s*(.*)$/)
    if (n) talk[n[1]] = { value: unq(n[2]), line: i + 1 }
  })
  return { top, talk }
}

function checkTalk({ file, lines, fm, bodyStart, inFence, mergedClean, warn }) {
  const dir = dirname(file)
  const name = basename(file).replace(/\.mdx?$/, '')
  const assetRel = `assets/${name}`
  const assetDir = join(dir, assetRel)
  const { top, talk } = readTalkFrontmatter(fm)
  const fmLine = top.layout?.line ?? 1
  // media-sync moves rasters and PDFs to the bucket after merge, so a merged, unchanged talk lacks them.
  const present = (p) => existsSync(p) || (mergedClean ? null : false)

  // Body: slide paragraphs, sections, the outro break.
  const isBreak = (l) => /^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(l)
  const slideRe = /^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:'[^']*'|"[^"]*"))?\)\s*$/
  const slides = []
  const sections = []
  for (let i = bodyStart; i < lines.length; i++) {
    if (inFence[i]) continue
    const l = lines[i]
    if (/^##\s/.test(l)) sections.push({ line: i + 1, at: i, title: l.replace(/^##\s+/, '').trim() })
    if (!/!\[/.test(l) || !SLIDE_DIR.test(l)) continue
    const m = l.match(slideRe)
    const alone = m && !(lines[i - 1] ?? '').trim() && !(lines[i + 1] ?? '').trim()
    if (!m || !alone) {
      warn('T2', i + 1, 'a slide image must sit alone in its own paragraph, ![alt](assets/<slug>/slides/slide-NN.webp)')
      continue
    }
    slides.push({ line: i + 1, at: i, alt: m[1].trim(), src: m[2] })
  }
  const lastSlide = slides.at(-1)?.at ?? -1
  let outroAt = lines.length
  for (let i = lastSlide + 1; i < lines.length && lastSlide >= 0; i++) {
    if (!inFence[i] && isBreak(lines[i])) { outroAt = i; break }
  }

  // T3: deck size.
  if (slides.length < 8 || slides.length > 40) warn('T3', slides[0]?.line ?? fmLine, `${slides.length} slides; a talk has 8 to 40`)

  // T2: names, order, one reference each, no stray files.
  const esc = assetRel.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&')
  const want = new RegExp('^' + esc + '/slides/slide-(\\d{2})\\.(webp|png)$')
  const seen = new Map()
  slides.forEach((s, k) => {
    const m = s.src.match(want)
    s.n = m ? Number(m[1]) : null
    if (!m) return warn('T2', s.line, `slide path ${s.src} should be ${assetRel}/slides/slide-${String(k + 1).padStart(2, '0')}.webp`)
    if (seen.has(s.src)) return warn('T2', s.line, `${basename(s.src)} is referenced twice (also line ${seen.get(s.src)})`)
    seen.set(s.src, s.line)
    if (s.n !== k + 1) warn('T2', s.line, `slide ${k + 1} in reading order points at ${basename(s.src)}; number slides 01..NN in order with no gap`)
  })
  const slideDir = join(assetDir, 'slides')
  if (existsSync(slideDir)) {
    const referenced = new Set(slides.map((s) => basename(s.src)))
    for (const f of readdirSync(slideDir).sort()) {
      if (f.startsWith('.')) continue
      if (!referenced.has(f)) warn('T2', slides[0]?.line ?? fmLine, `${assetRel}/slides/${f} is never referenced; remove it or add its slide`)
    }
  }

  // T4: alt text says what the slide says.
  for (const s of slides) {
    if (s.alt.length < 8 || /^(slide|image|img)[\s_-]*\d*$/i.test(s.alt))
      warn('T4', s.line, `slide alt text "${s.alt}" is too thin; write 8+ characters that say what the slide says`)
  }

  // T5: each slide file.
  for (const s of slides) {
    if (s.n === null) continue
    const abs = normalize(join(dir, s.src))
    const ok = present(abs)
    if (ok === null) continue
    if (!ok) { warn('T5', s.line, `slide file not found: ${s.src}`); continue }
    const dim = imageSize(abs)
    if (!dim || !/^(webp|png)$/.test(dim.type)) warn('T5', s.line, `${basename(s.src)} is not a webp or png file`)
    else if (dim.w !== 1600 || dim.h !== 900) warn('T5', s.line, `${basename(s.src)} is ${dim.w}x${dim.h}; slides are 1600x900`)
    const size = statSync(abs).size
    if (size > SLIDE_MAX_BYTES) warn('T5', s.line, `${basename(s.src)} is ${Math.round(size / 1024)} KB; the cap is 200 KB`)
  }

  // T1: the deck PDF.
  const deck = talk.deck
  if (!deck?.value) warn('T1', top.talk?.line ?? fmLine, 'talk.deck is missing; set it to ' + `${assetRel}/deck.pdf`)
  else if (deck.value !== `${assetRel}/deck.pdf`) warn('T1', deck.line, `talk.deck is ${deck.value}; it should be ${assetRel}/deck.pdf`)
  else {
    const abs = join(dir, deck.value)
    const ok = present(abs)
    if (ok === false) warn('T1', deck.line, `deck not found: ${deck.value}`)
    else if (ok) {
      const head = readFileSync(abs).subarray(0, 5).toString('latin1')
      if (head !== '%PDF-') warn('T1', deck.line, `${deck.value} is not a PDF`)
      else {
        const pages = pdfPages(abs)
        if (pages === null) warn('T1', deck.line, `could not count the pages of ${deck.value}`)
        else if (pages !== slides.length) warn('T1', deck.line, `deck.pdf has ${pages} pages and the post has ${slides.length} slides; they must match`)
      }
    }
  }

  // T6: notes per slide.
  const stops = new Set([...slides.map((s) => s.at), ...sections.map((s) => s.at), outroAt])
  slides.forEach((s, k) => {
    let end = s.at + 1
    while (end < lines.length && !stops.has(end)) end++
    const words = countWords(lines.slice(s.at + 1, end).filter((_, j) => !inFence[s.at + 1 + j]))
    const edge = k === 0 || k === slides.length - 1
    if (words === 0 && edge) return
    if (words < 15 || words > 150) warn('T6', s.line, `slide ${k + 1} has ${words} words of notes; write 15 to 150${edge ? ', or none on the first and last slide' : ''}`)
  })

  // T7: sections.
  const inBody = sections.filter((s) => s.at < outroAt)
  if (inBody.length < 2 || inBody.length > 8) warn('T7', inBody[0]?.line ?? fmLine, `${inBody.length} ## sections before the outro; a talk has 2 to 8`)
  inBody.forEach((sec, k) => {
    const end = inBody[k + 1]?.at ?? outroAt
    const n = slides.filter((s) => s.at > sec.at && s.at < end).length
    if (n < 2 || n > 10) warn('T7', sec.line, `section "${sec.title}" holds ${n} slides; a section holds 2 to 10`)
  })

  // T8: the share image.
  const image = top.image?.value
  const ogRel = `${assetRel}/og.png`
  if (!image) warn('T8', fmLine, `image: is not set; point it at /content/<vault-path>/${ogRel}`)
  else {
    const root = vaultRoot(dir)
    const expect = root !== null ? '/content/' + [relative(root, realpathSync(dir)), ogRel].filter(Boolean).join('/') : null
    if (expect ? image !== expect : !image.endsWith('/' + ogRel)) warn('T8', top.image.line, `image: is ${image}; it should be ${expect ?? `/content/<vault-path>/${ogRel}`}`)
  }
  const og = join(dir, ogRel)
  const ogOk = present(og)
  if (ogOk === false) warn('T8', top.image?.line ?? fmLine, `share image not found: ${ogRel}`)
  else if (ogOk) {
    const dim = imageSize(og)
    if (!dim || dim.type !== 'png') warn('T8', top.image?.line ?? fmLine, `${ogRel} is not a PNG file`)
    else if (dim.w !== 1200 || dim.h !== 630) warn('T8', top.image?.line ?? fmLine, `${ogRel} is ${dim.w}x${dim.h}; the share image is 1200x630`)
    const size = statSync(og).size
    if (size > OG_MAX_BYTES) warn('T8', top.image?.line ?? fmLine, `${ogRel} is ${Math.round(size / 1024)} KB; the cap is 300 KB`)
  }
}

function countWords(block) {
  const text = block
    .join(' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*(```|~~~).*$/gm, ' ')
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) ?? []).length
}

// Width, height and type from the file header: png and webp (VP8, VP8L, VP8X). No dependencies.
function imageSize(abs) {
  const b = readFileSync(abs)
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { type: 'png', w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  if (b.length > 30 && b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') {
    const chunk = b.toString('latin1', 12, 16)
    if (chunk === 'VP8 ') return { type: 'webp', w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }
    if (chunk === 'VP8L') {
      const v = b.readUInt32LE(21)
      return { type: 'webp', w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }
    }
    if (chunk === 'VP8X') return { type: 'webp', w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 }
  }
  return null
}

// pdfinfo when present (poppler), else the largest /Count in the page tree.
function pdfPages(abs) {
  const r = spawnSync('pdfinfo', [abs], { encoding: 'utf8' })
  const m = r.status === 0 && r.stdout.match(/^Pages:\s+(\d+)/m)
  if (m) return Number(m[1])
  const counts = [...readFileSync(abs).toString('latin1').matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)|\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages\b/g)].map((x) => Number(x[1] ?? x[2]))
  return counts.length ? Math.max(...counts) : null
}

function vaultRoot(dir) {
  const r = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, encoding: 'utf8' })
  return r.status === 0 ? r.stdout.trim() : null
}

function checkSvg(abs, warn) {
  const svg = readFileSync(abs, 'utf8')
  const rel = relative(process.cwd(), abs)
  const lineOf = (idx) => svg.slice(0, idx).split('\n').length
  const root = svg.match(/<svg\b[^>]*>/)
  if (!root) return warn('svg-root', 1, 'no <svg> element', rel)
  const rootTag = root[0]
  const vb = rootTag.match(/viewBox\s*=\s*"([^"]+)"/)
  if (!vb) warn('svg-viewbox', lineOf(root.index), 'no viewBox; add viewBox="0 0 760 H"', rel)
  else {
    const w = Number(vb[1].trim().split(/[\s,]+/)[2])
    if (w !== 760) warn('svg-viewbox', lineOf(root.index), `viewBox width is ${w}, the plate standard is 760`, rel)
  }
  if (/\s(width|height)\s*=/.test(rootTag.replace(/viewBox\s*=\s*"[^"]*"/, '')))
    warn('svg-fixed-size', lineOf(root.index), 'fixed width or height on <svg>; remove it and keep the viewBox', rel)
  const mw = svg.match(/min-width\s*:/)
  if (mw) warn('svg-fixed-size', lineOf(mw.index), 'min-width in the SVG; it forces sideways scroll on a phone', rel)
  const sizes = new Map()
  for (const m of svg.matchAll(/font-size\s*[=:]\s*"?\s*(\d+(?:\.\d+)?)/g)) {
    const s = Number(m[1])
    if (s < 9 || s > 13.5) sizes.set(s, sizes.get(s) ?? lineOf(m.index))
  }
  if (sizes.size)
    warn('svg-font-size', Math.min(...sizes.values()), `font-size outside 9 to 13.5: ${[...sizes.keys()].join(', ')} (plates 9 to 10.5, dense live diagrams about 11 to 13.5)`, rel)
  const da = svg.match(/\sstroke-dasharray\s*=\s*"/)
  if (da) warn('svg-dasharray-attr', lineOf(da.index), 'stroke-dasharray as an attribute is dropped by the sanitizer; put it in style="stroke-dasharray:5 4"', rel)
  const sm = svg.match(/<(animate|animateTransform|animateMotion|set)\b/)
  if (sm) warn('svg-smil', lineOf(sm.index), `SMIL <${sm[1]}> is not allowed; use figkit for motion`, rel)
  const sc = svg.match(/<script\b|\son[a-z]+\s*=\s*"/i)
  if (sc) warn('svg-script', lineOf(sc.index), 'script or event handler in the SVG', rel)
  if (!/ui-monospace/.test(svg)) warn('svg-font-family', lineOf(root.index), 'font-family does not include ui-monospace', rel)
}

function isMergedClean(file) {
  const run = (a) => spawnSync('git', a, { cwd: dirname(file), encoding: 'utf8' })
  const tracked = run(['ls-files', '--error-unmatch', '--', file.split('/').pop()])
  if (tracked.status !== 0) return false
  return run(['diff', '--quiet', 'HEAD', '--', file.split('/').pop()]).status === 0
}
