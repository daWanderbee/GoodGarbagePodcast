// ponytail: one-off generator. Output is committed; re-run only to reshape the plants.
const fs = require('fs');
const OUT = 'public/images/hero/parallax/';
let s = 20260916;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
const r = (a, b) => a + rnd() * (b - a);
const f = (n) => n.toFixed(1);

// A leaf blade: swells from the base, tapers to a point, curls under its own weight.
function blade(x, y, angle, len, width, curl) {
  const a = (angle * Math.PI) / 180;
  const tipX = x + Math.cos(a) * len * 0.92;
  const tipY = y - Math.sin(a) * len + curl;
  const mx = x + Math.cos(a) * len * 0.55;
  const my = y - Math.sin(a) * len * 0.62 + curl * 0.1;
  const nx = -Math.sin(a) * width, ny = -Math.cos(a) * width;
  return `M${f(x)} ${f(y)} Q${f(mx + nx)} ${f(my + ny)} ${f(tipX)} ${f(tipY)} Q${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)} Z`;
}

// ---- sugarcane: stalks with node bands, a crown of blades fanning off the top ----
function cane(lean) {
  const W = 420, H = 640, out = [];
  const stalks = [
    { x: W * 0.52, h: H * 0.72, w: 15 },
    { x: W * 0.40, h: H * 0.58, w: 13 },
    { x: W * 0.63, h: H * 0.47, w: 12 },
  ];
  for (const st of stalks) {
    const topX = st.x + lean * st.h * 0.16, topY = H - st.h;
    const cx = st.x + lean * st.h * 0.05;
    out.push(`<path d="M${f(st.x - st.w)} ${H} Q${f(cx - st.w)} ${f(H - st.h * 0.5)} ${f(topX - st.w * 0.8)} ${f(topY)} L${f(topX + st.w * 0.8)} ${f(topY)} Q${f(cx + st.w)} ${f(H - st.h * 0.5)} ${f(st.x + st.w)} ${H} Z" fill="#9cbf52"/>`);
    out.push(`<path d="M${f(st.x - st.w)} ${H} Q${f(cx - st.w)} ${f(H - st.h * 0.5)} ${f(topX - st.w * 0.8)} ${f(topY)} L${f(topX - st.w * 0.2)} ${f(topY)} Q${f(cx - st.w * 0.3)} ${f(H - st.h * 0.5)} ${f(st.x - st.w * 0.3)} ${H} Z" fill="#b6d167"/>`);
    // node bands up the stalk
    const nodes = Math.floor(st.h / 62);
    for (let i = 1; i <= nodes; i++) {
      const t = i / (nodes + 0.6);
      const nx = st.x + (topX - st.x) * t * t, ny = H - st.h * t, nw = st.w * (1 - t * 0.18);
      out.push(`<rect x="${f(nx - nw)}" y="${f(ny)}" width="${f(nw * 2)}" height="7" rx="3" fill="#7fa243"/>`);
    }
    // crown
    const n = 11;
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const spread = 20 + (i / n) * 74;
      const ang = 90 - side * spread * r(0.85, 1.15);
      const len = r(0.5, 0.86) * st.h;
      const curl = r(0.45, 0.95) * len * (0.35 + spread / 110);
      const dark = i % 3 === 0;
      out.push(`<path d="${blade(topX + side * 3, topY + r(0, 16), ang, len, r(7, 12), curl)}" fill="${dark ? '#3f8b39' : '#54a840'}"/>`);
    }
    out.push(`<path d="${blade(topX, topY - 4, 90 + lean * 6, st.h * 0.34, 5, 10)}" fill="#6fbd4c"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${out.join('')}</svg>`;
}


// ---- hemp: palmate leaves, seven leaflets each, fanned off a short stem ----
function palmate(x, y, angle, scale, dark) {
  const out = [];
  const leaflets = 7;
  for (let i = 0; i < leaflets; i++) {
    const off = i - (leaflets - 1) / 2;            // -3..3, centre leaflet is the longest
    const a = angle - off * 21;
    const len = (1 - Math.abs(off) * 0.17) * 96 * scale;
    const w = (1 - Math.abs(off) * 0.11) * 7.5 * scale;
    out.push(`<path d="${blade(x, y, a, len, w, len * 0.06 * Math.sign(off))}" fill="${dark ? '#2a6f34' : '#3d8f45'}"/>`);
  }
  // midrib catches the light
  out.push(`<path d="${blade(x, y, angle, 96 * scale * 0.9, 1.6 * scale, 0)}" fill="#7cc95a" opacity="0.6"/>`);
  return out.join('');
}

function hemp(flip) {
  // box is cut to what the plant actually reaches, so scaling by height scales the plant
  // rather than a margin: leaves run about 185 from the base, sideways as well as up
  const W = 400, H = 215, out = [];
  const base = { x: W * (flip ? 0.55 : 0.45), y: H - 4 };
  const leaves = [
    { a: 90, s: 1.25, d: false }, { a: 90 - 42 * (flip ? -1 : 1), s: 1.05, d: true },
    { a: 90 + 46 * (flip ? -1 : 1), s: 1.0, d: true }, { a: 90 - 74 * (flip ? -1 : 1), s: 0.82, d: false },
    { a: 90 + 78 * (flip ? -1 : 1), s: 0.78, d: true }, { a: 90 - 18 * (flip ? -1 : 1), s: 0.9, d: false },
  ];
  // stems first, so every leaf sits on one
  for (const l of leaves) {
    const a = (l.a * Math.PI) / 180, reach = 52 * l.s;
    out.push(`<path d="M${f(base.x)} ${f(base.y)} L${f(base.x + Math.cos(a) * reach)} ${f(base.y - Math.sin(a) * reach)}" stroke="#4d7a34" stroke-width="${f(4 * l.s)}" stroke-linecap="round" fill="none"/>`);
  }
  for (const l of leaves) {
    const a = (l.a * Math.PI) / 180, reach = 52 * l.s;
    out.push(palmate(base.x + Math.cos(a) * reach, base.y - Math.sin(a) * reach, l.a, l.s, l.d));
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${out.join('')}</svg>`;
}

// ---- ground band: reeds in three depth planes, seamless left/right ----
function reeds() {
  const W = 1200, H = 300, out = [];
  const planes = [
    { n: 260, lo: 70, hi: 150, w: [2, 4.5], fill: ['#1f5c33', '#27713a'], op: 0.9 },
    { n: 150, lo: 110, hi: 210, w: [3, 6], fill: ['#2d7a3c', '#369047'], op: 1 },
    { n: 70, lo: 160, hi: 285, w: [4.5, 9], fill: ['#49a84b', '#5cbb52'], op: 1 },
  ];
  for (const p of planes) {
    for (let i = 0; i < p.n; i++) {
      const x = rnd() * W;
      const len = r(p.lo, p.hi);
      const ang = 90 - r(-26, 26);
      const path = blade(x, H, ang, len, r(p.w[0], p.w[1]), r(10, 44));
      const fill = p.fill[i % p.fill.length];
      out.push(`<path d="${path}" fill="${fill}" opacity="${p.op}"/>`);
      // wrap the tile: anything crossing an edge is drawn again on the far side
      if (x < 120) out.push(`<path d="${blade(x + W, H, ang, len, r(p.w[0], p.w[1]), r(6, 30))}" fill="${fill}" opacity="${p.op}"/>`);
      if (x > W - 120) out.push(`<path d="${blade(x - W, H, ang, len, r(p.w[0], p.w[1]), r(6, 30))}" fill="${fill}" opacity="${p.op}"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${out.join('')}</svg>`;
}

// ---- flock: two wing strokes per bird, nothing more at this size ----
function flock() {
  const birds = [
    [30, 118, 1.0], [96, 74, 0.85], [168, 36, 1.15], [150, 132, 0.7],
    [236, 92, 1.0], [262, 24, 0.8], [330, 58, 0.95], [372, 14, 0.7],
  ];
  const tint = ['#cfe3d2', '#a9c7cf', '#e3d6bd'];
  const out = birds.map(([x, y, k], i) => {
    const w = 15 * k, h = 9 * k;
    return `<path d="M${f(x - w)} ${f(y)} q${f(w * 0.5)} ${f(-h)} ${f(w)} ${f(-h * 0.15)} q${f(w * 0.5)} ${f(-h * 0.85)} ${f(w)} ${f(h * 0.15)}" fill="none" stroke="${tint[i % 3]}" stroke-width="${f(2.1 * k)}" stroke-linecap="round" stroke-linejoin="round" opacity="${(0.55 + k * 0.4).toFixed(2)}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 170" width="420" height="170">${out.join('')}</svg>`;
}

fs.writeFileSync(OUT + 'cane_a.svg', cane(0.18));
fs.writeFileSync(OUT + 'cane_b.svg', cane(-0.18));
// two more clumps for the middle distance — same generator, different lean, and the RNG
// has moved on, so they are not the corner pair repeated
fs.writeFileSync(OUT + 'cane_c.svg', cane(0.1));
fs.writeFileSync(OUT + 'cane_d.svg', cane(-0.1));
fs.writeFileSync(OUT + 'hemp_a.svg', hemp(false));
fs.writeFileSync(OUT + 'hemp_b.svg', hemp(true));
fs.writeFileSync(OUT + 'reeds.svg', reeds());
fs.writeFileSync(OUT + 'flock.svg', flock());
console.log('written');
