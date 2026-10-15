import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./vendor/iso-kit.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const width = 1100;
const height = 380;
const desk = { x: -140, y: -70, w: 280, d: 140, r: 5 };
const projection = k.fitProjection(k.boxCorners(desk, -63, 125), 520, 320, { pad: 15, azimuth: 48, elevation: 30 });
const parts = [];
const at = (point) => k.iso(point, projection);
function box(x, y, w, d, z, h, { tone = "mid", lit = false, r = 1.5 } = {}) {
  const plan = { x, y, w, d, r };
  parts.push(k.solidSvg(k.slabOf(plan, z, h, projection, 5, 0.6), { tone, lit }));
}
function screw(x, y, z) {
  parts.push(k.dotsSvg([at([x, y, z])], { size: 0.7, tone: "mid" }));
}

// Fixed illustration: explicit back-to-front order, no crossing pipes or motion.
parts.push(`<path class="iso-halo" d="${k.haloOf(desk, -66, 10, projection)}"/>`);
for (const [x, y] of k.corners(desk, 12).sort((a, b) => k.depthOf([...a, 0], projection) - k.depthOf([...b, 0], projection))) {
  box(x - 5, y - 5, 10, 10, -63, 62, { tone: "lo" });
  box(x - 7, y - 7, 14, 14, -66, 3, { tone: "lo" });
}
box(-130, 45, 118, 13, -40, 34, { tone: "lo" });
box(-119, 59, 98, 2, -34, 23);
box(-78, 62, 22, 4, -26, 3, { tone: "hi" });
box(desk.x, desk.y, desk.w, desk.d, -6, 12, { tone: "hi", r: 5 });
parts.push(k.lineSvg(k.planOutline(k.insetPlan(desk, 4), 6.2, projection), { tone: "faint" }));
for (const [x, y] of k.corners(desk, 9)) screw(x, y, 6.3);

// A shelf of source cards, with rails holding the cards in place.
box(-116, -41, 53, 49, 6, 3);
for (let index = 0; index < 3; index++) {
  const x = -111 + index * 15;
  box(x, -35, 11, 33, 9, 18 + index * 5, { tone: "hi" });
  parts.push(k.lineSvg(k.planOutline({ x: x + 2, y: -31, w: 7, d: 25, r: 0.6 }, 27 + index * 5, projection), { tone: "lo" }));
}
box(-120, -43, 4, 51, 9, 10);
box(-63, -43, 4, 51, 9, 10);

// Computer and screen on a mounted support, with content on its near face.
box(-22, -33, 49, 28, 6, 4);
box(-5, -24, 12, 9, 10, 24);
box(-35, -27, 73, 9, 34, 65, { tone: "hi", r: 3 });
const screen = [at([-30, -17.8, 40]), at([33, -17.8, 40]), at([33, -17.8, 93]), at([-30, -17.8, 93])];
parts.push(`<path class="screen" d="${k.pathOf(screen, true)}"/>`);
for (let index = 0; index < 5; index++) {
  const z = 83 - index * 8;
  parts.push(`<path class="screen-line" d="${k.segment([-23, -17.6, z], [index % 2 ? 11 : 23, -17.6, z], projection)}"/>`);
}
screw(29, -17.5, 37.5);
box(-34, 8, 76, 29, 6, 2.4, { tone: "hi" });
for (let row = 0; row < 3; row++) for (let col = 0; col < 9; col++) {
  box(-29 + col * 7.5, 12 + row * 6.2, 5.5, 4, 8.4, 1.2, { tone: "lo", r: 0.7 });
}
box(-10, 32, 33, 3, 8.4, 1.2, { tone: "lo", r: 0.7 });

// Verification console: three slots and an accent lever, not numeric results.
box(75, -26, 45, 43, 6, 27, { tone: "hi" });
box(78, -23, 39, 37, 33, 1.5);
for (let index = 0; index < 3; index++) {
  box(83, -17 + index * 10, 23, 4, 34.5, 0.6, { tone: "lo", r: 0.7 });
}
box(110, -17, 3, 24, 34.5, 0.6, { lit: true, r: 0.6 });
box(109, -13, 5, 8, 35.1, 2, { lit: true, r: 0.7 });
for (const [x, y] of k.corners({ x: 78, y: -23, w: 39, d: 37 }, 3)) screw(x, y, 34.6);

// A notebook on the front of the desk, with a bound spine and printed rules.
box(55, 37, 41, 27, 6, 2.5, { tone: "hi" });
box(55, 37, 4, 27, 8.5, 0.6, { tone: "lo" });
for (let row = 0; row < 4; row++) {
  parts.push(k.lineSvg(k.lineOnTop([63, 42 + row * 4], [89, 42 + row * 4], 8.6, projection), { tone: "lo", free: true }));
}

function build(theme) {
  const dark = theme === "dark";
  const palette = dark
    ? { paper: "#101c20", face: "#172a2f", top: "#263e44", s0: "#142429", s1: "#193038", s2: "#203942", s3: "#2a444d", hi: "#b3ccd0", mid: "#829fa6", lo: "#5c7b83", faint: "#344f57", accent: "#78d6c0", ink: "#edf5f2", muted: "#aec4c6", bg: "#0d171b", screen: "#0d2526" }
    : { paper: "#f0f3ec", face: "#fcfdf7", top: "#f9fcf4", s0: "#bfcdc5", s1: "#d0dcd2", s2: "#dfe7dc", s3: "#e8eee3", hi: "#284b45", mid: "#5d7d71", lo: "#759286", faint: "#c3d2c6", accent: "#087b67", ink: "#183c34", muted: "#496a60", bg: "#f3f6ee", screen: "#163e37" };
  const css = `${k.ISO_CSS}
  .iso[data-theme="${theme}"]{--anatomy-paper:${palette.paper};--anatomy-face:${palette.face};--anatomy-top:${palette.top};--anatomy-shade-0:${palette.s0};--anatomy-shade-1:${palette.s1};--anatomy-shade-2:${palette.s2};--anatomy-shade-3:${palette.s3};--anatomy-hi:${palette.hi};--anatomy-mid:${palette.mid};--anatomy-lo:${palette.lo};--anatomy-faint:${palette.faint};--anatomy-lit:${palette.accent};--anatomy-lit-top:${palette.accent};--anatomy-lit-shade:${palette.accent};--anatomy-dot:${palette.hi};--anatomy-weight:1px;--anatomy-halo-opacity:.15}
  .screen{fill:${palette.screen};stroke:${palette.mid};stroke-width:.8}.screen-line{fill:none;stroke:${palette.accent};stroke-width:1.8;stroke-linecap:round}
  text{fill:${palette.ink};font-family:Georgia,"Times New Roman",serif}.small{font-family:ui-monospace,Menlo,Consolas,monospace;fill:${palette.muted};letter-spacing:2px}.accent{fill:${palette.accent}}
  `;
  const body = `<style>${css}</style>
  <rect width="1100" height="380" rx="12" fill="${palette.bg}"/>
  <path d="M30 30h24M30 30v24M1070 350h-24M1070 350v-24" fill="none" stroke="${palette.mid}" stroke-width="1"/>
  <text class="small" x="62" y="76" font-size="14">THE AI WORKSHOP</text>
  <text x="60" y="151" font-size="50">From messy data</text>
  <text x="60" y="213" font-size="50">to useful tools<tspan class="accent">.</tspan></text>
  <text class="small" x="63" y="271" font-size="12" letter-spacing="1">BUILD / CHECK / SHARE</text>
  <g transform="translate(556 25)">${parts.join("")}</g>
  <text class="small" x="63" y="331" font-size="11" letter-spacing=".8">LLM APPLICATIONS / DATA / AGENT TOOLING</text>`;
  return k.figureSvg({ width, height, label: "The AI Workshop: from messy data to useful tools. An isometric desk with source cards, a computer, a verification console and a notebook.", body }).replace('class="iso-svg"', `class="iso-svg iso" data-theme="${theme}"`);
}

mkdirSync(join(root, "assets"), { recursive: true });
for (const theme of ["light", "dark"]) {
  const svg = build(theme);
  if (svg.includes("NaN") || svg.includes("undefined") || /<script\b/.test(svg)) throw new Error("Invalid standalone SVG");
  writeFileSync(join(root, "assets", `ai-workshop-${theme}.svg`), svg, "utf8");
}
