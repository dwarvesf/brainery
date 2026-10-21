// Hero: one memo note, many ways in.
const SIZE = [720, 450];

function draw(s) {
  s.frame();
  s.title(360, 56, 'one note, many ways in');

  // helper: node with up to 3 hand lines of text
  const tool = (x, y, w, h, lines, o = {}) => {
    const n = s.node(x, y, w, h, '', o);
    const gap = 21;
    const top = n.cy - ((lines.length - 1) * gap) / 2 + 6;
    lines.forEach((l, i) => s.text(n.cx, top + i * gap, l, { size: 16 }));
    return n;
  };

  const note = s.node(265, 190, 190, 100, '', { fill: 'yellow', deg: 0 });
  s.text(note.cx, note.cy - 2, 'a memo note', { size: 24 });
  s.text(note.cx, note.cy + 24, 'the article itself', { size: 14, color: s.palette.gray });

  const ask = tool(200, 98, 320, 62, ['Ask about this article', '(cites the section)'], { border: 'warn', fill: 'cream' });
  const aa = tool(26, 207, 210, 66, ['Aa: size, focus, font,', 'Bionic / BeeLine']);
  const search = tool(484, 207, 210, 66, ['Cmd+K search,', 'grouped']);
  const resume = tool(70, 340, 230, 56, ['Resume where you', 'stopped']);
  const writers = tool(420, 340, 230, 56, ['Writers and Fellows']);

  s.connect(ask, note, { from: 'bottom', to: 'top', stroke: 'solid' });
  s.connect(aa, note, { from: 'right', to: 'left' });
  s.connect(search, note, { from: 'left', to: 'right' });
  s.arrow(resume.cx + 40, resume.y, 318, 292, {});
  s.arrow(writers.cx - 40, writers.y, 402, 292, {});

  s.watermark('@dfoundation');
}
