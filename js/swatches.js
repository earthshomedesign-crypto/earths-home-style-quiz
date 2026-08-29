/* ==========================================================================
   Earth's Home — Illustrated mood-swatch system for the Visual Preference quiz.
   Hand-built SVG "material & mood" cards in the studio palette — no stock
   photography, so nothing is ever broken, mismatched, or off-brand.
   ========================================================================== */

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
        <stop offset="0%" stop-color="#D98A52"/>
        <stop offset="55%" stop-color="#C1663B"/>
        <stop offset="100%" stop-color="#8F4326"/>
      </linearGradient>
      ${grainFilter(u, 0.05)}
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect width="300" height="220" filter="url(#grain-${u})"/>
    <circle cx="215" cy="60" r="46" fill="#F0C98A" opacity="0.35"/>`,

  cool: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C9D3D6"/>
        <stop offset="55%" stop-color="#9AAAB0"/>
        <stop offset="100%" stop-color="#5F6E75"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect x="0" y="150" width="300" height="70" fill="#4A585E" opacity="0.35"/>`,

  light: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFDF8"/>
        <stop offset="100%" stop-color="#EFE6D4"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <g stroke="#E8C98A" stroke-width="2" opacity="0.6">
      <line x1="220" y1="0" x2="150" y2="220"/>
      <line x1="260" y1="0" x2="190" y2="220"/>
      <line x1="300" y1="20" x2="235" y2="220"/>
    </g>
    <rect x="0" y="0" width="120" height="220" fill="#F7F1E5"/>`,

  moody: (u) => `
    <defs>
      <radialGradient id="g-${u}" cx="30%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#4A4438"/>
        <stop offset="55%" stop-color="#2B2620"/>
        <stop offset="100%" stop-color="#181410"/>
      </radialGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <circle cx="90" cy="90" r="18" fill="#E8B36B" opacity="0.55"/>
    <circle cx="90" cy="90" r="42" fill="#E8B36B" opacity="0.12"/>`,

  minimal: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    <line x1="30" y1="180" x2="270" y2="180" stroke="#D8CBB2" stroke-width="1.5"/>
    <circle cx="150" cy="140" r="26" fill="none" stroke="#3A332A" stroke-width="2.5"/>`,

  layered: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    <line x1="20" y1="180" x2="280" y2="180" stroke="#D8CBB2" stroke-width="1.5"/>
    <rect x="55" y="120" width="30" height="60" fill="#C1663B"/>
    <circle cx="115" cy="150" r="24" fill="none" stroke="#5E6650" stroke-width="3"/>
    <rect x="150" y="100" width="46" height="80" fill="#B08A4E" opacity="0.85"/>
    <path d="M210 180 L232 118 L254 180 Z" fill="#3A332A" opacity="0.8"/>
    <circle cx="245" cy="150" r="10" fill="#8F4326"/>`,

  refined: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#EFE7D8"/>
        <stop offset="45%" stop-color="#D8C9A8"/>
        <stop offset="55%" stop-color="#F6EFDF"/>
        <stop offset="100%" stop-color="#C7B48A"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect x="0" y="0" width="300" height="220" fill="#fff" opacity="0.06"/>`,

  rustic: (u) => `
    <defs>${grainFilter(u, 0.4)}</defs>
    <rect width="300" height="220" fill="#7A5B3C"/>
    <rect width="300" height="220" filter="url(#grain-${u})"/>
    <g stroke="#5E4226" stroke-width="2" opacity="0.5">
      <line x1="0" y1="40" x2="300" y2="35"/>
      <line x1="0" y1="95" x2="300" y2="105"/>
      <line x1="0" y1="160" x2="300" y2="150"/>
    </g>`,

  symmetrical: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    <line x1="150" y1="10" x2="150" y2="210" stroke="#D8CBB2" stroke-width="1"/>
    <path d="M150 60 L120 180 L180 180 Z" fill="none" stroke="#3A332A" stroke-width="2.5"/>
    <circle cx="105" cy="150" r="14" fill="#C1663B"/>
    <circle cx="195" cy="150" r="14" fill="#C1663B"/>`,

  asymmetrical: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    <path d="M90 70 L60 190 L150 190 Z" fill="none" stroke="#3A332A" stroke-width="2.5"/>
    <circle cx="210" cy="140" r="20" fill="#5E6650"/>
    <rect x="225" y="165" width="45" height="14" fill="#B08A4E"/>`,

  curved: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    <path d="M60 190 Q60 90 150 90 Q240 90 240 190" fill="none" stroke="#3A332A" stroke-width="4" stroke-linecap="round"/>
    <circle cx="150" cy="150" r="16" fill="#C1663B"/>`,

  angular: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    <path d="M60 190 L60 100 L150 60 L240 100 L240 190" fill="none" stroke="#3A332A" stroke-width="4" stroke-linejoin="miter"/>
    <rect x="135" y="130" width="30" height="30" fill="#5E6650"/>`,

  contrast: (u) => `
    <rect width="150" height="220" fill="#1E1A16"/>
    <rect x="150" width="150" height="220" fill="#F7F1E5"/>
    <circle cx="150" cy="110" r="34" fill="#F7F1E5" stroke="#1E1A16" stroke-width="3"/>`,

  tonal: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#D8CBB2"/>
        <stop offset="50%" stop-color="#C7B48A"/>
        <stop offset="100%" stop-color="#B4A07C"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>`,

  polished: (u) => `
    <defs>
      <linearGradient id="g-${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3A332A"/>
        <stop offset="45%" stop-color="#231F1A"/>
        <stop offset="55%" stop-color="#4E4536"/>
        <stop offset="100%" stop-color="#1A1712"/>
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#g-${u})"/>
    <rect x="0" y="0" width="300" height="80" fill="#fff" opacity="0.08"/>`,

  textured: (u) => `
    <defs>${grainFilter(u, 0.55)}</defs>
    <rect width="300" height="220" fill="#D9CFBA"/>
    <rect width="300" height="220" filter="url(#grain-${u})"/>`,

  new: (u) => `
    <rect width="300" height="220" fill="#F7F1E5"/>
    <rect x="90" y="70" width="120" height="80" fill="none" stroke="#3A332A" stroke-width="2"/>
    <line x1="90" y1="70" x2="210" y2="150" stroke="#3A332A" stroke-width="1"/>`,

  vintage: (u) => `
    <rect width="300" height="220" fill="#EFE4CB"/>
    <rect x="40" y="30" width="220" height="160" fill="none" stroke="#9C7B3E" stroke-width="3"/>
    <path d="M40 30 Q60 30 60 50 M260 30 Q240 30 240 50 M40 190 Q60 190 60 170 M260 190 Q240 190 240 170"
      fill="none" stroke="#9C7B3E" stroke-width="3"/>
    <circle cx="150" cy="110" r="24" fill="none" stroke="#9C7B3E" stroke-width="2"/>`,

  ornate: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    ${[40, 100, 160, 220, 280].map((x) => `<path d="M${x} 60 Q${x + 15} 90 ${x} 120 Q${x - 15} 90 ${x} 60" fill="#B08A4E" opacity="0.7"/>`).join("")}
    ${[70, 130, 190, 250].map((x) => `<circle cx="${x}" cy="150" r="8" fill="#C1663B"/>`).join("")}`,

  simple: (u) => `
    <rect width="300" height="220" fill="#F4EEE4"/>
    <rect x="110" y="80" width="80" height="80" fill="#3A332A"/>`,
};
