"use strict";
function fitIncome() {
  const root = document.documentElement.classList;
  root.remove("inc-2l", "inc-small", "inc-3l");
  const lines = [["forage", [""]], ["wood-food", [""]], ["relic-food", [""]],
    ["trade-food", [KIND.trade[0], KIND.cog[0]]], ["food-gold", Object.values(FOOD_GOLD_WHO).map((w) => w[0])],
    ["stone-gold", [""]], ["wood-gold", [""]], ["farm-gold", [""]]]
    .map(([id, whos]) => [$(id), whos]).filter(([el]) => !el.classList.contains("gone"));
  const fits = () => lines.every(([el, whos]) => {
    const saved = el.innerHTML;
    el.querySelector("[id$='-out']").textContent = "999.9";
    const ok = whos.every((who) => {
      if (who) el.querySelector("[id$='-who']").innerHTML = who;
      return el.scrollWidth <= el.clientWidth + 0.5;
    });
    el.innerHTML = saved;
    return ok;
  });
  for (const mode of ["inc-2l", "inc-small", "inc-3l"]) {
    if (fits()) return;
    root.add(mode);
  }
}
function fitFish() {
  const root = document.documentElement.classList, was = root.contains("fish-dd");
  root.remove("fish-dd");
  const f = document.querySelector("fieldset.res.food"), cs = getComputedStyle(f);
  const inner = f.getBoundingClientRect().right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
  const upsRight = Math.max(
    ...["fl", "gn"].map((k) =>
    $("food-ups").querySelector(`[data-up="${k}"]`).closest(".opt").getBoundingClientRect().right));
  const need = parseFloat(getComputedStyle(document.querySelector(".food-row")).columnGap)
    + $("fish-spot").getBoundingClientRect().width;
  const dd = upsRight + need > inner + 0.5;
  root.toggle("fish-dd", dd);
  if (dd !== was) renderSources();
}
function applyLayout() {
  const w = window.innerWidth, bld = showBuilders(), root = document.documentElement.classList;
  root.toggle("show-bld", bld);
  root.toggle("mid", w <= 1320 || (bld && w <= 1600));
  root.toggle("narrow", w <= 1150 || (bld && w <= 1320));
  fitHeader();
  root.toggle("no-stone", !showStone());
  root.toggle("tab-te", inTE());
  root.toggle("church", churchCiv());
  fitFish();
  fitIncome();
  document.querySelectorAll(".tab").forEach((b) =>
    { const on = b.dataset.tab === state.tab; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
  const title = document.getElementById("adder-title"), head = document.getElementById("unit-head-t");
  if (title) title.textContent = state.bldOn ? TEXT.addUnitOrBuilding : TEXT.addUnit;
  if (head) head.textContent = state.bldOn ? TEXT.unitBuilding : TEXT.unit;
}
function fit() {
  applyLayout();
  const w = window.innerWidth;
  let fs = w < 600 ? 13.5 : document.documentElement.classList.contains("narrow") ? 14 : 15;
  const techs = $("techs");
  const strip = () => getComputedStyle(techs).order === "-1";
  const room = () => wrap.clientHeight - (strip() ? techs.offsetHeight : 0);
  const idle = $("idle-tc");
  const idleFits = () => !idle.offsetParent ||
    idle.getBoundingClientRect().bottom <= techs.getBoundingClientRect().bottom - parseFloat(
      getComputedStyle(techs).paddingBottom) + 0.5;
  const fits = () => table.offsetHeight <= room() && idleFits();
  table.style.setProperty("--fs", fs + "px");
  placeTechs();
  fillRows();
  while (!fits() && fs > 9) {
    fs -= 0.5;
    table.style.setProperty("--fs", fs + "px");
    fillRows();
  }
  fitHeads();
  return fits();
}
function rowEl(name) { return tbody.querySelector(`tr[data-name="${CSS.escape(name)}"]`); }
function addUnit(i) {
  const name = UNITS[i][0];
  const existing = state.rows.find((r) => r.name === name);
  if (existing) {
    existing.count = Math.min(MAX_COUNT, existing.count + 1);
    rowEl(name).querySelector('.stepper[data-field="count"] input').value = existing.count;
    syncSteps(rowEl(name), existing.count);
    update();
  } else if (sameLineRows(i).length) {
    const old = sameLineRows(i), keep = old[0];
    old.slice(1).forEach((r) =>
      { keep.count = Math.min(MAX_COUNT, keep.count + r.count); state.rows.splice(state.rows.indexOf(r), 1); });
    keep.name = name;
    renderRows();
    fit();
  } else {
    const added = { name, count: 1, builders: 1 };
    state.rows.push(added);
    renderRows();
    if (!fit()) {
      state.rows.splice(state.rows.indexOf(added), 1);
      renderRows();
      fit();
      return;
    }
  }
  save();
}
tbody.addEventListener("input", (e) => {
  if (e.target.classList.contains("cu-in")) { customInput(e.target, false); return; }
  if (e.target.type !== "number") return;
  const tr = e.target.closest("tr"), field = fieldOf(e.target), [min, max] = limits(e.target.closest(".stepper"));
  const row = state.rows.find((r) => r.name === tr.dataset.name);
  const v = parseInt(e.target.value, 10);
  row[field] = Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;
  syncStepper(e.target.closest(".stepper"), row[field]);
  if (field === "builders") refreshRowMeta(tr, row);
  update();
  save();
});
tbody.addEventListener("change", (e) => {
  if (e.target.hasAttribute("data-pervil")) {
    const tr = e.target.closest("tr"), row = state.rows.find((r) => r.name === tr.dataset.name);
    row.perVil = e.target.checked;
    refreshRowMeta(tr, row);
    update();
    save();
    return;
  }
  if (e.target.dataset.up) {
    setUp(e.target.dataset.up, e.target.checked);
    if (!e.target.checked) setPostImp(false);
    syncSettings();
    update();
    save();
    return;
  }
  if (e.target.classList.contains("cu-in")) { customInput(e.target, true); return; }
  if (e.target.type !== "number") return;
  const field = fieldOf(e.target);
  const row = state.rows.find((r) => r.name === e.target.closest("tr").dataset.name);
  if (e.target.value === "") row[field] = 1;
  e.target.value = row[field];
  syncStepper(e.target.closest(".stepper"), row[field]);
  update();
  save();
});
const limits = (stepper) => { const inp = stepper.querySelector("input"); return [+inp.min, +inp.max]; };
const fieldOf = (el) => el.closest(".stepper").dataset.field;
function syncStepper(stepper, n) {
  const [min, max] = limits(stepper);
  stepper.querySelector('.step[data-step="-1"]').disabled = n <= min;
  stepper.querySelector('.step[data-step="1"]').disabled = n >= max;
}
function refreshRowMeta(tr, row) {
  if (row.custom) { tr.querySelector(".cu-eff").innerHTML = customEff(row); return; }
  const u = rowUnit(row);
  const meta = tr.querySelector(".meta-row");
  if (!meta) return;
  const na = meta.querySelector(".na");
  meta.innerHTML = costMeta(u, true, row) + (na ? " " + na.outerHTML : "");
}
const syncSteps = (tr, n) => syncStepper(tr.querySelector('.stepper[data-field="count"]'), n);
tbody.addEventListener("click", (e) => {
  const upg = e.target.closest(".upg");
  if (upg) {
    const tr = upg.closest("tr"), row = state.rows.find((r) => r.name === tr.dataset.name);
    if (!upgradeRow(row)) return;
    renderRows();
    fit();
    save();
    return;
  }
  const step = e.target.closest(".step");
  if (step) {
    const tr = step.closest("tr"), stepper = step.closest(".stepper"), field = stepper.dataset.field;
    const row = state.rows.find((r) => r.name === tr.dataset.name);
    const [min, max] = limits(stepper);
    row[field] = Math.max(min, Math.min(max, (row[field] || min) + +step.dataset.step));
    stepper.querySelector("input").value = row[field];
    syncStepper(stepper, row[field]);
    if (field === "builders") refreshRowMeta(tr, row);
    update();
    save();
    if (step.disabled) stepper.querySelector("input").focus();
    return;
  }
  const btn = e.target.closest("td.rm button");
  if (!btn) return;
  const idx = state.rows.findIndex((r) => r.name === btn.closest("tr").dataset.name);
  state.rows.splice(idx, 1);
  renderRows();
  fit();
  save();
  const next = tbody.querySelectorAll("td.rm button")[Math.min(idx, state.rows.length - 1)];
  (next || $("unit-search")).focus();
});
clearBtn.addEventListener("click", () => {
  state.rows = [];
  renderRows();
  fit();
  save();
  $("unit-search").focus();
});
const hasTech = (k) => state.civ === GENERIC || state.ftt || !(NO_TECH[k] || []).includes(state.civ);
const techAge = (k) => ((!fttOn() && (TECH_AGE_CIV[state.civ] || {})[k]) || TECH_AGE[k]);
const ageOpen = (age) => age <= curAge() + 1;
const techOpen = (k) => hasTech(k) && ageOpen(techAge(k));
const freeUp = (k) => !fttOn() && fxOf(state.civ).some((e) => e.k === "freeups" && e.ups.indexOf(k) !== -1);
const on = (k) => (state.up[k] || freeUp(k)) && techOpen(k);
const techName = (k) => (pastures() && PASTURE_TECH[k] ? PASTURE_TECH[k][0] : TECH_NAME[k]);
const techTitle = (k) => tip(!hasTech(k) ? say("cantResearch", { civ: state.civ, tech: techName(k) })
  : !techOpen(k) ? say("availableFrom", { age: AGES[techAge(k) - 1] }) : freeUp(k)
  ? say("freeFor", { civ: state.civ }) : "",
  pastures() && PASTURE_TECH[k] ? PASTURE_TECH[k][1] : TECH_DESC[k]);
function renderSources() {
  RES.forEach((res) => {
    const o = nicheOf(res);
    if (o && !nicheAvail(o)) {
      if (res === "food") state.food = "farm"; else state.src[res] = "std";
    }
  });
  const pasture = pastures();
  const opt = (v, label, tip, cur, off) =>
    `<option value="${v}"${v === cur ? " selected" : ""}${off ? " disabled" : ""}${tip
      ? ` title="${esc(tip)}"` : ""}>${esc(label)}</option>`;
  const alts = (res) => NICHE[res].filter(nicheAvail);
  const altOpts = (res, cur) => alts(res).map((o) => opt(o.id, o.label, o.tip, cur)).join("");
  const fs = $("food-source");
  const spots = document.documentElement.classList.contains("fish-dd")
    ? [...document.querySelectorAll("#fish-spot input")].map((r) =>
    [`fship:${r.value}`, say("shipSpot", { spot: r.parentElement.textContent.trim() }),
      say("fishingShipTip", { tip: spotTip(r.value) }), r.value === "trap" && !ageOpen(TRAP_AGE)]) : null;
  const food = spots && state.food === "fship" ? `fship:${fishSpot()}` : state.food;
  fs.innerHTML = FOOD_STD.flatMap(([v, l]) => (v === "fship" && spots ? spots
    : [[v, v === "farm" && pasture ? NAMES.pasture : l, v === "fish" ? TEXT.shoreFishing : ""]])).map(
    ([v, l, t, off]) => opt(v, l, t, food, off)).join("") +
    altOpts("food", food) + opt("custom", TEXT.customRate, "", food);
  fs.value = food;
  ["wood", "gold", "stone"].forEach((res) => {
    const sel = $("src-" + res);
    sel.innerHTML = opt("std", STD_SRC[res], "", state.src[res]) + altOpts(res, state.src[res])
      + opt("custom", TEXT.customRate, "", state.src[res]);
    sel.value = state.src[res];
  });
}
function laneShown(k) {
  if (k === "hp") return state.food === "farm" && !pastures();
  if (k === "wb" || k === "hc") return state.food === "farm";
  if (k === "fl" || k === "gn") return state.food === "fship" || state.src.gold === "whale";
  if (k === "car") return !!tradeSrc();
  if (k === "clk" || k === "crv") return state.src.gold === "cog";
  const res = UP_RES[k];
  return !!res && state.src[res] === "std";
}
function syncSettings() {
  renderSources();
  UPS.forEach((k) => { if (!hasTech(k)) state.up[k] = false; });
  document.querySelectorAll("[data-up]").forEach((cb) => {
    const k = cb.dataset.up, ok = techOpen(k), free = ok && freeUp(k);
    cb.checked = on(k);
    cb.disabled = !ok || free;
    cb.closest(".opt").classList.toggle("na", !ok);
    cb.closest(".opt").classList.toggle("fixed", free);
    cb.closest(".opt").title = techTitle(k);
  });
  const ups = $("food-ups"), ship = state.food === "fship";
  ["hp", "wb", "hc"].forEach((k) => { ups.querySelector(`[data-up="${k}"]`).closest(".opt").hidden = !laneShown(k); });
  ["fl", "gn"].forEach((k) => { ups.querySelector(`[data-up="${k}"]`).closest(".opt").hidden = !ship; });
  ups.classList.toggle("ship", ship);
  $("fish-spot").hidden = !ship;
  document.querySelectorAll('input[name="fish"]').forEach((r) => {
    const off = r.value === "trap" && !ageOpen(TRAP_AGE);
    r.checked = r.value === fishSpot();
    r.disabled = off;
    r.parentElement.classList.toggle("na", off);
    r.parentElement.title = spotTip(r.value);
  });
  const whale = state.src.gold === "whale";
  ["wood", "gold", "stone"].forEach((res) =>
    { $(res + "-ups").hidden = state.src[res] !== "std" && !(res === "gold" && (tradeSrc() || whale)); });
  const trade = tradeSrc(), goldOpt = (k) => $("gold-ups").querySelector(`[data-up="${k}"]`).closest(".opt");
  ["gm", "gsm"].forEach((k) => { goldOpt(k).hidden = !!trade || whale; });
  ["fl", "gn"].forEach((k) => { goldOpt(k).hidden = !whale; });
  goldOpt("car").hidden = !trade;
  ["clk", "crv"].forEach((k) => { goldOpt(k).hidden = trade !== "cog"; });
  $("trade-bump").closest(".opt").hidden = trade !== "trade";
  $("trade-bump").checked = state.tradeBump;
  const churchOpen = ageOpen(CHURCH_AGE);
  document.querySelectorAll("[data-church]").forEach((cb) => {
    const res = cb.dataset.church, l = cb.closest(".opt");
    cb.checked = state.church[res] && churchOpen;
    cb.disabled = !churchOpen;
    l.classList.toggle("na", !churchOpen);
    l.hidden = !churchShown(res);
    l.title = tip(churchOpen ? "" : say("availableFrom", { age: AGES[CHURCH_AGE - 1] }),
      say("churchTip", { p: CHURCH_FX.p }));
  });
  const relicOpen = ageOpen(RELIC_AGE);
  relicBox.classList.toggle("na", !relicOpen);
  relicInput.disabled = !relicOpen;
  relicInput.value = relicsNow();
  syncStepper(relicBox.querySelector(".stepper"), relicsNow());
  if (!relicOpen) relicBox.querySelectorAll(".step").forEach((b) => { b.disabled = true; });
  garrisonBox.querySelector("input").value = state.garrison;
  syncStepper(garrisonBox.querySelector(".stepper"), state.garrison);
  soldierBox.querySelector("input").value = state.soldiers;
  syncStepper(soldierBox.querySelector(".stepper"), state.soldiers);
  tcBox.classList.toggle("gone", fttOn() || !fxOf(state.civ).some((e) => e.tc));
  tcBox.querySelector("input").value = state.tcCastles;
  syncStepper(tcBox.querySelector(".stepper"), state.tcCastles);
  document.querySelectorAll('input[name="age"]').forEach((r) => { r.checked = +r.value === state.age; });
}
function setUp(key, val) {
  if (val && !techOpen(key)) return;
  state.up[key] = val;
  if (val && REQUIRES[key]) setUp(REQUIRES[key], true);
  if (!val) Object.keys(REQUIRES).forEach((k) => { if (REQUIRES[k] === key && state.up[k]) setUp(k, false); });
}
document.querySelector(".lanes").addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.rate) { t.value = state.customRate[t.dataset.rate]; return; }
  const picked = t.name === "food" ? "food" : t.dataset.src;
  if (picked && t.value === "custom" && state.customRate[picked] === undefined) state.customRate[picked] =
    clampRate(rates()[picked] * 60);
  if (t.dataset.up) { setUp(t.dataset.up, t.checked); if (!t.checked) setPostImp(false); }
  else if (t.name === "food") { const [food, fish] = t.value.split(":"); state.food = food; if (fish) state.fish =
    fish; }
  else if (t.name === "fish") state.fish = t.value;
  else if (t.dataset.src) state.src[t.dataset.src] = t.value;
  else if (t.dataset.church) state.church[t.dataset.church] = t.checked;
  else if (t.id === "trade-bump") state.tradeBump = t.checked;
  else return;
  syncSettings();
  const trap = rowEl(NAMES.fishTrap);
  if (trap) refreshRowMeta(trap, state.rows.find((r) => r.name === NAMES.fishTrap));
  update();
  save();
});
document.querySelector(".lanes").addEventListener("input", (e) => {
  const t = e.target;
  if (!t.dataset.rate || !Number.isFinite(parseFloat(t.value))) return;
  state.customRate[t.dataset.rate] = clampRate(t.value);
  update();
  save();
});
function counter(box, key, max, redraw = update, stepBy = 1) {
  const input = box.querySelector("input");
  const set = (v) => {
    state[key] = Math.max(0, Math.min(max, v));
    syncStepper(box.querySelector(".stepper"), state[key]);
    redraw();
    save();
  };
  box.addEventListener("click", (e) => {
    const step = e.target.closest(".step");
    if (!step) return;
    set(state[key] + step.dataset.step * stepBy);
    input.value = state[key];
    if (step.disabled) input.focus();
  });
  input.addEventListener("input", () => { const v = parseInt(input.value, 10); if (Number.isFinite(v)) set(v); });
  input.addEventListener("change", () => {
    const v = parseInt(input.value, 10);
    set(Number.isFinite(v) ? v : 0);
    input.value = state[key];
  });
}
