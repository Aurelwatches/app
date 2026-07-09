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
  { name: "First step", icon: "flag", unlocked: true, earnedDate: "Jun 28, 2026", detail: "Complete your first task in the app." },
  { name: "7 day streak", icon: "flame", unlocked: true, earnedDate: "Jul 4, 2026", detail: "Keep your streak alive for 7 days in a row." },
  { name: "Goal getter", icon: "target", unlocked: true, isNew: true, earnedDate: "Jul 9, 2026", detail: "Create a goal and complete a task toward it." },
  { name: "Early riser", icon: "sun", unlocked: false, detail: "Complete a task before 8 AM, 5 times." },
  { name: "Night owl", icon: "moon", unlocked: false, detail: "Complete a task after 10 PM, 5 times." },
  { name: "30 day streak", icon: "trophy", unlocked: false, detail: "Keep your streak alive for 30 days in a row." },
  { name: "Comeback", icon: "refresh", unlocked: false, detail: "Use a streak freeze to save a streak that would've broken." },
  { name: "Level 10", icon: "medal", unlocked: false, detail: "Reach level 10 by earning xp from completed tasks." },
];

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

// ---- Generic modal ----

const modalOverlay = document.getElementById("modal-overlay");
const modalSheet = document.getElementById("modal-sheet");

function openModal(html) {
  modalSheet.innerHTML = html;
  hydrateIcons(modalSheet);
  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
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

// ---- Settings: notification pickers ----

const timeOptions = ["6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM"];
let selectedTime = "8:00 AM";

function openTimePicker() {
  openModal(`
    <div class="modal-title">Morning message time</div>
    <div class="modal-subtitle">When your daily task list gets sent.</div>
    <div>
      ${timeOptions.map(t => `
        <div class="modal-option" data-time="${t}">
          <span class="opt-label">${t}</span>
          ${t === selectedTime ? `<span class="opt-check">${icon("check", 16)}</span>` : ""}
        </div>
      `).join("")}
    </div>
  `);
  modalSheet.querySelectorAll("[data-time]").forEach(opt => {
    opt.addEventListener("click", () => {
      selectedTime = opt.dataset.time;
      document.getElementById("morning-time-value").textContent = selectedTime;
      closeModal();
    });
  });
}

const messageStyles = [
  { name: "Coach", unlocked: true, sub: "Encouraging, upbeat nudges" },
  { name: "Drill sergeant", unlocked: false, sub: "Unlocks at level 10" },
  { name: "Zen", unlocked: false, sub: "Unlocks at level 15" },
];
let selectedMessageStyle = "Coach";

function openMessageStylePicker() {
  openModal(`
    <div class="modal-title">Message style</div>
    <div class="modal-subtitle">How your coach talks to you.</div>
    <div>
      ${messageStyles.map(m => `
        <div class="modal-option ${m.unlocked ? "" : "locked"}" data-style="${m.name}" data-locked="${!m.unlocked}">
          <div>
            <div class="opt-label">${m.name}</div>
            <div class="opt-sub">${m.sub}</div>
          </div>
          ${m.unlocked ? (m.name === selectedMessageStyle ? `<span class="opt-check">${icon("check", 16)}</span>` : "") : icon("lock", 14)}
        </div>
      `).join("")}
    </div>
  `);
  modalSheet.querySelectorAll("[data-style]").forEach(opt => {
    opt.addEventListener("click", () => {
      if (opt.dataset.locked === "true") return;
      selectedMessageStyle = opt.dataset.style;
      document.getElementById("message-style-value").textContent = selectedMessageStyle;
      closeModal();
    });
  });
}

document.getElementById("row-morning-time").addEventListener("click", openTimePicker);
document.getElementById("row-message-style").addEventListener("click", openMessageStylePicker);

// ---- Settings ----

const themes = [
  { name: "Amber", color: "#E2A146", locked: false },
  { name: "Slate", color: "#7C8798", locked: true, unlocksAt: "Level 10" },
  { name: "Sage", color: "#8FA37E", locked: true, unlocksAt: "Level 15" },
];
let selectedTheme = "Amber";

function renderThemeSwatches() {
  const el = document.getElementById("theme-swatches");
  el.innerHTML = themes.map(t => {
    if (t.locked) {
      return `<div class="theme-swatch locked" data-locked-theme="${t.name}">${icon("lock", 11)}</div>`;
    }
    return `<div class="theme-swatch ${t.name === selectedTheme ? "selected" : ""}" style="background:${t.color}" data-theme="${t.name}"></div>`;
  }).join("");

  el.querySelectorAll(".theme-swatch[data-theme]").forEach(swatch => {
    swatch.addEventListener("click", () => {
      selectedTheme = swatch.dataset.theme;
      renderThemeSwatches();
    });
  });

  el.querySelectorAll("[data-locked-theme]").forEach(swatch => {
    swatch.addEventListener("click", () => {
      const t = themes.find(x => x.name === swatch.dataset.lockedTheme);
      openModal(`
        <div class="modal-badge-detail">
          <div class="badge-circle locked">${icon("lock", 26)}</div>
          <div class="modal-title">${t.name} theme</div>
          <div class="status-pill locked">Unlocks at ${t.unlocksAt}</div>
          <div class="modal-body">Keep completing tasks to level up and unlock new color themes.</div>
        </div>
      `);
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
      applyAppearance();
    });
  });
}

function applyAppearance() {
  const screen = document.querySelector(".screen");
  let useLight;
  if (selectedAppearance === "Light") useLight = true;
  else if (selectedAppearance === "Dark") useLight = false;
  else useLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  screen.classList.toggle("light-theme", useLight);
}

if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    if (selectedAppearance === "System") applyAppearance();
  });
}

document.getElementById("toggle-checkins").addEventListener("click", (e) => {
  e.target.classList.toggle("on");
});

// ---- App limits ----

const appLimits = [
  { name: "Instagram", options: ["Off", "30 min/day", "45 min/day", "60 min/day"], index: 2 },
  { name: "TikTok", options: ["Off", "20 min/day", "30 min/day", "45 min/day"], index: 0 },
  { name: "YouTube", options: ["Off", "30 min/day", "60 min/day", "90 min/day"], index: 0 },
  { name: "X", options: ["Off", "15 min/day", "30 min/day"], index: 0 },
];

function renderAppLimits() {
  const card = document.getElementById("app-limits-card");
  card.innerHTML = appLimits.map((app, i) => `
    <div class="settings-row cyclable" data-app-index="${i}">
      <span class="row-label">${app.name}</span>
      <span class="row-value">${app.options[app.index]}</span>
    </div>
  `).join("");

  card.querySelectorAll("[data-app-index]").forEach(row => {
    row.addEventListener("click", () => {
      const app = appLimits[Number(row.dataset.appIndex)];
      app.index = (app.index + 1) % app.options.length;
      renderAppLimits();
    });
  });
}

// ---- Level / Awards ----

function renderBadgeGrid() {
  const grid = document.getElementById("badge-grid");
  grid.innerHTML = badges.map((b, i) => `
    <div class="badge-item ${b.unlocked ? "" : "locked"}" data-badge-index="${i}">
      ${b.isNew ? '<span class="badge-new-tag">new</span>' : ""}
      <div class="badge-circle ${b.unlocked ? "unlocked" : "locked"}">${icon(b.icon, b.unlocked ? 22 : 20)}</div>
      <span class="badge-label">${b.name}</span>
    </div>
  `).join("");

  grid.querySelectorAll(".badge-item").forEach(item => {
    item.addEventListener("click", () => openBadgeDetail(badges[Number(item.dataset.badgeIndex)]));
  });
}

function openBadgeDetail(b) {
  openModal(`
    <div class="modal-badge-detail">
      <div class="badge-circle ${b.unlocked ? "unlocked" : "locked"}">${icon(b.icon, 30)}</div>
      <div class="modal-title">${b.name}</div>
      <div class="status-pill ${b.unlocked ? "earned" : "locked"}">${b.unlocked ? `Earned ${b.earnedDate}` : "Locked"}</div>
      <div class="modal-body">${b.detail}</div>
    </div>
  `);
}

// ---- Streak ----

const monthNames = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

function renderStreakStrip() {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date(2026, 6, 9); // July 9, 2026 — matches the rest of the prototype's "today"
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const state = i === 0 ? "today" : i <= 11 ? "completed" : "missed";
    const tasksDone = state === "missed" ? 0 : state === "today" ? 3 : 3 + (d.getDate() % 3);
    const tasksTotal = 5;
    const xp = state === "missed" ? 0 : tasksDone * 14 + 5;
    days.push({
      letter: labels[d.getDay()], num: d.getDate(), state,
      dateLabel: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      tasksDone, tasksTotal, xp,
    });
  }

  const strip = document.getElementById("streak-strip");
  strip.innerHTML = days.map((day, i) => `
    <div class="day-cell ${day.state}" data-day-index="${i}">
      <span class="letter">${day.letter}</span>
      <span class="num">${day.num}</span>
      <span class="dot"></span>
    </div>
  `).join("");

  strip.querySelectorAll(".day-cell").forEach(cell => {
    cell.addEventListener("click", () => openDayDetail(days[Number(cell.dataset.dayIndex)]));
  });
}

function openDayDetail(day) {
  const isMissed = day.state === "missed";
  openModal(`
    <div class="modal-title">${day.dateLabel}</div>
    <div class="modal-subtitle">${day.state === "today" ? "Today, in progress" : isMissed ? "No activity logged" : "Completed"}</div>
    ${isMissed ? `
      <p style="font-size:13px; color:var(--text-secondary); line-height:1.5;">This was before your current streak started — no tasks were completed that day.</p>
    ` : `
      <div class="day-detail-stats">
        <div class="stat-card" style="flex:1;">
          <div class="stat-label"><span class="icon-slot accent">${icon("checklist", 15)}</span>Tasks</div>
          <div class="stat-value">${day.tasksDone}/${day.tasksTotal}</div>
        </div>
        <div class="stat-card" style="flex:1;">
          <div class="stat-label"><span class="icon-slot accent">${icon("star", 15)}</span>XP earned</div>
          <div class="stat-value">+${day.xp}</div>
        </div>
      </div>
    `}
  `);
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
renderAppLimits();
applyAppearance();
