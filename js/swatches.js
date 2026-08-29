/* ==========================================================================
   Earth's Home — Illustrated mood-swatch system for the Visual Preference quiz.
   Hand-built SVG "material & mood" cards in the studio palette — no stock
   photography, so nothing is ever broken, mismatched, or off-brand.
   ========================================================================== */

// Brand-derived palette. Fir/paper/fern are the studio's own colors; the rest
// are muted, grounded neutrals used only to depict material/mood concepts
// (a client's warm vs. cool instinct, etc.) — never as UI chrome.
const P = {
  paper: "#F5F1E7",
  paperDeep: "#EAE1CC",
  cream: "#FBF8F0",
  fir: "#2F4A24",
  firDark: "#1E2F17",
  fern: "#456E35",
  fernLight: "#7C9A6C",
  ink: "#262A20",
  clay: "#9C6B45",
  clayLight: "#C79868",
  clayDark: "#6B4A2E",
  stone: "#A6ADA0",
  stoneLight: "#C7CDC2",
  stoneDark: "#6E766A",
  bronze: "#8C6B3D",
};

let __swatchSeq = 0;

function svgSwatch(name) {
  const uid = `sw${__swatchSeq++}`;
  const builder = SWATCH_BUILDERS[name] || SWATCH_BUILDERS.simple;
  return `<svg class="swatch-svg" viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${builder(uid)}</svg>`;
}

function grainFilter(uid, opacity) {
  return `
    <filter id="grain-${uid}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.13  0 0 0 0 0.11  0 0 0 0 0.09  0 0 0 ${opacity} 0"/>
    </filter>`;
}

const SWATCH_BUILDERS = {
  warm: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${P.clayLight}"/>
        <stop offset="55%" stop-color="${P.clay}"/>
        <stop offset="100%" stop-color="${P.clayDark}"/>
      </linearGradient>
      ${grainFilter(u, 0.05)}
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect width="300" height="220" filter="url(#grain-${u})"/>
    <circle cx="215" cy="60" r="46" fill="${P.clayLight}" opacity="0.35"/>`,

  cool: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${P.stoneLight}"/>
        <stop offset="55%" stop-color="${P.stone}"/>
        <stop offset="100%" stop-color="${P.stoneDark}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect x="0" y="150" width="300" height="70" fill="${P.stoneDark}" opacity="0.35"/>`,

  light: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${P.cream}"/>
        <stop offset="100%" stop-color="${P.paperDeep}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <g stroke="${P.fernLight}" stroke-width="2" opacity="0.5">
      <line x1="220" y1="0" x2="150" y2="220"/>
      <line x1="260" y1="0" x2="190" y2="220"/>
      <line x1="300" y1="20" x2="235" y2="220"/>
    </g>
    <rect x="0" y="0" width="120" height="220" fill="${P.cream}"/>`,

  moody: (u) => `
    <defs>
      <radialGradient id="g-${u}" cx="30%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#33402A"/>
        <stop offset="55%" stop-color="${P.firDark}"/>
        <stop offset="100%" stop-color="#0F1710"/>
      </radialGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <circle cx="90" cy="90" r="18" fill="${P.clayLight}" opacity="0.55"/>
    <circle cx="90" cy="90" r="42" fill="${P.clayLight}" opacity="0.12"/>`,

  minimal: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    <line x1="30" y1="180" x2="270" y2="180" stroke="${P.paperDeep}" stroke-width="1.5"/>
    <circle cx="150" cy="140" r="26" fill="none" stroke="${P.ink}" stroke-width="2.5"/>`,

  layered: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    <line x1="20" y1="180" x2="280" y2="180" stroke="${P.paperDeep}" stroke-width="1.5"/>
    <rect x="55" y="120" width="30" height="60" fill="${P.clay}"/>
    <circle cx="115" cy="150" r="24" fill="none" stroke="${P.fir}" stroke-width="3"/>
    <rect x="150" y="100" width="46" height="80" fill="${P.fernLight}" opacity="0.9"/>
    <path d="M210 180 L232 118 L254 180 Z" fill="${P.ink}" opacity="0.8"/>
    <circle cx="245" cy="150" r="10" fill="${P.clayDark}"/>`,

  refined: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${P.cream}"/>
        <stop offset="45%" stop-color="${P.paperDeep}"/>
        <stop offset="55%" stop-color="${P.cream}"/>
        <stop offset="100%" stop-color="${P.stone}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect x="0" y="0" width="300" height="220" fill="#fff" opacity="0.06"/>`,

  rustic: (u) => `
    <defs>${grainFilter(u, 0.4)}</defs>
    <rect width="300" height="220" fill="${P.clayDark}"/>
    <rect width="300" height="220" filter="url(#grain-${u})"/>
    <g stroke="#4A331F" stroke-width="2" opacity="0.5">
      <line x1="0" y1="40" x2="300" y2="35"/>
      <line x1="0" y1="95" x2="300" y2="105"/>
      <line x1="0" y1="160" x2="300" y2="150"/>
    </g>`,

  symmetrical: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    <line x1="150" y1="10" x2="150" y2="210" stroke="${P.paperDeep}" stroke-width="1"/>
    <path d="M150 60 L120 180 L180 180 Z" fill="none" stroke="${P.ink}" stroke-width="2.5"/>
    <circle cx="105" cy="150" r="14" fill="${P.fir}"/>
    <circle cx="195" cy="150" r="14" fill="${P.fir}"/>`,

  asymmetrical: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    <path d="M90 70 L60 190 L150 190 Z" fill="none" stroke="${P.ink}" stroke-width="2.5"/>
    <circle cx="210" cy="140" r="20" fill="${P.fern}"/>
    <rect x="225" y="165" width="45" height="14" fill="${P.clay}"/>`,

  curved: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    <path d="M60 190 Q60 90 150 90 Q240 90 240 190" fill="none" stroke="${P.ink}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="150" cy="150" r="16" fill="${P.fir}"/>`,

  angular: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    <path d="M60 190 L60 100 L150 60 L240 100 L240 190" fill="none" stroke="${P.ink}" stroke-width="4" stroke-linejoin="miter"/>
    <rect x="135" y="130" width="30" height="30" fill="${P.fern}"/>`,

  contrast: (u) => `
    <rect width="150" height="220" fill="${P.ink}"/>
    <rect x="150" width="150" height="220" fill="${P.cream}"/>
    <circle cx="150" cy="110" r="34" fill="${P.cream}" stroke="${P.ink}" stroke-width="3"/>`,

  tonal: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${P.paperDeep}"/>
        <stop offset="50%" stop-color="#DDD2B4"/>
        <stop offset="100%" stop-color="#CBBFA0"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>`,

  polished: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${P.firDark}"/>
        <stop offset="45%" stop-color="${P.ink}"/>
        <stop offset="55%" stop-color="#3A4F2E"/>
        <stop offset="100%" stop-color="#131A0F"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect x="0" y="0" width="300" height="80" fill="#fff" opacity="0.08"/>`,

  textured: (u) => `
    <defs>${grainFilter(u, 0.55)}</defs>
    <rect width="300" height="220" fill="#D7CFB8"/>
    <rect width="300" height="220" filter="url(#grain-${u})"/>`,

  new: (u) => `
    <rect width="300" height="220" fill="${P.cream}"/>
    <rect x="90" y="70" width="120" height="80" fill="none" stroke="${P.ink}" stroke-width="2"/>
    <line x1="90" y1="70" x2="210" y2="150" stroke="${P.ink}" stroke-width="1"/>`,

  vintage: (u) => `
    <rect width="300" height="220" fill="${P.paperDeep}"/>
    <rect x="40" y="30" width="220" height="160" fill="none" stroke="${P.bronze}" stroke-width="3"/>
    <path d="M40 30 Q60 30 60 50 M260 30 Q240 30 240 50 M40 190 Q60 190 60 170 M260 190 Q240 190 240 170"
      fill="none" stroke="${P.bronze}" stroke-width="3"/>
    <circle cx="150" cy="110" r="24" fill="none" stroke="${P.bronze}" stroke-width="2"/>`,

  ornate: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    ${[40, 100, 160, 220, 280].map((x) => `<path d="M${x} 60 Q${x + 15} 90 ${x} 120 Q${x - 15} 90 ${x} 60" fill="${P.fern}" opacity="0.7"/>`).join("")}
    ${[70, 130, 190, 250].map((x) => `<circle cx="${x}" cy="150" r="8" fill="${P.fir}"/>`).join("")}`,

  simple: (u) => `
    <rect width="300" height="220" fill="${P.paper}"/>
    <rect x="110" y="80" width="80" height="80" fill="${P.ink}"/>`,
};
