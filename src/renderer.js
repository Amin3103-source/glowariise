// renderer.js — GlowArise v1.1

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  de: {
    "nav.focus":"Focus","nav.todo":"To-Do","nav.block":"Block",
    "nav.shield":"Shield","nav.stats":"Stats","nav.settings":"Einstellungen",
    "focus.title":"Deep Work","focus.sub":"Wähle eine Dauer und starte deine Session.",
    "focus.sessionActive":"Session aktiv","focus.sessionSub":"Ablenkungen blockiert — bleib im Flow.",
    "focus.freigangActive":"Freigang aktiv","focus.freigangSub":"Genieße deine verdiente Pause.",
    "focus.stopSession":"Session beenden","focus.stopFreigang":"Freigang beenden",
    "focus.duration":"Dauer","focus.customMin":"min — eigene Dauer",
    "focus.willBlock":"Wird gesperrt","focus.noSites":"Noch keine Seiten — gehe zu Block",
    "focus.start":"✦ Session starten","focus.hint":"Dauer wählen & Seiten blockieren",
    "focus.blocked":"Gesperrte Seiten",
    "focus.quote":'"The ability to perform deep work is becoming increasingly rare and increasingly valuable."',
    "focus.browserWarn":"⚠ Schließe alle Tabs der gesperrten Seiten & lade den Browser neu (Cmd+Shift+R).",
    "streak.days":"Tage Streak","streak.month":"diesen Monat","streak.total":"Sessions gesamt",
    "todo.title":"To-Do","todo.sub":"Aufgaben erledigen → Freigang verdienen.",
    "todo.freigangLabel":"Freigang nach Fertigstellung",
    "todo.allDone":"🎉 Alle erledigt — Freigang verdient!",
    "todo.startFreigang":"Freigang starten","todo.empty":"Noch keine Aufgaben",
    "todo.placeholder":"Neue Aufgabe…","todo.clearDone":"Erledigte löschen",
    "block.title":"Blockliste","block.sub":"Diese Seiten werden während einer Session gesperrt.",
    "block.quick":"Schnell:","block.empty":"Noch keine Seiten hinzugefügt",
    "shield.title":"Shield","shield.sub":"Dauerhafter Schutz — unabhängig vom Timer.",
    "shield.name":"Adult-Content Sperre","shield.desc":"120+ Domains systemweit gesperrt.",
    "shield.inactive":"Inaktiv","shield.active":"Aktiv — Schutz läuft",
    "shield.howTitle":"Wie funktioniert es?",
    "shield.how":"Direkt über die Hosts-Datei — kein VPN. Wirkt in allen Browsern.",
    "shield.scopeTitle":"Was wird gesperrt?",
    "shield.scope":"Pornhub, OnlyFans, Chaturbate und 120+ weitere Domains.",
    "stats.title":"Dein Fortschritt","stats.sub":"Jede Minute zählt.",
    "stats.totalLabel":"Fokus-Minuten gesamt","stats.subLabel":"Minuten sinnvoll genutzt",
    "stats.totalSessions":"Sessions gesamt","stats.monthMin":"Minuten diesen Monat",
    "stats.todaySessions":"Sessions heute","stats.streakLabel":"Tage Streak",
    "stats.milestones":"Meilensteine","stats.reset":"Statistiken zurücksetzen",
    "settings.title":"Einstellungen","settings.sound":"Sound bei Session-Ende",
    "settings.soundDesc":"Ton wenn die Session abläuft.",
    "settings.theme":"Erscheinungsbild","settings.themeDesc":"Hell oder dunkel.",
    "settings.light":"Hell","settings.dark":"Dunkel",
    "settings.lang":"Sprache","settings.quit":"App beenden",
    "settings.quitDesc":"Fenster schließen lässt die App im Tray weiterlaufen.",
    "settings.quitBtn":"Beenden",
    "pro.sub":"Werde zur besten Version deiner selbst.",
    "pro.monthly":"Monatlich","pro.yearly":"Jährlich","pro.popular":"Beliebteste Wahl",
    "pro.note":"Zahlungsabwicklung kommt bald. Alle Features sind aktuell kostenlos verfügbar.",
    "pro.modalSub":"Dieses Feature ist exklusiv für Pro-Nutzer.",
    "pro.modalNote":"Zahlungsabwicklung kommt bald — alle Features sind aktuell kostenlos.",
  },
  en: {
    "nav.focus":"Focus","nav.todo":"To-Do","nav.block":"Block",
    "nav.shield":"Shield","nav.stats":"Stats","nav.settings":"Settings",
    "focus.title":"Deep Work","focus.sub":"Choose a duration and start your session.",
    "focus.sessionActive":"Session active","focus.sessionSub":"Distractions blocked — stay in the flow.",
    "focus.freigangActive":"Break active","focus.freigangSub":"Enjoy your earned break.",
    "focus.stopSession":"End session","focus.stopFreigang":"End break",
    "focus.duration":"Duration","focus.customMin":"min — custom duration",
    "focus.willBlock":"Will be blocked","focus.noSites":"No sites yet — go to Block",
    "focus.start":"✦ Start session","focus.hint":"Choose duration & add sites to block",
    "focus.blocked":"Blocked sites",
    "focus.quote":'"The ability to perform deep work is becoming increasingly rare and increasingly valuable."',
    "focus.browserWarn":"⚠ Close all tabs of blocked sites & reload your browser (Cmd+Shift+R).",
    "streak.days":"Day streak","streak.month":"this month","streak.total":"Total sessions",
    "todo.title":"To-Do","todo.sub":"Complete tasks → earn free time.",
    "todo.freigangLabel":"Break after completion",
    "todo.allDone":"🎉 All done — break earned!",
    "todo.startFreigang":"Start break","todo.empty":"No tasks yet",
    "todo.placeholder":"New task…","todo.clearDone":"Clear completed",
    "block.title":"Block list","block.sub":"These sites will be blocked during a session.",
    "block.quick":"Quick:","block.empty":"No sites added yet",
    "shield.title":"Shield","shield.sub":"Permanent protection — independent of the timer.",
    "shield.name":"Adult content block","shield.desc":"120+ domains blocked system-wide.",
    "shield.inactive":"Inactive","shield.active":"Active — protection running",
    "shield.howTitle":"How does it work?",
    "shield.how":"Via the hosts file — no VPN needed. Works in all browsers.",
    "shield.scopeTitle":"What gets blocked?",
    "shield.scope":"Pornhub, OnlyFans, Chaturbate and 120+ more domains.",
    "stats.title":"Your Progress","stats.sub":"Every minute counts.",
    "stats.totalLabel":"Total focus minutes","stats.subLabel":"Minutes well spent",
    "stats.totalSessions":"Total sessions","stats.monthMin":"Minutes this month",
    "stats.todaySessions":"Sessions today","stats.streakLabel":"Day streak",
    "stats.milestones":"Milestones","stats.reset":"Reset statistics",
    "settings.title":"Settings","settings.sound":"Sound on session end",
    "settings.soundDesc":"Plays a sound when the session expires.",
    "settings.theme":"Appearance","settings.themeDesc":"Light or dark.",
    "settings.light":"Light","settings.dark":"Dark",
    "settings.lang":"Language","settings.quit":"Quit app",
    "settings.quitDesc":"Closing the window keeps the app running in the tray.",
    "settings.quitBtn":"Quit",
    "pro.sub":"Become the best version of yourself.",
    "pro.monthly":"Monthly","pro.yearly":"Yearly","pro.popular":"Most popular",
    "pro.note":"Payment processing coming soon. All features are currently free.",
    "pro.modalSub":"This feature is exclusive to Pro users.",
    "pro.modalNote":"Payment processing coming soon — all features are currently free.",
  }
};

let lang = "de";
function t(key) { return T[lang]?.[key] || T.de[key] || key; }

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  // Update select options text
  const lightOpt = document.querySelector("#theme-select option[value='light']");
  const darkOpt  = document.querySelector("#theme-select option[value='dark']");
  if (lightOpt) lightOpt.textContent = t("settings.light");
  if (darkOpt)  darkOpt.textContent  = t("settings.dark");
  
  // Update focus hint
  updateStartBtn();

  // Update session/freigang labels if visible
  const sessionLabel = document.querySelector(".session-label");
  if (sessionLabel && document.getElementById("session-view") && !document.getElementById("session-view").classList.contains("hidden")) {
    sessionLabel.textContent = t("focus.sessionActive");
  }
}

// ─── Milestones ───────────────────────────────────────────────────────────────
const MILESTONES = [
  { minutes:60,   icon:"🌱", name:"Erster Schritt",   nameEn:"First Step",     desc:"1 Stunde fokussiert",         descEn:"1 hour focused" },
  { minutes:300,  icon:"⚡", name:"Momentum",         nameEn:"Momentum",        desc:"5 Stunden erreicht",          descEn:"5 hours reached" },
  { minutes:600,  icon:"🔥", name:"On Fire",          nameEn:"On Fire",         desc:"10 Stunden — du brennst!",    descEn:"10 hours — you're on fire!" },
  { minutes:1500, icon:"💎", name:"Deep Worker",      nameEn:"Deep Worker",     desc:"25 Stunden Fokus",            descEn:"25 hours of focus" },
  { minutes:3000, icon:"🏆", name:"Champion",         nameEn:"Champion",        desc:"50 Stunden — Elite-Level",    descEn:"50 hours — elite level" },
  { minutes:6000, icon:"👑", name:"GlowArise Master", nameEn:"GlowArise Master",desc:"100 Stunden Meisterschaft",   descEn:"100 hours mastery" },
  { minutes:60000,icon:"✦",  name:"Legendary",        nameEn:"Legendary",       desc:"1.000 Stunden — Legende",     descEn:"1,000 hours — legend" },
];

// ─── State ────────────────────────────────────────────────────────────────────
let S = {};
let selectedMin = 0;
let sessionIv = null;
let freigangIv = null;
let sessionStartedAt = null; // track actual start time

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  S = await window.api.getData();
  S.todos     = S.todos     || [];
  S.blocklist = S.blocklist || [];
  S.stats     = S.stats     || { totalSessions:0, totalMinutes:0, todaySessions:0,
                                  todayMinutes:0, lastDate:"", streak:0,
                                  lastSessionDate:"", monthMinutes:0, lastMonth:"" };
  S.prefs     = S.prefs     || { sound:true, theme:"dark", lang:"de" };

  lang = S.prefs.lang || "de";
  applyTheme(S.prefs.theme || "dark");
  applyI18n();

  document.getElementById("theme-select").value = S.prefs.theme || "dark";
  document.getElementById("lang-select").value  = lang;
  document.getElementById("sound-toggle").checked = S.prefs.sound !== false;

  const ok = await window.api.checkWritable();
  // Only show admin warn if truly not writable even with elevation
  // The app now uses osascript to elevate, so this should rarely show
  document.getElementById("admin-warn").classList.toggle("hidden", true);

  renderBlocklist(); renderFocusPreview(); renderTodos();
  renderShield(); renderProgress(); updateStreakBanner();

  if (S.session?.active && S.session.endTime > Date.now()) {
    sessionStartedAt = S.session.startedAt || Date.now();
    showSessionView(S.session);
  }
  if (S.freigang?.active && S.freigang.endTime > Date.now()) showFreigangView(S.freigang);

  window.api.onSessionEnded(() => { playDone(); recordSession(); endSessionUI(); });
  window.api.onFreigangEnded(() => endFreigangUI());
}

// ─── Theme ────────────────────────────────────────────────────────────────────
function applyTheme(th) {
  document.documentElement.setAttribute("data-theme", th);
  const sun  = document.getElementById("icon-sun");
  const moon = document.getElementById("icon-moon");
  if (sun)  sun.style.display  = th === "dark"  ? "block" : "none";
  if (moon) moon.style.display = th === "light" ? "block" : "none";
}

document.getElementById("theme-toggle")?.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next); S.prefs.theme = next;
  document.getElementById("theme-select").value = next;
  window.api.saveData(S);
});

document.getElementById("theme-select").addEventListener("change", function() {
  applyTheme(this.value); S.prefs.theme = this.value; window.api.saveData(S);
});

// ─── Language ─────────────────────────────────────────────────────────────────
document.getElementById("lang-select").addEventListener("change", function() {
  lang = this.value;
  S.prefs.lang = lang;
  window.api.saveData(S);
  applyI18n();
  // Re-render dynamic content
  renderBlocklist(); renderFocusPreview(); renderTodos();
  renderShield(); renderProgress(); updateStreakBanner();
});

// ─── Navigation ───────────────────────────────────────────────────────────────
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

// ─── Paywall ──────────────────────────────────────────────────────────────────
function showPaywall() {
  document.getElementById("pro-modal").classList.remove("hidden");
}
document.getElementById("modal-close")?.addEventListener("click", () => {
  document.getElementById("pro-modal").classList.add("hidden");
});
document.getElementById("pro-modal")?.addEventListener("click", function(e) {
  if (e.target === this) this.classList.add("hidden");
});
document.getElementById("btn-upgrade-top")?.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelector("[data-tab='pro']")?.classList.add("active");
  document.getElementById("tab-pro")?.classList.add("active");
});
document.getElementById("btn-buy-monthly")?.addEventListener("click", showPaywall);
document.getElementById("btn-buy-yearly")?.addEventListener("click", showPaywall);
document.getElementById("modal-buy")?.addEventListener("click", showPaywall);

// ─── Timer presets ────────────────────────────────────────────────────────────
document.querySelectorAll(".preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMin = parseInt(btn.dataset.min);
    document.getElementById("custom-min").value = "";
    updateStartBtn();
  });
});
document.getElementById("custom-min").addEventListener("input", function() {
  document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
  selectedMin = parseInt(this.value) || 0;
  updateStartBtn();
});

function updateStartBtn() {
  const btn = document.getElementById("btn-start-session");
  const hint = document.getElementById("focus-hint");
  const ok = selectedMin > 0 && S.blocklist.length > 0;
  btn.disabled = !ok;
  if (!selectedMin && !S.blocklist.length) hint.textContent = t("focus.hint");
  else if (!selectedMin) hint.textContent = lang === "de" ? "Bitte Dauer wählen" : "Please select a duration";
  else if (!S.blocklist.length) hint.textContent = lang === "de" ? "Mindestens 1 Seite hinzufügen" : "Add at least 1 site";
  else hint.textContent = `${selectedMin} min · ${S.blocklist.length} ${lang === "de" ? "Seite(n)" : "site(s)"}`;
}

// ─── Session ──────────────────────────────────────────────────────────────────
document.getElementById("btn-start-session").addEventListener("click", async () => {
  const res = await window.api.startSession({ minutes: selectedMin, blocklist: S.blocklist });
  if (!res.ok) { document.getElementById("admin-warn").classList.remove("hidden"); return; }
  sessionStartedAt = Date.now();
  S.session = { active:true, endTime:res.endTime, blocklist:S.blocklist, minutes:selectedMin, startedAt:sessionStartedAt };
  await window.api.saveData(S);
  document.getElementById("browser-warn").classList.remove("hidden");
  showSessionView(S.session);
});

document.getElementById("btn-stop-session").addEventListener("click", async () => {
  await window.api.endSession();
  recordSession();
  endSessionUI();
});

document.getElementById("btn-stop-freigang").addEventListener("click", async () => {
  await window.api.endFreigang();
  endFreigangUI();
});

function showSessionView(s) {
  document.getElementById("focus-setup").classList.add("hidden");
  document.getElementById("freigang-view").classList.add("hidden");
  document.getElementById("session-view").classList.remove("hidden");
  const chips = document.getElementById("session-chips");
  chips.innerHTML = (s.blocklist||[]).map(d => `<span class="site-chip">${d}</span>`).join("");
  startClock("session-countdown", s.endTime, () => { playDone(); recordSession(); endSessionUI(); });
}

function endSessionUI() {
  stopClock("session");
  S.session = null;
  sessionStartedAt = null;
  document.getElementById("session-view").classList.add("hidden");
  document.getElementById("focus-setup").classList.remove("hidden");
  document.getElementById("browser-warn").classList.add("hidden");
}

function showFreigangView(f) {
  document.getElementById("focus-setup").classList.add("hidden");
  document.getElementById("session-view").classList.add("hidden");
  document.getElementById("freigang-view").classList.remove("hidden");
  startClock("freigang-countdown", f.endTime, endFreigangUI);
}

function endFreigangUI() {
  stopClock("freigang");
  S.freigang = null;
  document.getElementById("freigang-view").classList.add("hidden");
  document.getElementById("focus-setup").classList.remove("hidden");
}

// ─── Stats — tracks ACTUAL time spent, not planned ───────────────────────────
function recordSession() {
  if (!sessionStartedAt) return;

  // Calculate REAL minutes spent (not the planned amount)
  const actualMs = Date.now() - sessionStartedAt;
  const actualMin = Math.max(1, Math.floor(actualMs / 60000));

  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const st = S.stats;

  if (st.lastDate !== today) { st.todaySessions = 0; st.todayMinutes = 0; }
  if (st.lastMonth !== month) { st.monthMinutes = 0; }

  st.totalSessions++;
  st.totalMinutes   = (st.totalMinutes   || 0) + actualMin;
  st.todaySessions++;
  st.todayMinutes   = (st.todayMinutes   || 0) + actualMin;
  st.monthMinutes   = (st.monthMinutes   || 0) + actualMin;
  st.lastDate  = today;
  st.lastMonth = month;

  // Streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (st.lastSessionDate === yesterday) {
    st.streak = (st.streak || 0) + 1;
  } else if (st.lastSessionDate !== today) {
    st.streak = 1;
  }
  st.lastSessionDate = today;

  sessionStartedAt = null;
  window.api.saveData(S);
  renderProgress();
  updateStreakBanner();
}

function updateStreakBanner() {
  const st = S.stats;
  const el_streak = document.getElementById("streak-count");
  const el_month  = document.getElementById("month-hours");
  const el_total  = document.getElementById("total-sessions-top");
  if (!el_streak) return;

  el_streak.textContent = st.streak || 0;
  const h = Math.floor((st.monthMinutes || 0) / 60);
  const m = (st.monthMinutes || 0) % 60;
  el_month.textContent = h > 0 ? `${h}h ${m}m` : `${st.monthMinutes || 0}m`;
  el_total.textContent = st.totalSessions || 0;
}

function renderProgress() {
  const st = S.stats;
  const totalMin = st.totalMinutes || 0;
  const totalH   = Math.floor(totalMin / 60);

  const bigEl = document.getElementById("big-total-hours");
  if (bigEl) bigEl.textContent = totalMin < 60 ? `${totalMin}m` : `${totalH}h`;

  const els = {
    "stat-total-sessions": st.totalSessions || 0,
    "stat-month-min":      st.monthMinutes  || 0,
    "stat-today":          st.todaySessions || 0,
    "stat-streak":         `${st.streak || 0} 🔥`,
  };
  Object.entries(els).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // Milestone progress bar
  const next = MILESTONES.find(m => totalMin < m.minutes) || MILESTONES[MILESTONES.length - 1];
  const prevIdx = MILESTONES.indexOf(next) - 1;
  const from = prevIdx >= 0 ? MILESTONES[prevIdx].minutes : 0;
  const pct = Math.min(100, Math.round(((totalMin - from) / (next.minutes - from)) * 100));

  const fillEl = document.getElementById("milestone-fill");
  const labelEl = document.getElementById("milestone-label");
  if (fillEl) fillEl.style.width = pct + "%";
  if (labelEl) {
    if (totalMin >= MILESTONES[MILESTONES.length-1].minutes) {
      labelEl.textContent = lang === "de" ? "Alle Meilensteine erreicht! 🎉" : "All milestones reached! 🎉";
    } else {
      const remaining = next.minutes - totalMin;
      labelEl.textContent = lang === "de"
        ? `Nächstes Ziel: ${next.minutes >= 60 ? Math.floor(next.minutes/60)+"h" : next.minutes+"m"} — noch ${remaining >= 60 ? Math.floor(remaining/60)+"h" : remaining+"m"}`
        : `Next goal: ${next.minutes >= 60 ? Math.floor(next.minutes/60)+"h" : next.minutes+"m"} — ${remaining >= 60 ? Math.floor(remaining/60)+"h" : remaining+"m"} left`;
    }
  }

  // Milestones list
  const list = document.getElementById("milestones-list");
  if (!list) return;
  list.innerHTML = MILESTONES.map(m => {
    const unlocked = totalMin >= m.minutes;
    const name = lang === "en" ? m.nameEn : m.name;
    const desc = lang === "en" ? m.descEn : m.desc;
    return `<div class="milestone-item ${unlocked ? "unlocked" : ""}">
      <span class="milestone-icon">${m.icon}</span>
      <div class="milestone-info">
        <p class="milestone-name" style="${unlocked ? "color:var(--gold)" : ""}">${name}</p>
        <p class="milestone-desc">${desc}</p>
      </div>
      <span class="milestone-check">${unlocked ? "✓" : "🔒"}</span>
    </div>`;
  }).join("");
}

document.getElementById("btn-reset-stats")?.addEventListener("click", () => {
  S.stats = { totalSessions:0, totalMinutes:0, todaySessions:0, todayMinutes:0,
              lastDate:"", streak:0, lastSessionDate:"", monthMinutes:0, lastMonth:"" };
  window.api.saveData(S);
  renderProgress();
  updateStreakBanner();
});

// ─── Clock ────────────────────────────────────────────────────────────────────
function startClock(id, endTime, onDone) {
  const key = id.includes("session") ? "session" : "freigang";
  stopClock(key);
  function tick() {
    const rem = Math.max(0, endTime - Date.now());
    const h = Math.floor(rem/3600000), m = Math.floor((rem%3600000)/60000), s = Math.floor((rem%60000)/1000);
    const el = document.getElementById(id);
    if (el) el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    if (rem === 0) { stopClock(key); onDone(); }
  }
  tick();
  if (key === "session") sessionIv = setInterval(tick, 1000);
  else freigangIv = setInterval(tick, 1000);
}

function stopClock(key) {
  if (key === "session" && sessionIv)   { clearInterval(sessionIv);   sessionIv   = null; }
  if (key === "freigang" && freigangIv) { clearInterval(freigangIv); freigangIv = null; }
}
const pad = n => String(n).padStart(2, "0");

// ─── Sound ────────────────────────────────────────────────────────────────────
function playDone() {
  if (!S.prefs?.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; o.type = "sine";
      const t2 = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0, t2);
      g.gain.linearRampToValueAtTime(0.25, t2 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t2 + 0.5);
      o.start(t2); o.stop(t2 + 0.5);
    });
  } catch (_) {}
}
document.getElementById("sound-toggle").addEventListener("change", function() {
  S.prefs.sound = this.checked; window.api.saveData(S);
});

// ─── To-Do ────────────────────────────────────────────────────────────────────
document.getElementById("btn-add-todo").addEventListener("click", addTodo);
document.getElementById("todo-input").addEventListener("keydown", e => { if (e.key==="Enter") addTodo(); });

function addTodo() {
  const inp = document.getElementById("todo-input");
  const text = inp.value.trim(); if (!text) return;
  S.todos.push({ id:Date.now(), text, done:false });
  window.api.saveData(S); inp.value = ""; renderTodos();
}

function renderTodos() {
  const list = document.getElementById("todo-list");
  const total = S.todos.length, done = S.todos.filter(t => t.done).length;
  const pct = total > 0 ? Math.round(done/total*100) : 0;
  const allDone = total > 0 && done === total;
  document.getElementById("todo-progress").style.width = pct + "%";
  document.getElementById("todo-count").textContent = `${done} / ${total}`;
  document.getElementById("todo-hint").textContent = allDone
    ? (lang==="de" ? "Freigang verdient! 🎉" : "Break earned! 🎉")
    : total > 0 ? `${total-done} ${lang==="de"?"übrig":"left"}` : "";
  document.getElementById("unlock-banner").classList.toggle("hidden", !allDone);

  if (!total) {
    list.innerHTML = `<div class="empty-state"><p>${t("todo.empty")}</p></div>`;
    return;
  }
  list.innerHTML = S.todos.map(item => `
    <div class="list-item todo-item ${item.done?"done":""}" data-id="${item.id}">
      <div class="todo-check">${item.done?"✓":""}</div>
      <span class="todo-text">${esc(item.text)}</span>
      <button class="item-del" data-del="${item.id}">×</button>
    </div>`).join("");
  list.querySelectorAll(".todo-item").forEach(el => {
    el.addEventListener("click", e => { if (e.target.closest(".item-del")) return; toggleTodo(+el.dataset.id); });
  });
  list.querySelectorAll(".item-del").forEach(b => b.addEventListener("click", () => delTodo(+b.dataset.del)));
}

function toggleTodo(id) {
  const item = S.todos.find(x => x.id===id);
  if (item) item.done = !item.done;
  window.api.saveData(S); renderTodos();
}
function delTodo(id) {
  S.todos = S.todos.filter(x => x.id!==id);
  window.api.saveData(S); renderTodos();
}

document.getElementById("btn-clear-done").addEventListener("click", () => {
  S.todos = S.todos.filter(x => !x.done);
  window.api.saveData(S); renderTodos();
});

document.getElementById("btn-start-freigang").addEventListener("click", async () => {
  const min = parseInt(document.getElementById("freigang-min").value) || 40;
  const res = await window.api.startFreigang({ minutes: min });
  if (!res.ok) return;
  S.freigang = { active:true, endTime:res.endTime };
  S.todos = S.todos.map(x => ({ ...x, done:false }));
  window.api.saveData(S); renderTodos();
  showFreigangView(S.freigang);
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelector("[data-tab='focus']").classList.add("active");
  document.getElementById("tab-focus").classList.add("active");
});

// ─── Blocklist ────────────────────────────────────────────────────────────────
document.getElementById("btn-add-domain").addEventListener("click", () => addDomain());
document.getElementById("domain-input").addEventListener("keydown", e => { if (e.key==="Enter") addDomain(); });
document.querySelectorAll(".quick-chip").forEach(btn => btn.addEventListener("click", () => {
  // x.com and twitter.com are the same — add both
  if (btn.dataset.d === "x.com") { addDomain("x.com"); addDomain("twitter.com"); }
  else addDomain(btn.dataset.d);
}));

function addDomain(raw) {
  const inp = document.getElementById("domain-input");
  let d = (raw||inp.value).trim().toLowerCase()
    .replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];
  if (!d || S.blocklist.includes(d)) { inp.value=""; return; }
  S.blocklist.push(d); window.api.saveData(S); inp.value="";
  renderBlocklist(); renderFocusPreview(); updateStartBtn(); updateQuickChips();
}

function removeDomain(d) {
  S.blocklist = S.blocklist.filter(x => x!==d);
  window.api.saveData(S);
  renderBlocklist(); renderFocusPreview(); updateStartBtn(); updateQuickChips();
}

function renderBlocklist() {
  const c = document.getElementById("blocklist-items");
  if (!S.blocklist.length) {
    c.innerHTML = `<div class="empty-state"><p>${t("block.empty")}</p></div>`;
    return;
  }
  c.innerHTML = S.blocklist.map(d => `
    <div class="list-item">
      <span style="font-size:13px">🔒</span>
      <span class="item-text">${d}</span>
      <button class="item-del" data-d="${d}">×</button>
    </div>`).join("");
  c.querySelectorAll(".item-del").forEach(b => b.addEventListener("click", () => removeDomain(b.dataset.d)));
}

function renderFocusPreview() {
  const el = document.getElementById("focus-preview");
  if (!S.blocklist.length) {
    el.innerHTML = `<span class="dim">${t("focus.noSites")}</span>`;
    return;
  }
  el.innerHTML = S.blocklist.map(d => `<span class="site-chip">${d}</span>`).join("");
}

function updateQuickChips() {
  document.querySelectorAll(".quick-chip").forEach(b =>
    b.classList.toggle("added", S.blocklist.includes(b.dataset.d)));
}

// ─── Shield ───────────────────────────────────────────────────────────────────
document.getElementById("always-on-toggle").addEventListener("change", async function() {
  await window.api.setAlwaysOn(this.checked);
  S.alwaysOn = this.checked;
  renderShield();
});

function renderShield() {
  const on = !!S.alwaysOn;
  document.getElementById("always-on-toggle").checked = on;
  document.getElementById("shield-card").classList.toggle("on", on);
  const dot = document.getElementById("shield-dot");
  if (dot) { dot.classList.toggle("active", on); }
  const statusEl = document.getElementById("shield-status-text");
  if (statusEl) statusEl.textContent = on ? t("shield.active") : t("shield.inactive");
}

// ─── Settings ─────────────────────────────────────────────────────────────────
document.getElementById("btn-quit").addEventListener("click", () => window.api.quitApp());

// ─── Helpers ──────────────────────────────────────────────────────────────────
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");



init();
