// ---- Data ----

const goalGroups = [
  { name: "Launch business", tasks: [
    { title: "Write project outline", done: false },
    { title: "Research competitors", done: true },
  ]},
  { name: "Get fit", tasks: [
    { title: "Morning run", done: true },
    { title: "Meal prep dinner", done: false },
  ]},
  { name: "Read more", tasks: [
    { title: "Read 20 pages", done: false },
  ]},
];

const weekDays = [
  { letter: "Sun", num: 5, state: "completed" },
  { letter: "Mon", num: 6, state: "completed" },
  { letter: "Tue", num: 7, state: "completed" },
  { letter: "Wed", num: 8, state: "completed" },
  { letter: "Thu", num: 9, state: "today" },
  { letter: "Fri", num: 10, state: "future" },
  { letter: "Sat", num: 11, state: "future" },
];

const goalIcons = ["target", "book", "run", "dollar", "heart", "brain", "palette", "house"];

const leaderboard = [
  { rank: 1, name: "Alex", xp: 1250 },
  { rank: 2, name: "Jordan", xp: 1080 },
  { rank: 3, name: "Sam", xp: 940 },
  { rank: 4, name: "You", xp: 820, isYou: true },
  { rank: 5, name: "Riley", xp: 760 },
  { rank: 6, name: "Morgan", xp: 690 },
];

const badges = [
  { name: "First step", icon: "flag", unlocked: true },
  { name: "7 day streak", icon: "flame", unlocked: true },
  { name: "Goal getter", icon: "target", unlocked: true, isNew: true },
  { name: "Early riser", icon: "sun", unlocked: false },
  { name: "Night owl", icon: "moon", unlocked: false },
  { name: "30 day streak", icon: "trophy", unlocked: false },
  { name: "Comeback", icon: "refresh", unlocked: false },
  { name: "Level 10", icon: "medal", unlocked: false },
];

const appLimits = ["Instagram · 30 min/day", "Instagram · 45 min/day", "Instagram · 60 min/day"];
let appLimitIndex = 1;

// ---- Icon hydration ----

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach(el => {
    const name = el.dataset.icon;
    const size = el.dataset.size ? Number(el.dataset.size) : 20;
    el.innerHTML = icon(name, size);
  });
}

// ---- Tabs ----

function switchTab(tab) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${tab}`).classList.add("active");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  const tabBtn = document.querySelector(`.tab[data-tab="${tab}"]`);
  if (tabBtn) tabBtn.classList.add("active");

  document.getElementById("fab-add").style.display = tab === "tasks" ? "flex" : "none";
}

document.querySelectorAll("[data-tab]").forEach(el => {
  el.addEventListener("click", () => switchTab(el.dataset.tab));
});

// ---- Today screen ----

function renderDayStrip() {
  const strip = document.getElementById("day-strip");
  strip.innerHTML = "";
  weekDays.forEach(day => {
    const cell = document.createElement("div");
    cell.className = `day-cell ${day.state}`;
    cell.innerHTML = `
      <span class="letter">${day.letter}</span>
      <span class="num">${day.num}</span>
      <span class="dot"></span>
    `;
    strip.appendChild(cell);
  });
}

function updateRing() {
  const allTasks = goalGroups.flatMap(g => g.tasks);
  const done = allTasks.filter(t => t.done).length;
  const total = allTasks.length;
  const circumference = 490;
  const progress = total === 0 ? 0 : done / total;
  document.getElementById("ring-progress").style.strokeDashoffset = circumference * (1 - progress);
  document.getElementById("ring-count").textContent = `${done}/${total}`;
  document.getElementById("tasks-subtitle").textContent = `Today · ${done} of ${total} done`;
}

document.getElementById("today-date").textContent = "July 9, 2026";

// ---- Tasks screen ----

function renderTasks() {
  const container = document.getElementById("goal-groups");
  container.innerHTML = "";
  goalGroups.forEach((group, gi) => {
    const groupEl = document.createElement("div");
    groupEl.className = "goal-group";
    const rows = group.tasks.map((task, ti) => `
      <div class="task-row ${task.done ? "done" : ""}" data-gi="${gi}" data-ti="${ti}">
        <span class="checkbox">${task.done ? icon("check", 12) : ""}</span>
        <span class="task-title">${task.title}</span>
      </div>
    `).join("");
    groupEl.innerHTML = `
      <div class="group-name">${group.name}</div>
      <div class="group-card">${rows}</div>
    `;
    container.appendChild(groupEl);
  });

  container.querySelectorAll(".task-row").forEach(row => {
    row.addEventListener("click", () => {
      const gi = Number(row.dataset.gi);
      const ti = Number(row.dataset.ti);
      goalGroups[gi].tasks[ti].done = !goalGroups[gi].tasks[ti].done;
      renderTasks();
      updateRing();
    });
  });
}

// ---- Profile / Leaderboard ----

function renderLeaderboard() {
  const top3 = leaderboard.filter(p => p.rank <= 3);
  const rest = leaderboard.filter(p => p.rank > 3);

  const podiumOrder = [top3[1], top3[0], top3[2]]; // silver, gold, bronze — center-tallest layout
  const heights = { 1: 92, 2: 64, 3: 48 };
  const medalIcon = { 1: "trophy", 2: "medal", 3: "medal" };

  const podium = document.getElementById("podium");
  podium.innerHTML = podiumOrder.map(p => `
    <div class="podium-col">
      <div class="podium-avatar rank-${p.rank}">${p.name[0]}</div>
      <div class="podium-name">${p.name}</div>
      <div class="podium-xp">${p.xp.toLocaleString()} xp</div>
      <div class="podium-block rank-${p.rank}" style="height:${heights[p.rank]}px;">
        <span class="podium-icon">${icon(medalIcon[p.rank], 16)}</span>
        <span class="podium-rank">${p.rank}</span>
      </div>
    </div>
  `).join("");

  const list = document.getElementById("leaderboard-list");
  list.innerHTML = rest.map(p => `
    <div class="leaderboard-row ${p.isYou ? "you" : ""}">
      <span class="lb-rank">${p.rank}</span>
      <div class="lb-avatar">${p.name[0]}</div>
      <span class="lb-name">${p.name}</span>
      <span class="lb-xp">${p.xp.toLocaleString()} xp</span>
    </div>
  `).join("");
}

// ---- Goal creation sheet ----

const goalSheet = document.getElementById("goal-sheet");
let goalStep = 0;
let goalDraft = { name: "", icon: goalIcons[0], why: "", freq: "Daily" };

function renderIconGrid() {
  const grid = document.getElementById("icon-grid");
  grid.innerHTML = "";
  goalIcons.forEach(iconName => {
    const btn = document.createElement("button");
    btn.className = `icon-choice ${iconName === goalDraft.icon ? "selected" : ""}`;
    btn.innerHTML = icon(iconName, 18);
    btn.addEventListener("click", () => {
      goalDraft.icon = iconName;
      renderIconGrid();
    });
    grid.appendChild(btn);
  });
}

function renderFreqRow() {
  const row = document.getElementById("freq-row");
  row.innerHTML = "";
  ["Daily", "Few times a week", "Weekly"].forEach(freq => {
    const btn = document.createElement("button");
    btn.className = `freq-chip ${freq === goalDraft.freq ? "selected" : ""}`;
    btn.textContent = freq;
    btn.addEventListener("click", () => {
      goalDraft.freq = freq;
      renderFreqRow();
    });
    row.appendChild(btn);
  });
}

function updateStepDots() {
  document.querySelectorAll(".step-dots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === goalStep);
  });
}

function updateCta() {
  const cta = document.getElementById("goal-cta");
  cta.textContent = goalStep === 2 ? "Create goal" : "Continue";
  const canContinue = goalStep === 0 ? goalDraft.name.trim().length > 0
    : goalStep === 1 ? goalDraft.why.trim().length > 0
    : true;
  cta.disabled = !canContinue;
}

function showGoalStep(step) {
  goalStep = step;
  [0, 1, 2].forEach(i => {
    document.getElementById(`goal-step-${i}`).style.display = i === step ? "block" : "none";
  });
  updateStepDots();
  updateCta();

  if (step === 1) {
    document.getElementById("why-recap").innerHTML = `${icon(goalDraft.icon, 14)}<span>${goalDraft.name}</span>`;
  }
  if (step === 2) {
    document.getElementById("review-icon").innerHTML = icon(goalDraft.icon, 16);
    document.getElementById("review-name").textContent = goalDraft.name;
    document.getElementById("review-why").textContent = goalDraft.why;
  }
}

document.getElementById("qa-goals").addEventListener("click", () => {
  goalDraft = { name: "", icon: goalIcons[0], why: "", freq: "Daily" };
  document.getElementById("goal-name").value = "";
  document.getElementById("goal-why").value = "";
  renderIconGrid();
  renderFreqRow();
  showGoalStep(0);
  goalSheet.classList.add("open");
});

document.getElementById("goal-back").addEventListener("click", () => {
  if (goalStep === 0) {
    goalSheet.classList.remove("open");
  } else {
    showGoalStep(goalStep - 1);
  }
});

document.getElementById("goal-name").addEventListener("input", (e) => {
  goalDraft.name = e.target.value;
  updateCta();
});

document.getElementById("goal-why").addEventListener("input", (e) => {
  goalDraft.why = e.target.value;
  updateCta();
});

document.getElementById("goal-cta").addEventListener("click", () => {
  if (goalStep < 2) {
    showGoalStep(goalStep + 1);
  } else {
    // "Create goal" — no data layer yet, matches the real app's current state.
    goalSheet.classList.remove("open");
  }
});

// ---- Settings ----

const themes = [
  { name: "Amber", color: "#E2A146", locked: false },
  { name: "Slate", locked: true },
  { name: "Sage", locked: true },
];
let selectedTheme = "Amber";

function renderThemeSwatches() {
  const el = document.getElementById("theme-swatches");
  el.innerHTML = themes.map(t => {
    if (t.locked) {
      return `<div class="theme-swatch locked">${icon("lock", 11)}</div>`;
    }
    return `<div class="theme-swatch ${t.name === selectedTheme ? "selected" : ""}" style="background:${t.color}" data-theme="${t.name}"></div>`;
  }).join("");

  el.querySelectorAll(".theme-swatch[data-theme]").forEach(swatch => {
    swatch.addEventListener("click", () => {
      selectedTheme = swatch.dataset.theme;
      renderThemeSwatches();
    });
  });
}

const appearanceModes = ["System", "Light", "Dark"];
let selectedAppearance = "Dark";

function renderAppearanceSegmented() {
  const el = document.getElementById("appearance-segmented");
  el.innerHTML = appearanceModes.map(mode => `
    <div class="seg-btn ${mode === selectedAppearance ? "selected" : ""}" data-mode="${mode}">${mode}</div>
  `).join("");

  el.querySelectorAll(".seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedAppearance = btn.dataset.mode;
      renderAppearanceSegmented();
    });
  });
}

document.getElementById("toggle-checkins").addEventListener("click", (e) => {
  e.target.classList.toggle("on");
});

document.getElementById("app-limit-row").addEventListener("click", () => {
  appLimitIndex = (appLimitIndex + 1) % appLimits.length;
  document.getElementById("app-limit-value").textContent = appLimits[appLimitIndex];
});

// ---- Level / Awards ----

function renderBadgeGrid() {
  const grid = document.getElementById("badge-grid");
  grid.innerHTML = badges.map(b => `
    <div class="badge-item ${b.unlocked ? "" : "locked"}">
      ${b.isNew ? '<span class="badge-new-tag">new</span>' : ""}
      <div class="badge-circle ${b.unlocked ? "unlocked" : "locked"}">${icon(b.icon, b.unlocked ? 22 : 20)}</div>
      <span class="badge-label">${b.name}</span>
    </div>
  `).join("");
}

// ---- Streak ----

function renderStreakStrip() {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date(2026, 6, 9); // July 9, 2026 — matches the rest of the prototype's "today"
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const state = i === 0 ? "today" : i <= 11 ? "completed" : "missed";
    days.push({ letter: labels[d.getDay()], num: d.getDate(), state });
  }

  const strip = document.getElementById("streak-strip");
  strip.innerHTML = days.map(day => `
    <div class="day-cell ${day.state}">
      <span class="letter">${day.letter}</span>
      <span class="num">${day.num}</span>
      <span class="dot"></span>
    </div>
  `).join("");
}

// ---- FAB: add task ----

document.getElementById("fab-add").addEventListener("click", () => {
  const lastGroup = goalGroups[goalGroups.length - 1];
  lastGroup.tasks.push({ title: "New task", done: false });
  renderTasks();
  updateRing();
});

// ---- Init ----

hydrateIcons();
renderDayStrip();
renderTasks();
updateRing();
renderLeaderboard();
renderThemeSwatches();
renderAppearanceSegmented();
renderBadgeGrid();
renderStreakStrip();
