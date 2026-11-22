export type Point = [number, number];

export type MarginaliaMarkRun = {
  text: string;
  mark: "" | "under" | "oval";
};

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Deterministic PRNG so SVG pen strokes are identical across SSR and client hydration. */
export function seededRandom(seed: number): () => number {
  let s = (Math.floor(seed * 9973) ^ 0x9e3779b9) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function r1(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

/** Catmull-Rom spline converted into smooth cubic Bézier segments. */
export function smoothPath(pts: Point[]): string {
  if (pts.length < 2) return "";
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

/** Hand-drawn slightly open oval loop around a w x h container. */
export function ovalPath(w: number, h: number, seed: number): string {
  const rand = seededRandom(seed);
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.max(4, w / 2 - 3);
  const ry = Math.max(4, h / 2 - 3);
  const start = -2.5 + rand() * 0.6;
  const sweep = Math.PI * 2 * (1.09 + rand() * 0.08);
  const steps = 28;
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + sweep * t;
    const k = 1.04 - 0.09 * t + (rand() - 0.5) * 0.03;
    pts.push([
      cx + Math.cos(a) * rx * k,
      cy + Math.sin(a) * ry * k + (t - 0.5) * 2,
    ]);
  }
  return smoothPath(pts);
}

/** Quick editorial pen underline with a subtle return stroke. */
export function underlinePath(w: number, h: number, seed: number): string {
  const rand = seededRandom(seed);
  const y = h - 4;
  const pts: Point[] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    pts.push([
      2 + ((w - 4) * i) / steps,
      y + Math.sin(i * 1.3 + rand() * 2) * 1.3 - i * 0.22,
    ]);
  }
  const back = 0.35 + rand() * 0.22;
  const end = pts[pts.length - 1];
  return (
    smoothPath(pts) +
    `Q${r1(end[0] + 3)} ${r1(end[1] + 1.5)} ${r1(end[0] - 6)} ${r1(y + 2.5)}` +
    `L${r1(w * (1 - back))} ${r1(y + 3.1 + rand())}`
  );
}

/** Loose editorial sketch rectangle whose corners slightly overshoot. */
export function sketchBoxPath(w: number, h: number, seed: number): string {
  const rand = seededRandom(seed);
  const j = () => (rand() - 0.5) * 3.5;
  const o = 6;
  return (
    `M${r1(-o + j())} ${r1(2 + j())}L${r1(w + o + j())} ${r1(j())}` +
    `M${r1(w - 2 + j())} ${r1(-o + j())}L${r1(w + j())} ${r1(h + o + j())}` +
    `M${r1(w + o + j())} ${r1(h - 2 + j())}L${r1(-o + j())} ${r1(h + j())}` +
    `M${r1(2 + j())} ${r1(h + o + j())}L${r1(j())} ${r1(-o + j())}`
  );
}

/** Curved hand-drawn arrow from point a to point b. */
export function arrowPaths(
  a: Point,
  b: Point,
  bend = 0.22,
  head = 9,
): { shaft: string; head: string } {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const c: Point = [
    (a[0] + b[0]) / 2 - (dy / len) * len * bend,
    (a[1] + b[1]) / 2 + (dx / len) * len * bend,
  ];
  const shaft = `M${r1(a[0])} ${r1(a[1])}Q${r1(c[0])} ${r1(c[1])} ${r1(b[0])} ${r1(b[1])}`;
  const ang = Math.atan2(b[1] - c[1], b[0] - c[0]);
  const spread = 0.5;
  const h1: Point = [b[0] - Math.cos(ang - spread) * head, b[1] - Math.sin(ang - spread) * head];
  const h2: Point = [b[0] - Math.cos(ang + spread) * head, b[1] - Math.sin(ang + spread) * head];
  return {
    shaft,
    head: `M${r1(h1[0])} ${r1(h1[1])}L${r1(b[0])} ${r1(b[1])}L${r1(h2[0])} ${r1(h2[1])}`,
  };
}

/** Clean editorial swoosh underline beneath large serif headings. */
export function headingSwooshPath(w: number, seed: number): string {
  const rand = seededRandom(seed);
  const steps = 12;
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([
      4 + (w - 8) * t,
      16 - Math.sin(t * Math.PI) * (5.5 + rand() * 1.2) - t * 3.5,
    ]);
  }
  return smoothPath(pts);
}

/** Slightly organic horizontal pen stroke (used for shelf line and language bars). */
export function handLinePath(x1: number, x2: number, y: number, seed: number): string {
  const rand = seededRandom(seed);
  const steps = Math.max(2, Math.round((x2 - x1) / 22));
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    pts.push([x1 + ((x2 - x1) * i) / steps, y + (rand() - 0.5) * 2.6]);
  }
  return smoothPath(pts);
}

/** Four-point editorial sparkle used on the cover orbit accent. */
export function sparklePath(cx: number, cy: number, r: number): string {
  const k = r * 0.22;
  return (
    `M${r1(cx)} ${r1(cy - r)}` +
    `C${r1(cx + k * 0.4)} ${r1(cy - k)} ${r1(cx + k)} ${r1(cy - k * 0.4)} ${r1(cx + r)} ${r1(cy)}` +
    `C${r1(cx + k)} ${r1(cy + k * 0.4)} ${r1(cx + k * 0.4)} ${r1(cy + k)} ${r1(cx)} ${r1(cy + r)}` +
    `C${r1(cx - k * 0.4)} ${r1(cy + k)} ${r1(cx - k)} ${r1(cy + k * 0.4)} ${r1(cx - r)} ${r1(cy)}` +
    `C${r1(cx - k)} ${r1(cy - k * 0.4)} ${r1(cx - k * 0.4)} ${r1(cy - k)} ${r1(cx)} ${r1(cy - r)}Z`
  );
}

/** Hand-drawn heart shape that the orbiting star morphs into when hovering the author signature. */
export function heartPath(cx: number, cy: number, r: number): string {
  const s = r / 10;
  const p = (x: number, y: number) => `${r1(cx + x * s)} ${r1(cy + y * s)}`;
  return (
    `M${p(0, -3.5)}` +
    `C${p(2, -9)} ${p(10, -8)} ${p(10, -2)}` +
    `C${p(10, 3)} ${p(4, 6.5)} ${p(0, 10)}` +
    `C${p(-4, 6.5)} ${p(-10, 3)} ${p(-10, -2)}` +
    `C${p(-10, -8)} ${p(-2, -9)} ${p(0, -3.5)}Z`
  );
}

/** 3D tilted elliptical orbit position at phase t (0..1); front = in front of the letter "o". */
export function orbitPoint(
  t: number,
  rx: number,
  ry: number,
  tilt: number,
): { x: number; y: number; front: boolean } {
  const a = t * Math.PI * 2;
  const x0 = Math.cos(a) * rx;
  const y0 = Math.sin(a) * ry;
  const c = Math.cos(tilt);
  const s = Math.sin(tilt);
  return {
    x: x0 * c - y0 * s,
    y: x0 * s + y0 * c,
    front: Math.sin(a) > 0,
  };
}

/** Parses inline "*sublinhado*" and "[circulado]" marginalia markup. */
export function parseMarginaliaMarks(input: string): MarginaliaMarkRun[] {
  const out: MarginaliaMarkRun[] = [];
  const re = /\*([^*]+)\*|\[([^\]]+)\]/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(input))) {
    if (match.index > last) {
      out.push({ text: input.slice(last, match.index), mark: "" });
    }
    out.push(
      match[1] !== undefined
        ? { text: match[1], mark: "under" }
        : { text: match[2], mark: "oval" },
    );
    last = match.index + match[0].length;
  }
  if (last < input.length) {
    out.push({ text: input.slice(last), mark: "" });
  }
  return out;
}

export function isLightHex(hex: string): boolean {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  const v = parseInt(h, 16);
  const lum = (0.299 * ((v >> 16) & 255) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255;
  return lum > 0.62;
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatPtNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/* ---- Pure TypeScript QR Code generator (Byte mode, Level M, Versions 1-6, <= 106 bytes) ---- */

const QR_EXP: number[] = [];
const QR_LOG: number[] = [];
(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    QR_EXP[i] = x;
    QR_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) QR_EXP[i] = QR_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  return a && b ? QR_EXP[QR_LOG[a] + QR_LOG[b]] : 0;
}

function rsRemainder(data: number[], n: number): number[] {
  let gen = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array<number>(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j];
      next[j + 1] ^= gfMul(gen[j], QR_EXP[i]);
    }
    gen = next;
  }
  const res = new Array<number>(n).fill(0);
  for (const d of data) {
    const factor = d ^ res[0];
    res.shift();
    res.push(0);
    for (let j = 0; j < n; j++) res[j] ^= gfMul(gen[j + 1], factor);
  }
  return res;
}

function encodeUtf8(s: string): number[] {
  const out: number[] = [];
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}

const QR_M = [
  [0, 0, 0],
  [16, 10, 1],
  [28, 16, 1],
  [44, 26, 1],
  [32, 18, 2],
  [43, 24, 2],
  [27, 16, 4],
] as const;

function qrMask(m: number, x: number, y: number): boolean {
  switch (m) {
    case 0: return (x + y) % 2 === 0;
    case 1: return y % 2 === 0;
    case 2: return x % 3 === 0;
    case 3: return (x + y) % 3 === 0;
    case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

function qrPenalty(g: boolean[][]): number {
  const n = g.length;
  let penalty = 0;
  let dark = 0;
  for (let a = 0; a < n; a++) {
    for (const horiz of [true, false]) {
      let run = 1;
      for (let b = 1; b <= n; b++) {
        const same = b < n && (horiz ? g[a][b] === g[a][b - 1] : g[b][a] === g[b - 1][a]);
        if (same) run++;
        else {
          if (run >= 5) penalty += run - 2;
          run = 1;
        }
      }
      for (let b = 0; b + 10 < n; b++) {
        let s = "";
        for (let k = 0; k < 11; k++) s += (horiz ? g[a][b + k] : g[b + k][a]) ? "1" : "0";
        if (s === "10111010000" || s === "00001011101") penalty += 40;
      }
    }
  }
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (g[y][x]) dark++;
      if (
        x < n - 1 &&
        y < n - 1 &&
        g[y][x] === g[y][x + 1] &&
        g[y][x] === g[y + 1][x] &&
        g[y][x] === g[y + 1][x + 1]
      ) {
        penalty += 3;
      }
    }
  }
  penalty += Math.floor(Math.abs((dark * 20) / (n * n) - 10)) * 10;
  return penalty;
}

export function qrMatrix(text: string): boolean[][] | null {
  const bytes = encodeUtf8(text);
  let ver = 1;
  while (ver <= 6 && 12 + bytes.length * 8 > QR_M[ver][0] * QR_M[ver][2] * 8) ver++;
  if (ver > 6) return null;
  const [per, ecn, blocks] = QR_M[ver];
  const cap = per * blocks;
  const bits: number[] = [];
  const put = (v: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((v >>> i) & 1);
  };
  put(4, 4);
  put(bytes.length, 8);
  for (const b of bytes) put(b, 8);
  put(0, Math.min(4, cap * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  }
  for (let pad = 0xec; data.length < cap; pad ^= 0xec ^ 0x11) data.push(pad);

  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  for (let b = 0; b < blocks; b++) {
    const chunk = data.slice(b * per, (b + 1) * per);
    dataBlocks.push(chunk);
    ecBlocks.push(rsRemainder(chunk, ecn));
  }
  const stream: number[] = [];
  for (let i = 0; i < per; i++) for (const blk of dataBlocks) stream.push(blk[i]);
  for (let i = 0; i < ecn; i++) for (const blk of ecBlocks) stream.push(blk[i]);

  const size = 17 + ver * 4;
  const mods: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fn: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, v: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    mods[y][x] = v;
    fn[y][x] = true;
  };
  for (const [fx, fy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        set(fx + dx, fy + dy, d !== 2 && d !== 4);
      }
    }
  }
  for (let i = 8; i < size - 8; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  if (ver > 1) {
    const c = size - 7;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        set(c + dx, c + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }
  const drawFormat = (mask: number) => {
    let rem = mask;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const f = ((mask << 10) | rem) ^ 0x5412;
    const bit = (i: number) => ((f >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6));
    set(8, 8, bit(7));
    set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  drawFormat(0);

  let idx = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        if (!fn[y][x] && idx < stream.length * 8) {
          mods[y][x] = ((stream[idx >>> 3] >>> (7 - (idx & 7))) & 1) === 1;
          idx++;
        }
      }
    }
  }

  let best = mods;
  let bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    drawFormat(m);
    const candidate = mods.map((row, y) =>
      row.map((v, x) => (fn[y][x] ? v : v !== qrMask(m, x, y))),
    );
    const score = qrPenalty(candidate);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

export function clampNumber(v: number, min: number, max: number): number {
  return clamp(v, min, max);
}
