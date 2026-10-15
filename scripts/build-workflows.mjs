import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const workflows = [
  { file: "agent-workflow", title: "Context becomes action.", label: "AGENTS TOOLKIT / A REPRESENTATIVE WORKFLOW", accent: "#ff945a", steps: [["CONTEXT", "Recover decisions"],["PLAN", "Choose next steps"],["BUILD", "Apply the change"],["VERIFY", "Inspect the result"]] },
  { file: "talk-workflow", title: "Questions become shared ideas.", label: "TALKS / AN ILLUSTRATIVE SESSION", accent: "#b8caff", steps: [["QUESTION", "Frame the problem"],["DEMO", "Make it concrete"],["DISCUSS", "Explore tradeoffs"],["SHARE", "Slides and examples"]] },
  { file: "news-workflow", title: "Sources become a daily digest.", label: "DAILYNEWS / THE PUBLISHING FLOW", accent: "#ffcf8a", steps: [["COLLECT", "Gather RSS stories"],["RANK", "Find relevant items"],["SUMMARIZE", "Build the digest"],["DELIVER", "Email and archive"]] },
];
const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
for (const work of workflows) {
  for (const mobile of [false, true]) for (const still of [false, true]) {
    const w = mobile ? 600 : 1200;
    const h = mobile ? 670 : 410;
    const positions = mobile ? [[40,146],[350,146],[350,404],[40,404]] : [[45,145],[345,145],[645,145],[945,145]];
    const centers = positions.map(([x,y]) => [x+105,y+85]);
    const legs = mobile
      ? [`M250 231H350`, `M455 316V404`, `M350 489H250`]
      : [`M255 230H345`, `M555 230H645`, `M855 230H945`];
    const path = mobile ? "M145 231H455V489H145" : "M150 230H1050";
    let body = `<rect width="${w}" height="${h}" rx="12" fill="#101b2a"/>
      <text x="36" y="45" fill="#bac6d5" font-size="${mobile ? 16 : 17}" letter-spacing="1.3" font-family="Consolas,monospace">${esc(work.label)}</text>
      <text x="36" y="96" fill="#f4f0e8" font-size="${mobile ? 30 : 36}" font-weight="700">${esc(work.title)}</text>`;
    for (const leg of legs) body += `<path d="${leg}" fill="none" stroke="#58708f" stroke-width="2" stroke-dasharray="4 6"/>`;
    for (let i=0;i<4;i++) {
      const [x,y]=positions[i];
      body += `<g class="stage s${i}" style="--delay:${i*.65}s">
        <rect x="${x}" y="${y}" width="210" height="170" rx="12" fill="#19283c" stroke="${work.accent}" stroke-width="1.5"/>
        <circle cx="${x+36}" cy="${y+37}" r="16" fill="${work.accent}"/>
        <text x="${x+36}" y="${y+43}" text-anchor="middle" fill="#101b2a" font-size="18" font-weight="700">${i+1}</text>
        <path d="M${x+72} ${y+31}h98m-98 12h66" fill="none" stroke="#748ca9" stroke-width="2"/>
        <text x="${x+18}" y="${y+94}" fill="#f4f0e8" font-size="${mobile ? 25 : 24}" font-weight="700">${esc(work.steps[i][0])}</text>
        <text x="${x+18}" y="${y+131}" fill="#bac6d5" font-size="${mobile ? 19 : 19}">${esc(work.steps[i][1])}</text>
        <path class="progress" d="M${x+18} ${y+151}h174" stroke="${work.accent}" stroke-width="3"/>
      </g>`;
    }
    if (!still) body += `<g class="packet"><circle r="7" fill="${work.accent}"><animateMotion dur="4.6s" repeatCount="1" fill="freeze" path="${path}" calcMode="linear"/></circle></g>`;
    body += `<text x="36" y="${h-28}" fill="#bac6d5" font-size="${mobile ? 16 : 17}" font-family="Consolas,monospace">${still ? "THE COMPLETE FLOW" : "ONE PASS, THEN THE COMPLETE FLOW"}</text>`;
    const css = still ? "" : `<style>
      .stage{animation:activate 1.8s ease both;animation-delay:var(--delay)}
      .progress{stroke-dasharray:174;animation:draw 1.8s ease both;animation-delay:var(--delay)}
      .packet{animation:packet 4.6s linear both}
      @keyframes activate{from{opacity:.35}to{opacity:1}}
      @keyframes draw{from{stroke-dashoffset:174}to{stroke-dashoffset:0}}
      @keyframes packet{0%,95%{opacity:1}100%{opacity:0}}
      @media(prefers-reduced-motion:reduce){.stage,.progress{animation:none}.packet{display:none}}
    </style>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(work.title)}</title><desc id="desc">${esc(work.steps.map(step=>step.join(": ")).join(". "))}. ${still ? "Still overview." : "A single 4.6-second walkthrough, then a still overview."}</desc>${css}<g font-family="Arial,Helvetica,sans-serif">${body}</g></svg>\n`;
    if (/NaN|undefined|<script|<foreignObject/.test(svg)) throw new Error("Invalid workflow SVG");
    writeFileSync(join(out,`${work.file}${mobile ? "-mobile" : ""}${still ? "-still" : ""}.svg`),svg,"utf8");
  }
}
