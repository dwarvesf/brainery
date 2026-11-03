#!/usr/bin/env node
// talk-build.mjs: build the slide files of a `layout: talk` post.
// Usage: node _meta/scripts/talk-build.mjs <post.md> [--from html|pdf]
//
// The talk lives in <post-dir>/assets/<slug>/ (the slug is the note's file name):
//   deck-src/*.html   optional source, one HTML file per slide, sorted by name
//   deck.pdf          the downloadable deck, one page per slide
//   slides/slide-NN.webp, og.png   written by this script
//
// From HTML (the default when deck-src/ holds .html files): print every slide to
// a one-page PDF with headless Chrome, join the pages into deck.pdf, then go on
// as from a PDF. Each slide sets `@page { size: 1600px 900px; margin: 0 }`.
// From a PDF (guest decks exported from Keynote, Slides, Canva, PowerPoint):
// split each page to slides/slide-NN.webp at 1600x900, webp q80, 200 KB cap.
// Always: render og.png (1200x630) from slide 1, then print the talk checks.
//
// Binaries (none are installed by this script; it names any that is missing):
// a Chromium browser for HTML (Chrome, Edge, Brave, Chromium, or $TALK_CHROME),
// pdfunite or qpdf to join pages, pdftoppm and pdfinfo (poppler), cwebp (webp),
// and ImageMagick `magick` or macOS `sips` for og.png. pngquant is optional.
// Rule list: handbook/memo/post-rubric.md, "Talk posts".

import { spawn, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SLIDE_W = 1600
const SLIDE_H = 900
const SLIDE_MAX = 200 * 1024
const OG_W = 1200
const OG_H = 630
const OG_MAX = 300 * 1024

const args = process.argv.slice(2)
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
  const pages = pdfPageCount(deckPdf)
  console.log(`deck.pdf: ${pages} pages, ${Math.round(statSync(deckPdf).size / 1024)} KB`)
  const firstPng = rasterize(pages)
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

async function htmlToPdf() {
  const pagesOut = []
  for (const [k, f] of htmlSlides.entries()) {
    const pdf = join(work, `page-${String(k + 1).padStart(2, '0')}.pdf`)
    await runChrome(pdf, [
      '--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-gpu',
      '--disable-extensions', '--hide-scrollbars', '--no-pdf-header-footer',
      '--virtual-time-budget=5000', `--user-data-dir=${join(work, 'profile')}`,
      `--print-to-pdf=${pdf}`, pathToFileURL(join(srcDir, f)).href,
    ])
    if (!existsSync(pdf) || statSync(pdf).size === 0) die(`Chrome produced no PDF for ${f}`)
    const n = pdfPageCount(pdf)
    if (n !== 1) die(`${f} printed to ${n} pages; set @page { size: ${SLIDE_W}px ${SLIDE_H}px; margin: 0 } and keep the slide inside one page`)
    pagesOut.push(pdf)
  }
  if (joiner === 'pdfunite') run('pdfunite', [...pagesOut, deckPdf])
  else run('qpdf', ['--empty', '--pages', ...pagesOut, '--', deckPdf])
  console.log(`deck.pdf: joined ${pagesOut.length} slides from deck-src/`)
}

function rasterize(pages) {
  const info = run('pdfinfo', [deckPdf]).match(/Page size:\s+([\d.]+) x ([\d.]+)/)
  if (info && Math.abs(Number(info[1]) / Number(info[2]) - SLIDE_W / SLIDE_H) > 0.01)
    console.log(`warning: page size ${info[1]} x ${info[2]} pt is not 16:9; slides are letterboxed to ${SLIDE_W}x${SLIDE_H}`)
  let first = null
  for (let p = 1; p <= pages; p++) {
    const nn = String(p).padStart(2, '0')
    const base = join(work, `r-${nn}`)
    run('pdftoppm', ['-f', String(p), '-l', String(p), '-singlefile', '-png', '-scale-to', String(SLIDE_W), deckPdf, base])
    const png = fitSlide(`${base}.png`, join(work, `f-${nn}.png`))
    if (p === 1) first = png
    const webp = join(slideDir, `slide-${nn}.webp`)
    let q = 80
    run('cwebp', ['-quiet', '-q', String(q), '-m', '6', png, '-o', webp])
    while (statSync(webp).size > SLIDE_MAX && q > 50) {
      q -= 10
      run('cwebp', ['-quiet', '-q', String(q), '-m', '6', png, '-o', webp])
    }
    const kb = Math.round(statSync(webp).size / 1024)
    console.log(`slides/slide-${nn}.webp  ${SLIDE_W}x${SLIDE_H}  ${kb} KB  q${q}${kb > 200 ? '  OVER 200 KB' : ''}`)
  }
  return first
}

// pdftoppm keeps the page aspect (long edge 1600). A 16:9 page that rounds to
// 1600x899 or 1600x901 is stretched by one pixel; any other shape is letterboxed.
function fitSlide(png, out) {
  const [w, h] = pngSize(png)
  if (w === SLIDE_W && h === SLIDE_H) return png
  if (w === SLIDE_W && Math.abs(h - SLIDE_H) <= 2 && has('magick')) {
    run('magick', [png, '-resize', `${SLIDE_W}x${SLIDE_H}!`, out])
    return out
  }
  pad(png, out, SLIDE_W, SLIDE_H)
  return out
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
