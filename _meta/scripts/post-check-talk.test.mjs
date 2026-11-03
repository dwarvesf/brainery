// Tests for the talk checks T1 to T8 in post-check.mjs.
// Run: node --test _meta/scripts/post-check-talk.test.mjs
// Builds a small passing talk in a temp folder (real PNG slides, a real PDF),
// then breaks one rule per case and expects that rule's id and no other.

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const CHECK = join(dirname(fileURLToPath(import.meta.url)), 'post-check.mjs')
const NAME = 'fixture-talk'
const NOTES = 'This note explains the slide in plain words, with one number and the reason it matters to the reader here.'

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (b) => {
  let c = 0xffffffff
  for (const x of b) c = CRC[(c ^ x) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function png(w, h) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const td = Buffer.concat([Buffer.from(type, 'latin1'), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(td))
    return Buffer.concat([len, td, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr.set([8, 2, 0, 0, 0], 8)
  const raw = Buffer.alloc((w * 3 + 1) * h)
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}
function pdf(pages) {
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', `<< /Type /Pages /Kids [${Array.from({ length: pages }, (_, i) => `${i + 3} 0 R`).join(' ')}] /Count ${pages} >>`]
  for (let i = 0; i < pages; i++) objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 1200 675] >>')
  let out = '%PDF-1.4\n'
  const offs = objs.map((o, i) => {
    const at = out.length
    out += `${i + 1} 0 obj\n${o}\nendobj\n`
    return at
  })
  const xref = out.length
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offs.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(out, 'latin1')
}

// sections: [{ title, slides: [{ n, alt, notes, file? }] }]
function note({ sections, image = `/content/${NAME}-root/assets/${NAME}/og.png`, deck = `assets/${NAME}/deck.pdf`, ratio }) {
  const seg = (s) => [`![${s.alt}](assets/${NAME}/slides/${s.file ?? `slide-${String(s.n).padStart(2, '0')}.png`})`, s.notes].filter(Boolean).join('\n\n')
  const body = sections.map(({ title, slides }) => [`## ${title}`, ...slides.map(seg)].join('\n\n')).join('\n\n')
  const img = image ? `image: ${image}\n` : ''
  return `---\ntitle: Fixture talk\ndescription: A fixture for the talk checks.\ndate: 2026-11-03\nlayout: talk\n${img}talk:\n  deck: ${deck}\n${ratio ? `  ratio: "${ratio}"\n` : ''}---\n\nThe intro paragraph.\n\n${body}\n\n---\n\nThe outro.\n`
}

const slide = (n, last) => ({ n, alt: `Slide ${n} says one clear thing about the fixture`, notes: n === 1 || last ? '' : NOTES })
const goodSections = () => [
  { title: 'First part', slides: [1, 2, 3, 4].map((n) => slide(n)) },
  { title: 'Second part', slides: [5, 6, 7, 8].map((n) => slide(n, n === 8)) },
]

function fixture({ sections = goodSections(), pages = 8, files = 8, sizes = {}, og = [1200, 630], ...rest } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'talk-test-'))
  // Outside a git checkout the vault root is unknown, so T8 checks the og.png suffix of image:.
  const dir = join(root, `${NAME}-root`)
  const slides = join(dir, 'assets', NAME, 'slides')
  mkdirSync(slides, { recursive: true })
  for (let n = 1; n <= files; n++) {
    const [w, h] = sizes[n] ?? [1600, 900]
    writeFileSync(join(slides, `slide-${String(n).padStart(2, '0')}.png`), png(w, h))
  }
  writeFileSync(join(dir, 'assets', NAME, 'deck.pdf'), pdf(pages))
  writeFileSync(join(dir, 'assets', NAME, 'og.png'), png(...og))
  const file = join(dir, `${NAME}.md`)
  writeFileSync(file, note({ sections, ...rest }))
  return { root, file }
}

function check(fx) {
  const r = spawnSync(process.execPath, [CHECK, fx.file], { encoding: 'utf8' })
  rmSync(fx.root, { recursive: true, force: true })
  assert.equal(r.status, 0, `post-check crashed: ${r.stderr}`)
  return r.stdout
}
const ids = (out) => [...new Set([...out.matchAll(/^WARN (\S+) /gm)].map((m) => m[1]))].sort()

test('a well-formed talk passes', () => {
  const out = check(fixture())
  assert.match(out, /^PASS /m, out)
})

test('T1: deck page count differs from the slide count', () => {
  assert.deepEqual(ids(check(fixture({ pages: 7 }))), ['T1'])
})

test('T2: one slide name broken (negative control)', () => {
  const sections = goodSections()
  sections[0].slides[2].file = 'slide-3.png'
  const out = check(fixture({ sections }))
  assert.deepEqual(ids(out), ['T2'], out)
  assert.match(out, /slide-03\.png is never referenced/)
})

test('T2: slides out of order', () => {
  const sections = goodSections()
  ;[sections[0].slides[1], sections[0].slides[2]] = [sections[0].slides[2], sections[0].slides[1]]
  assert.deepEqual(ids(check(fixture({ sections }))), ['T2'])
})

test('T3: fewer than 8 slides', () => {
  const sections = goodSections()
  sections[1].slides.pop()
  sections[1].slides.at(-1).notes = ''
  assert.deepEqual(ids(check(fixture({ sections, pages: 7, files: 7 }))), ['T3'])
})

test('T4: thin alt text', () => {
  const sections = goodSections()
  sections[0].slides[3].alt = 'Slide 4'
  assert.deepEqual(ids(check(fixture({ sections }))), ['T4'])
})

test('T5: a slide at an unsupported ratio', () => {
  assert.deepEqual(ids(check(fixture({ sizes: { 5: [1600, 800] } }))), ['T5'])
})

test('T5: a 4:3 deck passes', () => {
  const sizes = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 1, [1600, 1200]]))
  const out = check(fixture({ sizes, ratio: '4:3' }))
  assert.match(out, /^PASS /m, out)
})

test('T5: a 16:10 deck at a 1200 px long edge passes', () => {
  const sizes = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 1, [1200, 750]]))
  assert.match(check(fixture({ sizes, ratio: '16:10' })), /^PASS /m)
})

test('T5: a 4:3 deck without talk.ratio fails (the default is 16:9)', () => {
  const sizes = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 1, [1600, 1200]]))
  const out = check(fixture({ sizes }))
  assert.deepEqual(ids(out), ['T5'], out)
  assert.match(out, /talk\.ratio is not set/)
})

test('T5: a declared ratio that disagrees with the slides fails', () => {
  const out = check(fixture({ ratio: '16:10' }))
  assert.deepEqual(ids(out), ['T5'], out)
  assert.match(out, /talk\.ratio is 16:10 but the slides are 16:9/)
})

test('T5: a mixed-ratio deck fails', () => {
  const out = check(fixture({ sizes: { 4: [1600, 1200] } }))
  assert.deepEqual(ids(out), ['T5'], out)
  assert.match(out, /mixes ratios \(16:9, 4:3\)/)
})

test('T5: a long edge under 1200 px fails', () => {
  const sizes = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 1, [960, 540]]))
  assert.deepEqual(ids(check(fixture({ sizes }))), ['T5'])
})

test('T6: notes too short', () => {
  const sections = goodSections()
  sections[0].slides[2].notes = 'Too short to explain anything.'
  assert.deepEqual(ids(check(fixture({ sections }))), ['T6'])
})

test('T6: a middle slide without notes fails, the first and last may have none', () => {
  const sections = goodSections()
  sections[1].slides[1].notes = ''
  assert.deepEqual(ids(check(fixture({ sections }))), ['T6'])
})

test('T7: only one section', () => {
  const sections = [{ title: 'Only part', slides: goodSections().flatMap((s) => s.slides) }]
  assert.deepEqual(ids(check(fixture({ sections }))), ['T7'])
})

test('T8: share image at the wrong size', () => {
  assert.deepEqual(ids(check(fixture({ og: [1200, 600] }))), ['T8'])
})

test('T8: image field missing', () => {
  assert.deepEqual(ids(check(fixture({ image: '' }))), ['T8'])
})

test('a note without layout: talk gets no talk checks', () => {
  const fx = fixture()
  writeFileSync(fx.file, readFileSync(fx.file, 'utf8').replace('layout: talk', 'layout: series'))
  const out = check(fx)
  assert.ok(!/^WARN T\d /m.test(out), out)
})
