/* ==========================================================================
   Earth's Home — Designer-facing report rendering + export.
   ========================================================================== */

let __lastReport = null;

function scaleBar(axisLabel0, axisLabel1, score) {
  return `
    <div class="scale">
      <div class="scale-labels"><span>${axisLabel0}</span><span>${axisLabel1}</span></div>
      <div class="scale-track"><div class="scale-marker" style="left:${score}%"></div></div>
    </div>`;
}

function lifestyleFacts(lifestyle) {
  const lines = [];
  LIFESTYLE_QUESTIONS.forEach((q) => {
    const ans = lifestyle[q.id];
    if (!ans) return;
    if (q.type === "multi") {
      ans.forEach((v) => { if (LIFESTYLE_LABELS[q.id] && LIFESTYLE_LABELS[q.id][v]) lines.push(LIFESTYLE_LABELS[q.id][v]); });
    } else if (LIFESTYLE_LABELS[q.id] && LIFESTYLE_LABELS[q.id][ans]) {
      lines.push(LIFESTYLE_LABELS[q.id][ans]);
    }
  });
  return lines;
}

function sensoryFacts(sensory) {
  const lines = [];
  SENSORY_QUESTIONS.forEach((q) => {
    const ans = sensory[q.id];
    if (ans && SENSORY_GUIDANCE[q.id] && SENSORY_GUIDANCE[q.id][ans]) lines.push(SENSORY_GUIDANCE[q.id][ans]);
  });
  return lines;
}

function valuesRanked(values) {
  return values.map((id) => VALUES_LIST.find((v) => v.id === id)).filter(Boolean);
}

function tplReport() {
  const report = buildReport(state.answers);
  __lastReport = report;
  const c = report.client;
  const dateStr = new Date(report.generatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return `
  <section class="report">
    <div class="report-header">
      ${brandMark()}
      <p class="eyebrow">Discovery Report</p>
      <h1>${escapeHtml(c.name || "Your client")}</h1>
      <p class="report-meta">${escapeHtml(c.project || "")}${c.project && c.timeline ? " · " : ""}${escapeHtml(c.timeline || "")} · ${dateStr}</p>
    </div>

    <div class="report-block signature-block">
      <p class="eyebrow">Style Signature</p>
      <h2>${report.signature.headline}</h2>
      <p class="signature-para">${report.signature.paragraph}</p>
    </div>

    <div class="report-block">
      <p class="eyebrow">Style Scales</p>
      ${scaleBar(AXES.A.pole0, AXES.A.pole1, report.scores.A)}
      ${scaleBar(AXES.B.pole0, AXES.B.pole1, report.scores.B)}
      ${scaleBar(AXES.C.pole0, AXES.C.pole1, report.scores.C)}
      ${scaleBar(AXES.D.pole0, AXES.D.pole1, report.scores.D)}
      ${scaleBar(AXES.warmth.pole0, AXES.warmth.pole1, report.scores.warmth)}
    </div>

    <div class="report-block">
      <p class="eyebrow">Design Personality</p>
      ${["openness", "conscientiousness", "extraversion"].map((t) => `
        <div class="trait">
          <div class="trait-head"><strong>${t[0].toUpperCase() + t.slice(1)}</strong><span>${report.personality[t]}%</span></div>
          <div class="scale-track"><div class="scale-marker" style="left:${report.personality[t]}%"></div></div>
          <p class="trait-copy">${PERSONALITY_COPY[t][tier(report.personality[t])]}</p>
        </div>`).join("")}
    </div>

    <div class="report-block">
      <p class="eyebrow">Sensory Profile</p>
      <ul class="fact-list">${sensoryFacts(report.sensory).map((l) => `<li>${l}</li>`).join("")}</ul>
    </div>

    <div class="report-block">
      <p class="eyebrow">Top Values, in priority order</p>
      <ol class="values-ranked">${valuesRanked(report.values).map((v) => `<li><strong>${v.label}</strong> — ${v.detail}</li>`).join("")}</ol>
    </div>

    <div class="report-block">
      <p class="eyebrow">Lifestyle &amp; Practical Needs</p>
      <ul class="fact-list">${lifestyleFacts(report.lifestyle).map((l) => `<li>${l}</li>`).join("")}</ul>
    </div>

    <div class="report-block">
      <p class="eyebrow">Consultation Discussion Points</p>
      ${report.flags.length ? report.flags.map((f) => `
        <div class="flag-card">
          <h4>${f.title}</h4>
          <p>${f.insight}</p>
          <p class="flag-question">Ask: “${f.question}”</p>
        </div>`).join("") : `<p class="fact-list-empty">No major tensions detected — this client's stated preferences are unusually well-aligned. Use the opening questions below to go deeper.</p>`}
    </div>

    <div class="report-block">
      <p class="eyebrow">Suggested Opening Questions</p>
      <ul class="fact-list">${report.openingQuestions.map((q) => `<li>${q}</li>`).join("")}</ul>
    </div>

    <div class="report-actions">
      <button class="btn btn-primary" id="email-btn">Email report to ${STUDIO.name}</button>
      <button class="btn btn-secondary" id="copy-btn">Copy full report</button>
      <button class="btn btn-secondary" id="print-btn">Print / Save as PDF</button>
      <button class="btn btn-ghost" id="restart-btn">Start over</button>
    </div>
    <p class="report-footnote" id="copy-confirm" hidden>Copied to clipboard.</p>
  </section>`;
}

function reportPlainText(report) {
  const c = report.client;
  const lines = [];
  lines.push(`${STUDIO.name} — Discovery Report`);
  lines.push(`Client: ${c.name || ""}  <${c.email || ""}>`);
  lines.push(`Project: ${c.project || "—"}    Timeline: ${c.timeline || "—"}`);
  lines.push(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push("");
  lines.push(`STYLE SIGNATURE: ${report.signature.headline}`);
  lines.push(report.signature.paragraph);
  lines.push("");
  lines.push("STYLE SCALES (0-100, second pole = 100)");
  lines.push(`${AXES.A.pole0} <-> ${AXES.A.pole1}: ${report.scores.A}`);
  lines.push(`${AXES.B.pole0} <-> ${AXES.B.pole1}: ${report.scores.B}`);
  lines.push(`${AXES.C.pole0} <-> ${AXES.C.pole1}: ${report.scores.C}`);
  lines.push(`${AXES.D.pole0} <-> ${AXES.D.pole1}: ${report.scores.D}`);
  lines.push(`${AXES.warmth.pole0} <-> ${AXES.warmth.pole1}: ${report.scores.warmth}`);
  lines.push("");
  lines.push("DESIGN PERSONALITY");
  ["openness", "conscientiousness", "extraversion"].forEach((t) => {
    lines.push(`${t} (${report.personality[t]}%): ${PERSONALITY_COPY[t][tier(report.personality[t])]}`);
  });
  lines.push("");
  lines.push("SENSORY PROFILE");
  sensoryFacts(report.sensory).forEach((l) => lines.push(`- ${l}`));
  lines.push("");
  lines.push("TOP VALUES (priority order)");
  valuesRanked(report.values).forEach((v, i) => lines.push(`${i + 1}. ${v.label} — ${v.detail}`));
  lines.push("");
  lines.push("LIFESTYLE & PRACTICAL NEEDS");
  lifestyleFacts(report.lifestyle).forEach((l) => lines.push(`- ${l}`));
  lines.push("");
  lines.push("CONSULTATION DISCUSSION POINTS");
  if (report.flags.length) {
    report.flags.forEach((f) => {
      lines.push(`- ${f.title}: ${f.insight}`);
      lines.push(`  Ask: "${f.question}"`);
    });
  } else {
    lines.push("- No major tensions detected.");
  }
  lines.push("");
  lines.push("SUGGESTED OPENING QUESTIONS");
  report.openingQuestions.forEach((q) => lines.push(`- ${q}`));
  return lines.join("\n");
}

function wireReport(node) {
  const report = __lastReport;

  node.querySelector("#email-btn").addEventListener("click", () => {
    const subject = `Discovery Quiz Results — ${report.client.name || "New client"}`;
    const summary = [
      `Style Signature: ${report.signature.headline}`,
      report.signature.paragraph,
      "",
      `Scales — Minimal/Collected: ${report.scores.A} | Organic/Polished: ${report.scores.B} | Traditional/Contemporary: ${report.scores.C} | Light/Enveloping: ${report.scores.D} | Warm/Cool: ${report.scores.warmth}`,
      "",
      `Top values: ${valuesRanked(report.values).map((v) => v.label).join(", ")}`,
      "",
      report.flags.length ? "Key discussion points:" : "",
      ...report.flags.map((f) => `- ${f.title}: ${f.question}`),
      "",
      `Client: ${report.client.name} <${report.client.email}> · ${report.client.project || ""} · ${report.client.timeline || ""}`,
      "",
      "(Full report copied separately / see printed PDF for complete detail.)",
    ].join("\n");
    const url = `mailto:${encodeURIComponent(STUDIO.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
    window.location.href = url;
  });

  node.querySelector("#copy-btn").addEventListener("click", async () => {
    const text = reportPlainText(report);
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    const confirm = node.querySelector("#copy-confirm");
    confirm.hidden = false;
    setTimeout(() => (confirm.hidden = true), 2500);
  });

  node.querySelector("#print-btn").addEventListener("click", () => window.print());

  node.querySelector("#restart-btn").addEventListener("click", () => {
    if (!confirm("Start a new quiz? This will clear the current answers.")) return;
    state.stepIndex = 0;
    state.answers = { client: {}, visual: {}, lifestyle: {}, personality: {}, sensory: {}, values: [] };
    render();
  });
}
