import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const font = {
  P: ["11110","10001","10001","11110","10000","10000","10000"],
  R: ["11110","10001","10001","11110","10100","10010","10001"],
  U: ["10001","10001","10001","10001","10001","10001","01110"],
  D: ["11110","10001","10001","10001","10001","10001","11110"],
  H: ["10001","10001","10001","11111","10001","10001","10001"],
  V: ["10001","10001","10001","10001","10001","01010","00100"],
  I: ["11111","00100","00100","00100","00100","00100","11111"],
  K: ["10001","10010","10100","11000","10100","10010","10001"],
  O: ["01110","10001","10001","10001","10001","10001","01110"],
};
const n = (v) => Number(v.toFixed(2));
const random = (seed) => {
  const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

function personalShapes() {
  const paths = [[], [], []];
  function line(group, points, accent = false) { paths[group].push({ points, accent }); }
  function arc(group, x, y, rx, ry, start = 0, end = Math.PI * 2) {
    const points = [];
    for (let i = 0; i <= 48; i++) {
      const t = start + (end - start) * i / 48;
      points.push([x + Math.cos(t) * rx, y + Math.sin(t) * ry]);
    }
    line(group, points);
  }
  // Abstract Duke 390 silhouette: angular tank, short tail and orange frame.
  // Illustrative only; this is not a model-accurate technical drawing.
  arc(0,-93,45,42,42); arc(0,90,45,42,42);
  line(0,[[-93,45],[-49,-17],[29,-17],[90,45],[-93,45]]);
  line(0,[[90,45],[63,-48],[55,-68],[35,-72],[27,-68]]);
  line(0,[[-44,-35],[-20,-47],[0,-50],[45,-32],[12,-8],[-35,-18],[-44,-35]]);
  line(0,[[-100,-44],[-65,-45],[-36,-33],[-33,-25],[-72,-30],[-100,-44]]);
  line(0,[[-60,-15],[37,-12],[20,29],[-12,33],[-60,-15]],true);
  line(0,[[-26,-10],[12,-5],[27,23],[-12,33],[-29,8],[-26,-10]]);
  line(0,[[-38,40],[27,59],[62,59]]);
  line(0,[[65,-52],[82,-44],[70,-30],[59,-31],[65,-52]]);
  // Strength training: a barbell with two pairs of plates.
  line(1,[[-124,0],[124,0]]);
  for (const side of [-1,1]) {
    for (const [x,h] of [[82,65],[57,48]]) {
      const a=side*x;
      line(1,[[a-10,-h],[a+10,-h],[a+10,h],[a-10,h],[a-10,-h]]);
    }
  }
  // Coffee: cup, handle, saucer and steam.
  line(2,[[-63,-31],[60,-31],[60,40],[43,57],[-43,57],[-63,38],[-63,-31]]);
  arc(2,60,7,32,34,-Math.PI/2,Math.PI/2);
  line(2,[[-85,75],[84,75]]);
  for (const x of [-34,0,34]) {
    const points=[];
    for(let i=0;i<=32;i++) points.push([x+8*Math.sin(i/32*Math.PI*2),-57-i*2]);
    line(2,points);
  }
  return paths.map((group) => {
    const segments=[];
    let length=0;
    for(const {points:path, accent} of group) for(let i=1;i<path.length;i++) {
      const [a,b]=[path[i-1],path[i]];
      const size=Math.hypot(b[0]-a[0],b[1]-a[1]);
      segments.push({a,b,start:length,size,accent}); length+=size;
    }
    const samples=[];
    // Sample the silhouette at about 9px intervals; duplicate particles share
    // these destinations during the reveal, then separate into the name.
    const count=Math.ceil(length/9);
    for(let i=0;i<count;i++) {
      const at=i/count*length;
      const segment=segments.find(s=>s.start+s.size>=at);
      const t=(at-segment.start)/segment.size;
      samples.push([segment.a[0]+(segment.b[0]-segment.a[0])*t,segment.a[1]+(segment.b[1]-segment.a[1])*t,segment.accent]);
    }
    return samples;
  });
}
const interests=personalShapes();

function build(mobile, still = false) {
  const width = mobile ? 600 : 1200;
  const height = mobile ? 470 : 650;
  const cell = mobile ? 11 : 22;
  const margin = mobile ? 28 : 48;
  const points = [];
  for (const [word, top] of [["PRUDHVI", mobile ? 110 : 130],["KROVVIDI", mobile ? 220 : 330]]) {
    const left = (width - (word.length * 6 - 1) * cell) / 2;
    for (let letter = 0; letter < word.length; letter++) {
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 5; col++) {
          if (font[word[letter]][row][col] !== "1") continue;
          // Four points per bitmap cell make a fine dot matrix, without a font dependency.
          for (const ox of [0.23, 0.73]) for (const oy of [0.23, 0.73]) {
            points.push({ x: left + (letter * 6 + col + ox) * cell, y: top + (row + oy) * cell });
          }
        }
      }
    }
  }
  const cx = width / 2;
  const cy = mobile ? 213 : 313;
  const scale = mobile ? 0.5 : 1;
  const dots = points.map((p, i) => {
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    const z = 1 - 2 * (i + 0.5) / points.length;
    const ring = Math.sqrt(1 - z * z);
    const perspective = 1 + 0.22 * ring * Math.sin(angle);
    const sphereX = cx + 253 * scale * ring * Math.cos(angle) * perspective;
    const sphereY = cy + 190 * scale * z * perspective;
    const group = i % 3;
    const shape = interests[group];
    const destination = shape[Math.floor(i / 3) % shape.length];
    const personalX = (width * (group + 0.5) / 3) + destination[0] * scale;
    const personalY = cy + destination[1] * scale;
    const sx = margin + random(i + 1) * (width - margin * 2);
    const sy = (mobile ? 88 : 95) + random(i + 4000) * (mobile ? 230 : 400);
    const color = i % 13 === 0 ? "#ff945a" : i % 17 === 0 ? "#81b4ff" : "#f4f0e8";
    const style = still ? "" : ` style="--personal-color:${destination[2] ? "#ff945a" : "#f4f0e8"};--rest-color:${color};--sx:${n(sx-p.x)}px;--sy:${n(sy-p.y)}px;--ax:${n(sphereX-p.x)}px;--ay:${n(sphereY-p.y)}px;--bx:${n(personalX-p.x)}px;--by:${n(personalY-p.y)}px"`;
    return `<circle class="particle" cx="${n(p.x)}" cy="${n(p.y)}" r="${n(3.6*scale)}" fill="${color}"${style}/>`;
  }).join("");
  let grid = "";
  for (let y = 84; y < (mobile ? 335 : 520); y += 22) {
    for (let x = margin; x <= width - margin; x += 22) grid += `<circle cx="${x}" cy="${y}" r=".7" fill="#34465d" opacity=".38"/>`;
  }
  const motion = still ? "" : `<style>
    .particle{animation:assemble 10s cubic-bezier(.45,0,.2,1) infinite both}
    .interests{animation:glimpse 10s linear infinite both;opacity:0}
    @keyframes assemble{
      0%{transform:translate(var(--sx),var(--sy));opacity:0}
      7.5%{transform:translate(var(--ax),var(--ay));opacity:.9}
      12.5%{transform:translate(var(--ax),var(--ay));opacity:.9}
      22.5%{transform:translate(var(--bx),var(--by));opacity:1;fill:var(--personal-color)}
      35%{transform:translate(var(--bx),var(--by));opacity:1;fill:var(--personal-color)}
      48%,94%{transform:translate(0px,0px);opacity:1;fill:var(--rest-color)}
      100%{transform:translate(0px,0px);opacity:0;fill:var(--rest-color)}
    }
    @keyframes glimpse{0%,17.5%{opacity:0}22.5%,35%{opacity:1}41.5%,100%{opacity:0}}
    @media(prefers-reduced-motion:reduce){.particle,.interests{animation:none}.interests{display:none}}
  </style>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Prudhvi Krovvidi. A little more about me.</title>
<desc id="desc">${still ? "A dot-matrix nameplate." : "A looping point-cloud reveal: scattered points gather into a sphere, form a Duke 390-inspired motorcycle, a powerlifting barbell and a black-coffee cup, then resolve into Prudhvi Krovvidi. Each 10-second cycle holds the finished name before restarting. Reduced-motion settings show the finished name immediately."}</desc>
${motion}${still ? "<style>.interests{display:none}</style>" : ""}<rect width="${width}" height="${height}" rx="12" fill="#101b2a"/>
${grid}
<g font-family="Arial,Helvetica,sans-serif" fill="#bac6d5">
  <path d="M${margin} 24H${width-margin}" stroke="#354459"/>
  <text x="${margin}" y="60" font-size="${mobile ? 18 : 19}" letter-spacing="2" font-family="Consolas,monospace">PRUDHVI KROVVIDI / OFF THE CLOCK</text>
  ${dots}
  <g class="interests" font-size="${mobile ? 14 : 17}" text-anchor="middle" letter-spacing="1.5" fill="#ff945a" font-family="Consolas,monospace"><text x="${width/6}" y="${mobile ? 306 : 485}">KTM DUKE 390</text><text x="${width/2}" y="${mobile ? 306 : 485}">POWERLIFTING</text><text x="${width*5/6}" y="${mobile ? 306 : 485}">BLACK COFFEE</text></g>
  <g><path d="M${margin} ${mobile ? 336 : 524}h48" stroke="#ff945a" stroke-width="3"/>
  <text x="${margin}" y="${mobile ? 381 : 579}" font-size="${mobile ? 29 : 34}" fill="#f4f0e8">A little more about me.</text>
  <text x="${margin}" y="${mobile ? 424 : 620}" font-size="${mobile ? 17 : 19}" letter-spacing="1.5" font-family="Consolas,monospace">DUKE 390 / POWERLIFTING / BLACK COFFEE</text></g>
</g></svg>\n`;
  if (/NaN|undefined|<script|<foreignObject/.test(svg)) throw new Error("Invalid particle SVG");
  writeFileSync(join(root,"assets",`particle-identity${mobile ? "-mobile" : ""}${still ? "-still" : ""}.svg`),svg,"utf8");
  return points.length;
}
for (const mobile of [false,true]) for (const still of [false,true]) build(mobile,still);
