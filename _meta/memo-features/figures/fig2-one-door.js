// One door: Ask drawer -> Neko chat, same thread.
const SIZE = [720, 600];

function draw(s) {
  s.frame();
  s.title(360, 52, 'one door, one thread');
  // node with a label and a 14px sub line (kit sub is 12.5px, too small at column width)
  const two = (x, y, w, h, label, sub, o = {}) => {
    const n = s.node(x, y, w, h, '', o);
    s.text(n.cx, n.cy - 1, label, { size: o.size || 17 });
    s.text(n.cx, n.cy + 20, sub, { size: 14, color: s.palette.gray });
    return n;
  };

  // Cloudflare lane
  s.group(30, 112, 420, 188, { label: 'Ask runs on Cloudflare' });
  const q = s.node(60, 134, 360, 52, 'Reader asks in the Ask drawer', { size: 17, deg: 0 });
  const a = two(60, 222, 360, 64, 'Ask answers from the article', '+ up to 5 related notes, with cites', { deg: 0 });
  s.connect(q, a, { from: 'bottom', to: 'top', stroke: 'solid' });

  // Team server lane
  s.group(30, 358, 420, 212, { label: "Neko chat runs on the team's own server" });
  const move = two(60, 382, 360, 76, 'Past the page? It moves into Neko chat', 'same thread, carries the article and last turns', {
    size: 16,
    fill: 'highlight', border: 'warn', deg: 0,
  });
  const join = two(60, 490, 360, 56, 'A person from the team can join', 'always announced', { deg: 0 });

  s.arrow(a.x + a.w - 30, a.y + a.h + 2, a.x + a.w - 30, move.y - 2, { stroke: 'solid', color: 'warn' });
  s.connect(move, join, { from: 'bottom', to: 'top', stroke: 'solid' });

  // fallback
  const fb = s.node(500, 372, 190, 96, '', { stroke: 'dashed', deg: 0 });
  ['If chat is down:', 'copy the question', '+ open Discord'].forEach((l, i) =>
    s.text(fb.cx, fb.y + 30 + i * 25, l, { size: 16 }));
  s.arrow(move.x + move.w + 2, move.cy, fb.x - 2, fb.cy - 4, {});

  s.watermark('@dfoundation');
}
