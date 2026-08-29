/* ==========================================================================
   Earth's Home — Style & Living Discovery Quiz
   Question banks, scoring metadata, and interpretive copy.
   ========================================================================== */

const STUDIO = {
  name: "Earth's Home",
  tagline: "Interior Design Discovery",
  email: "earthshomedesign@gmail.com",
};

/* --------------------------------------------------------------------------
   SECTION 1 — VISUAL PREFERENCE QUIZ
   Forced-choice pairs. Each maps to one scoring axis.
   Axes: warmth, A (minimal<->collected), B (organic<->polished),
         C (traditional<->contemporary), D (airy<->enveloping)
   value 0 = poleA side, value 1 = poleB side, on the AXIS's own direction
   (see AXES below for which pole is 0 and which is 1)
-------------------------------------------------------------------------- */

const AXES = {
  warmth: { id: "warmth", label: "Palette Temperature", pole0: "Warm", pole1: "Cool" },
  A: { id: "A", label: "Minimal ↔ Collected", pole0: "Minimal", pole1: "Collected" },
  B: { id: "B", label: "Organic ↔ Polished", pole0: "Organic", pole1: "Polished" },
  C: { id: "C", label: "Traditional ↔ Contemporary", pole0: "Traditional", pole1: "Contemporary" },
  D: { id: "D", label: "Light-Filled ↔ Enveloping", pole0: "Light-Filled", pole1: "Enveloping" },
};

const VISUAL_PAIRS = [
  {
    id: "warmth", axis: "warmth",
    prompt: "Which pulls you in?",
    a: { label: "Warm", value: 0, swatch: "warm" },
    b: { label: "Cool", value: 1, swatch: "cool" },
  },
  {
    id: "mood", axis: "D",
    prompt: "Which room would you rather sit in?",
    a: { label: "Light & Airy", value: 0, swatch: "light" },
    b: { label: "Moody & Enveloping", value: 1, swatch: "moody" },
  },
  {
    id: "density", axis: "A",
    prompt: "Which shelf feels more like home?",
    a: { label: "Minimal", value: 0, swatch: "minimal" },
    b: { label: "Layered", value: 1, swatch: "layered" },
  },
  {
    id: "finish", axis: "B",
    prompt: "Which finish do you reach for?",
    a: { label: "Refined", value: 1, swatch: "refined" },
    b: { label: "Rustic", value: 0, swatch: "rustic" },
  },
  {
    id: "arrangement", axis: "C",
    prompt: "Which arrangement feels right?",
    a: { label: "Symmetrical", value: 0, swatch: "symmetrical" },
    b: { label: "Asymmetrical", value: 1, swatch: "asymmetrical" },
  },
  {
    id: "form", axis: "B",
    prompt: "Which shape language calls to you?",
    a: { label: "Curved", value: 0, swatch: "curved" },
    b: { label: "Angular", value: 1, swatch: "angular" },
  },
  {
    id: "contrast", axis: "D",
    prompt: "Which palette feels more you?",
    a: { label: "High Contrast", value: 1, swatch: "contrast" },
    b: { label: "Tonal", value: 0, swatch: "tonal" },
  },
  {
    id: "texture", axis: "B",
    prompt: "Which surface do you want to touch?",
    a: { label: "Polished", value: 1, swatch: "polished" },
    b: { label: "Textured", value: 0, swatch: "textured" },
  },
  {
    id: "era", axis: "C",
    prompt: "Which era speaks to you?",
    a: { label: "New", value: 1, swatch: "new" },
    b: { label: "Vintage", value: 0, swatch: "vintage" },
  },
  {
    id: "ornamentation", axis: "A",
    prompt: "Which detail level feels right?",
    a: { label: "Ornate", value: 1, swatch: "ornate" },
    b: { label: "Simple", value: 0, swatch: "simple" },
  },
];

/* --------------------------------------------------------------------------
   SECTION 2 — LIFESTYLE & HOME BEHAVIOUR QUIZ
-------------------------------------------------------------------------- */

const LIFESTYLE_QUESTIONS = [
  {
    id: "energy",
    text: "When you walk in after a long day, what do you want your home to give you?",
    type: "single",
    options: [
      { label: "Energy — it should feel inspiring", value: "energizing" },
      { label: "Calm — it should feel like an exhale", value: "calming" },
      { label: "A bit of both, room to room", value: "both" },
    ],
  },
  {
    id: "entertaining",
    text: "How often do you host people in your home?",
    type: "single",
    options: [
      { label: "Weekly or more", value: "frequent" },
      { label: "A few times a month", value: "regular" },
      { label: "A few times a year", value: "occasional" },
      { label: "Rarely — this is our private retreat", value: "rare" },
    ],
  },
  {
    id: "tidiness",
    text: "At the end of a busy week, your home is usually…",
    type: "single",
    options: [
      { label: "Everything put away, surfaces clear", value: "put-away" },
      { label: "Lived-in, a few things out", value: "lived-in" },
      { label: "Comfortably layered with everyday life", value: "layered" },
    ],
  },
  {
    id: "display",
    text: "Which feels more like you?",
    type: "single",
    options: [
      { label: "10 beautiful, considered objects on display", value: "display" },
      { label: "Almost nothing on display — calm and clear", value: "clear" },
    ],
  },
  {
    id: "maintenance",
    text: "How do you feel about maintaining delicate materials — light stone, raw wood, linen?",
    type: "single",
    options: [
      { label: "I love the ritual of caring for them", value: "love-it" },
      { label: "I like them, but want them low-maintenance", value: "some" },
      { label: "I'd rather avoid anything high-maintenance", value: "avoid" },
    ],
  },
  {
    id: "household",
    text: "Who and what shares your home day to day?",
    type: "multi",
    options: [
      { label: "Just us / no kids or pets", value: "just-us" },
      { label: "Kids at home", value: "kids" },
      { label: "Pets", value: "pets" },
      { label: "Frequent overnight guests", value: "guests" },
    ],
  },
  {
    id: "clutterOrEmpty",
    text: "Which bothers you more?",
    type: "single",
    options: [
      { label: "Visual clutter", value: "clutter" },
      { label: "A space that feels empty or cold", value: "empty" },
      { label: "Neither really bothers me", value: "neither" },
    ],
  },
  {
    id: "eveningSelf",
    text: "Picture your ideal evening in — which are you drawn to?",
    type: "single",
    options: [
      { label: "A proper set table for a dinner party", value: "table" },
      { label: "Sinking into a huge, sink-in sofa", value: "sofa" },
      { label: "Both, depending on the night", value: "both" },
    ],
  },
  {
    id: "characterVsPerfection",
    text: "Which do you value more in a finished space?",
    type: "single",
    options: [
      { label: "Character, patina, imperfection", value: "character" },
      { label: "A flawless, considered finish", value: "perfection" },
      { label: "A balance of both", value: "balance" },
    ],
  },
  {
    id: "evolution",
    text: "Once your home is designed, what do you want?",
    type: "single",
    options: [
      { label: "Finished, and left alone", value: "finished" },
      { label: "A living project I keep evolving", value: "evolving" },
      { label: "Mostly settled, with room for new finds", value: "settled" },
    ],
  },
];

/* --------------------------------------------------------------------------
   SECTION 3 — DESIGN PERSONALITY QUIZ
   (Big Five-informed: Openness, Conscientiousness, Extraversion)
   4-point forced scale, framed entirely as design statements.
-------------------------------------------------------------------------- */

const PERSONALITY_SCALE = [
  { label: "Not me at all", value: 1 },
  { label: "Not really me", value: 2 },
  { label: "Sounds like me", value: 3 },
  { label: "Very much me", value: 4 },
];

const PERSONALITY_STATEMENTS = [
  { id: "O1", trait: "openness", text: "I'm drawn to unexpected combinations — mixing eras, colors, or materials that ‘shouldn’t’ work together." },
  { id: "O2", trait: "openness", text: "I love having art or objects in my home that spark a conversation or tell a story." },
  { id: "O3", trait: "openness", text: "I'd rather try something unconventional than choose the safe, expected option." },
  { id: "C1", trait: "conscientiousness", text: "I feel most at ease when everything has a clear place and the space feels ordered." },
  { id: "C2", trait: "conscientiousness", text: "I'd rather invest in smart, built-in storage than leave things out, even beautiful things." },
  { id: "C3", trait: "conscientiousness", text: "I like a home that's planned and intentional, down to the smallest detail." },
  { id: "E1", trait: "extraversion", text: "My home is really a stage for gathering people — I design around hosting." },
  { id: "E2", trait: "extraversion", text: "I love a statement piece that gets noticed and talked about." },
  { id: "E3", trait: "extraversion", text: "After a long week, I recharge by being around people in my own home, not tucked away alone." },
];

/* --------------------------------------------------------------------------
   SECTION 4 — SENSORY PREFERENCE QUIZ
-------------------------------------------------------------------------- */

const SENSORY_QUESTIONS = [
  {
    id: "overheadLight",
    text: "Bright, overhead lighting…",
    type: "single",
    options: [
      { label: "Feels harsh to me", value: "harsh" },
      { label: "Doesn't bother me", value: "neutral" },
      { label: "I actually like it bright", value: "likes-bright" },
    ],
  },
  {
    id: "lightQuality",
    text: "Which light do you love more?",
    type: "single",
    options: [
      { label: "Sunlight flooding in", value: "direct" },
      { label: "Soft, filtered, diffused light", value: "filtered" },
    ],
  },
  {
    id: "touch",
    text: "If you could only touch one, which calls to you?",
    type: "single",
    options: [
      { label: "Honed stone", value: "stone" },
      { label: "Polished lacquer", value: "lacquer" },
      { label: "Raw wood", value: "wood" },
      { label: "Washed linen", value: "linen" },
      { label: "Plush velvet", value: "velvet" },
    ],
  },
  {
    id: "clutterSensitivity",
    text: "Visual clutter — piles, cords, mismatched objects…",
    type: "single",
    options: [
      { label: "Makes me anxious", value: "high" },
      { label: "Mildly bothers me", value: "medium" },
      { label: "Doesn't bother me much", value: "low" },
    ],
  },
  {
    id: "acoustics",
    text: "Echo-y rooms with hard, bare surfaces…",
    type: "single",
    options: [
      { label: "Bother me — I want softness and sound absorption", value: "bothered" },
      { label: "Don't really bother me", value: "unbothered" },
    ],
  },
  {
    id: "imperfection",
    text: "The imperfections in natural materials — knots in wood, veining in stone…",
    type: "single",
    options: [
      { label: "I love them, they feel alive", value: "loves" },
      { label: "I prefer a more uniform, consistent finish", value: "prefers-uniform" },
    ],
  },
  {
    id: "roomFeel",
    text: "A room should feel…",
    type: "single",
    options: [
      { label: "Cool & crisp", value: "cool" },
      { label: "Warm & cocooning", value: "warm" },
      { label: "Depends on the room", value: "depends" },
    ],
  },
];

/* --------------------------------------------------------------------------
   SECTION 5 — VALUES QUIZ
   Client selects up to 5, in priority order (order of tap = rank).
-------------------------------------------------------------------------- */

const VALUES_LIST = [
  { id: "natural-materials", label: "Natural materials", detail: "wood, stone, linen, clay" },
  { id: "low-tox", label: "Low-tox materials", detail: "non-toxic finishes & furnishings" },
  { id: "longevity", label: "Longevity", detail: "pieces built to last generations" },
  { id: "vintage-reuse", label: "Vintage & reuse", detail: "giving old things new life" },
  { id: "local-craft", label: "Local craftsmanship", detail: "small-batch, made near home" },
  { id: "low-maintenance", label: "Effortless upkeep", detail: "low-maintenance living" },
  { id: "budget-conscious", label: "Thoughtful budget", detail: "value over volume" },
  { id: "energy-efficiency", label: "Energy efficiency", detail: "sustainable systems" },
  { id: "connection-nature", label: "Connection to nature", detail: "light, air, greenery" },
  { id: "craftsmanship", label: "Visible craftsmanship", detail: "handmade quality you can see" },
  { id: "technology", label: "Smart technology", detail: "convenience & control" },
  { id: "wellness", label: "Wellness", detail: "air quality, acoustics, circadian light" },
];

const VALUES_MAX_SELECT = 5;
