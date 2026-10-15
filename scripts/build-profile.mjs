import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./vendor/iso-kit.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "assets");
mkdirSync(out, { recursive: true });
const c = { navy: "#101b2a", ink: "#f4f0e8", muted: "#bac6d5", orange: "#ff945a", line: "#354459", blue: "#2455cb", cream: "#f2eee5", dark: "#182337" };
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const text = (x, y, s, size = 24, fill = c.ink, extra = "") => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const mono = 'font-family="ui-monospace,Consolas,monospace" letter-spacing="2"';
const bold = 'font-weight="750" letter-spacing="-2"';
function save(name, w, h, label, body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(label)}</title><g font-family="Arial,Helvetica,sans-serif">${body}</g></svg>\n`;
  if (/NaN|undefined|<script\b|<foreignObject\b/.test(svg)) throw new Error(`Invalid SVG: ${name}`);
  writeFileSync(join(out, name), svg, "utf8");
}

function toolkitArt() {
  const p = k.fitProjection(k.boxCorners({ x: -70, y: -50, w: 140, d: 100, r: 5 }, 0, 125), 380, 280, { pad: 8, azimuth: 45, elevation: 28 });
  const pieces = [];
  function box(x, y, w, d, z, h, lit = false) {
    pieces.push(k.solidSvg(k.slabOf({x, y, w, d, r: 2}, z, h, p, 5, 0.6), { tone: "hi", lit }));
  }
  box(-70,-50,140,100,0,12);
  for (const [index, [z, x, y]] of [[20,-60,-40],[57,-48,-30],[94,-36,-20]].entries()) {
    pieces.push(`<g class="tool-module" style="--lift:${-(index+1)*8}px">`);
    box(x,y,110,70,z,22);
    box(x+8,y+8,35,54,z+22,2,true);
    for (let i=0;i<3;i++) box(x+52,y+13+i*14,44,5,z+22,1);
    pieces.push("</g>");
  }
  const css = `${k.ISO_CSS}.iso{--anatomy-paper:#101b2a;--anatomy-face:#243449;--anatomy-top:#344b66;--anatomy-shade-0:#111c2b;--anatomy-shade-1:#1a2a40;--anatomy-shade-2:#2b3c55;--anatomy-shade-3:#405876;--anatomy-hi:#afc6df;--anatomy-mid:#8ba6c6;--anatomy-lo:#5d799a;--anatomy-faint:#405876;--anatomy-lit:#ff945a;--anatomy-lit-top:#ffb07a;--anatomy-lit-shade:#bb5e30;--anatomy-weight:1px}`;
  return `<style>${css}</style><g class="iso">${pieces.join("")}</g>`;
}
function talksArt() {
  return `<g transform="translate(16 12)">
    <path d="M20 195L209 260L347 181L156 116Z" fill="#d2cbbd"/>
    <path d="M20 195V219L209 285V260Z" fill="#c3b9a7"/>
    <path d="M209 260V285L347 205V181Z" fill="#a7a090"/>
    <path d="M58 56L255 112V226L58 170Z" fill="#182337"/>
    <path d="M58 56L73 48L269 104L255 112Z" fill="#455169"/>
    <path d="M255 112L269 104V218L255 226Z" fill="#101b2a"/>
    <g transform="matrix(1 .285 0 1 76 89)">
      <g class="presentation">${text(0,0,"GOOD ENOUGH",23,c.ink,'font-weight="700"')}
      ${text(0,30,"FOR WHAT?",27,c.orange,'font-weight="700"')}
      <path class="screen-lines" d="M0 58h152M0 71h98" stroke="#7f91a8" stroke-width="3"/></g>
    </g>
    <path d="M270 185v-62q0-18 12-15t12 24v15" stroke="#182337" fill="none" stroke-width="5"/>
    <path d="M265 189l18 5" stroke="#182337" stroke-width="7"/>
    <path d="M86 217l100 34M106 203l100 34M126 189l100 34" stroke="#f2eee5" stroke-width="6"/>
  </g>`;
}
function newsArt() {
  let pages = "";
  for (const [index, [x,y]] of [[55,70],[73,48],[91,26]].entries()) {
    pages += `<g transform="translate(${x} ${y})"><g class="news-sheet" style="--delay:${index*.35}s"><path d="M0 0L190 42V220L0 178Z" fill="#102d78"/><path d="M0 -7L190 35V211L0 169Z" fill="#f4f0e8"/><path d="M18 16L167 49V88L18 55Z" fill="#ff945a"/><path d="M18 79l149 33M18 94l92 20M18 115l149 33M18 130l149 33" stroke="#8997af" stroke-width="4"/><path d="M18 151l72 16" stroke="#2455cb" stroke-width="4"/></g></g>`;
  }
  return `${pages}<g transform="translate(295 40)"><circle r="38" fill="#101b2a"/><circle cx="-12" cy="12" r="4" fill="#ff945a"/><path class="broadcast" d="M-14 -3a17 17 0 0 1 17 17M-14 -16a30 30 0 0 1 30 30" stroke="#ff945a" stroke-width="5" fill="none"/></g>`;
}
const projects = [
  { file: "agents-toolkit", n:"01", title: "Agents Toolkit", kicker:"TOOLS FOR THE AGENTIC ERA", lines:["Reusable skills, hooks and workflows.","Built for Claude and Codex."], tags:"SKILLS / CONTEXT / VERIFICATION", bg:c.navy, fg:c.ink, muted:c.muted, accent:c.orange, art:toolkitArt(), cta:"EXPLORE THE TOOLKIT" },
  { file: "talks", n:"02", title: "Talks & workshops", kicker:"IDEAS WORTH SHARING", lines:["Applied AI. Better evaluation.","Learning by building in public."], tags:"THE FIFTH ELEPHANT / APPLIED AI", bg:c.cream, fg:c.dark, muted:"#485568", accent:"#a83c13", art:talksArt(), cta:"SLIDES, RECORDINGS & EXAMPLES" },
  { file: "dailynews", n:"03", title: "Dailynews", kicker:"SIGNAL FROM THE NOISE", lines:["RSS to an AI-assisted news digest.","Collected, ranked and delivered."], tags:"RSS / LLMs / GITHUB ACTIONS", bg:c.blue, fg:c.ink, muted:"#e0e8ff", accent:"#ffe1b5", art:newsArt(), cta:"READ THE DIGEST" },
];
for (const p of projects) {
  for (const small of [false, true]) {
    const w = small ? 600 : 1200;
    const h = small ? 650 : 370;
    const x = small ? 32 : 48;
    const titleY = small ? 112 : 142;
    const art = small ? `<g transform="translate(115 310)">${p.art}</g>` : `<g transform="translate(795 31) scale(1.1)">${p.art}</g>`;
    const b = `<style>
      .tool-module{animation:unpack 4.8s ease-in-out both}
      .presentation{animation:present 3.6s ease-out both}
      .screen-lines,.broadcast{stroke-dasharray:200;animation:draw-screen 4.2s ease-out both}
      .news-sheet{animation:publish 3.6s ease-out both;animation-delay:var(--delay)}
      @keyframes unpack{0%,100%{transform:translateY(0px)}30%,60%{transform:translateY(var(--lift))}}
      @keyframes present{0%{opacity:.25;transform:translateY(7px)}40%,100%{opacity:1;transform:translateY(0px)}}
      @keyframes draw-screen{0%{stroke-dashoffset:200}65%,100%{stroke-dashoffset:0}}
      @keyframes publish{0%{transform:translate(10px,-16px);opacity:.3}70%,100%{transform:translate(0px,0px);opacity:1}}
      @media(prefers-reduced-motion:reduce){.tool-module,.presentation,.screen-lines,.broadcast,.news-sheet{animation:none}}
      </style><rect width="${w}" height="${h}" rx="12" fill="${p.bg}"/>
      ${text(x,small ? 49 : 66,`${p.n} / ${p.kicker}`,small ? 19 : 19,p.muted,mono)}
      ${text(x,titleY,p.title,small ? 50 : 62,p.fg,bold)}
      ${text(x,titleY+50,p.lines[0],small ? 30 : 28,p.fg)}
      ${text(x,titleY+87,p.lines[1],small ? 30 : 28,p.fg)}
      ${text(x,small ? 259 : 284,p.tags,small ? 20 : 19,p.muted,mono)}
      <path d="M${x} ${small ? 294 : 311}H${w-x}" stroke="${p.muted}" stroke-opacity=".25"/>
      ${art}
      ${text(x,small ? 617 : 342,p.cta,small ? 22 : 17,p.accent,mono)}
      <path d="M${w-70} ${small ? 611 : 335}h24m-10-10 10 10-10 10" fill="none" stroke="${p.accent}" stroke-width="3"/>`;
    save(`${p.file}${small ? "-mobile" : ""}.svg`,w,h,`${p.title}. ${p.lines.join(" ")} ${p.cta}.`,b);
  }
}
