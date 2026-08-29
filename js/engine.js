/* ==========================================================================
   Earth's Home — Scoring & Interpretation Engine
   Turns raw quiz answers into a designer-facing discovery report.
   ========================================================================== */

/* ---------- Visual scales ---------- */

function scoreVisualAxes(visualAnswers) {
  // returns { warmth: 0-100, A: 0-100, B: 0-100, C: 0-100, D: 0-100 }
  const buckets = { warmth: [], A: [], B: [], C: [], D: [] };
  VISUAL_PAIRS.forEach((pair) => {
    const chosen = visualAnswers[pair.id]; // 0 or 1, whichever side was picked
    if (chosen === undefined) return;
    buckets[pair.axis].push(chosen);
  });
  const scores = {};
  Object.keys(buckets).forEach((axis) => {
    const arr = buckets[axis];
    scores[axis] = arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) : 50;
  });
  return scores;
}

/* ---------- Personality (Big-Five informed) ---------- */

function scorePersonality(personalityAnswers) {
  const traits = { openness: [], conscientiousness: [], extraversion: [] };
  PERSONALITY_STATEMENTS.forEach((s) => {
    const v = personalityAnswers[s.id];
    if (v === undefined) return;
    traits[s.trait].push(v);
  });
  const out = {};
  Object.keys(traits).forEach((t) => {
    const arr = traits[t];
    const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 2.5;
    out[t] = Math.round(((avg - 1) / 3) * 100); // 1..4 -> 0..100
  });
  return out;
}

function tier(score) {
  if (score >= 66) return "high";
  if (score <= 34) return "low";
  return "mid";
}

const PERSONALITY_COPY = {
  openness: {
    high: "Genuinely energized by the unexpected. Bring vintage-meets-modern mixes, bold art, unusual materials — safe and predictable will read as flat to this client.",
    mid: "Open to a considered surprise, but wants it grounded. One or two unexpected moves per room, not a whole scheme of them.",
    low: "Finds comfort in the familiar. Lead with timeless forms, symmetry, and materials they already recognize — novelty should be introduced slowly, if at all.",
  },
  conscientiousness: {
    high: "Order is not optional — it's how this client relaxes. Prioritize concealed storage, a defined place for everything, and restrained, intentional compositions.",
    mid: "Likes things tidy but won't obsess over it. Good storage matters, but a little visible life won't stress them out.",
    low: "Comfortable with things being layered and a little loose. Flexible, reconfigurable spaces will serve them better than rigid, over-planned ones.",
  },
  extraversion: {
    high: "Home is a stage. Prioritize conversation-friendly layouts, generous dining and gathering zones, and at least one statement piece guests will remark on.",
    mid: "Wants spaces that can host, but doesn't need every room performing. Balance one or two gathering zones with quieter ones.",
    low: "Home is a retreat first. Prioritize intimacy, acoustic softness, layered lighting, and a room built purely for recharging alone.",
  },
};

/* ---------- Sensory guidance ---------- */

const SENSORY_GUIDANCE = {
  overheadLight: {
    harsh: "Avoid bare overhead fixtures — plan layered lighting (lamps, sconces, dimmable recessed) instead.",
    neutral: "Overhead lighting is fine as one layer among several — no special avoidance needed.",
    "likes-bright": "Comfortable with strong, even overhead light — don't over-soften every fixture.",
  },
  lightQuality: {
    direct: "Prioritize unobstructed windows and sightlines to daylight; avoid heavy window treatments.",
    filtered: "Plan for sheers, diffusion, and softened daylight rather than direct, unfiltered sun.",
  },
  touch: {
    stone: "Honed stone is their tactile anchor — consider it for a hero surface (island, table, bath).",
    lacquer: "Drawn to polished lacquer — smooth, reflective finishes will feel luxurious to them, not cold.",
    wood: "Raw, touchable wood should appear somewhere they can actually rest a hand on it, not just as trim.",
    linen: "Washed linen is their comfort material — bring it into upholstery and soft goods, not just drapery.",
    velvet: "Plush velvet reads as luxury to them — a strong candidate for a statement seating piece.",
  },
  clutterSensitivity: {
    high: "Storage strategy is not optional here — plan concealed, dedicated storage for nearly everything.",
    medium: "Keep primary surfaces clear; some visible daily-use items are fine.",
    low: "This client won't be bothered by an authentically lived-in look — don't over-style for camera-readiness.",
  },
  acoustics: {
    bothered: "Build in soft goods deliberately — rugs, upholstery, drapery, acoustic panels — not just for looks but for how the room sounds.",
    unbothered: "Acoustics are a lower priority; hard, sculptural surfaces can be used more freely.",
  },
  imperfection: {
    loves: "Lean into natural variation — live-edge wood, dramatic stone veining, handmade ceramics with visible texture.",
    "prefers-uniform": "Choose engineered or more consistent materials over highly variable natural ones, or select carefully for uniformity.",
  },
  roomFeel: {
    cool: "Base palette can run cooler and crisper without feeling unwelcoming to this client.",
    warm: "Prioritize warm undertones and cocooning textures even in otherwise minimal or contemporary rooms.",
    depends: "Plan room-by-room — this client wants temperature to shift with function (crisp kitchen, cocooning bedroom, etc.).",
  },
};

/* ---------- Lifestyle plain-English facts ---------- */

const LIFESTYLE_LABELS = {
  energy: {
    energizing: "Wants the home to feel energizing and inspiring.",
    calming: "Wants the home to feel calming — an exhale at the end of the day.",
    both: "Wants a mix — some rooms energizing, some calming.",
  },
  entertaining: {
    frequent: "Hosts weekly or more — entertaining is a core use case, design for it.",
    regular: "Hosts a few times a month — entertaining matters but isn't constant.",
    occasional: "Hosts a few times a year — entertaining spaces should flex back to everyday life easily.",
    rare: "Rarely hosts — this is a private retreat first; don't over-invest in entertaining-only spaces.",
  },
  tidiness: {
    "put-away": "Keeps surfaces clear by default — will maintain a more minimal styling.",
    "lived-in": "Home runs lived-in with a few things out — plan for realistic daily use, not a styled shoot.",
    layered: "Comfortably layered with everyday life — a curated-but-lived-in look will feel authentic, not messy.",
  },
  display: {
    display: "Wants beautiful objects visibly on display — open shelving and vignettes will get used.",
    clear: "Wants almost nothing on display — prioritize closed storage over open shelving.",
  },
  maintenance: {
    "love-it": "Enjoys caring for delicate materials — raw wood, light stone, and linen are all fair game.",
    some: "Likes delicate materials but wants them treated/sealed for lower maintenance.",
    avoid: "Wants to avoid high-maintenance materials — favor performance fabrics and sealed, durable finishes.",
  },
  household: {
    "just-us": "No kids or pets in the home day to day.",
    kids: "Kids are in the home — durability and safety matter in material choice and layout.",
    pets: "Pets are in the home — factor in scratch/stain resistance and easy-clean surfaces.",
    guests: "Frequent overnight guests — a flexible guest room/bath is worth prioritizing.",
  },
  clutterOrEmpty: {
    clutter: "More bothered by visual clutter than by empty space — err toward restraint.",
    empty: "More bothered by a space feeling empty or cold than by clutter — layer in warmth and objects.",
    neither: "Not particularly sensitive to clutter or emptiness — more flexibility here.",
  },
  eveningSelf: {
    table: "Envisions a proper set dining table for evenings in — formal dining matters to them.",
    sofa: "Envisions sinking into a huge, sink-in sofa — prioritize deep, comfortable seating.",
    both: "Wants both a proper dining setup and a deep, comfortable sofa, depending on the night.",
  },
  characterVsPerfection: {
    character: "Values character and patina over a flawless finish — imperfection reads as authenticity.",
    perfection: "Values a flawless, considered finish — prioritize precision and consistency in execution.",
    balance: "Wants a balance of character and polish — neither pure patina nor pure perfection.",
  },
  evolution: {
    finished: "Wants the home finished once and left alone — avoid over-designing for future flexibility.",
    evolving: "Sees the home as a living project — build in room to keep adding and evolving.",
    settled: "Wants it mostly settled, with room left for new finds over time.",
  },
};

/* ---------- Style signature naming ---------- */

const AXIS_NAME_WORDS = {
  A: { 0: "Minimal", 1: "Collected" },
  B: { 0: "Organic", 1: "Polished" },
  C: { 0: "Timeless", 1: "Contemporary" },
  D: { 0: "Luminous", 1: "Enveloping" },
};

const AXIS_PARAGRAPH = {
  A: {
    0: "a pared-back calm where every object earns its place",
    1: "a richly layered, curated collection of objects that mean something",
    n: "a comfortable middle ground between pared-back and richly layered",
  },
  B: {
    0: "raw, textural materials that show the hand of nature",
    1: "clean, refined surfaces with architectural precision",
    n: "a considered mix of raw texture and refined polish",
  },
  C: {
    0: "timeless, heritage-informed forms",
    1: "clean-lined, of-the-moment forms",
    n: "forms that blend the timeless and the of-the-moment",
  },
  D: {
    0: "light-filled rooms that feel open and easy",
    1: "deep, moody rooms built for retreat",
    n: "flexible — light-filled some days, enveloping and moody on others",
  },
};

const NEUTRAL_DEV_THRESHOLD = 10;

function buildStyleSignature(scores, warmthScore) {
  const axes = ["A", "B", "C", "D"];
  const deviations = axes.map((a) => ({ axis: a, dev: Math.abs(scores[a] - 50) })).sort((x, y) => y.dev - x.dev);
  const top2 = deviations.slice(0, 2);
  const words = top2.map((d) =>
    d.dev >= NEUTRAL_DEV_THRESHOLD ? AXIS_NAME_WORDS[d.axis][scores[d.axis] >= 50 ? 1 : 0] : "Considered"
  );
  const headline = words.join(" & ");

  const phrases = axes.map((a) => {
    const dev = Math.abs(scores[a] - 50);
    return dev >= NEUTRAL_DEV_THRESHOLD ? AXIS_PARAGRAPH[a][scores[a] >= 50 ? 1 : 0] : AXIS_PARAGRAPH[a].n;
  });
  const warmthDev = Math.abs(warmthScore - 50);
  const warmthWord = warmthDev < NEUTRAL_DEV_THRESHOLD ? "balanced between warm and cool" : warmthScore >= 50 ? "cool and grounded" : "warm and sun-touched";
  const paragraph =
    `Drawn to ${phrases[0]}, expressed through ${phrases[1]}, leaning toward ${phrases[2]}, ` +
    `in rooms that feel ${phrases[3]}. Their palette instinct runs ${warmthWord}.`;

  return { headline, paragraph };
}

/* ---------- Tension / discussion-point flags ---------- */

function buildFlags(ctx) {
  const { scores, personality, lifestyle, sensory, values } = ctx;
  const flags = [];

  if (scores.A <= 35 && lifestyle.display === "display") {
    flags.push({
      title: "Minimal instinct vs. desire to display",
      insight: "Visual preferences skew strongly minimal, but they also want beautiful objects visibly on display.",
      question: "Which objects are the non-negotiable ‘keepers’ you'd want out on display, even in a pared-back room?",
    });
  }

  if (scores.B >= 65 && (lifestyle.household || []).some((h) => h === "kids" || h === "pets") && lifestyle.maintenance === "avoid") {
    flags.push({
      title: "Refined finishes vs. a high-traffic household",
      insight: "Strong pull toward polished, refined materials, but the home has kids and/or pets and a low tolerance for maintenance.",
      question: "Where would you accept a performance material that reads as refined but handles daily wear — versus where you want the real thing regardless?",
    });
  }

  if (scores.D >= 65 && sensory.lightQuality === "direct") {
    flags.push({
      title: "Enveloping mood vs. craving direct sunlight",
      insight: "Leans toward moody, enveloping rooms, but also craves sunlight flooding in unfiltered.",
      question: "Is the ‘moody’ pull mostly about color and material depth, or about low light specifically — and are there rooms that should stay bright regardless?",
    });
  }

  if (personality.conscientiousness >= 66 && scores.A >= 60) {
    flags.push({
      title: "Curated layering vs. need for order",
      insight: "Wants a collected, layered look, but also feels most at ease when everything has a clear, ordered place.",
      question: "Should we aim for ‘editorial layering’ — curated objects with serious concealed storage behind the scenes — rather than open, casual clutter?",
    });
  }

  if (personality.extraversion >= 66 && (lifestyle.entertaining === "frequent" || lifestyle.entertaining === "regular")) {
    flags.push({
      title: "Entertaining energy vs. need for retreat",
      insight: "Strongly social and hosts often — worth confirming there's also a private zone built purely to recharge.",
      question: "Beyond the entertaining spaces, is there a room — even a small one — that should be designed purely as your retreat?",
    });
  }

  if (personality.openness >= 66 && scores.C <= 35) {
    flags.push({
      title: "High openness, strongly contemporary",
      insight: "Genuinely drawn to the unconventional, paired with a strong contemporary lean — a good candidate for bold, unexpected moves.",
      question: "Are there specific eras, cultures, or materials you'd love mixed into an otherwise contemporary scheme?",
    });
  }

  const topValues = values || [];
  if (topValues.includes("budget-conscious") && (topValues.includes("craftsmanship") || topValues.includes("local-craft"))) {
    flags.push({
      title: "Budget-conscious vs. bespoke craftsmanship",
      insight: "Both ‘thoughtful budget’ and visible/local craftsmanship rank as top priorities — these can pull against each other.",
      question: "Where would you rather splurge on craftsmanship — hero pieces, or everyday pieces used constantly?",
    });
  }

  if (lifestyle.maintenance === "avoid" && sensory.touch === "wood") {
    flags.push({
      title: "Loves raw wood, wants low maintenance",
      insight: "Most drawn to raw wood by touch, but wants to avoid high-maintenance materials.",
      question: "Would a sealed or engineered wood that keeps the raw look, but with far less upkeep, work for you?",
    });
  }

  if (lifestyle.characterVsPerfection === "perfection" && topValues.includes("vintage-reuse")) {
    flags.push({
      title: "Flawless finish vs. valuing vintage",
      insight: "Values a flawless finish, but also ranks vintage and reuse as a top priority — vintage pieces carry patina by nature.",
      question: "For vintage pieces, are you picturing restored-to-pristine, or gently worn with visible history?",
    });
  }

  if (sensory.clutterSensitivity === "high" && lifestyle.tidiness === "layered") {
    flags.push({
      title: "Layered living vs. clutter sensitivity",
      insight: "Describes their home as comfortably layered day to day, but visual clutter genuinely bothers them.",
      question: "Should we plan zoned, contained ‘layering’ — trays, baskets, defined spots — so it reads intentional rather than cluttered?",
    });
  }

  return flags;
}

/* ---------- Suggested discovery-meeting questions ---------- */

function buildOpeningQuestions(ctx) {
  const { flags, values, lifestyle } = ctx;
  const qs = [];
  flags.slice(0, 2).forEach((f) => qs.push(f.question));
  if (values && values[0]) {
    const v = VALUES_LIST.find((v) => v.id === values[0]);
    if (v) qs.push(`You ranked “${v.label}” as your top priority — what's a home (yours or someone else's) where you felt that value done right?`);
  }
  if (lifestyle.evolution === "evolving") {
    qs.push("Since you see this as a living project — where should we design for permanence, and where should we deliberately leave room to change?");
  }
  qs.push("Walk me through a typical week in this home, room by room — where do you actually spend your time?");
  return qs.slice(0, 5);
}

/* ---------- Top-level report builder ---------- */

function buildReport(answers) {
  const scores = scoreVisualAxes(answers.visual || {});
  const personality = scorePersonality(answers.personality || {});
  const lifestyle = answers.lifestyle || {};
  const sensory = answers.sensory || {};
  const values = answers.values || [];
  const client = answers.client || {};

  const signature = buildStyleSignature(scores, scores.warmth);
  const flags = buildFlags({ scores, personality, lifestyle, sensory, values });
  const openingQuestions = buildOpeningQuestions({ flags, values, lifestyle });

  return {
    generatedAt: new Date().toISOString(),
    client,
    scores,
    personality,
    lifestyle,
    sensory,
    values,
    signature,
    flags,
    openingQuestions,
  };
}
