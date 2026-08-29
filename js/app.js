/* ==========================================================================
   Earth's Home — App shell: state, navigation, rendering.
   ========================================================================== */

const state = {
  stepIndex: 0,
  flow: [],
  answers: { client: {}, visual: {}, lifestyle: {}, personality: {}, sensory: {}, values: [] },
};

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function buildFlow() {
  const flow = [{ type: "welcome" }, { type: "client" }];
  VISUAL_PAIRS.forEach((p) => flow.push({ type: "visual", data: p }));
  LIFESTYLE_QUESTIONS.forEach((q) => flow.push({ type: "lifestyle", data: q }));
  PERSONALITY_STATEMENTS.forEach((s) => flow.push({ type: "personality", data: s }));
  SENSORY_QUESTIONS.forEach((q) => flow.push({ type: "sensory", data: q }));
  flow.push({ type: "values" });
  flow.push({ type: "report" });

  // One continuous question count across the whole quiz — no visible "chapters".
  const questionTypes = ["visual", "lifestyle", "personality", "sensory", "values"];
  const qTotal = flow.filter((s) => questionTypes.includes(s.type)).length;
  let qCounter = 0;
  flow.forEach((s) => {
    if (questionTypes.includes(s.type)) {
      qCounter++;
      s.qNum = qCounter;
      s.qTotal = qTotal;
    }
  });
  return flow;
}

function goNext() {
  if (state.stepIndex < state.flow.length - 1) {
    state.stepIndex++;
    render();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }
}
function goBack() {
  if (state.stepIndex > 0) {
    state.stepIndex--;
    render();
    window.scrollTo(0, 0);
  }
}

function render() {
  const step = state.flow[state.stepIndex];
  const main = document.getElementById("app-main");
  main.innerHTML = "";
  const chrome = document.getElementById("app-chrome");

  if (step.type === "welcome" || step.type === "report") {
    chrome.classList.add("hidden");
  } else {
    chrome.classList.remove("hidden");
    renderChrome(step);
  }

  const node = document.createElement("div");
  node.className = "screen";
  switch (step.type) {
    case "welcome": node.innerHTML = tplWelcome(); break;
    case "client": node.innerHTML = tplClient(); break;
    case "visual": node.innerHTML = tplVisual(step); break;
    case "lifestyle": node.innerHTML = tplChoice(step, "lifestyle"); break;
    case "personality": node.innerHTML = tplPersonality(step); break;
    case "sensory": node.innerHTML = tplChoice(step, "sensory"); break;
    case "values": node.innerHTML = tplValues(step); break;
    case "report": node.innerHTML = tplReport(); break;
  }
  main.appendChild(node);
  wireStep(step, node);
}

function renderChrome(step) {
  const pct = Math.round((state.stepIndex / (state.flow.length - 2)) * 100);
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-label").textContent = step.qNum ? `Question ${step.qNum} of ${step.qTotal}` : "Getting started";
  document.getElementById("back-btn").style.visibility = state.stepIndex > 1 ? "visible" : "hidden";
}

/* ---------- Templates ---------- */

function tplWelcome() {
  return `
  <section class="hero">
    <div class="hero-mark">${brandMark()}</div>
    <p class="eyebrow">Interior Design Discovery</p>
    <h1>Let's understand how you actually want to live.</h1>
    <p class="lede">One flowing quiz, answered instinctively — a little about how you see, how you live day to day,
      what draws you in, how you sense a room, and what matters most to you. No design vocabulary required, no
      separate tests. Just answer quickly, with your gut, start to finish.</p>
    <p class="hero-scope">your eye · your everyday life · what draws you in · your senses · what you value</p>
    <div class="hero-meta">
      <div class="meta-pill">⏱ About 15 minutes</div>
      <div class="meta-pill">One continuous flow</div>
      <div class="meta-pill">Private &amp; only shared with your designer</div>
    </div>
    <button class="btn btn-primary btn-lg" id="start-btn">Begin the discovery quiz</button>
  </section>`;
}

function brandMark() {
  // Placeholder text lockup matching the real wordmark's tracked-caps treatment,
  // until the actual logo file (with the hand-lettered monogram) is available.
  return `<p class="brand-word">${escapeHtml(STUDIO.name)}</p>`;
}

function tplClient() {
  const c = state.answers.client;
  return `
  <section class="panel">
    <p class="eyebrow">Before we begin</p>
    <h2>A little about you</h2>
    <p class="sub">So your designer can personalize your consultation from the very first message.</p>
    <div class="field">
      <label>Your name</label>
      <input type="text" id="f-name" value="${escapeHtml(c.name || "")}" placeholder="Jordan Ellis" autocomplete="name">
    </div>
    <div class="field">
      <label>Email</label>
      <input type="email" id="f-email" value="${escapeHtml(c.email || "")}" placeholder="you@email.com" autocomplete="email">
    </div>
    <div class="field">
      <label>What are we designing?</label>
      <select id="f-project">
        <option value="">Select one…</option>
        ${["Full home", "Single room", "Renovation", "New build", "Not sure yet"].map((o) => `<option ${c.project === o ? "selected" : ""}>${o}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label>Timeline</label>
      <select id="f-timeline">
        <option value="">Select one…</option>
        ${["Ready now", "3–6 months", "6–12 months", "Just exploring"].map((o) => `<option ${c.timeline === o ? "selected" : ""}>${o}</option>`).join("")}
      </select>
    </div>
    <button class="btn btn-primary" id="client-continue" disabled>Continue</button>
  </section>`;
}

function tplVisual(step) {
  const p = step.data;
  return `
  <section class="panel panel-wide">
    <h2>${p.prompt}</h2>
    <p class="sub">Go with your gut — there's no wrong answer.</p>
    <div class="pair-grid">
      <button class="swatch-card" data-side="a" data-value="${p.a.value}">
        ${svgSwatch(p.a.swatch)}
        <span class="swatch-label">${p.a.label}</span>
      </button>
      <button class="swatch-card" data-side="b" data-value="${p.b.value}">
        ${svgSwatch(p.b.swatch)}
        <span class="swatch-label">${p.b.label}</span>
      </button>
    </div>
  </section>`;
}

function tplChoice(step, group) {
  const q = step.data;
  const stored = state.answers[group][q.id];
  const isMulti = q.type === "multi";
  const selected = isMulti ? (stored || []) : stored;
  return `
  <section class="panel">
    <h2>${q.text}</h2>
    ${isMulti ? '<p class="sub">Select all that apply.</p>' : ""}
    <div class="option-list" data-multi="${isMulti}">
      ${q.options.map((o) => `
        <button class="option-btn ${isMulti ? (selected.includes(o.value) ? "selected" : "") : (selected === o.value ? "selected" : "")}" data-value="${o.value}">
          <span class="option-check"></span>
          <span>${o.label}</span>
        </button>`).join("")}
    </div>
    ${isMulti ? `<button class="btn btn-primary" id="choice-continue" ${selected.length ? "" : "disabled"}>Continue</button>` : ""}
  </section>`;
}

function tplPersonality(step) {
  const s = step.data;
  const stored = state.answers.personality[s.id];
  return `
  <section class="panel">
    <h2>“${s.text}”</h2>
    <div class="scale-row">
      ${PERSONALITY_SCALE.map((opt) => `
        <button class="scale-btn ${stored === opt.value ? "selected" : ""}" data-value="${opt.value}">
          <span class="scale-dot"></span>
          <span>${opt.label}</span>
        </button>`).join("")}
    </div>
  </section>`;
}

function tplValues(step) {
  const selected = state.answers.values;
  return `
  <section class="panel panel-wide">
    <h2>What matters most to you at home?</h2>
    <p class="sub">Tap up to ${VALUES_MAX_SELECT}, in the order they come to mind. The order matters — first tap ranks highest.</p>
    <div class="values-grid">
      ${VALUES_LIST.map((v) => {
        const rank = selected.indexOf(v.id);
        return `<button class="value-card ${rank > -1 ? "selected" : ""}" data-id="${v.id}">
          ${rank > -1 ? `<span class="value-rank">${rank + 1}</span>` : ""}
          <h4>${v.label}</h4>
          <p>${v.detail}</p>
        </button>`;
      }).join("")}
    </div>
    <button class="btn btn-primary" id="values-continue" ${selected.length >= 3 ? "" : "disabled"}>See my results</button>
    <p class="hint">${selected.length}/${VALUES_MAX_SELECT} selected (minimum 3)</p>
  </section>`;
}

/* ---------- Wiring ---------- */

function wireStep(step, node) {
  if (step.type === "welcome") {
    node.querySelector("#start-btn").addEventListener("click", goNext);
  }

  if (step.type === "client") {
    const nameEl = node.querySelector("#f-name");
    const emailEl = node.querySelector("#f-email");
    const projectEl = node.querySelector("#f-project");
    const timelineEl = node.querySelector("#f-timeline");
    const btn = node.querySelector("#client-continue");
    const validate = () => {
      const ok = nameEl.value.trim().length > 1 && /\S+@\S+\.\S+/.test(emailEl.value);
      btn.disabled = !ok;
    };
    [nameEl, emailEl].forEach((i) => i.addEventListener("input", validate));
    validate();
    btn.addEventListener("click", () => {
      state.answers.client = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        project: projectEl.value,
        timeline: timelineEl.value,
      };
      goNext();
    });
  }

  if (step.type === "visual") {
    node.querySelectorAll(".swatch-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        node.querySelectorAll(".swatch-card").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.answers.visual[step.data.id] = Number(btn.dataset.value);
        setTimeout(goNext, 320);
      });
    });
  }

  if (step.type === "lifestyle" || step.type === "sensory") {
    const group = step.type;
    const q = step.data;
    const isMulti = q.type === "multi";
    const list = node.querySelector(".option-list");
    list.querySelectorAll(".option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (isMulti) {
          const cur = state.answers[group][q.id] || [];
          const val = btn.dataset.value;
          const idx = cur.indexOf(val);
          if (idx > -1) cur.splice(idx, 1); else cur.push(val);
          state.answers[group][q.id] = cur;
          btn.classList.toggle("selected");
          const contBtn = node.querySelector("#choice-continue");
          if (contBtn) contBtn.disabled = cur.length === 0;
        } else {
          list.querySelectorAll(".option-btn").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          state.answers[group][q.id] = btn.dataset.value;
          setTimeout(goNext, 280);
        }
      });
    });
    const contBtn = node.querySelector("#choice-continue");
    if (contBtn) contBtn.addEventListener("click", goNext);
  }

  if (step.type === "personality") {
    node.querySelectorAll(".scale-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        node.querySelectorAll(".scale-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.answers.personality[step.data.id] = Number(btn.dataset.value);
        setTimeout(goNext, 280);
      });
    });
  }

  if (step.type === "values") {
    node.querySelectorAll(".value-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const cur = state.answers.values;
        const idx = cur.indexOf(id);
        if (idx > -1) {
          cur.splice(idx, 1);
        } else {
          if (cur.length >= VALUES_MAX_SELECT) return;
          cur.push(id);
        }
        render();
      });
    });
    const cont = node.querySelector("#values-continue");
    if (cont) cont.addEventListener("click", goNext);
  }

  if (step.type === "report") wireReport(node);
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  state.flow = buildFlow();
  document.getElementById("back-btn").addEventListener("click", goBack);
  render();
});
