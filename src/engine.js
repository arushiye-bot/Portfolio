// Shared pixel engine: view, sky/weather, sprites, input, particles.
export const GOLD = '#ffd23f', DG = '#c99a10', INK = '#2b2f5e';
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
export const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// 5x7 pixel font
const F = {
  A:'01110,10001,10001,11111,10001,10001,10001',B:'11110,10001,10001,11110,10001,10001,11110',C:'01110,10001,10000,10000,10000,10001,01110',
  D:'11110,10001,10001,10001,10001,10001,11110',E:'11111,10000,10000,11110,10000,10000,11111',F:'11111,10000,10000,11110,10000,10000,10000',
  G:'01110,10001,10000,10111,10001,10001,01111',H:'10001,10001,10001,11111,10001,10001,10001',I:'11111,00100,00100,00100,00100,00100,11111',
  J:'00111,00010,00010,00010,00010,10010,01100',K:'10001,10010,10100,11000,10100,10010,10001',L:'10000,10000,10000,10000,10000,10000,11111',
  M:'10001,11011,10101,10101,10001,10001,10001',N:'10001,11001,10101,10011,10001,10001,10001',O:'01110,10001,10001,10001,10001,10001,01110',
  P:'11110,10001,10001,11110,10000,10000,10000',Q:'01110,10001,10001,10001,10101,10010,01101',R:'11110,10001,10001,11110,10100,10010,10001',
  S:'01111,10000,10000,01110,00001,00001,11110',T:'11111,00100,00100,00100,00100,00100,00100',U:'10001,10001,10001,10001,10001,10001,01110',
  V:'10001,10001,10001,10001,10001,01010,00100',W:'10001,10001,10001,10101,10101,10101,01010',X:'10001,10001,01010,00100,01010,10001,10001',
  Y:'10001,10001,01010,00100,00100,00100,00100',Z:'11111,00001,00010,00100,01000,10000,11111',
  0:'01110,10001,10011,10101,11001,10001,01110',1:'00100,01100,00100,00100,00100,00100,01110',2:'01110,10001,00001,00010,00100,01000,11111',
  3:'11110,00001,00001,01110,00001,00001,11110',4:'00010,00110,01010,10010,11111,00010,00010',5:'11111,10000,11110,00001,00001,10001,01110',
  6:'00110,01000,10000,11110,10001,10001,01110',7:'11111,00001,00010,00100,01000,01000,01000',8:'01110,10001,10001,01110,10001,10001,01110',
  9:'01110,10001,10001,01111,00001,00010,01100','?':'01110,10001,00001,00110,00100,00000,00100','!':'00100,00100,00100,00100,00100,00000,00100',
  '+':'00000,00100,00100,11111,00100,00100,00000','-':'00000,00000,00000,11111,00000,00000,00000',' ':'00000,00000,00000,00000,00000,00000,00000',
};
const GLY = {}; for (const k in F) GLY[k] = F[k].split(',');

export function rect(g, x, y, w, h, c) { if (c) g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(0, Math.round(w)), Math.max(0, Math.round(h))); }
export function ellipseRows(g, cx, cy, rx, ry, c) {
  g.fillStyle = c;
  for (let dy = -Math.floor(ry); dy <= Math.floor(ry); dy++) {
    const half = rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.01)));
    g.fillRect(Math.round(cx - half), Math.round(cy + dy), Math.max(1, Math.round(half * 2)), 1);
  }
}
export function textW(t, cell = 1) { return t.length * 6 * cell - cell; }
export function drawText(g, text, x, y, color, cell = 1) {
  g.fillStyle = color; let cx = Math.round(x);
  for (const ch of String(text).toUpperCase()) {
    const gl = GLY[ch];
    if (gl) for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (gl[r][c] === '1') g.fillRect(cx + c * cell, Math.round(y) + r * cell, cell, cell);
    cx += 6 * cell;
  }
}
export function drawLabel(g, text, cx, y, arrow = true) {
  const w = textW(text) + 8, x = Math.round(cx - w / 2);
  rect(g, x, y, w, 11, DG); rect(g, x + 1, y + 1, w - 2, 9, GOLD); drawText(g, text, x + 4, y + 2, INK);
  if (arrow) { rect(g, cx - 3, y + 11, 7, 1, GOLD); rect(g, cx - 2, y + 12, 5, 1, GOLD); rect(g, cx - 1, y + 13, 3, 1, GOLD); }
}

// ---------- view ----------
export function createView(canvas) {
  const g = canvas.getContext('2d');
  const v = { canvas, g, W: 320, H: 190, GROUND: 156, portrait: false };
  v.resize = () => {
    const iw = innerWidth, ih = innerHeight;
    v.portrait = ih > iw * 1.05;
    const coarse = matchMedia('(pointer: coarse)').matches;
    if (v.portrait) { v.W = 200; v.H = clamp(Math.round(200 * ih / iw), 260, 440); }
    else { v.H = 190; v.W = clamp(Math.round(190 * iw / ih), 260, 460); }
    v.GROUND = v.H - (coarse ? (v.portrait ? 74 : 58) : 34);
    canvas.width = v.W; canvas.height = v.H; g.imageSmoothingEnabled = false;
  };
  addEventListener('resize', v.resize); v.resize();
  return v;
}

// ---------- atmosphere: sky, weather, aliens ----------
const P0 = { top: [10, 12, 40], mid: [58, 40, 112], hor: [188, 80, 122] };
const PM = { top: [58, 48, 128], mid: [228, 108, 112], hor: [255, 190, 120] };
const P1 = { top: [96, 166, 232], mid: [140, 196, 240], hor: [255, 226, 190] };
const mixP = (a, b, t) => ({ top: mix(a.top, b.top, t), mid: mix(a.mid, b.mid, t), hor: mix(a.hor, b.hor, t) });
const pal = (t) => (t < .5 ? mixP(P0, PM, t * 2) : mixP(PM, P1, (t - .5) * 2));

export function drawUFO(g, x, y, s = 1, alpha = 1) {
  g.globalAlpha = alpha;
  ellipseRows(g, x, y - 3 * s, 6 * s, 5 * s, '#96e6ff'); rect(g, x - 1 * s, y - 5 * s, 3 * s, 3 * s, '#78e682');
  rect(g, x - 1 * s, y - 4 * s, 1, 1, INK); rect(g, x + 1 * s, y - 4 * s, 1, 1, INK);
  ellipseRows(g, x, y + 1 * s, 13 * s, 4 * s, '#a0aacd'); ellipseRows(g, x, y + 2 * s, 12 * s, 2 * s, '#6e78a8');
  const lc = ['#ff78c8', '#ffe15a', '#64ffa0', '#ff78c8'];
  for (let i = 0; i < 4; i++) rect(g, x + (-9 + i * 6) * s, y + 1 * s, Math.max(1, 2 * s), Math.max(1, 2 * s), lc[i]);
  g.globalAlpha = 1;
}

export function createAtmos(cfg) {
  const A = { cfg, t: 0, rain: 0, elapsed: 0, idle: 0, rainUntil: -1, time: 0, forceDay: false };
  A.stars = Array.from({ length: 120 }, (_, i) => ({ nx: rnd(i * 7.1), ny: rnd(i * 3.3 + 9) * .75, ph: rnd(i) * 6 }));
  A.ufos = [
    { nx: .15, ny: .2, s: 1.3, sp: .006, ph: 0, beam: true }, { nx: .58, ny: .1, s: 1, sp: -.004, ph: 2 },
    { nx: .82, ny: .3, s: 1.5, sp: .003, ph: 4, beam: true }, { nx: .35, ny: .42, s: .6, sp: .008, ph: 1 }, { nx: .05, ny: .52, s: .5, sp: .005, ph: 3 },
  ];
  A.drops = Array.from({ length: 220 }, (_, i) => ({ nx: rnd(i * 1.7), ny: rnd(i * 2.9), sp: 130 + rnd(i) * 90 }));
  A.clouds = Array.from({ length: 6 }, (_, i) => ({ x: i * 150 + 40, y: 20 + rnd(i * 4) * 40, s: 0.8 + rnd(i) * .7 }));
  A.shooters = []; A.nextShoot = 2;
  A.poke = () => { A.idle = 0; };
  A.update = (dt) => {
    A.time += dt; A.elapsed += dt; A.idle += dt;
    A.nextShoot -= dt;
    if (A.nextShoot <= 0) { A.nextShoot = 2.5 + Math.random() * 4; if (A.t < .5) A.shooters.push({ x: Math.random() * 1.1, y: Math.random() * .35, life: 0, dur: .9 + Math.random() * .5, len: 26 + Math.random() * 24 }); }
    for (let i = A.shooters.length - 1; i >= 0; i--) { const q = A.shooters[i]; q.life += dt; if (q.life > q.dur) A.shooters.splice(i, 1); }
    if (A.elapsed > cfg.dayAt || A.forceDay) A.t = Math.min(1, A.t + dt / cfg.dayDur);
    if (A.idle > cfg.idleRain && A.t < .3 && A.elapsed >= A.rainUntil) A.rainUntil = A.elapsed + cfg.rainFor;
    const want = (A.elapsed < A.rainUntil && A.t < .35) ? 1 : 0;
    A.rain += (want - A.rain) * Math.min(1, dt * 1.5);
    A.ufos.forEach((u, i) => { if (A.t > .55) u.ny -= dt * (.05 + .012 * i); else { u.nx += u.sp * dt; if (u.nx > 1.1) u.nx = -.1; if (u.nx < -.1) u.nx = 1.1; } });
    A.drops.forEach((d) => { d.ny += d.sp * dt / 400; if (d.ny > 1) { d.ny = -.02; } });
  };
  A.drawBack = (v, cam) => {
    const { g, W, GROUND } = v, p = pal(A.t), t = A.t;
    for (let y = 0; y < GROUND; y++) { const f = y / GROUND; g.fillStyle = rgb(f < .5 ? mix(p.top, p.mid, f * 2) : mix(p.mid, p.hor, (f - .5) * 2)); g.fillRect(0, y, W, 1); }
    const sa = Math.max(0, 1 - t * 1.7);
    if (sa > 0) { g.globalAlpha = sa; g.fillStyle = '#fff'; A.stars.forEach((s) => { if (((A.time * 1.3 + s.ph) | 0) % 5) g.fillRect(Math.round(s.nx * W), Math.round(s.ny * GROUND), 1, 1); }); g.globalAlpha = 1; }
    A.shooters.forEach((q) => { const k = q.life / q.dur, al = Math.max(0, 1 - t * 2) * (1 - k * k); if (al <= 0) return; const hx = (q.x - .1 + k * .55) * W, hy = q.y * GROUND + k * GROUND * .3;
      for (let i = 0; i < q.len; i++) { g.globalAlpha = al * (1 - i / q.len) * .9; g.fillStyle = i < 2 ? '#ffffff' : '#ffe9b0'; g.fillRect(Math.round(hx - i * 1.7), Math.round(hy - i * .55), 2, i < q.len * .5 ? 2 : 1); } g.globalAlpha = 1; });
    if (t < .6) { g.globalAlpha = Math.max(0, 1 - t * 1.8); ellipseRows(g, W * .82, GROUND * .2, 7, 7, '#f5e9b8'); ellipseRows(g, W * .82 + 3, GROUND * .2 - 1, 6, 6, rgb(mix(p.top, p.mid, .4))); g.globalAlpha = 1; }
    if (t > .22) { const e = clamp((t - .22) / .78, 0, 1), sy = GROUND * .92 + (GROUND * .2 - GROUND * .92) * e, sx = W * .8; g.globalAlpha = .25; ellipseRows(g, sx, sy, 15, 15, '#ffe896'); g.globalAlpha = 1; ellipseRows(g, sx, sy, 9, 9, '#ffe896'); }
    const aa = Math.max(0, 1 - t * 1.5) * .12;
    if (aa > 0) { for (let x = 0; x < W; x += 2) { const y1 = GROUND * .25 + Math.sin((x + cam * .1) / 40 + A.time * .4) * 10; g.fillStyle = `hsla(${(140 + x * .35 + A.time * 10) % 360},85%,62%,${aa})`; g.fillRect(x, y1, 2, 14); const y2 = GROUND * .38 + Math.sin((x + cam * .1) / 30 + A.time * .3 + 2) * 8; g.fillStyle = `hsla(${(250 + x * .35 + A.time * 10) % 360},85%,66%,${aa})`; g.fillRect(x, y2, 2, 10); } }
    const ca = clamp((t - .4) * 1.7, 0, .95);
    if (ca > 0) { g.globalAlpha = ca; A.clouds.forEach((c) => { const cx = ((c.x - cam * .08 + A.time * 3) % (W + 120) + W + 120) % (W + 120) - 40; ellipseRows(g, cx, c.y, 10 * c.s, 5 * c.s, '#fafcff'); ellipseRows(g, cx + 9 * c.s, c.y + 2, 9 * c.s, 4 * c.s, '#fafcff'); ellipseRows(g, cx - 8 * c.s, c.y + 2, 7 * c.s, 4 * c.s, '#fafcff'); }); g.globalAlpha = 1; }
    A.ufos.forEach((u, i) => {
      const x = u.nx * W + Math.sin(A.time * .8 + u.ph) * 4, y = u.ny * GROUND + Math.sin(A.time * 1.1 + u.ph) * 2, al = clamp(1 - Math.max(0, t - .55) * 3, 0, 1);
      if (al <= 0 || y < -20) return;
      if (u.beam && t < .5) { const b = (Math.sin(A.time * .7 + u.ph) + 1) / 2; if (b > .55) { g.fillStyle = `rgba(120,255,160,${.22 * (b - .55) / .45 * al})`; g.beginPath(); g.moveTo(x - 3 * u.s, y + 5 * u.s); g.lineTo(x + 3 * u.s, y + 5 * u.s); g.lineTo(x + 20 * u.s, GROUND); g.lineTo(x - 20 * u.s, GROUND); g.fill(); } }
      drawUFO(g, x, y, u.s, al);
    });
    const hill = (par, base, amp, col) => { g.fillStyle = col; for (let x = 0; x < W; x++) { const q = x + cam * par, h = GROUND - base + Math.sin(q / 30) * amp + Math.sin(q / 11) * amp * .4; g.fillRect(x, Math.round(h), 1, GROUND - Math.round(h)); } };
    hill(.12, 38, 11, rgb(mix([34, 28, 74], [96, 148, 126], t))); hill(.3, 20, 7, rgb(mix([26, 24, 62], [78, 134, 100], t)));
  };
  A.drawGround = (v, cam, pits = []) => {
    const { g, W, H, GROUND } = v, t = A.t;
    rect(g, 0, GROUND, W, 6, rgb(mix([46, 118, 68], [96, 188, 72], t))); rect(g, 0, GROUND + 6, W, H - GROUND - 6, rgb(mix([88, 62, 48], [140, 100, 60], t)));
    g.fillStyle = rgb(mix([34, 92, 54], [70, 160, 50], t)); for (let x = -(Math.round(cam) % 16); x < W; x += 16) g.fillRect(x, GROUND, 8, 2);
    g.fillStyle = rgb(mix([70, 48, 38], [118, 84, 50], t)); for (let x = -(Math.round(cam) % 24); x < W; x += 24) g.fillRect(x, GROUND + 14, 6, 3);
    pits.forEach((p) => {
      const sx = Math.round(p.x1 - cam), w = p.x2 - p.x1; if (sx > W || sx + w < 0) return;
      g.globalAlpha = .18; rect(g, sx - 6, GROUND - 16, w + 12, 16, '#ff7a30'); g.globalAlpha = 1;
      for (let ry = 0; ry < H - GROUND; ry += 2) { const wob = Math.sin(A.time * 3 + ry * .7 + p.x1) > 0; rect(g, sx, GROUND + ry, w, 2, wob ? '#ff5a28' : '#ff9a3c'); }
      rect(g, sx, GROUND, w, 2, '#ffd36a'); rect(g, sx - 1, GROUND, 1, H - GROUND, '#5a3a22'); rect(g, sx + w, GROUND, 1, H - GROUND, '#5a3a22');
    });
  };
  A.drawRain = (v) => {
    if (A.rain < .02) return; const { g, W, H } = v;
    g.fillStyle = `rgba(4,6,24,${.3 * A.rain})`; g.fillRect(0, 0, W, H);
    const GR = v.GROUND; g.fillStyle = `rgba(120,170,255,${.12 * A.rain})`; g.fillRect(0, GR, W, H - GR);
    for (let i = 0; i < 28; i++) { const ph = (A.time * 1.5 + rnd(i * 5.7)) % 1, w = 2 + Math.round(ph * 10), x = Math.round(rnd(i * 3.3) * W), y = GR + 3 + Math.round(rnd(i * 9.1) * (H - GR - 10)); g.fillStyle = `rgba(205,228,255,${(1 - ph) * .85 * A.rain})`; g.fillRect(x - (w >> 1), y, w, 1); g.fillRect(x - (w >> 1) - 1, y + 1, 1, 1); g.fillRect(x + (w >> 1), y + 1, 1, 1); }
    g.fillStyle = `rgba(150,185,255,${.85 * A.rain})`;
    const n = Math.floor(A.drops.length * A.rain); for (let i = 0; i < n; i++) { const d = A.drops[i]; g.fillRect(Math.round(d.nx * W - d.ny * 14), Math.round(d.ny * H), 1, 4); }
  };
  A.drawLights = (v, cam, worldW, pits = []) => {
    const { g, W, GROUND } = v, vis = 1 - A.t * .55, gap = 200, wy = GROUND - 74, sag = 14;
    const k0 = Math.max(0, Math.floor((cam - 110) / gap) - 1), k1 = Math.ceil((cam + W - 110) / gap) + 1;
    for (let k = k0; k <= k1; k++) {
      const wx0 = 110 + k * gap, wx1 = wx0 + gap; if (wx1 > worldW - 60) break;
      for (let dx = 0; dx <= gap; dx += 2) { const f = dx / gap, y = wy + sag * 4 * f * (1 - f), x = wx0 + dx - cam; if (x < -2 || x > W + 2) continue; g.fillStyle = '#2a2650'; g.fillRect(Math.round(x), Math.round(y), 2, 1); }
      for (let i = 1; i < 16; i++) { const f = i / 16, bx = wx0 + f * gap - cam, by = wy + sag * 4 * f * (1 - f) + 3; if (bx < -6 || bx > W + 6) continue;
        const hue = (i * 47 + k * 90 + A.time * 70) % 360, tw = .6 + .4 * Math.sin(A.time * 3 + i * 1.7 + k);
        g.globalAlpha = .22 * vis * tw; ellipseRows(g, bx, by, 5, 4, `hsl(${hue},100%,60%)`);
        g.globalAlpha = vis; rect(g, bx - 1, by - 1, 3, 3, `hsl(${hue},100%,${62 + 18 * tw}%)`); }
      g.globalAlpha = 1;
      [wx0, wx1].forEach((px) => { if (pits.some((p) => px > p.x1 - 4 && px < p.x2 + 4)) return; const sx = px - cam; if (sx < -4 || sx > W + 4) return; rect(g, sx, wy - 3, 2, GROUND - wy + 3, '#2a2650'); rect(g, sx - 2, wy - 3, 6, 2, '#3a3470'); });
    }
  };
  A.drawName = (v, cam, text) => {
    const { g, W, GROUND } = v; let cell = W < 260 ? 3 : 4; const n = text.toUpperCase();
    while (n.length * 6 * cell > W * 0.92 && cell > 1) cell--;
    const nw = n.length * 6 * cell, spacing = Math.max(nw + 260, 520), y = Math.round(GROUND * .2 + Math.sin(A.time * 1.4) * 3);
    for (let k = 0; k < 14; k++) {
      const x0 = Math.round((W - nw) / 2 + k * spacing - cam * .35); if (x0 > W || x0 + nw < 0) continue;
      [...n].forEach((ch, i) => { const gl = GLY[ch]; if (!gl) return; for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (gl[r][c] === '1') {
        const px = x0 + i * 6 * cell + c * cell, py = y + r * cell; g.fillStyle = GOLD; g.fillRect(px, py, cell, cell);
        if (cell >= 3) { g.fillStyle = DG; g.fillRect(px, py + cell - 1, cell, 1); g.fillRect(px + cell - 1, py, 1, cell); } else { g.fillStyle = DG; g.fillRect(px, py + cell - 1, cell, 1); } } });
    }
  };
  return A;
}

// ---------- particles ----------
const parts = [];
export const spark = (x, y, color = '#ffe9a0', n = 8) => { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 20 + Math.random() * 40; parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 20, life: .5 + Math.random() * .3, color }); } };
export const pop = (x, y, text, color = '#fff') => parts.push({ x, y, vx: 0, vy: -26, life: .9, text, color });
export function updateParts(dt) { for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; if (!p.text) p.vy += 90 * dt; if (p.life <= 0) parts.splice(i, 1); } }
export function drawParts(g, cam) { parts.forEach((p) => { if (p.text) drawText(g, p.text, p.x - cam - textW(p.text) / 2, p.y, p.color); else { g.fillStyle = p.color; g.fillRect(Math.round(p.x - cam), Math.round(p.y), 2, 2); } }); }

// ---------- sprites ----------
export function drawGhost(g, x, y, o = {}) {
  const s = o.s || 1, c = o.color || [236, 242, 255], dir = o.dir || 1, body = rgb(c), shade = rgb(mix(c, [110, 130, 200], .4));
  const R = (a, b, w, h, col) => rect(g, x + a * s, y + b * s, Math.max(1, w * s), Math.max(1, h * s), col);
  if (o.alpha != null) g.globalAlpha = o.alpha;
  const hw = 8, r = 8.5, cy = -18;
  for (let dx = -hw; dx <= hw; dx++) { const top = cy - Math.sqrt(Math.max(0, r * r - dx * dx)), bot = -3 + ((((dx + hw) / 3) | 0) % 2 ? 3 : 0); rect(g, x + dx * s, y + top * s, Math.max(1, s), (bot - top) * s, body); }
  if (o.air) { R(-12, -21, 3, 5, shade); R(9, -21, 3, 5, shade); } else { R(-11, -13, 3, 5, shade); R(8, -13, 3, 5, shade); }
  const face = o.face || 'happy', lk = dir > 0 ? 1 : -1;
  if (face === 'x') { [-5, 2].forEach((ex) => { R(ex + lk * .5, -21, 1, 1, INK); R(ex + 2 + lk * .5, -19, 1, 1, INK); R(ex + 2 + lk * .5, -21, 1, 1, INK); R(ex + lk * .5, -19, 1, 1, INK); R(ex + 1 + lk * .5, -20, 1, 1, INK); }); }
  else { R(-5 + lk * .5, -21, 2, 5, INK); R(3 + lk * .5, -21, 2, 5, INK); R(-5 + lk * .5, -21, 1, 1, '#fff'); R(3 + lk * .5, -21, 1, 1, '#fff'); }
  R(-8, -14, 3, 2, '#ff96aa'); R(5, -14, 3, 2, '#ff96aa');
  if (face === 'boo') R(-2, -14, 4, 4, INK); else if (face === 'happy') { R(-2, -13, 4, 1, INK); R(-3, -14, 1, 1, INK); R(2, -14, 1, 1, INK); }
  const a = o.acc;
  if (a === 'hat') { R(-5, -28, 10, 2, '#9664dc'); R(-3, -32, 6, 4, '#9664dc'); R(-1, -35, 2, 3, '#9664dc'); R(0, -36, 1, 1, GOLD); }
  if (a === 'tie') { R(-1, -9, 3, 2, '#d23c46'); R(0, -7, 1, 4, '#d23c46'); }
  if (a === 'glasses') { R(-7, -22, 6, 7, null); g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(Math.round(x - 7 * s) + .5, Math.round(y - 22 * s) + .5, Math.round(6 * s), Math.round(7 * s)); g.strokeRect(Math.round(x + 1 * s) + .5, Math.round(y - 22 * s) + .5, Math.round(6 * s), Math.round(7 * s)); R(-1, -19, 2, 1, INK); }
  if (a === 'mail') { R(9, -14, 9, 7, '#fff'); R(9, -14, 9, 1, DG); R(11, -13, 1, 1, DG); R(13, -12, 1, 1, DG); R(15, -13, 1, 1, DG); }
  if (a === 'bow') { R(-6, -27, 5, 3, '#ff5a8c'); R(1, -27, 5, 3, '#ff5a8c'); R(-1, -26, 2, 2, '#ffb0c8'); }
  g.globalAlpha = 1;
}
export function drawKid(g, x, y, o = {}) {
  const d = o.dir || 1, R = (a, b, w, h, c) => rect(g, d > 0 ? x + a : x - a - w, y + b, w, h, c);
  const skin = '#f4ceaa', hair = '#46283c', coat = '#5090dc', scarf = '#dc4650';
  const bob = o.moving ? ((Math.floor(o.step || 0) % 2) ? 1 : 0) : 0;
  R(-6, -25, 12, 2, hair); R(-7, -24, 14, 5, hair); R(-3, -29, 6, 4, hair);
  R(-6, -21, 12, 8, skin); R(-7, -20, 2, 5, hair); R(5, -20, 4, 4, hair);
  R(1, -18, 2, 3, INK); R(-4, -18, 2, 3, INK); R(-6, -15, 3, 2, '#ff96aa'); R(3, -15, 3, 2, '#ff96aa');
  R(-5, -12, 10, 7, coat); R(-6, -13, 12, 2, scarf); R(-8, -13, 3, 7, scarf);
  R(-4, -5, 3, 5 - bob, INK); R(1, -5, 3, 4 + bob, INK);
  const wy = o.wave ? -26 : -16; R(5, -9, 2, 2, skin); R(6, wy, 1, 8, '#966440'); R(5, wy - 3, 3, 3, GOLD); R(6, wy - 4, 1, 1, '#fff');
  if (o.flash) { g.globalAlpha = .6; ellipseRows(g, x + (d > 0 ? 8 : -8), y + wy - 2, 6, 6, '#fff7c0'); g.globalAlpha = 1; }
}
export function drawCoin(g, x, y, t = 0) { const w = Math.abs(Math.cos(t * 4 + x)) * 3 + 1; rect(g, x - w, y - 4, w * 2, 8, '#ffd23f'); rect(g, x - w, y - 4, w * 2, 1, '#fff2a0'); rect(g, x - w, y + 3, w * 2, 1, DG); }
export function drawBrick(g, x, y, kind = 'brick', used = false, bump = 0) {
  y -= bump; const w = 14;
  if (kind === 'q') { rect(g, x, y, w, w, used ? '#3c2814' : DG); rect(g, x + 1, y + 1, w - 2, w - 2, used ? '#785432' : GOLD); if (!used) drawText(g, '?', x + 4, y + 3, INK); return; }
  rect(g, x, y, w, w, '#6e321e'); rect(g, x + 1, y + 1, w - 2, w - 2, used ? '#8c6040' : '#c8643c');
  rect(g, x, y + 6, w, 1, '#6e321e'); rect(g, x + 6, y, 1, 6, '#6e321e'); rect(g, x + 3, y + 7, 1, 7, '#6e321e'); rect(g, x + 10, y + 7, 1, 7, '#6e321e');
}
export function drawFlag(g, x, y, done) { rect(g, x, y - 34, 2, 34, '#fff'); rect(g, x + 2, y - 34, 12, 8, done ? '#3fd16a' : '#8c8cb4'); rect(g, x + 2, y - 28, 7, 3, done ? '#3fd16a' : '#8c8cb4'); rect(g, x - 1, y - 36, 4, 3, GOLD); }
export function drawPine(g, x, y, h = 16) { rect(g, x - 1, y - 3, 2, 3, '#503728'); for (let i = 0; i < 3; i++) { const w = 9 - i * 2, yy = y - 3 - i * (h / 3.4); rect(g, x - w / 2, yy - h / 3.4, w, h / 3.4 + 1, '#165040'); } rect(g, x - 1, y - 3 - 2 * (h / 3.4) - h / 3.4, 2, 2, '#fff'); }

// ---------- input ----------
export function attachInput(keys, poke, canType) {
  const norm = (e) => (e.key === ' ' ? ' ' : e.key.toLowerCase());
  addEventListener('keydown', (e) => { if (canType && !canType()) return; poke(); const k = norm(e); if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault(); keys[k] = true; });
  addEventListener('keyup', (e) => { keys[norm(e)] = false; });
  addEventListener('pointerdown', poke);
  document.querySelectorAll('#pad button').forEach((b) => {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); poke(); keys[k] = true; b.setPointerCapture?.(e.pointerId); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, () => { keys[k] = false; }));
  });
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
}
