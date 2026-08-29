# Earth's Home — Interior Design Discovery Quiz

A 15-minute, client-facing discovery quiz for Earth's Home interior design studio.
It replaces "what's your style?" with something far more useful for a personalized
consultation: how a client actually *sees*, *lives*, *thinks*, *senses*, and *values*.

No backend required — it's a static site (open `index.html` directly, or host it
anywhere: GitHub Pages, Netlify, S3, etc).

## What it does

The client moves through five quick mini-quizzes, one instinctive question at a time:

1. **Visual Preference** — 10 forced-choice pairs (warm/cool, minimal/layered,
   refined/rustic, curved/angular, and more), illustrated with a custom set of
   hand-built SVG "mood swatches" in the studio's own palette — no stock photography,
   so nothing is ever broken, mismatched, or off-brand.
2. **Lifestyle & Home Behaviour** — how they actually live day to day: entertaining,
   tidiness, maintenance tolerance, kids/pets, display habits.
3. **Design Personality** — nine statements adapted from the Big Five (openness,
   conscientiousness, extraversion), framed entirely as design preferences, never
   presented to the client as a personality test.
4. **Sensory Preference** — light, touch, acoustics, and material imperfection.
5. **Values** — the client taps their top 3–5 priorities (natural materials,
   craftsmanship, budget-consciousness, wellness, etc.) in the order they come to
   mind, which doubles as a priority ranking.

## What the designer gets

At the end, the app builds a **designer-facing interpreted report** — not just raw
scores, but a synthesized read they can walk into a consultation with:

- A data-driven **Style Signature** headline + narrative paragraph
- Five style scales (Minimal↔Collected, Organic↔Polished, Traditional↔Contemporary,
  Light-Filled↔Enveloping, Warm↔Cool)
- A **Design Personality** snapshot with concrete implications per trait
- A **Sensory Profile** translated into material/lighting guidance
- Ranked **Values** priorities
- Plain-English **Lifestyle & Practical Needs**
- **Consultation Discussion Points** — a rules-based engine that flags real tensions
  in the client's own answers (e.g. "wants a flawless finish" + "values vintage reuse")
  and suggests the exact question to ask about it
- **Suggested opening questions** for the discovery meeting, generated from the
  client's specific answers

The report can be emailed straight to the studio (pre-filled `mailto:`), copied as
plain text, or printed/saved as a PDF.

## Project structure

```
index.html        app shell
css/style.css      full stylesheet (brand, layout, print styles)
js/data.js         all question banks + copy
js/swatches.js      illustrated SVG mood-swatch system
js/engine.js        scoring + interpretation logic
js/report.js        report rendering + email/copy/print export
js/app.js           state machine, navigation, screen rendering
```

## Running locally

Just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8080
```
