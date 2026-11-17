"use strict";
const KIDS = {}, PARENTS = {}, LINE_OF = {}, LINE_NODES = [];
EDGES.forEach(([p, c]) => { (KIDS[p] = KIDS[p] || []).push(c); (PARENTS[c] = PARENTS[c] || []).push(p); });
(function groupLines() {
  const nb = {};
  EDGES.forEach(([p, c]) => { (nb[p] = nb[p] || []).push(c); (nb[c] = nb[c] || []).push(p); });
  Object.keys(nb).forEach((start) => {
    if (LINE_OF[start] !== undefined) return;
    const id = LINE_NODES.length, stack = [start], nodes = [];
    LINE_OF[start] = id;
    while (stack.length) {
      const n = stack.pop();
      nodes.push(n);
      nb[n].forEach((m) => { if (LINE_OF[m] === undefined) { LINE_OF[m] = id; stack.push(m); } });
    }
    LINE_NODES.push(nodes);
  });
})();
const unique = (m) => !!(MEMBERS[m] && MEMBERS[m][0]);
const uniqueShown = (m) => !unique(m) || (state.civ === GENERIC ? state.regional : memberHas(m));
function memberHas(m) {
  const info = MEMBERS[m];
  if (!info) return false;
  if (state.civ === GENERIC) return true;
  if (state.ftt && !info[0]) return true;
  if (!fttOn() && allyUnlockAge(m) && (!PARENTS[m] || PARENTS[m].some(memberHas))) return true;
  return info[1].charAt(CIV_NAMES.indexOf(state.civ)) === "1";
}
function descendants(n, out = new Set()) {
  (KIDS[n] || []).forEach((k) => { if (!out.has(k)) { out.add(k); descendants(k, out); } });
  return out;
}
function postImpView() {
  const view = { hidden: new Set(), name: new Map(), search: new Map() };
  const entriesOf = new Map();
  UNITS.forEach((u, i) => {
    const id = LINE_OF[members(u)[0]];
    if (id !== undefined) (entriesOf.get(id) || entriesOf.set(id, []).get(id)).push(i);
  });
  entriesOf.forEach((idxs, id) => {
    const nodes = LINE_NODES[id];
    const mixed = nodes.some(unique) && nodes.some((n) => !unique(n));
    const avail = state.civ === GENERIC ? nodes.filter((n) => !mixed || !unique(n)) : nodes.filter(memberHas);
    const frontier = avail.filter((n) => ![...descendants(n)].some((d) => avail.indexOf(d) !== -1));
    const text = nodes.filter(uniqueShown).map(norm).join(" | ");
    idxs.forEach((i) => {
      const ms = members(UNITS[i]);
      if (state.civ === GENERIC && mixed && ms.every(unique)) return;
      const latest = ms.filter((m) => frontier.indexOf(m) !== -1).sort((x, y) => unique(x) - unique(y))[0];
      if (!latest) { view.hidden.add(i); return; }
      view.name.set(i, latest);
      view.search.set(i, text + " | " + norm(UNITS[i][1]) + " | " + norm(parentOf(UNITS[i])));
    });
  });
  return view;
}
const ENTRY_OF = new Map();
UNITS.forEach((u, i) => members(u).forEach((m) => { if (!ENTRY_OF.has(m)) ENTRY_OF.set(m, i); }));
const lineOf = (i) => LINE_OF[members(UNITS[i])[0]];
function sameLineRows(i) {
  const id = lineOf(i);
  if (id === undefined) return [];
  return state.rows.filter((r) => {
    if (r.custom) return false;
    const j = byName.get(r.name);
    return j !== i && lineOf(j) === id && UNITS[j][1] === UNITS[i][1];
  });
}
function upgradeOf(i) {
  const ms = members(UNITS[i]);
  const queue = [];
  ms.forEach((m) => (KIDS[m] || []).forEach((k) => { if (ms.indexOf(k) === -1) queue.push(k); }));
  if (!queue.length) return null;
  const first = queue[0], seen = new Set();
  while (queue.length) {
    const n = queue.shift();
    if (seen.has(n)) continue;
    seen.add(n);
    if (memberHas(n) && ENTRY_OF.has(n)) {
      const t = ENTRY_OF.get(n), a = ageOf(t);
      if (a > 0 && a <= state.age + 1) return { target: t, node: n, why: "" };
      return { target: -1, node: n, why: say("needsAge", { name: n, age: AGES[(a || 4) - 1] }) };
    }
    (KIDS[n] || []).forEach((k) => queue.push(k));
  }
  return { target: -1, node: first, why: say("cantUpgrade", { civ: state.civ, name: first }) };
}
function upgradeRow(row) {
  const up = row.custom ? null : upgradeOf(byName.get(row.name));
  if (!up || up.target < 0) return false;
  const toName = UNITS[up.target][0], there = state.rows.find((r) => r.name === toName);
  if (there) {
    there.count = Math.min(MAX_COUNT, there.count + row.count);
    state.rows.splice(state.rows.indexOf(row), 1);
  } else {
    row.name = toName;
    row.builders = Math.min(row.builders || 1, maxBuilders(toName));
  }
  return true;
}
let piView = null;
const view = () => (state.postimp ? (piView = piView || postImpView()) : null);
const invalidateView = () => { piView = null; };
const displayName = (i) => {
  const w = NAME_WITH_UNIQUE[UNITS[i][0]], early = EARLY_UNIQUE[UNITS[i][0]];
  if (early && !ageOpen(UNITS[i][9]) && uniqueShown(early[0])) return early[0];
  if (w && (state.civ === GENERIC ? state.regional : !state.postimp && memberHas(w[0]))) return w[1];
  return (state.postimp && view().name.get(i)) || UNITS[i][0];
};
const fmt = (n) => (Math.round(n * 10) / 10).toFixed(1);
const vils = (n) => Math.max(0, Math.ceil(n - 1e-9));
const fmtT = (t) => (Math.abs(t - Math.round(t)) < 0.05 ? String(Math.round(t)) : t.toFixed(1));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const withBuilders = (t, n) => (n > 1 ? (BUILD_TIME.mult * t) / (n + BUILD_TIME.add) : t);
const perWorker = (u, row) => !!WORKER[u[0]] && !!(row && row.perVil);
const workerTime = (u) => effective(UNITS[byName.get(WORKER[u[0]])]).t;
const rowTime = (u, e, row) =>
  (perWorker(u, row) ? workerTime(u) : BLD(u) ? withBuilders(e.t, row.builders || 1) : e.t);
function costMeta(u, withTitle, row) {
  const e = effective(u), builders = (row && row.builders) || 1;
  if (perWorker(u, row)) {
    const w = WORKER[u[0]];
    e.t = workerTime(u);
    e.applied = e.applied.filter((a) => e.timeFx.indexOf(a) === -1).concat(say("onePer", { w, t: fmtT(e.t) }));
  } else if (BLD(u) && builders > 1) {
    e.t = withBuilders(e.t, builders);
    e.applied.push(say("builders", { n: builders }));
  }
  const parts = RES.map((r, i) => {
    const v = e.c[r];
    if (!v) return "";
    const cls = "t-" + r + (v !== u[i + 2] ? " mod" : "");
    return `<b class="${cls}">${v}${LETTER[r]}</b>`;
  }).filter(Boolean);
  const tMod = Math.abs(e.t - baseTime(u)) > 1e-9;
  let html = `${parts.join(" ")} / <span${tMod ? ' class="mod"' : ""}>${say("seconds", { t: fmtT(e.t) })}</span>`;
  if (withTitle && e.applied.length) {
    const base = RES.map((r, i) => (u[i + 2] ? u[i + 2] + LETTER[r] : "")).filter(Boolean).join(" ") + " / "
      + baseTime(u) + "s";
    html = `<span title="${esc(say("baseApplied", { base, applied: e.applied.join("; ") }))}">${html}</span>`;
  }
  return html;
}
function farmFood() {
  let upg = (on("hcol") ? FARM_FOOD.hcol : 0) + (on("hp") ? FARM_FOOD.hp : 0) + (on("crop") ? FARM_FOOD.crop : 0);
  let mult = 1;
  activeFx().forEach((x) => {
    if (x.e.k !== "farmfood") return;
    if (x.e.upg) upg *= x.e.upg;
    if (x.e.mult) mult *= x.e.mult;
  });
  return (FARM_FOOD.base + upg) * mult;
}
const pastures = () => !fttOn() && fxOf(state.civ).some((e) => e.k === "farm" && e.t === "pasture");
const pastureFood = () => PASTURE_FOOD.base + (on("hcol") ? PASTURE_FOOD.hcol : 0) + (on("hp") ? PASTURE_FOOD.hp : 0) +
  (on("crop") ? PASTURE_FOOD.crop : 0);
let reseedShown = false;
function reseed(r, tot) {
  const tr = $("reseed-row");
  if (!tr) return;
  const farmers = state.useReseed && state.food === "farm" ? vils(tot.food) : 0;
  const show = farmers > 0;
  tr.hidden = !show;
  if (show) {
    const past = pastures(), per = past ? PASTURE_VILS : 1, plots = Math.ceil(farmers / per);
    const noun = past ? TEXT.pasture : TEXT.farm;
    const e = effective(UNITS[byName.get(past ? NAMES.pasture : NAMES.farm)]);
    const food = past ? pastureFood() : farmFood();
    const cycle = e.t + food / (per * r.food);
    const lumberjacks = (plots * e.c.wood) / cycle / r.wood;
    tot.wood += lumberjacks;
    $("reseed-meta").innerHTML = `<b class="t-wood">${plots * e.c.wood}w</b> / ${fmtT(cycle)}s`;
    $("reseed-meta").title =
      say("reseedMeta", { n: plots, noun, s: pluralEnd(plots), wood: e.c.wood, food: Math.round(food),
      for: past ? say("forVils", { n: per }) : "", t: fmtT(e.t), gather: fmtT(cycle - e.t) });
    const td = $("reseed-wood");
    td.textContent = fmt(lumberjacks);
    td.title = `${lumberjacks.toFixed(2)} ${unitWord("wood")}`;
  }
  if (show !== reseedShown) { reseedShown = show; requestAnimationFrame(fit); }
}
const trapsOn = () => state.useReseed && state.food === "fship" && fishSpot() === "trap";
const trapFood = () => activeFx().reduce((f, x) => (x.e.k === "trapfood" ? f * x.e.mult : f), TRAP_FOOD);
let trapShown = false;
function rebuildTraps(r, tot) {
  const tr = $("trap-row");
  if (!tr) return;
  const traps = trapsOn() ? vils(tot.food) : 0;
  const show = traps > 0;
  tr.hidden = !show;
  if (show) {
    const e = effective(UNITS[byName.get(NAMES.fishTrap)]), food = trapFood();
    const cycle = e.t + food / r.food;
    const lumberjacks = (traps * e.c.wood) / cycle / r.wood;
    tot.wood += lumberjacks;
    $("trap-meta").innerHTML = `<b class="t-wood">${traps * e.c.wood}w</b> / ${fmtT(cycle)}s`;
    $("trap-meta").title = say("trapMeta", { n: traps, s: pluralEnd(traps), wood: e.c.wood, food: Math.round(food),
      t: fmtT(e.t), gather: fmtT(cycle - e.t) });
    const td = $("trap-wood");
    td.textContent = fmt(lumberjacks);
    td.title = `${lumberjacks.toFixed(2)} ${unitWord("wood")}`;
  }
  if (show !== trapShown) { trapShown = show; requestAnimationFrame(fit); }
}
function unitPop(u) {
  let pop = HALF_POP(u) ? 0.5 : 1;
  activeFx().forEach((x) => { if (x.e.k === "pop" && x.e.m(u)) pop *= 1 - pct(x.e) / 100; });
  return pop;
}
const housePop = () => activeFx().reduce((p, x) => (x.e.k === "housepop" ? p + x.e.v : p), HOUSE_POP);
let houseShown = false;
function houseBuilding(r, tot, popRate) {
  const tr = $("house-row");
  if (!tr) return;
  const show = state.useHouses && popRate > 0 && !activeFx().some((x) => x.e.k === "nohouses");
  tr.hidden = !show;
  if (show) {
    const e = effective(UNITS[byName.get(NAMES.house)]), pop = housePop();
    const every = pop / popRate;
    const lumber = e.c.wood / every / r.wood, building = e.t / every;
    tot.wood += lumber + building;
    $("house-meta").innerHTML = `<b class="t-wood">${e.c.wood}w</b> / ${fmtT(every)}s`;
    $("house-meta").title = say("houseMeta", { pop, every: fmtT(every), wood: e.c.wood, t: fmtT(e.t) });
    const td = $("house-wood");
    td.textContent = fmt(lumber + building);
    td.title = say("houseWood", { n: (lumber + building).toFixed(2), word: unitWord("wood"), lumber: lumber.toFixed(2),
      building: building.toFixed(2) });
  }
  if (show !== houseShown) { houseShown = show; requestAnimationFrame(fit); }
}
const unitWord = (res) => KIND_WORD[kindOf(res)];
const WIDE_ONLY_RE = new RegExp(`^(${WIDE_ONLY.join("|")}) `);
const vrTot = { wood: 0, food: 0, gold: 0, stone: 0 };
function showHead(res, r) {
  const [plural, one] = KIND[kindOf(res)];
  $("rate-" + res).textContent = fmt(r[res] * 60);
  const custom = srcOf(res) === "custom", rin = $("rate-in-" + res);
  $("rate-" + res).hidden = custom;
  rin.hidden = !custom;
  if (custom && document.activeElement !== rin) rin.value = state.customRate[res] || CUSTOM_RATE;
  $("rate-" + res + "-t").title = say("gatheredPer", { one });
  const hd = (HEADS[res] || {})[res === "food" ? state.food : state.src[res]];
  const plainName = KIND_SHORT[kindOf(res)]
    || say("resVils", { res: RES_WORD[res].charAt(0).toUpperCase() + RES_WORD[res].slice(1) });
  const own = hd ? `# <span class="hl">${hd}</span><span class="hs">${plainName}</span>` : "";
  const th = $("head-" + res);
  th.innerHTML = own ? own
    : plural === "vils" ? `# ${plainName}`
    : `# ${plural.replace(WIDE_ONLY_RE, '<span class="wide-only">$1 </span>')}`;
  th.dataset.label = hd ? `# ${hd}` : th.textContent;
}
function sumRows(r) {
  const tot = { wood: 0, food: 0, gold: 0, stone: 0 };
  let builders = 0, popRate = 0;
  tbody.querySelectorAll("tr[data-name]").forEach((tr) => {
    const row = state.rows.find((x) => x.name === tr.dataset.name);
    const u = rowUnit(row);
    tr.classList.toggle("idle", row.count === 0);
    const e = effective(u);
    const t = rowTime(u, e, row);
    if (!BLD(u)) popRate += (row.count * unitPop(u)) / t;
    else if (!NO_BUILDERS(u)) builders += row.count * (row.custom ? row.builders : row.builders || 1);
    RES.forEach((res) => {
      const c = e.c[res];
      const td = tr.querySelector("td." + res);
      if (!c) { td.textContent = "–"; td.classList.add("zero"); td.removeAttribute("title"); return; }
      const v = (row.count * c) / t / r[res];
      tot[res] += v;
      td.textContent = fmt(v);
      td.classList.toggle("zero", row.count === 0);
      td.title = `${v.toFixed(2)} ${unitWord(res)}`;
    });
  });
  return { tot, builders, popRate };
}
const perMinText = (v) => (v >= 100 ? String(Math.round(v)) : fmtT(v));
const fxOn = (k) => activeFx().some((x) => x.e.k === k);
function coverByRelics(r, tot, cover) {
  const relic = relicIncome(), rs = pluralEnd(relicsNow());
  ["gold", "food"].forEach((res) => {
    const x = Math.min(tot[res], relic[res] / r[res]);
    tot[res] -= x;
    if (x) cover[res].push(say("relicsCover", { n: relicsNow(), s: rs, x: x.toFixed(2) }));
  });
  $("relic-out").textContent = say("goldPerMin", { n: perMinText(relic.gold * 60) });
  const each = relicIncome(1);
  const food = each.food ? say("andFood", { food: fmt(each.food * 60) }) : "";
  $("relics").title = tip(ageOpen(RELIC_AGE) ? "" : say("availableFrom", { age: AGES[RELIC_AGE - 1] }),
    say("relicTip", { gold: fmt(each.gold * 60), food }) + TEXT.takenOff);
  const rf = $("relic-food");
  rf.classList.toggle("gone", !each.food);
  rf.hidden = !each.food || !ageOpen(RELIC_AGE) || inTE();
  $("relic-food-out").textContent = perMinText(relic.food * 60);
  rf.title = say("relicFood", { n: fmt(each.food * 60) }) + TEXT.takenOff;
}
function coverBySoldiers(r, tot, cover) {
  const soldierEach = activeFx().reduce((f, x) => (x.e.k === "soldierfood" ? f + x.e.perMin / 60 : f), 0);
  const soldierFood = state.soldiers * soldierEach;
  const x = Math.min(tot.food, soldierFood / r.food);
  tot.food -= x;
  const sb = $("soldiers");
  sb.classList.toggle("gone", !hasTechFx("soldierfood"));
  sb.hidden = !soldierEach;
  $("soldier-out").textContent = say("foodPerMin", { n: perMinText(soldierFood * 60) });
  sb.title = say("soldierTip", { n: fmt(soldierEach * 60) }) + TEXT.takenOff;
  if (x) cover.food.push(say("soldiersCover", { n: state.soldiers, s: pluralEnd(state.soldiers), x: x.toFixed(2) }));
}
function coverByGarrison(r, tot, cover) {
  const garrisonFx = activeFx().find((x) => x.e.k === "garrison");
  const garrisonFood = garrisonFx ? garrisonFx.e.perMin(state.garrison) / 60 : 0;
  const x = Math.min(tot.food, garrisonFood / r.food);
  tot.food -= x;
  const gb = $("garrison");
  gb.classList.toggle("gone", !garrisonFx);
  $("garrison-out").textContent = say("foodPerMin", { n: perMinText(garrisonFood * 60) });
  if (garrisonFx) gb.title = say("garrisonTip", { coef: garrisonFx.e.coef, per: garrisonFx.e.per }) + TEXT.takenOff;
  if (x) cover.food.push(say("garrisonCover", { n: state.garrison, x: x.toFixed(2) }));
}
const EXTRA_LINES = [
  { id: "forage", from: "food", to: "wood", each: () => forageEach(), on: () => fxOn("forage"), tip: "forageTip",
    cover: "foragersCover", always: true },
  { id: "wood-food", from: "wood", to: "food", each: (r) => woodFoodShare() * r.wood, on: () => fxOn("woodfood"),
    tip: "woodFoodTip", cover: "jacksCover" },
  { id: "food-gold", from: "food", to: "gold", each: (r) => foodGoldShare() * r.food, on: () => fxOn("foodgold"),
    tip: "foodGoldTip", who: () => FOOD_GOLD_WHO[state.food],
    showWho: (w) => { $("food-gold-who").innerHTML = w[0]; } },
  { id: "stone-gold", from: "stone", to: "gold", each: (r) => stoneGoldShare() * r.stone, on: () => fxOn("stonegold"),
    tip: "stoneGoldTip", cover: "minersCover", shown: () => showStone() },
  { id: "wood-gold", from: "wood", to: "gold", each: (r) => woodGoldShare() * r.wood, on: () => hasWoodGold(),
    tip: "woodGoldTip", cover: "jacksCover" },
  { id: "farm-gold", from: "food", to: "gold", each: () => farmGoldEach(), on: () => hasTechFx("farmgold"),
    tip: "farmGoldTip", cover: "farmersCover" },
  { id: "trade-food", from: "gold", to: "food", each: (r) => tradeFoodShare() * r.gold, on: () => fxOn("tradefood"),
    tip: "tradeFoodTip", who: tradeWho, showWho: (w) => { $("trade-food-who").textContent = w[0]; } },
];
function tradeWho() {
  const [many, one] = KIND[tradeSrc()] || [];
  return [many, one, many];
}
function showExtraLine(line, r, tot, cover) {
  const each = line.each(r), n = each ? vils(tot[line.from]) : 0;
  const x = Math.min(tot[line.to], (n * each) / r[line.to]);
  tot[line.to] -= x;
  const el = $(line.id);
  el.classList.toggle("gone", !line.on());
  el.hidden = !each || !(line.shown ? line.shown() : true);
  if (each || line.always) {
    $(line.id + "-out").textContent = perMinText((inTE() ? state.te.vils[line.from] : n) * each * 60);
    const v = { n: fmt(each * 60) };
    if (line.who) {
      const w = line.who();
      line.showWho(w);
      v.who = w[1];
    }
    el.title = say(line.tip, v) + (inTE() ? "" : TEXT.takenOff);
  }
  if (!x) return;
  if (!line.who) { cover[line.to].push(say(line.cover, { n, s: pluralEnd(n), x: x.toFixed(2) })); return; }
  const w = line.who();
  cover[line.to].push(say("whoCover", { n, who: n === 1 ? w[1] : w[2], x: x.toFixed(2) }));
}
function showTotals(tot, cover, builders) {
  let grand = 0, exact = 0;
  RES.forEach((res) => {
    const n = vils(tot[res]);
    if (!inTE()) vrTot[res] = n;
    if (kindOf(res) === "vils") { grand += n; exact += tot[res]; }
    const td = $("tot-" + res);
    td.textContent = n;
    td.title = `${tot[res].toFixed(2)} ${unitWord(res)}` + (cover[res].length
      ? say("afterCover", { list: cover[res].join(TEXT.and) }) : "");
    td.classList.toggle("zero", n === 0);
  });
  grand += builders;
  exact += builders;
  $("tot-bld").textContent = hasBuildingRow() ? builders : "";
  $("grand").textContent = grand;
  $("grand").title = say("villagersN", { n: exact.toFixed(2) }) +
    (builders ? say("including", { n: builders, s: pluralEnd(builders) }) : "");
  $("tot-count").textContent = state.rows.reduce((s, row) => s + row.count, 0);
}
