import { SITE, SECTIONS } from './content.js';
import { sfx } from './music.js';
import { createView, createAtmos, rect, drawText, drawLabel, drawGhost, drawCoin, drawBrick, drawFlag, drawPine, spark, pop, updateParts, drawParts, clamp, GOLD } from './engine.js';

export const END_X = 2900, WORLD = 3100;              // about 35 seconds of walking
const SPEED = 90, JUMP_V = -290, GRAV = 700;
const ZONES = [{ id: 'about', x: 450 }, { id: 'work', x: 1050 }, { id: 'skills', x: 1650 }, { id: 'contact', x: 2250 }];
const pits = [[760, 802], [1360, 1404], [1960, 2006], [2640, 2682]].map(([x1, x2]) => ({ x1, x2 }));

export function createGame(canvas, api) {
  const view = createView(canvas);
  const atmos = createAtmos({ idleRain: 8, dayAt: 45, dayDur: 14, rainFor: 14 });
  const keys = {};
  const flags = [600, 1200, 1800, 2400].map((x, i) => ({ x, hit: false, i }));
  const blocks = [];
  ZONES.forEach((z) => { const s = SECTIONS.find((q) => q.id === z.id);
    blocks.push({ x: z.x - 14, kind: 'brick', y: 0, bump: 0 }, { x: z.x, kind: 'q', section: s, y: 0, bump: 0, used: false }, { x: z.x + 14, kind: 'brick', y: 0, bump: 0 }); });
  [250, 900, 1250, 1550, 2100, 2750].forEach((x, i) => blocks.push({ x, kind: i % 2 ? 'q' : 'brick', coin: true, y: 0, bump: 0, used: false }));
  const coins = [];
  const addArc = (x0, n, gap, h) => { for (let i = 0; i < n; i++) coins.push({ x: x0 + i * gap, dy: h + Math.sin((i / (n - 1)) * Math.PI) * 22, got: false }); };
  pits.forEach((p) => addArc(p.x1 - 6, 5, 12, 26));
  for (let x = 250; x < 2850; x += 170) if (!pits.some((p) => x > p.x1 - 70 && x < p.x2 + 20)) addArc(x, 3, 16, 18);
  const trees = []; for (let x = 120; x < WORLD; x += 70 + (x * 7) % 60) if (!pits.some((p) => x > p.x1 - 15 && x < p.x2 + 15)) trees.push({ x, h: 14 + (x * 13) % 10 });

  const P = { x: 60, y: view.GROUND, vy: 0, dir: 1, ground: true, walk: 0 };
  let started = false, paused = true, cam = 0, lastFlag = 0, finished = false, score = 0, name = SITE.name, pending = null, raf = 0, last = performance.now(), dead = false;
  const BLOCK_Y = () => view.GROUND - 52;
  const groundAt = (x) => (pits.some((p) => x > p.x1 + 3 && x < p.x2 - 3) ? Infinity : view.GROUND);
  const add = (n, x, y) => { score += n; api.onScore(score); if (x != null) pop(x, y, '+' + n, '#ffe27a'); };
  const later = (t, fn) => { pending = { t, fn }; };

  function teleport(id) { const z = ZONES.find((q) => q.id === id); P.x = z.x - 70; P.y = view.GROUND; P.vy = 0; lastFlag = Math.max(0, ...flags.filter((f) => f.x < P.x).map((f) => f.x)); }

  function hitBlock(b) {
    b.bump = 6; sfx('bump'); spark(b.x + 7, b.y, '#ffe9a0', 6);
    if (b.section) {
      if (!b.used) { b.used = true; add(100, b.x + 7, b.y - 10); sfx('coin'); api.toast(`+100  ${b.section.title} unlocked!`); }
      later(0.35, () => api.openSection(b.section.id));
    } else if (b.coin && !b.used) { b.used = true; add(20, b.x + 7, b.y - 10); sfx('coin'); }
  }

  function update(dt) {
    atmos.update(dt);
    if (pending) { pending.t -= dt; if (pending.t <= 0) { const f = pending.fn; pending = null; f(); } }
    blocks.forEach((b) => { b.y = BLOCK_Y(); b.bump = Math.max(0, b.bump - dt * 40); });
    if (paused || !started) { P.walk = 0; return; }
    const L = keys.arrowleft || keys.a, R = keys.arrowright || keys.d, J = keys[' '] || keys.arrowup || keys.w;
    const mv = (R ? 1 : 0) - (L ? 1 : 0);
    P.x = clamp(P.x + mv * SPEED * dt, 10, WORLD - 10);
    if (mv) { P.dir = mv; P.walk += dt * 8; } else P.walk = 0;
    if (J && P.ground) { P.vy = JUMP_V; P.ground = false; sfx('jump'); }
    const prevHead = P.y - 27, prevY = P.y; P.vy += GRAV * dt; P.y += P.vy * dt;
    const gy = groundAt(P.x); let landed = false;
    if (P.vy >= 0) blocks.forEach((b) => { if (!landed && P.x + 5 > b.x && P.x - 5 < b.x + 14 && prevY <= b.y + 2 && P.y >= b.y) { P.y = b.y; P.vy = 0; landed = true; } });
    if (!landed && gy !== Infinity && P.vy >= 0 && P.y >= gy && prevY <= gy + 2) { P.y = gy; P.vy = 0; landed = true; }
    if (!landed && gy !== Infinity && P.y > view.GROUND + 4) { P.y = view.GROUND; P.vy = 0; landed = true; }
    P.ground = landed;
    if (P.vy < 0) { const head = P.y - 27; blocks.forEach((b) => { if (P.x + 6 > b.x && P.x - 6 < b.x + 14 && prevHead >= b.y + 14 && head < b.y + 14) { P.vy = 60; P.y = b.y + 14 + 27; hitBlock(b); } }); }
    if (P.y > view.H + 20) { P.x = lastFlag || 60; P.y = view.GROUND; P.vy = 0; P.ground = true; sfx('hurt'); api.toast('Oops! Back to the checkpoint'); }
    coins.forEach((c) => { if (!c.got && Math.abs(c.x - P.x) < 9 && Math.abs(view.GROUND - c.dy - (P.y - 12)) < 16) { c.got = true; add(10, c.x, view.GROUND - c.dy - 8); sfx('coin'); spark(c.x, view.GROUND - c.dy, GOLD, 5); } });
    flags.forEach((f) => { if (!f.hit && P.x > f.x) { f.hit = true; lastFlag = f.x; sfx('pop'); add(50, f.x, view.GROUND - 50); spark(f.x, view.GROUND - 30, '#3fd16a', 14); api.toast(`Checkpoint ${f.i + 1} ✔  +50`); later(0.5, () => api.openCheckpoint(f.i)); } });
    if (!finished && P.x >= END_X) { finished = true; sfx('win'); add(500, P.x, P.y - 40); later(0.7, () => api.onEnd()); }
    api.onProgress(P.x / END_X);
  }

  function draw() {
    const { g, W, GROUND } = view;
    cam = clamp(P.x - W * 0.4, 0, WORLD - W);
    atmos.drawBack(view, cam); atmos.drawName(view, cam, SITE.name); atmos.drawGround(view, cam, pits);
    trees.forEach((tr) => { const x = tr.x - cam; if (x > -12 && x < W + 12) drawPine(g, Math.round(x), GROUND, tr.h); });
    atmos.drawLights(view, cam, WORLD, pits);
    drawText(g, 'HI ' + name + '!', 40 - cam, GROUND - 14, '#fff'); drawText(g, 'WALK >>', 40 - cam, GROUND + 12, GOLD);
    flags.forEach((f) => drawFlag(g, Math.round(f.x - cam), GROUND, f.hit));
    blocks.forEach((b) => { const x = Math.round(b.x - cam); if (x > -20 && x < W + 20) drawBrick(g, x, b.y, b.kind, b.used, b.bump); });
    ZONES.forEach((z) => { const s = SECTIONS.find((q) => q.id === z.id); const x = z.x + 7 - cam; if (x > -40 && x < W + 40) drawLabel(g, s.short, Math.round(x), BLOCK_Y() - 22); });
    coins.forEach((c) => { if (!c.got) { const x = c.x - cam; if (x > -6 && x < W + 6) drawCoin(g, Math.round(x), Math.round(GROUND - c.dy), atmos.time); } });
    const ex = END_X - cam; if (ex > -60 && ex < W + 60) { rect(g, ex, GROUND - 60, 3, 60, '#fff'); rect(g, ex + 3, GROUND - 60, 22, 12, '#ff7ac8'); drawText(g, 'THANKS!', ex - 12, GROUND - 76, GOLD); }
    drawGhost(g, Math.round(P.x - cam), Math.round(P.y - 4 + (P.ground ? Math.sin(atmos.time * 4) * 1.2 : 0)), { dir: P.dir, air: !P.ground, face: 'happy' });
    updateParts(1 / 60); drawParts(g, cam); atmos.drawRain(view);
  }

  const norm = (e) => (e.key === ' ' ? ' ' : e.key.toLowerCase());
  const kd = (e) => { if (e.target.tagName === 'INPUT') return; atmos.poke(); if (paused || !started) return; const k = norm(e); if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault(); keys[k] = true; };
  const ku = (e) => { keys[norm(e)] = false; };
  const pd = () => atmos.poke();
  addEventListener('keydown', kd); addEventListener('keyup', ku); addEventListener('pointerdown', pd);
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

  const frame = (now) => { if (dead) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!view.idle) { update(dt); draw(); } raf = requestAnimationFrame(frame); };
  raf = requestAnimationFrame(frame);

  return {
    atmos, P, view, keys,
    start(n) { name = n; started = true; paused = false; sfx('win'); },
    setPaused(b) { paused = b; if (b) for (const k in keys) keys[k] = false; },
    setIdle(b) { view.idle = b; },
    teleport, setKey(k, b) { if (paused || !started) return; atmos.poke(); keys[k] = b; },
    addScore(n, label) { add(n, P.x, P.y - 40); },
    destroy() { dead = true; cancelAnimationFrame(raf); removeEventListener('keydown', kd); removeEventListener('keyup', ku); removeEventListener('pointerdown', pd); },
  };
}
