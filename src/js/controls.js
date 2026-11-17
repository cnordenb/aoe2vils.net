"use strict";
const civInput = $("civ-search");
const selectCivText = () => setTimeout(() => { if (document.activeElement === civInput) civInput.select(); }, 0);
const civCombo = combo({
  input: civInput, list: $("civ-list"), id: "copt",
  query: () => (civInput.value === state.civ ? "" : norm(civInput.value)),
  items: (q) => CIVS.filter((c) => norm(c).includes(q)).map((c) => ({
    value: c,
    label: c === GENERIC ? TEXT.genericNoBonuses : c,
    meta: c === state.civ ? `<span class="cur">${TEXT.selected}</span>` : "",
  })),
  start: (items, q) => {
    if (!q) return items.findIndex((it) => it.value === state.civ);
    const i = items.findIndex((it) => norm(it.value).startsWith(q));
    return i < 0 ? 0 : i;
  },
  empty: () => TEXT.noCivByName,
  choose: (c) => { setCiv(c); civInput.value = c; },
  cancel: () => {
    if (civCombo.isOpen()) return;
    civInput.value = state.civ;
    selectCivText();
  },
  prime: selectCivText,
});
civInput.addEventListener("focus", () => civInput.select());
civInput.addEventListener("click", () => { if (civInput.value === state.civ) selectCivText(); });
const allyInput = $("ally-search");
const allySummary = () => state.allies.join(", ");
function toggleAlly(c) {
  if (c === "") state.allies = [];
  else if (state.allies.indexOf(c) !== -1) state.allies = state.allies.filter((x) => x !== c);
  else if (state.allies.length < MAX_ALLIES) state.allies = state.allies.concat(c);
  allyInput.title = allySummary();
  syncSettings();
  renderCivFx();
  renderRows();
  fit();
  save();
}
const allyCombo = combo({
  input: allyInput, list: $("ally-list"), id: "aopt", multi: true,
  query: () => norm(allyInput.value),
  items: (q) => {
    const full = state.allies.length >= MAX_ALLIES;
    const out = q ? [] : [{ value: "", label: TEXT.none, selected: state.allies.length === 0 }];
    CIV_NAMES.forEach((c) => {
      if (!norm(c).includes(q)) return;
      const sel = state.allies.indexOf(c) !== -1;
      const tb = fxOf(c).filter((e) => e.team && relevant(e)).map((e) =>
        fill(e.label, e.p === undefined ? "" : e.p)).join("; ");
      out.push({ value: c, label: c, selected: sel, disabled: full && !sel,
        title: full && !sel ? say("upToAllies", { n: MAX_ALLIES }) : tb
          ? say("teamBonusIs", { tb }) : TEXT.teamBonusNoChange,
        meta: `<span class="tb">${tb ? esc(tb) : "–"}</span>` });
    });
    return out;
  },
  start: (items, q) => (q ? Math.max(0, items.findIndex((it) => norm(it.value).startsWith(q))) : 0),
  empty: () => TEXT.noCivByName,
  choose: toggleAlly,
  cancel: () => { if (!allyCombo.isOpen()) allyInput.value = document.activeElement === allyInput
    ? "" : allySummary(); },
  prime: () => { allyInput.value = ""; },
});
allyInput.addEventListener("focus", () => { allyInput.value = ""; allyInput.placeholder = TEXT.searchCivs; });
allyInput.addEventListener("blur", () => { allyInput.placeholder = TEXT.none; });
const fttBox = $("full-tree");
fttBox.closest("label").title = TEXT.fttTitle;
fttBox.addEventListener("change", () => {
  state.ftt = fttBox.checked;
  if (state.postimp) postImpTechs();
  syncSettings();
  renderTechs();
  renderCivFx();
  renderRows();
  fit();
  save();
  if (unitCombo.isOpen()) { unitCombo.render(); unitInput.focus({ preventScroll: true }); }
});
const ruBox = $("include-ru");
ruBox.addEventListener("change", () => {
  state.regional = ruBox.checked;
  invalidateView();
  syncSettings();
  renderRows();
  save();
  if (unitCombo.isOpen()) { unitCombo.render(); unitInput.focus({ preventScroll: true }); }
});
const bldBox = $("include-bld");
bldBox.addEventListener("change", () => {
  state.bldOn = bldBox.checked;
  renderTechs();
  renderRows();
  fit();
  save();
  if (unitCombo.isOpen()) { unitCombo.render(); unitInput.focus({ preventScroll: true }); }
});
const dockBox = $("include-dock");
dockBox.addEventListener("change", () => {
  state.dock = dockBox.checked;
  renderTechs();
  renderRows();
  fit();
  save();
  if (unitCombo.isOpen()) { unitCombo.render(); unitInput.focus({ preventScroll: true }); }
});
const reseedBox = $("use-reseed"), housesBox = $("use-houses");
reseedBox.addEventListener("change", () => { state.useReseed = reseedBox.checked; update(); save(); });
housesBox.addEventListener("change", () => { state.useHouses = housesBox.checked; update(); save(); });
const idleBox = $("idle-on"), idleSlider = $("idle-t"), idleField = $("idle-t-out");
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
function syncIdle() {
  const n = Math.floor(state.idleT / IDLE_VIL_T);
  idleBox.checked = state.idleTc;
  $("idle-out").hidden = !state.idleTc;
  $("idle-out").classList.toggle("idle-none", !state.idleT);
  $("idle-out").classList.toggle("idle-some", !!state.idleT && !n);
  idleSlider.value = Math.min(state.idleT, +idleSlider.max);
  if (document.activeElement !== idleField) idleField.value = mmss(state.idleT);
  $("vils-missing").textContent = n;
  $("vils-missing").title = say("idleTip", { t: mmss(state.idleT), n, each: IDLE_VIL_T });
}
function parseIdle(text) {
  const m = /^\s*(?:(\d{1,2}):([0-5]?\d)|(\d{1,4}))\s*$/.exec(text);
  if (!m) return null;
  return Math.min(IDLE_MAX, m[3] !== undefined ? +m[3] : +m[1] * 60 + +m[2]);
}
const setIdleT = (s) => { state.idleT = Math.max(0, Math.min(IDLE_MAX, s)); syncIdle(); save(); };
idleBox.addEventListener("change", () =>
  { state.idleTc = idleBox.checked; if (!state.idleTc) state.idleT = 0; syncIdle(); save(); });
idleSlider.addEventListener("input", () => { setIdleT(parseInt(idleSlider.value, 10) || 0); });
idleField.addEventListener("input", () => { const s = parseIdle(idleField.value); if (s !== null) setIdleT(s); });
idleField.addEventListener("change", () =>
  { const s = parseIdle(idleField.value); if (s !== null) setIdleT(s); idleField.value = mmss(state.idleT); });
idleField.addEventListener("keydown", (e) => { if (e.key === "Enter") idleField.blur(); });
let raf = 0;
window.addEventListener("resize", () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    fit();
    if (unitCombo.isOpen()) unitCombo.open();
    if (civCombo.isOpen()) civCombo.open();
  });
});
function setTab(t) {
  if (state.tab === t) return;
  state.tab = t;
  if (t === "te") {
    state.te.research = state.age + 1;
    RES.forEach((res) => { state.te.vils[res] = Math.min(TE_MAX, vrTot[res]); });
  }
  unitCombo.close();
  refreshAll();
}
document.querySelectorAll(".tab").forEach((b) => {
  b.addEventListener("click", () => setTab(b.dataset.tab));
  b.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const other = document.querySelector(`.tab:not([data-tab="${b.dataset.tab}"])`);
    setTab(other.dataset.tab);
    other.focus();
  });
});
const teRow = $("te-row");
function setTeVils(td, v) {
  const res = td.dataset.res, stepper = td.querySelector(".stepper");
  state.te.vils[res] = Math.max(0, Math.min(TE_MAX, v));
  syncStepper(stepper, state.te.vils[res]);
  update();
  save();
}
const afterIn = $("te-after");
function setTeAfter(v) {
  state.te.after = Math.max(0, Math.min(TE_AFTER_MAX, v));
  if (state.te.research !== TE_AFTER) { state.te.research = TE_AFTER; refreshAll(); return; }
  syncTeAfter();
  update();
  save();
}
$("te-after-slide").addEventListener("input", (e) => { setTeAfter(parseInt(e.target.value, 10) || 0); });
function setTeAmount(field) {
  sizeAmt(field);
  const res = field.dataset.res, c = teCalc[res], text = field.value.replace(/[\s,]/g, "");
  if (!/^\d+$/.test(text) || !c || !(c.per > 0)) return;
  const n = Math.max(0, Math.min(TE_MAX, Math.ceil((+text - c.bonus - c.extra - 1e-9) / c.per)));
  const td = teRow.querySelector(`.te-in[data-res="${res}"]`);
  td.querySelector("input").value = n;
  setTeVils(td, n);
}
const teBox = $("te-box");
teBox.addEventListener("input", (e) => { if (e.target.classList.contains("te-amt")) setTeAmount(e.target); });
teBox.addEventListener("change", (e) => {
  const f = e.target;
  if (!f.classList.contains("te-amt")) return;
  setTeAmount(f);
  f.value = f.dataset.shown;
  sizeAmt(f);
});
teBox.addEventListener("keydown", (e) =>
  { if (e.key === "Enter" && e.target.classList.contains("te-amt")) e.target.blur(); });
teRow.addEventListener("change", (e) => {
  const t = e.target;
  if (t.name === "te-age") { state.te.research = +t.value; refreshAll(); return; }
  if (t === afterIn) {
    const v = parseInt(t.value, 10);
    if (Number.isFinite(v)) setTeAfter(v);
    t.value = state.te.after;
    sizeTeAfter();
    return;
  }
  if (t.type !== "number") return;
  const v = parseInt(t.value, 10);
  setTeVils(t.closest("td"), Number.isFinite(v) ? v : 0);
  t.value = state.te.vils[t.closest("td").dataset.res];
});
teRow.addEventListener("input", (e) => {
  if (e.target.type !== "number") return;
  const v = parseInt(e.target.value, 10);
  if (e.target === afterIn) { sizeTeAfter(); if (Number.isFinite(v)) setTeAfter(v); return; }
  if (Number.isFinite(v)) setTeVils(e.target.closest("td"), v);
});
teRow.addEventListener("click", (e) => {
  const step = e.target.closest(".step");
  if (!step) return;
  const td = step.closest("td"), input = td.querySelector("input");
  setTeVils(td, state.te.vils[td.dataset.res] + +step.dataset.step);
  input.value = state.te.vils[td.dataset.res];
  if (step.disabled) input.focus();
});
function refreshAll() {
  civInput.value = state.civ;
  allyInput.value = allySummary();
  allyInput.title = allySummary();
  dockBox.checked = state.dock;
  bldBox.checked = state.bldOn;
  reseedBox.checked = state.useReseed;
  housesBox.checked = state.useHouses;
  document.querySelectorAll(".postimp-box").forEach((b) => { b.checked = state.postimp; });
  syncIdle();
  syncFtt();
  syncSettings();
  renderTechs();
  renderCivFx();
  renderTE();
  renderRows();
  fit();
  save();
}
const RESET_KEYS = ["rows", "civ", "allies", "age", "food", "fish", "customRate", "ftt", "consc", "crane",
  "shipwright", "uts", "postimp", "src", "tradeBump", "relics", "soldiers", "garrison", "tcCastles", "church", "idleTc",
  "idleT", "te"];
$("reset").addEventListener("click", () => {
  unitCombo.close(); allyCombo.close(); civCombo.close();
  unitInput.value = "";
  const fresh = structuredClone(DEFAULTS);
  RESET_KEYS.forEach((k) => { state[k] = fresh[k]; });
  UPS.forEach((k) => { state.up[k] = false; });
  refreshAll();
});
$("clear-civs").addEventListener("click", () => {
  allyCombo.close(); civCombo.close();
  state.allies = [];
  allyInput.value = "";
  allyInput.title = "";
  civInput.value = GENERIC;
  setCiv(GENERIC);
  if (unitCombo.isOpen()) unitCombo.render();
});
document.querySelectorAll(".clear-techs").forEach((btn) => btn.addEventListener("click", () => {
  UPS.forEach((k) => { state.up[k] = false; });
  state.uts = [];
  state.consc = false;
  state.crane = false;
  state.shipwright = false;
  setPostImp(false);
  refreshAll();
  if (unitCombo.isOpen()) unitCombo.render();
}));
document.querySelectorAll(".te-clear").forEach((btn) => btn.addEventListener("click", () => {
  state.te.vils = structuredClone(DEFAULTS.te.vils);
  refreshAll();
}));
function postImpTechs() {
  state.age = 3;
  UPS.forEach((k) => { if (hasTech(k)) state.up[k] = true; });
  if (!state.ftt) civTechs().forEach((t) => { if (state.uts.indexOf(t.name) === -1) state.uts.push(t.name); });
  state.consc = true;
  if (hasCrane()) state.crane = true;
  if (hasShipwright()) state.shipwright = true;
  state.rows.slice().forEach((row) => { while (state.rows.indexOf(row) !== -1 && upgradeRow(row)); });
}
function setPostImp(on) {
  if (state.postimp === on) return;
  state.postimp = on;
  invalidateView();
  document.querySelectorAll(".postimp-box").forEach((b) => { b.checked = on; });
}
document.querySelectorAll(".postimp-box").forEach((box) => box.addEventListener("change", () => {
  setPostImp(box.checked);
  if (box.checked) postImpTechs();
  refreshAll();
  if (unitCombo.isOpen()) { unitCombo.render(); unitInput.focus({ preventScroll: true }); }
}));
load();
state.rows.slice().forEach((r) => {
  if (r.custom || state.rows.indexOf(r) === -1) return;
  sameLineRows(byName.get(r.name)).forEach((o) => {
    r.count = Math.min(MAX_COUNT, r.count + o.count);
    state.rows.splice(state.rows.indexOf(o), 1);
  });
});
if (state.civ === GENERIC) state.ftt = false;
if (state.postimp) postImpTechs();
civInput.value = state.civ;
allyInput.value = allySummary();
allyInput.title = allySummary();
dockBox.checked = state.dock;
bldBox.checked = state.bldOn;
reseedBox.checked = state.useReseed;
housesBox.checked = state.useHouses;
document.querySelectorAll(".postimp-box").forEach((b) => { b.checked = state.postimp; });
syncIdle();
syncFtt();
syncSettings();
renderTechs();
renderCivFx();
renderTE();
renderRows();
fit();
syncButtons();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
