// Tests that talk-build.mjs stamps deck.pdf with the post's Title, Author and Subject.
// Run: node --test _meta/scripts/talk-build-meta.test.mjs
// Builds a talk from a fixture PDF (--from pdf, so no browser is needed), then reads the
// result back with pdfinfo. Skips when a binary the build needs is not installed.

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const SCRIPTS = dirname(fileURLToPath(import.meta.url))
const BUILD = join(SCRIPTS, 'talk-build.mjs')
const SPEAKERS = join(SCRIPTS, '..', 'talk-template', 'speakers')
const NAME = 'meta-talk'

const has = (bin) => spawnSync('sh', ['-c', `command -v ${bin}`], { stdio: 'ignore' }).status === 0
const missing = ['gs', 'pdfinfo', 'pdftoppm', 'cwebp'].filter((b) => !has(b))
if (!has('magick') && !has('sips')) missing.push('magick or sips')
const skip = missing.length ? `missing: ${missing.join(', ')}` : false

function pdf(pages) {
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', `<< /Type /Pages /Kids [${Array.from({ length: pages }, (_, i) => `${i + 3} 0 R`).join(' ')}] /Count ${pages} >>`]
  for (let i = 0; i < pages; i++) objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 1600 900] >>')
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

// Build a one-deck talk from frontmatter lines, return pdfinfo of its deck.pdf.
function build(frontmatter, runs = 1) {
  const root = mkdtempSync(join(tmpdir(), 'talk-meta-'))
  try {
    const assets = join(root, 'assets', NAME)
    mkdirSync(assets, { recursive: true })
    writeFileSync(join(assets, 'deck.pdf'), pdf(2))
    const file = join(root, `${NAME}.md`)
    writeFileSync(file, `---\n${frontmatter.join('\n')}\nlayout: talk\ntalk:\n  deck: assets/${NAME}/deck.pdf\n---\n\nIntro.\n`)
    let r
    for (let i = 0; i < runs; i++) {
      r = spawnSync(process.execPath, [BUILD, file, '--from', 'pdf'], { encoding: 'utf8' })
      // 0 and 1 are a built deck (1 = talk-check warnings on this tiny fixture); 2 is a die.
      assert.ok(r.status === 0 || r.status === 1, `talk-build died (${r.status}): ${r.stderr}`)
    }
    const info = spawnSync('pdfinfo', [join(assets, 'deck.pdf')], { encoding: 'utf8' }).stdout
    return { info, out: r.stdout, field: (k) => info.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1] }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test('Title, Subject and the speaker-file Author land in deck.pdf', { skip }, () => {
  const name = JSON.parse(readFileSync(join(SPEAKERS, 'tieubao.json'), 'utf8')).name
  const r = build(['title: How to publish a talk on memo', 'description: A talk post puts each slide beside what you said.', 'authors:', '  - tieubao'])
  assert.equal(r.field('Title'), 'How to publish a talk on memo', r.info)
  assert.equal(r.field('Author'), name, r.info)
  assert.equal(r.field('Subject'), 'A talk post puts each slide beside what you said.', r.info)
  assert.match(r.out, /Title, Author, Subject written/)
})

test('Author falls back to the handle when there is no speaker file', { skip }, () => {
  const r = build(['title: A talk', 'description: About a thing.', 'authors:', '  - no-such-speaker'])
  assert.equal(r.field('Author'), 'no-such-speaker', r.info)
})

test('accents, Đ, quotes and parentheses survive in the Title', { skip }, () => {
  const r = build(['title: "Xây dựng hệ thống: Đừng quên \\"Phở\\" (bản 2)"', 'description: Mô tả ngắn.', 'authors: [no-such-speaker]'])
  assert.equal(r.field('Title'), 'Xây dựng hệ thống: Đừng quên "Phở" (bản 2)', r.info)
  assert.equal(r.field('Subject'), 'Mô tả ngắn.', r.info)
  assert.equal(r.field('Author'), 'no-such-speaker', r.info)
})

test('rebuilding the same deck keeps the metadata', { skip }, () => {
  const r = build(['title: Same again', 'description: Twice.', 'authors:', '  - no-such-speaker'], 2)
  assert.equal(r.field('Title'), 'Same again', r.info)
  assert.equal(r.field('Author'), 'no-such-speaker', r.info)
  assert.equal(r.field('Pages'), '2', r.info)
})
