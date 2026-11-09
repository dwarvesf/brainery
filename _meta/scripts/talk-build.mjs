#!/usr/bin/env node
// talk-build.mjs: build the slide files of a `layout: talk` post.
// Usage: node _meta/scripts/talk-build.mjs <post.md> [--from html|pdf]
//        node _meta/scripts/talk-build.mjs --init <post.md> [--speaker <handle>]
//
// --init copies the house deck theme (_meta/talk-template/: theme.css and the
// example layouts) into assets/<slug>/deck-src/ to start a deck. The theme is
// optional; a deck exported from any tool needs no deck-src at all. With
// --speaker, slide 2 is the speaker profile, read from
// _meta/talk-template/speakers/<handle>.json at every render, so one edit to
// that file updates the profile in every deck on its next build. The photo is
// the vault file the data file names (never hotlinked), and the render reads
// the live memo note count when the contributor page answers within seconds.
//
// The talk lives in <post-dir>/assets/<slug>/ (the slug is the note's file name):
//   deck-src/*.html   optional source, one HTML file per slide, sorted by name
//   deck.pdf          the downloadable deck, one page per slide
//   slides/slide-NN.webp, og.png   written by this script
//
// From HTML (the default when deck-src/ holds .html files): print every slide to
// a one-page PDF with headless Chrome, join the pages into deck.pdf, then go on
// as from a PDF. Each slide sets its page size, `@page { size: 1600px 900px;
// margin: 0 }` for 16:9. When deck-src has no fonts.css, the template's copy
// (the memo faces) is added to the render, so decks do not carry the fonts.
// From a PDF (decks exported from Keynote, Slides, Canva, PowerPoint): split
// each page to slides/slide-NN.webp at the page's own ratio, long edge 3200
// (2x of the 1600x900 page, so a slide shown wider than 800 CSS px stays sharp
// on a 2x screen), webp q80, 500 KB cap. Nothing is cropped or stretched.
// Post-check T5 accepts 16:9, 16:10 and 4:3, one ratio per deck.
// Always: write talk.ratio and talk.speaker to the frontmatter (speaker only
// when the first author has a speakers/<handle>.json and the writer set none),
// stamp deck.pdf with the post's Title (title), Author (the speaker's
// name from _meta/talk-template/speakers/<handle>.json when that file exists,
// else the first author handle) and Subject (description), render og.png
// (1200x630) from slide 1, then print the talk checks. Joining pages drops all
// document info, and the media-sync compression (Ghostscript /ebook) keeps what
// the file carries, so the stamp is what a reader's PDF viewer and the browser
// Save dialog show.
//
// Binaries (none are installed by this script; it names any that is missing):
// a Chromium browser for HTML (Chrome, Edge, Brave, Chromium, or $TALK_CHROME),
// pdfunite or qpdf to join pages, pdftoppm and pdfinfo (poppler), cwebp (webp),
// and ImageMagick `magick` or macOS `sips` for og.png. pngquant is optional.
// Ghostscript `gs` writes the PDF Title and Author; without it the build warns
// and leaves them out.
// Rule list: handbook/memo/post-rubric.md, "Talk posts".

import { spawn, spawnSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const LONG_EDGE = 3200
const RATIOS = [[16, 9], [16, 10], [4, 3]]
const SLIDE_MAX = 500 * 1024
const OG_W = 1200
const OG_H = 630
const OG_MAX = 300 * 1024
let firstRatio = null // set by rasterize from slide 1, written to talk.ratio

const args = process.argv.slice(2)
const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'talk-template')
if (args[0] === '--init') init(args[1], args.includes('--speaker') ? args[args.indexOf('--speaker') + 1] : null)
const fromAt = args.indexOf('--from')
const fromArg = fromAt >= 0 ? args[fromAt + 1] : null
const note = args.find((a, i) => !a.startsWith('--') && (fromAt < 0 || i !== fromAt + 1))
if (!note || !existsSync(note)) die('usage: talk-build.mjs <post.md> [--from html|pdf]')
if (fromAt >= 0 && !['html', 'pdf'].includes(fromArg)) die('--from takes html or pdf')

const name = basename(note).replace(/\.mdx?$/, '')
const assetDir = join(dirname(resolve(note)), 'assets', name)
const srcDir = join(assetDir, 'deck-src')
const deckPdf = join(assetDir, 'deck.pdf')
const slideDir = join(assetDir, 'slides')
const htmlSlides = existsSync(srcDir) ? readdirSync(srcDir).filter((f) => f.endsWith('.html')).sort() : []
const from = fromArg ?? (htmlSlides.length ? 'html' : 'pdf')
if (from === 'html' && !htmlSlides.length) die(`no .html slides in ${srcDir}`)
if (from === 'pdf' && !existsSync(deckPdf)) die(`no deck.pdf in ${assetDir}; export your deck to PDF and put it there`)

const joiner = has('pdfunite') ? 'pdfunite' : has('qpdf') ? 'qpdf' : null
const chrome = from === 'html' ? findChrome() : null
const missing = ['pdftoppm', 'pdfinfo', 'cwebp'].filter((b) => !has(b))
if (from === 'html' && !joiner) missing.push('pdfunite or qpdf')
if (from === 'html' && !chrome) missing.push('a Chromium browser (Chrome, Edge, Brave, Chromium, or set TALK_CHROME)')
if (!has('magick') && !has('sips')) missing.push('magick or sips')
if (missing.length) die(`missing: ${missing.join(', ')}. Install them and run again; this script installs nothing.`)

const work = mkdtempSync(join(tmpdir(), 'talk-build-'))
try {
  mkdirSync(slideDir, { recursive: true })
  if (from === 'html') await htmlToPdf()
  stampMeta()
  const pages = pdfPageCount(deckPdf)
  console.log(`deck.pdf: ${pages} pages, ${Math.round(statSync(deckPdf).size / 1024)} KB`)
  const firstPng = rasterize(pages)
  writeRatio(firstRatio)
  writeSpeaker()
  makeOg(firstPng)
  const stale = readdirSync(slideDir).filter((f) => /^slide-\d+\.(webp|png)$/.test(f) && Number(f.match(/\d+/)[0]) > pages)
  if (stale.length) console.log(`note: ${stale.join(', ')} left over from a longer deck; remove them (post-check T2 flags them)`)
} finally {
  rmSync(work, { recursive: true, force: true })
}

// Talk checks on the post.
const check = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'post-check.mjs'), note], { encoding: 'utf8' })
if (check.status !== 0 || check.stderr.trim()) die(`post-check failed to run: ${check.stderr.trim().split('\n').slice(0, 6).join(' | ')}`)
const out = check.stdout.split('\n').filter(Boolean)
const talkLines = out.filter((l) => /^WARN T\d /.test(l))
const other = out.filter((l) => /^WARN /.test(l) && !/^WARN T\d /.test(l)).length
console.log('\npost-check, talk checks:')
if (talkLines.length) talkLines.forEach((l) => console.log(l))
else console.log('T1 to T8 PASS')
if (other) console.log(`(${other} other post-check warning(s); run post-check.mjs on the note to see them)`)
process.exit(talkLines.length ? 1 : 0)

// The post's title, description and first author handle, read from the
// frontmatter (scalars, plus `authors` as a list, an inline list or one value).
function postMeta() {
  const lines = readFileSync(note, 'utf8').split('\n')
  const end = lines[0]?.trim() === '---' ? lines.findIndex((l, i) => i > 0 && l.trim() === '---') : -1
  const fm = end > 0 ? lines.slice(1, end) : []
  const unquote = (v) => {
    const q = v.trim().match(/^(["'])(.*)\1$/)
    if (!q) return v.trim()
    return q[1] === '"' ? q[2].replace(/\\(["\\])/g, '$1') : q[2].replace(/''/g, "'")
  }
  const scalar = (key) => unquote(fm.find((l) => l.startsWith(`${key}:`))?.slice(key.length + 1) ?? '')
  const at = fm.findIndex((l) => /^authors:/.test(l))
  let handle = ''
  if (at >= 0) {
    const rest = fm[at].slice('authors:'.length).trim()
    if (rest) handle = unquote(rest.replace(/^\[/, '').split(',')[0].replace(/\]$/, ''))
    else handle = unquote((fm.slice(at + 1).find((l) => /^\s*-\s+\S/.test(l)) ?? '').replace(/^\s*-\s+/, ''))
  }
  return { title: scalar('title'), description: scalar('description'), handle }
}

// A PDF text string for pdfmark: UTF-16BE hex, so accents and Đ survive.
function pdfText(s) {
  return `<FEFF${Buffer.from(s, 'utf16le').swap16().toString('hex').toUpperCase()}>`
}

// The `name` in speakers/<handle>.json, or null when the handle has no usable file.
function speakerName(handle) {
  const file = join(TEMPLATE, 'speakers', `${handle}.json`)
  if (!/^[\w-]+$/.test(handle) || !existsSync(file)) return null
  try { return JSON.parse(readFileSync(file, 'utf8')).name || null }
  catch { console.log(`warning: speakers/${handle}.json is not valid JSON; its name is ignored`); return null }
}

// Write Title, Author and Subject into deck.pdf with a Ghostscript pdfmark.
function stampMeta() {
  const { title, description, handle } = postMeta()
  const author = speakerName(handle) ?? handle
  const fields = [['Title', title], ['Author', author], ['Subject', description]].filter(([, v]) => v)
  if (!fields.length) return
  if (!has('gs')) return console.log('warning: gs (Ghostscript) is not installed; deck.pdf has no Title or Author')
  const marks = join(work, 'docinfo.ps')
  const stamped = join(work, 'deck-stamped.pdf')
  writeFileSync(marks, `[ ${fields.map(([k, v]) => `/${k} ${pdfText(v)}`).join(' ')} /DOCINFO pdfmark\n`)
  run('gs', ['-q', '-dNOPAUSE', '-dBATCH', '-sDEVICE=pdfwrite', '-o', stamped, marks, deckPdf])
  copyFileSync(stamped, deckPdf)
  console.log(`deck.pdf: ${fields.map(([k]) => k).join(', ')} written`)
}

async function htmlToPdf() {
  const pagesOut = []
  const stage = join(work, 'deck-src')
  cpSync(srcDir, stage, { recursive: true })
  if (!existsSync(join(stage, 'fonts.css')) && existsSync(join(TEMPLATE, 'fonts.css'))) copyFileSync(join(TEMPLATE, 'fonts.css'), join(stage, 'fonts.css'))
  await fillProfiles(stage)
  for (const [k, f] of htmlSlides.entries()) {
    const pdf = join(work, `page-${String(k + 1).padStart(2, '0')}.pdf`)
    await runChrome(pdf, [
      '--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-gpu',
      '--disable-extensions', '--hide-scrollbars', '--no-pdf-header-footer',
      '--virtual-time-budget=5000', `--user-data-dir=${join(work, 'profile')}`,
      `--print-to-pdf=${pdf}`, pathToFileURL(join(stage, f)).href,
    ])
    if (!existsSync(pdf) || statSync(pdf).size === 0) die(`Chrome produced no PDF for ${f}`)
    const n = pdfPageCount(pdf)
    if (n !== 1) die(`${f} printed to ${n} pages; set @page { size: 1600px 900px; margin: 0 } (or your deck's size) and keep the slide inside one page`)
    pagesOut.push(pdf)
  }
  if (joiner === 'pdfunite') run('pdfunite', [...pagesOut, deckPdf])
  else run('qpdf', ['--empty', '--pages', ...pagesOut, '--', deckPdf])
  console.log(`deck.pdf: joined ${pagesOut.length} slides from deck-src/`)
}

function rasterize(pages) {
  let first = null
  const seen = new Set()
  for (let p = 1; p <= pages; p++) {
    const nn = String(p).padStart(2, '0')
    const base = join(work, `r-${nn}`)
    run('pdftoppm', ['-f', String(p), '-l', String(p), '-singlefile', '-png', '-scale-to', String(LONG_EDGE), deckPdf, base])
    const { png, w, h, ratio } = snapRatio(`${base}.png`, join(work, `f-${nn}.png`))
    seen.add(ratio)
    if (p === 1) { first = png; firstRatio = ratio }
    const webp = join(slideDir, `slide-${nn}.webp`)
    let q = 80
    run('cwebp', ['-quiet', '-q', String(q), '-m', '6', png, '-o', webp])
    while (statSync(webp).size > SLIDE_MAX && q > 50) {
      q -= 10
      run('cwebp', ['-quiet', '-q', String(q), '-m', '6', png, '-o', webp])
    }
    const kb = Math.round(statSync(webp).size / 1024)
    console.log(`slides/slide-${nn}.webp  ${w}x${h} ${ratio}  ${kb} KB  q${q}${kb > SLIDE_MAX / 1024 ? `  OVER ${SLIDE_MAX / 1024} KB` : ''}`)
  }
  if (seen.size > 1) console.log(`warning: the deck mixes page ratios (${[...seen].join(', ')}); post-check T5 wants one ratio per deck`)
  for (const r of seen) if (r.startsWith('other')) console.log(`warning: a page ratio of ${r.slice(6)} is not 16:9, 16:10 or 4:3; re-export the deck at one of those (post-check T5)`)
  return first
}

// Keep the page's own ratio. pdftoppm sets the long edge to 3200; a page that
// is a supported ratio up to rounding gets its exact size (3200x1800, 3200x2000,
// 3200x2400), by at most two pixels of resize. Anything else stays as it is.
function snapRatio(png, out) {
  const [w, h] = pngSize(png)
  const long = Math.max(w, h)
  const short = Math.min(w, h)
  for (const [a, b] of RATIOS) {
    const exact = Math.round((long * b) / a)
    if (Math.abs(short - exact) > 2) continue
    const [tw, th] = w >= h ? [long, exact] : [exact, long]
    const ratio = `${a}:${b}`
    if (tw === w && th === h) return { png, w, h, ratio }
    if (has('magick')) run('magick', [png, '-resize', `${tw}x${th}!`, out])
    else { copyFileSync(png, out); run('sips', ['-z', String(th), String(tw), out]) }
    return { png: out, w: tw, h: th, ratio }
  }
  return { png, w, h, ratio: `other ${(long / short).toFixed(3)}` }
}

// Set one key of the note's `talk:` block. `overwrite` false keeps a value the
// writer set by hand. Returns true when the file changed.
function setTalkField(key, line, overwrite) {
  const text = readFileSync(note, 'utf8')
  const lines = text.split('\n')
  const end = lines[0]?.trim() === '---' ? lines.findIndex((l, i) => i > 0 && l.trim() === '---') : -1
  const at = lines.findIndex((l, i) => i > 0 && i < end && /^talk:\s*$/.test(l))
  if (at < 0) return null
  let k = at + 1
  const has = new RegExp(`^\\s+${key}:`)
  while (k < end && /^\s+\S/.test(lines[k])) {
    if (has.test(lines[k])) break
    k++
  }
  if (k < end && has.test(lines[k])) {
    if (!overwrite || lines[k] === line) return false
    lines[k] = line
  } else lines.splice(k, 0, line)
  writeFileSync(note, lines.join('\n'))
  return true
}

// Record slide 1's ratio as talk.ratio in the note's frontmatter, so the site
// knows the slide shape after media-sync has moved the rasters to the bucket.
function writeRatio(ratio) {
  if (!ratio || ratio.startsWith('other')) return
  const changed = setTalkField('ratio', `  ratio: "${ratio}"`, true)
  if (changed === null) return console.log(`warning: no talk: block in the frontmatter; add talk.ratio: "${ratio}" by hand`)
  if (changed) console.log(`talk.ratio: "${ratio}" written to the frontmatter`)
}

// Record the first author's name from speakers/<handle>.json as talk.speaker, so
// the Download button names the file after the speaker. A value set by hand stays.
function writeSpeaker() {
  const name = speakerName(postMeta().handle)
  if (!name) return
  const quoted = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  if (setTalkField('speaker', `  speaker: "${quoted}"`, false)) console.log(`talk.speaker: "${name}" written to the frontmatter`)
}

function makeOg(firstPng) {
  const og = join(assetDir, 'og.png')
  // Letterbox, never crop: slide 1 scaled to fit 1200x630, padded with its own corner color.
  pad(firstPng, og, OG_W, OG_H)
  if (statSync(og).size > OG_MAX && has('pngquant')) run('pngquant', ['--quality=90-100', '--strip', '--force', '--output', og, og])
  const kb = Math.round(statSync(og).size / 1024)
  console.log(`og.png  ${OG_W}x${OG_H}  ${kb} KB${kb > 300 ? '  OVER 300 KB' : ''}`)
}

function pad(src, out, w, h) {
  if (has('magick')) {
    const bg = run('magick', [src, '-format', '#%[hex:p{0,0}]', 'info:']).trim().slice(0, 7)
    run('magick', [src, '-resize', `${w}x${h}`, '-background', bg, '-gravity', 'center', '-extent', `${w}x${h}`, out])
    return
  }
  // sips fallback (macOS): fit inside the box, then pad to it.
  copyFileSync(src, out)
  const [sw, sh] = pngSize(src)
  if (sw / sh > w / h) run('sips', ['--resampleWidth', String(w), out])
  else run('sips', ['--resampleHeight', String(h), out])
  run('sips', ['--padToHeightWidth', String(h), String(w), '--padColor', 'FFFFFF', out])
}

function init(target, speaker) {
  if (!target) die('usage: talk-build.mjs --init <post.md> [--speaker <handle>]')
  if (speaker && !existsSync(join(TEMPLATE, 'speakers', `${speaker}.json`))) die(`no speaker file _meta/talk-template/speakers/${speaker}.json; copy tieubao.json and fill in your own public facts`)
  const slug = basename(target).replace(/\.mdx?$/, '')
  const dest = join(dirname(resolve(target)), 'assets', slug, 'deck-src')
  if (existsSync(dest) && readdirSync(dest).some((f) => f.endsWith('.html'))) die(`${dest} already has slides; nothing copied`)
  mkdirSync(dest, { recursive: true })
  const files = readdirSync(TEMPLATE, { withFileTypes: true }).filter((d) => d.isFile() && !['fonts.css', 'profile.html'].includes(d.name)).map((d) => d.name).sort()
  let n = 0
  for (const f of files) {
    const slide = /^slide-\d+-.*\.html$/.test(f)
    const to = slide ? `slide-${String(++n).padStart(2, '0')}.html` : f
    copyFileSync(join(TEMPLATE, f), join(dest, to))
    console.log(`deck-src/${to}${to !== f ? `  (from ${f})` : ''}`)
    if (slide && n === 1) {
      if (!speaker) { console.log('(no --speaker: the profile slide is skipped; add one with your own speakers/<handle>.json)'); continue }
      const profile = readFileSync(join(TEMPLATE, 'profile.html'), 'utf8').replaceAll('{{speaker}}', speaker)
      writeFileSync(join(dest, `slide-${String(++n).padStart(2, '0')}.html`), profile)
      console.log(`deck-src/slide-${String(n).padStart(2, '0')}.html  (profile, from speakers/${speaker}.json)`)
    }
  }
  console.log(`\nStarted a deck in ${dest}. Edit the slides, add or copy layouts, then run:\n  node _meta/scripts/talk-build.mjs ${target}`)
  process.exit(0)
}

// Fill every <div class="profile" data-speaker="<id>"></div> in the staged deck
// from speakers/<id>.json. The photo is the vault file the data file names, so
// the slide never hotlinks it.
async function fillProfiles(stage) {
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  for (const f of readdirSync(stage).filter((x) => x.endsWith('.html'))) {
    const file = join(stage, f)
    const html = readFileSync(file, 'utf8')
    const m = html.match(/<div class="profile" data-speaker="([\w-]+)"><\/div>/)
    if (!m) continue
    const dataFile = join(TEMPLATE, 'speakers', `${m[1]}.json`)
    if (!existsSync(dataFile)) die(`${f} asks for speaker ${m[1]}, but ${dataFile} does not exist`)
    const sp = JSON.parse(readFileSync(dataFile, 'utf8'))
    // The photo is a vault path in the data file. After merge, media-sync moves
    // it to the bucket, so a later build reads memo's copy of the same path.
    let photoName = null
    if (sp.photo) {
      photoName = `speaker-${sp.id}${extname(sp.photo)}`
      const local = join(TEMPLATE, '..', '..', sp.photo)
      if (existsSync(local)) copyFileSync(local, join(stage, photoName))
      else {
        const r = await fetch(`https://memo.d.foundation/content/${sp.photo}`, { signal: AbortSignal.timeout(15000) }).catch(() => null)
        if (r?.ok) writeFileSync(join(stage, photoName), Buffer.from(await r.arrayBuffer()))
        else { console.log(`warning: photo ${sp.photo} not found locally or on memo; the profile slide has no photo`); photoName = null }
      }
    }
    const facts = [...(sp.facts ?? [])]
    if (sp.memo_contributor) {
      const r = await fetch(`https://memo.d.foundation/contributor/${sp.memo_contributor}`, { signal: AbortSignal.timeout(6000) }).catch(() => null)
      const count = r?.ok ? (await r.text()).match(/(\d[\d,]*) notes since/)?.[1] : null
      if (count) facts.push({ label: 'Memo', text: `${count} notes on memo.d.foundation` })
      else console.log('profile: memo note count unavailable, line omitted')
    }
    // Two links at most: a longer row crowds the speaker slide, whatever the speaker file lists.
    const body = `<div class="profile">${photoName ? `<img class="photo" src="${photoName}" alt="${esc(sp.name)}">` : '<div class="photo"></div>'}<div>
<div class="name">${esc(sp.name)}</div><div class="headline">${esc(sp.headline)}</div><div class="role">${esc(sp.role)}</div><div class="dither"></div>
<dl>${facts.map((x) => `<dt>${esc(x.label)}</dt><dd>${esc(x.text)}</dd>`).join('')}</dl></div></div>
<div class="links">${(sp.links ?? []).slice(0, 2).map(esc).join('  ·  ')}</div>`
    writeFileSync(file, html.replace(m[0], body))
  }
}

function pngSize(p) {
  const b = readFileSync(p)
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}

function pdfPageCount(pdf) {
  const m = run('pdfinfo', [pdf]).match(/^Pages:\s+(\d+)/m)
  if (!m) die(`pdfinfo could not read ${pdf}`)
  return Number(m[1])
}

// Chrome new-headless can write its output and never exit, so poll for the
// file, wait for its size to settle, then stop the process.
function runChrome(outFile, chromeArgs) {
  return new Promise((done) => {
    const child = spawn(chrome, chromeArgs, { stdio: 'ignore' })
    let last = -1
    let ticks = 0
    const timer = setInterval(() => {
      ticks++
      const size = existsSync(outFile) ? statSync(outFile).size : 0
      const settled = size > 0 && size === last
      last = size
      if (settled || child.exitCode !== null || ticks > 120) {
        clearInterval(timer)
        if (child.exitCode === null) child.kill('SIGTERM')
        setTimeout(() => {
          if (child.exitCode === null) child.kill('SIGKILL')
          done()
        }, 500)
      }
    }, 500)
  })
}

function findChrome() {
  const list = [
    process.env.TALK_CHROME,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ].filter(Boolean)
  for (const c of list) if (existsSync(c)) return c
  for (const b of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge']) {
    const r = spawnSync('sh', ['-c', `command -v ${b}`], { encoding: 'utf8' })
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim()
  }
  return null
}

function has(bin) {
  return spawnSync('sh', ['-c', `command -v ${bin}`], { stdio: 'ignore' }).status === 0
}

function run(bin, a) {
  const r = spawnSync(bin, a, { encoding: 'utf8' })
  if (r.status !== 0) die(`${bin} ${a.join(' ')} failed: ${(r.stderr || r.stdout || '').trim().slice(0, 400)}`)
  return (r.stdout || '') + (r.stderr || '')
}

function die(msg) {
  console.error(`talk-build: ${msg}`)
  process.exit(2)
}
