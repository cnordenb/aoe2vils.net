"use strict";
function update() {
  const r = rates();
  RES.forEach((res) => showHead(res, r));
  const { tot, builders, popRate } = sumRows(r);
  const cover = { wood: [], food: [], gold: [], stone: [] };
  coverByRelics(r, tot, cover);
  coverBySoldiers(r, tot, cover);
  coverByGarrison(r, tot, cover);
  reseed(r, tot);
  rebuildTraps(r, tot);
  houseBuilding(r, tot, popRate);
  fitHeads();
  EXTRA_LINES.forEach((line) => showExtraLine(line, r, tot, cover));
  showTotals(tot, cover, builders);
  fillRows();
  updateTE(r);
  const fxH = $("civ-fx").offsetHeight;
  renderCivFx();
  if ($("civ-fx").offsetHeight !== fxH) requestAnimationFrame(fit);
}
function placeTechs() {
  const techs = $("techs");
  techs.style.top = "";
  if (document.documentElement.classList.contains("narrow") || inTE()) return;
  const level = document.querySelector('[data-up="gsm"]').closest(".opt").getBoundingClientRect().top;
  techs.style.top = `${level - $("ut-list").getBoundingClientRect().top}px`;
}
function placeGrand() {
  const box = document.querySelector(".grand-box");
  if (getComputedStyle(box).position !== "absolute") { box.style.top = ""; return 0; }
  const row = $("tot-row").getBoundingClientRect(), g = $("grand").getBoundingClientRect();
  box.style.top = `${box.offsetTop + row.top + row.height / 2 - (g.top + g.height / 2)}px`;
  const techs = ["ut-list", "consc-opt", "shipwright-opt", "crane-opt"].map((id) =>
    $(id).getBoundingClientRect().bottom);
  return Math.max(0, Math.max(...techs)
    + parseFloat(getComputedStyle($("techs")).rowGap) - box.getBoundingClientRect().top);
}
function fillRows() {
  const used = tbody.querySelectorAll("tr[data-name], tr.reseed:not([hidden]), tr.houses:not([hidden])").length;
  const fillers = [...tbody.querySelectorAll("tr.filler")];
  let n = Math.max(0, MIN_ROWS - used);
  const show = () => { fillers.forEach((tr, i) => { tr.hidden = i >= n; }); return placeGrand(); };
  while (show() > 0 && n < fillers.length) n++;
}
function ageUp(target) {
  let t = AGE_UP[target - 1];
  const applied = [];
  activeFx().forEach((x) => {
    if (x.e.k !== "ageup") return;
    const p = pctAt(x.e, target - 1);
    if (!p) return;
    t /= 1 + p / 100;
    applied.push(fill(x.e.label, p));
  });
  return { t, applied };
}
const teCalc = {};
const sizeAmt = (el) => { el.previousElementSibling.textContent = el.value || " "; };
function updateTE(r) {
  [1, 2, 3].forEach((a) => {
    const { t, applied } = ageUp(a), el = $("te-t" + a);
    el.textContent = fmtT(t) + "s";
    el.classList.toggle("mod", applied.length > 0);
    el.title = applied.length
      ? say("baseApplied", { base: say("seconds", { t: AGE_UP[a - 1] }), applied: applied.join("; ") }) : "";
  });
  const after = teAfter(), target = state.te.research, t = after ? state.te.after : ageUp(target).t;
  $("te-label").textContent = after
    ? say("afterTime", { t: minSec(state.te.after) }) : say("onReaching", { age: AGES[target] });
  const bonus = { wood: 0, food: 0, gold: 0, stone: 0 };
  if (!after) activeFx().forEach((x) =>
    { if (x.e.k === "agebonus") RES.forEach((res) => { bonus[res] += x.e.res[res] || 0; }); });
  const forage = state.te.vils.food * forageEach() * t;
  const foodGold = state.te.vils.food * foodGoldShare() * r.food * t;
  const woodFood = state.te.vils.wood * woodFoodShare() * r.wood * t;
  const stoneGold = state.te.vils.stone * stoneGoldShare() * r.stone * t;
  const extra = { wood: forage ? [forage, TEXT.foragers] : null, gold: foodGold
    ? [foodGold, (FOOD_GOLD_WHO[state.food] || [])[2]] : null,
    food: woodFood ? [woodFood, TEXT.lumberjacks] : null };
  if (stoneGold) extra.gold = [stoneGold, TEXT.stoneMiners];
  const woodGold = state.te.vils.wood * woodGoldShare() * r.wood * t;
  if (woodGold) extra.gold = [woodGold, TEXT.lumberjacks];
  const farmGold = state.te.vils.food * farmGoldEach() * t;
  if (farmGold) extra.gold = [farmGold, TEXT.farmers];
  const tradeFood = state.te.vils.gold * tradeFoodShare() * r.gold * t, traders = (KIND[tradeSrc()] || [])[0];
  if (tradeFood) extra.food = extra.food
    ? [extra.food[0] + tradeFood, `${extra.food[1]}${TEXT.and}${traders}`] : [tradeFood, traders];
  RES.forEach((res) => {
    const amt = state.te.vils[res] * r[res] * t + (extra[res] ? extra[res][0] : 0), el = $("te-" + res);
    teCalc[res] = { per: r[res] * t, extra: extra[res] ? extra[res][0] : 0, bonus: bonus[res] };
    el.dataset.shown = Math.floor(amt + 1e-9) + bonus[res];
    if (document.activeElement !== el) { el.value = el.dataset.shown; sizeAmt(el); }
    el.title = say("gathered", { n: amt.toFixed(1), res: RES_WORD[res] }) +
      (extra[res] ? say("gatheredBy", { n: extra[res][0].toFixed(1), who: extra[res][1] }) : "") +
      (bonus[res] ? say("bonusOnReaching", { n: bonus[res], age: AGES[target] }) : "");
    const inp = document.querySelector(`#te-row .te-in[data-res="${res}"] input`);
    if (inp) inp.setAttribute("aria-label", $("head-" + res).dataset.label);
  });
  const others = RES.filter((res) => kindOf(res) !== "vils" && state.te.vils[res]);
  $("te-vils").textContent = RES.reduce((n, res) => n + (kindOf(res) === "vils" ? state.te.vils[res] : 0), 0);
  $("te-vils").title = others.length
    ? say("notCounted", {
    list: others.map((res) => `${state.te.vils[res]} ${KIND[kindOf(res)][state.te.vils[res] === 1 ? 1 : 0]}`).join(
    ", ") }) : "";
}
function syncTeAfter() {
  const field = $("te-after"), slide = $("te-after-slide");
  if (document.activeElement !== field) field.value = state.te.after;
  sizeTeAfter();
  slide.value = Math.min(state.te.after, +slide.max);
  slide.hidden = state.te.research !== TE_AFTER;
}
const sizeTeAfter = () => { const field = $("te-after"); field.nextElementSibling.textContent = field.value || " "; };
const minSec = (s) =>
  [[Math.floor(s / 3600), TEXT.hourUnit], [Math.floor(s / 60) % 60, TEXT.minUnit], [s % 60, TEXT.secUnit]]
  .filter(([n]) => n).map(([n, u]) => n + u).join("") || 0 + TEXT.secUnit;
function renderTE() {
  document.querySelectorAll('input[name="te-age"]').forEach((b) => { b.checked = +b.value === state.te.research; });
  syncTeAfter();
  document.querySelectorAll("#te-row .te-in").forEach((td) => {
    td.innerHTML = stepperHtml("te", state.te.vils[td.dataset.res], 0, TE_MAX,
      $("head-" + td.dataset.res).dataset.label);
  });
}
function upgradeButton(i) {
  const up = upgradeOf(i);
  if (!up) return "";
  const ok = up.target >= 0;
  const title = ok ? say("upgradeTo", { name: displayNameOf(up.target, up.node) }) : up.why;
  return `<button type="button" class="upg"` +
    ` data-upgrade${ok ? "" : " disabled"} title="${esc(title)}">${TEXT.upgrade}</button>`;
}
const displayNameOf = (t, node) => (UNITS[t][10] ? node : displayName(t));
function reseedRowHtml() {
  const box = (k) => { const ok = techOpen(k), free = ok && freeUp(k);
    return `<label class="opt${ok ? "" : " na"}${free ? " fixed" : ""}"` +
      ` title="${esc(techTitle(k))}"><input type="checkbox"` +
      ` data-up="${k}"${on(k) ? " checked" : ""}${ok && !free ? "" : " disabled"}> ${techName(k)}</label>`; };
  return `<tr class="reseed" id="reseed-row" hidden>
          <td class="rm"></td>
          <th scope="row" colspan="3">` +
    `<span class="uname">${say("reseeding", { name: pastures() ? NAMES.pasture : NAMES.farm })}</span>` +
    `<span class="meta meta-row" id="reseed-meta"></span>
            <div class="reseed-techs">${box("hcol")}${box("hp")}${box("crop")}</div></th>
          <td class="num wood" id="reseed-wood"></td><td class="num food zero">–</td><td class="num gold zero">–</td>` +
    `<td class="num stone zero">–</td>
        </tr>`;
}
function perWorkerHtml(u, row) {
  if (!WORKER[u[0]]) return "";
  const wt = fmtT(workerTime(u));
  return `<span class="row-opts"><label class="opt"` +
    ` title="${say("perWorker", { name: u[0], worker: WORKER[u[0]], t: wt })}">` +
    `<input type="checkbox" data-pervil${row.perVil ? " checked" : ""}> ${say("seconds", { t: wt })}</label></span>`;
}
function woodRowHtml(cls, id, label) {
  return `<tr class="${cls}" id="${id}-row" hidden>
          <td class="rm"></td>
          <th scope="row" colspan="3">` +
    `<span class="uname">${label}</span><span class="meta meta-row" id="${id}-meta"></span></th>
          <td class="num wood" id="${id}-wood"></td><td class="num food zero">–</td><td class="num gold zero">–</td>` +
    `<td class="num stone zero">–</td>
        </tr>`;
}
const FILLER = `<tr class="filler" aria-hidden="true" hidden><td class="rm"></td><th></th><td class="bld-cell"></td>` +
  `<td class="count">${stepperHtml("filler", 0, 0, 0, "")}</td>` +
  `<td class="num wood"></td><td class="num food"></td><td class="num gold"></td><td class="num stone"></td></tr>`;
function stepperHtml(field, v, min, max, label) {
  return `<div class="stepper" data-field="${field}">` +
    `<button type="button" class="step" data-step="-1"` +
    ` aria-label="${say("oneFewer", { label })}"${v <= min ? " disabled" : ""}>−</button>` +
    `<input type="number" inputmode="numeric" min="${min}" max="${max}" step="1" value="${v}" aria-label="${label}">` +
    `<button type="button" class="step" data-step="1"` +
    ` aria-label="${say("oneMore", { label })}"${v >= max ? " disabled" : ""}>+</button></div>`;
}
const countStepper = (row, safe) => `<div class="stepper" data-field="count">
            <button type="button" class="step" data-step="-1"` +
  ` aria-label="${say("buildingFewer", { name: safe })}"${row.count <= 0 ? " disabled" : ""}>−</button>` +
  `<input type="number" inputmode="numeric" min="0"` +
  ` max="${MAX_COUNT}" step="1"` +
  ` value="${row.count}"` +
  ` aria-label="${say("buildingsProducing", { name: safe })}"><button type="button" class="step" data-step="1"` +
  ` aria-label="${say("buildingMore", { name: safe })}"${row.count >= MAX_COUNT ? " disabled" : ""}>+</button>
          </div>`;
function customRowHtml(row) {
  const safe = esc(row.name), c = row.custom, d = CUSTOM[customKind(row.name)];
  const builders = d.flags
    ? stepperHtml("builders", row.builders, 0, CUSTOM_BUILDERS, say("buildersPer", { name: safe })) : "";
  const field = (k, suffix, cls, label) => `<label class="cu-f${cls}"><input type="number" class="cu-in"` +
    ` data-cost="${k}" min="${k === "t" ? CUSTOM_T_MIN : 0}" max="${d.max}" ` +
    `step="${k === "t" ? "any" : 1}"` +
    ` inputmode="${k === "t" ? "decimal" : "numeric"}"` +
    ` value="${c[k]}" aria-label="${safe}: ${label}">${suffix}</label>`;
  return `<tr data-name="${safe}" class="custom">
          <td class="rm"><button type="button"` +
    ` aria-label="${say("removeName", { name: safe })}" title="${TEXT.remove}">×</button></td>
          <th scope="row"><span class="uname">${safe}</span><span class="meta cu-eff">${customEff(row)}</span>` +
        `<span class="cu-fields">${d.res.map((r) =>
          field(r, LETTER[r], " t-" + r, say("resCost", { res: RES_WORD[r] }))).join("")}<span>/</span>${field("t",
          TEXT.secUnit, "", say("inSeconds", { time: d.time }))}</span></th>
          <td class="bld-cell">${builders}</td>
          <td class="count">${countStepper(row, safe)}</td>
          <td class="num wood"></td><td class="num food"></td><td class="num gold"></td><td class="num stone"></td>
        </tr>`;
}
const customEff = (row) => { const u = rowUnit(row);
  return effective(u).applied.length || (BLD(u) && row.builders > 1) ? `→ ${costMeta(u, true, row)}` : ""; };
function customInput(inp, done) {
  const tr = inp.closest("tr"), row = state.rows.find((r) => r.name === tr.dataset.name), k = inp.dataset.cost;
  const n = clampNum(inp.value, +inp.min, +inp.max, +inp.min);
  row.custom[k] = k === "t" ? Math.round(n * 10) / 10 : Math.round(n);
  if (done) inp.value = row.custom[k];
  tr.querySelector(".cu-eff").innerHTML = customEff(row);
  update();
  save();
}
function addCustom(kind) {
  if (customRows(kind).length >= CUSTOM_MAX) return;
  let n = 1;
  while (state.rows.some((r) => r.name === `${CUSTOM[kind].prefix} ${n}`)) n++;
  const name = `${CUSTOM[kind].prefix} ${n}`;
  const added = { name, count: 1, builders: 1, custom: cleanCustom({}, kind) };
  state.rows.push(added);
  renderRows();
  if (!fit()) {
    state.rows.splice(state.rows.indexOf(added), 1);
    renderRows();
    fit();
    return;
  }
  save();
  rowEl(name).querySelector(".cu-in").focus();
}
const orderRows = () => state.rows.sort((a, b) => BLD(rowUnit(a)) - BLD(rowUnit(b)));
function renderRows() {
  invalidateView();
  orderRows();
  {
    tbody.innerHTML = state.rows.map((row) => {
      if (row.custom) return customRowHtml(row);
      const i = byName.get(row.name);
      const u = UNITS[i];
      const safe = esc(row.name);
      const a = ageOf(i);
      const why = a === 0 ? say("notInTree", { civ: state.civ }) : a > state.age + 1
        ? say("needsShort", { age: AGES[a - 1] }) : "";
      const na = why ? ` <span class="na">${esc(why)}</span>` : "";
      const builders = BLD(u) && !NO_BUILDERS(u)
        ? stepperHtml("builders", row.builders || 1, 1, maxBuilders(row.name), say("buildersPer", { name: safe })) : "";
      return `<tr data-name="${safe}"${why ? ` class="na"` +
        ` title="${esc(why.charAt(0).toUpperCase() + why.slice(1))}"` : ""}>
          <td class="rm"><button type="button"` +
        ` aria-label="${say("removeName", { name: safe })}" title="${TEXT.remove}">×</button></td>
          <th scope="row">` +
        `<span class="uname"${u[10]
          ? ` title="${esc(u[10].join(", "))}"` : ""}>${esc(displayName(i))}</span>${upgradeButton(
          i)}<span class="meta meta-row">${costMeta(u, true, row)}${na}</span>${perWorkerHtml(u, row)}</th>
          <td class="bld-cell">${builders}</td>
          <td class="count">${countStepper(row, safe)}</td>
          <td class="num wood"></td><td class="num food"></td><td class="num gold"></td><td class="num stone"></td>
        </tr>`;
    }).join("") + reseedRowHtml() + woodRowHtml("reseed", "trap", TEXT.trapRow)
      + woodRowHtml("houses", "house", TEXT.houseRow) + FILLER.repeat(MIN_ROWS + 4);
  }
  clearBtn.hidden = state.rows.length === 0;
  $("crane").closest(".opt").hidden = !state.bldOn || inTE();
  update();
}
const showBuilders = () => state.bldOn || hasBuildingRow();
const showStone = () => inTE() || state.bldOn || hasBuildingRow();
function fitHeader() {
  const root = document.documentElement.classList, top = document.querySelector(".top");
  const h1 = top.querySelector("h1"), tabs = top.querySelector(".tabs"), clear = top.querySelector(".clear-slot"),
    pickers = top.querySelector(".pickers");
  const sameLine = (a, b) =>
    { const x = a.getBoundingClientRect(), y = b.getBoundingClientRect(); return x.top < y.bottom
    && y.top < x.bottom; };
  const fits = [
    () => sameLine(h1, tabs) && sameLine(h1, clear) && sameLine(h1, pickers),
    () => sameLine(h1, tabs) && sameLine(h1, clear) && sameLine(h1, pickers),
    () => sameLine(h1, tabs) && sameLine(h1, clear),
    () => sameLine(h1, clear),
  ];
  const modes = [[], ["hdr-b"], ["hdr-b", "hdr-c"], ["hdr-b", "hdr-c", "hdr-d"]];
  root.add("hdr-measure");
  let pick = modes.length - 1;
  for (let i = 0; i < modes.length; i++) {
    root.remove("hdr-b", "hdr-c", "hdr-d");
    modes[i].forEach((c) => root.add(c));
    if (fits[i]() && top.scrollWidth <= top.clientWidth + 1) { pick = i; break; }
  }
  root.remove("hdr-measure", "hdr-b", "hdr-c", "hdr-d");
  modes[pick].forEach((c) => root.add(c));
}
function fitHeads() {
  const ths = RES.map((r) => $("head-" + r)).filter((th) => th.querySelector(".hl"));
  const head = table.tHead, row = head.rows[0];
  row.style.height = "";
  ths.forEach((th) => th.classList.add("plain"));
  const hh = () => head.getBoundingClientRect().height, base = hh();
  ths.forEach((th) => {
    th.classList.remove("plain");
    if (hh() > base + 0.5 || th.scrollWidth > th.clientWidth + 1) th.classList.add("plain");
  });
  row.style.height = base + "px";
}
