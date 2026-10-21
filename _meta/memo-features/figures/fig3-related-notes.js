// Before vs after: how related notes get picked.
const SIZE = [720, 696];

function draw(s) {
  s.frame();
  s.title(360, 52, 'picking related notes');
  // node with a label and a 14px sub line (kit sub is 12.5px, too small at column width)
  const two = (x, y, w, h, label, sub, o = {}) => {
    const n = s.node(x, y, w, h, '', o);
    s.text(n.cx, n.cy - 1, label, { size: o.size || 17 });
    s.text(n.cx, n.cy + 20, sub, { size: 14, color: s.palette.gray });
    return n;
  };

  // ---- BEFORE (quiet, gray) ----
  s.group(30, 104, 310, 540, { stroke: 'gray' });
  s.sectionLabel(44, 128, 'before: same folder');
  const a1 = two(60, 158, 250, 64, 'tuning AI agents', 'the article, lives in essays/', { deg: 0 });
  s.group(60, 276, 250, 236, { label: 'essays/' });
  const b1 = s.node(80, 302, 210, 64, 'How trust works at Dwarves', { size: 14, deg: 0, stroke: 'dashed' });
  const b2 = s.node(80, 410, 210, 64, 'Designing Out SNAP Fraud', { size: 14, deg: 0, stroke: 'dashed' });
  s.arrow(a1.cx, a1.y + a1.h + 2, a1.cx, 272, { label: 'same folder', labelDx: 62, labelDy: 4 });
  s.text(185, 596, 'pulled in only because', { size: 16, color: s.palette.bad });
  s.text(185, 620, 'they share the folder', { size: 16, color: s.palette.bad });

  // ---- AFTER (accented) ----
  s.group(380, 104, 310, 540, { stroke: 'accent:good' });
  s.sectionLabel(394, 128, 'after: nearest by meaning');
  const a2 = two(410, 158, 250, 64, 'tuning AI agents', 'the same article', { deg: 0 });

  s.group(410, 262, 250, 164, { stroke: 'accent:good' });
  s.text(430, 296, '1  links first', { size: 17, anchor: 'start' });
  s.text(430, 326, '2  then backlinks', { size: 17, anchor: 'start' });
  s.text(430, 356, '3  nearest by embedding', { size: 17, anchor: 'start' });
  s.text(452, 382, 'embedding over every note', { size: 14, anchor: 'start', color: s.palette.gray });
  s.text(452, 404, 'weak matches dropped', { size: 14, anchor: 'start', color: s.palette.gray });
  s.arrow(a2.cx, a2.y + a2.h + 2, a2.cx, 258, { stroke: 'solid', color: 'good' });

  const r = ['AI agent explained', 'AI agent architectures', 'Human intervention'];
  r.forEach((t, i) => s.node(430, 470 + i * 44 + i * 6, 210, 42, t, { size: 16, fill: 'mint', border: 'good', deg: 0 }));
  s.arrow(a2.cx, 429, a2.cx, 466, { stroke: 'solid', color: 'good' });

  s.watermark('@dfoundation');
}
