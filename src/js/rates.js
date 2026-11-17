"use strict";
const { CIV_NAMES, UNITS, MEMBERS, EDGES, RES, LETTER, AGES, BASE, LUMBER, FOOD, FISH_SHIP, TRAP_AGE, SPOT_TIP,
  TRAP_FOOD, TRAP_TIME, FARM_TABLES, NICHE, STD_SRC, HEADS, FOOD_STD, KIND, WHALE, TRADE_D, TRADE_UNIT, CARAVAN_SPEED,
  HULL_SPEED, TRADE_BUMP, MULT, REQUIRES, UPS, TECH_DESC, CONSC_DESC, CRANE_DESC, SHIPWRIGHT_DESC, TECH_NAME,
  PASTURE_TECH, TECH_AGE, TECH_AGE_CIV, NO_TECH, FX, UT, CONSCRIPTION_AGE, CRANE_AGE, CRANE_MISSING, CRANE,
  SHIPWRIGHT_AGE, SHIPWRIGHT_MISSING, SHIPWRIGHT, CONSCRIPTION, BUILDING_GROUPS, RENAMED, TE_AFTER, TE_AFTER_SECS,
  TE_AFTER_MAX, TE_MAX, SOLDIERS_MAX, GARRISON_START, GARRISON_MAX, GARRISON_STEP, TC_MAX, IDLE_MAX, IDLE_VIL_T, SIZE,
  BUILDERS_BY_SIZE, MAX_BUILDERS, CUSTOM_MAX, CUSTOM, CUSTOM_BUILDERS, CUSTOM_NEW_T, MAX_ALLIES, TE_KINDS,
  EARLY_UNIQUE, AGE_TIME, CUSTOM_RATE, RELIC_AGE, CHURCH_AGE, FOOD_GOLD_WHO, NAME_WITH_UNIQUE, WORKER, AGE_UP,
  MIN_ROWS, UP_RES, GENERIC, NAMES, RENAMED_CIVS, BUILDERS_DEFAULT, CUSTOM_AGE, CUSTOM_T_MIN, CUSTOM_RATE_MIN,
  CUSTOM_RATE_MAX, RELIC_GOLD, WHALE_UPGRADE, TRADE_GOLD, BUILD_TIME, FARM_FOOD, PASTURE_FOOD, PASTURE_VILS,
  HOUSE_POP, KIND_WORD, KIND_SHORT, WIDE_ONLY, TEXT, MAX_COUNT, RES_WORD, RELICS_MAX, GROUP_RENAME, UT_AGES } = DATA;
const { UNIQUE, BLD, REGIONAL_OR_UNIQUE, NO_BUILDERS, HALF_POP, NAVAL } = DATA.MATCH;
const DEFAULTS = structuredClone(DATA.STATE);
const state = DATA.STATE;
UPS.forEach((k) => { state.up[k] = false; });
const say = (key, v = {}) => TEXT[key].replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
const CHURCH_FX = Object.values(FX).flat().find((e) => e.k === "church");
const pluralEnd = (n) => (n === 1 ? "" : TEXT.pluralS);
const fishKey = () => (on("gn") ? "gn" : on("fl") ? "fl" : "");
const fishSpot = () => (state.fish === "trap" && !ageOpen(TRAP_AGE) ? "deep" : state.fish);
const spotTip = (s) =>
  tip(s === "trap" && !ageOpen(TRAP_AGE) ? say("availableFrom", { age: AGES[TRAP_AGE - 1] }) : "", SPOT_TIP[s]);
const tip = (why, desc) => (why ? `${why}. ${desc}` : desc);
const CIVS = [GENERIC].concat(CIV_NAMES);
const byName = new Map(UNITS.map((u, i) => [u[0], i]));
const parentOf = (u) => (BUILDING_GROUPS.indexOf(u[1]) !== -1 ? CUSTOM.building.parent : CUSTOM.unit.parent);
const norm = (s) => s.toLowerCase().replace(/[-\s]+/g, " ").trim();
const searchOf = (i) =>
  { const u = UNITS[i]; return [u[0]].concat(members(u).filter(uniqueShown), [u[1], parentOf(u)]).map(norm).join(
  " | "); };
const ALIAS = new Map();
UNITS.forEach((u) => members(u).forEach((m) => { if (!byName.has(m)) ALIAS.set(m, u[0]); }));
const maxBuilders = (name) => MAX_BUILDERS[name] || BUILDERS_BY_SIZE[SIZE[name]]
  || (CUSTOM.building.re.test(name) ? CUSTOM_BUILDERS : BUILDERS_DEFAULT);
Object.values(CUSTOM).forEach((d) => { d.re = new RegExp(`^${d.prefix} [1-${CUSTOM_MAX}]$`); });
const CUSTOM_ALL_AGES = String(CUSTOM_AGE).repeat(CIV_NAMES.length);
const customKind = (name) => Object.keys(CUSTOM).find((k) => CUSTOM[k].re.test(name));
const customRows = (kind) => state.rows.filter((r) => r.custom && (!kind || customKind(r.name) === kind));
const clampNum = (v, min, max, none) =>
  { const n = parseFloat(v); return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : none; };
const cleanCustom = (c, kind) => Object.assign(
  Object.fromEntries(RES.map((r) =>
    [r, CUSTOM[kind].res.indexOf(r) !== -1 ? Math.round(clampNum(c && c[r], 0, CUSTOM[kind].max, 0)) : 0])),
  { t: Math.round(clampNum(c && c.t, CUSTOM_T_MIN, CUSTOM[kind].max, CUSTOM_NEW_T) * 10) / 10 });
const rowUnit = (row) => (row.custom
  ? [row.name, NAMES.customGroup, row.custom.wood, row.custom.food, row.custom.gold, row.custom.stone, row.custom.t,
  CUSTOM[customKind(row.name)].flags, CUSTOM_ALL_AGES, CUSTOM_AGE]
  : UNITS[byName.get(row.name)]);
const KEY = "villagers-required.v3";
const $ = (id) => document.getElementById(id);
const tbody = $("rows");
const table = $("sheet");
const wrap = $("sheet-wrap");
const clearBtn = $("clear");
function isCleared() {
  return !state.rows.length && state.civ === GENERIC && !state.allies.length && state.age === DEFAULTS.age &&
    state.food === DEFAULTS.food && state.fish === DEFAULTS.fish
      && Object.keys(DEFAULTS.src).every((r) => state.src[r] === DEFAULTS.src[r]) && !state.tradeBump && !state.relics
      && !state.soldiers && state.garrison === GARRISON_START && state.tcCastles === DEFAULTS.tcCastles && !state.idleTc
      && !state.idleT && !state.consc && !state.crane && !state.shipwright && !state.uts.length && !state.postimp &&
    UPS.every((k) => !state.up[k]) && RES.every((r) => !state.church[r]) && state.te.after === TE_AFTER_SECS &&
    (!inTE() || (state.te.research === state.age + 1 && RES.every((r) => !state.te.vils[r])));
}
const teCleared = () => RES.every((r) => !state.te.vils[r]);
function anyTechOn() {
  const inReseed = (k) => reseedShown && !inTE() && (k === "hcol" || k === "hp" || k === "crop");
  return UPS.some((k) => on(k) && !freeUp(k)
    && ((laneShown(k) && (showStone() || (k !== "sm" && k !== "ssm"))) || inReseed(k))) ||
    (!state.ftt && shownTechs().some((t) => state.uts.indexOf(t.name) !== -1 && ageOpen(t.age))) ||
    (state.consc && !freeUp("consc") && ageOpen(CONSCRIPTION_AGE))
      || (state.crane && craneOpen() && state.bldOn && !inTE()) ||
    (state.shipwright && shipwrightOpen() && state.dock && !inTE());
}
function syncButtons() {
  $("reset").hidden = isCleared();
  $("clear-civs").hidden = state.civ === GENERIC && !state.allies.length;
  $("ally-count").textContent = `${state.allies.length}/${MAX_ALLIES}`;
  document.querySelectorAll(".clear-techs").forEach((b) => { b.hidden = !anyTechOn(); });
  document.querySelectorAll(".te-clear").forEach((b) => { b.hidden = teCleared(); });
}
function save() {
  syncButtons();
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {  }
}
function loadRow(r) {
  if (!r) return;
  const count = Math.max(0, Math.min(MAX_COUNT, parseInt(r.count, 10) || 0));
  if (r.custom) {
    const kind = customKind(r.name);
    if (kind && !state.rows.some((x) => x.name === r.name) && customRows(kind).length < CUSTOM_MAX) {
      const b = parseInt(r.builders, 10);
      const builders = kind === "building" && Number.isFinite(b) ? Math.max(0, Math.min(CUSTOM_BUILDERS, b)) : 1;
      state.rows.push({ name: r.name, count, builders, custom: cleanCustom(r.custom, kind) });
    }
    return;
  }
  const plain = String(r.name).replace(/[- ]line(?= \(|$)/, "");
  const name = byName.has(r.name) ? r.name : RENAMED[r.name] || ALIAS.get(r.name) || ALIAS.get(plain);
  if (!name) return;
  const builders = Math.max(1, Math.min(maxBuilders(name), parseInt(r.builders, 10) || 1));
  const same = state.rows.find((x) => x.name === name);
  if (same) same.count = Math.min(MAX_COUNT, same.count + count);
  else state.rows.push(Object.assign({ name, count, builders }, r.perVil ? { perVil: true } : {}));
}
function loadCivs(s, cur) {
  if (FOOD_STD.some(([v]) => v === s.food) || NICHE.food.some((o) => o.id === s.food)
    || s.food === "custom") state.food = s.food;
  if (FISH_SHIP[s.fish]) state.fish = s.fish;
  if (s.up) UPS.forEach((k) => { state.up[k] = !!s.up[k]; });
  const civName = (c) => RENAMED_CIVS[c] || c;
  if (CIVS.indexOf(civName(s.civ)) !== -1) state.civ = civName(s.civ);
  if (Array.isArray(s.allies)) {
    state.allies = s.allies.map(civName).filter((c, i, arr) => CIV_NAMES.indexOf(c) !== -1
      && arr.indexOf(c) === i).slice(0, MAX_ALLIES);
  }
  if (cur && s.age >= 0 && s.age <= AGES.length - 1) state.age = s.age | 0;
}
function loadTE(te) {
  if ([1, 2, 3, TE_AFTER].indexOf(te.research) !== -1) state.te.research = te.research;
  const after = parseInt(te.after, 10);
  if (Number.isFinite(after)) state.te.after = Math.max(0, Math.min(TE_AFTER_MAX, after));
  if (te.vils) RES.forEach((r) => {
    const v = parseInt(te.vils[r], 10);
    if (Number.isFinite(v)) state.te.vils[r] = Math.max(0, Math.min(TE_MAX, v));
  });
}
function load() {
  try {
    const cur = localStorage.getItem(KEY);
    const s = JSON.parse(cur || localStorage.getItem("villagers-required.v2")
      || localStorage.getItem("villagers-required.v1") || "null");
    if (!s) return;
    if (Array.isArray(s.rows)) {
      state.rows = [];
      s.rows.forEach(loadRow);
    }
    loadCivs(s, cur);
    loadOptions(s);
    if (s.te) loadTE(s.te);
    if (!FOOD_STD.some(([v]) => v === state.food) && !NICHE.food.some((o) => o.id === s.food)
      && state.food !== "custom") state.food = DEFAULTS.food;
    if (Array.isArray(s.uts)) state.uts = s.uts.filter((n) => typeof n === "string");
  } catch (e) {}
}
function loadOptions(s) {
  state.dock = !!s.dock;
  state.useReseed = s.useReseed !== false;
  state.useHouses = s.useHouses !== false;
  state.ftt = !!s.ftt;
  state.regional = !!s.regional;
  state.consc = !!s.consc;
  state.crane = !!s.crane;
  state.shipwright = !!s.shipwright;
  state.postimp = !!s.postimp;
  state.bldOn = !!s.bldOn;
  if (s.src) ["wood", "gold", "stone"].forEach((r) =>
    { if (s.src[r] === "custom" || NICHE[r].some((o) => o.id === s.src[r])) state.src[r] = s.src[r]; });
  if (s.customRate) RES.forEach((r) =>
    { if (Number.isFinite(parseFloat(s.customRate[r]))) state.customRate[r] = clampRate(s.customRate[r]); });
  state.tradeBump = !!s.tradeBump;
  state.relics = Math.max(0, Math.min(RELICS_MAX, parseInt(s.relics, 10) || 0));
  if (s.church) RES.forEach((r) => { state.church[r] = !!s.church[r]; });
  state.soldiers = Math.max(0, Math.min(SOLDIERS_MAX, parseInt(s.soldiers, 10) || 0));
  const gf = parseInt(s.garrison, 10);
  if (Number.isFinite(gf)) state.garrison = Math.max(0, Math.min(GARRISON_MAX, gf));
  const tc = parseInt(s.tcCastles, 10);
  if (Number.isFinite(tc)) state.tcCastles = Math.max(0, Math.min(TC_MAX, tc));
  state.idleTc = !!s.idleTc;
  state.idleT = state.idleTc ? Math.max(0, Math.min(IDLE_MAX, parseInt(s.idleT, 10) || 0)) : 0;
}
const fxOf = (civ) => FX[civ] || [];
const relevant = (e) =>
  (inTE() ? TE_KINDS.indexOf(e.k) !== -1 && (e.k !== "freeups" || e.ups.some((k) => UPS.indexOf(k) !== -1)) &&
    !(teAfter() && (e.k === "ageup" || e.k === "agebonus"))
  : e.k !== "ageup" && e.k !== "agebonus" && inReach(e) && (e.k !== "stonegold" || showStone()));
const RES_AT = { wood: 2, food: 3, gold: 4, stone: 5 };
const changes = (e, u) => (e.k === "flat" ? u[RES_AT[e.res]] > 0 : e.k === "swap" ? u[RES_AT[e.from]] > 0
  : e.k === "cost" ? (e.res || RES).some((r) => u[RES_AT[r]] > 0) : true);
const onlyOf = (e, test, key) => {
  if (e[key] === undefined) {
    const hit = e.m ? UNITS.filter((u) => e.m(u) && changes(e, u)) : [];
    e[key] = hit.length && hit.every(test) ? hit.map((u) => u[0]) : null;
  }
  return e[key];
};
const buildingsOnly = (e) => onlyOf(e, BLD, "_bld");
const navalOnly = (e) => onlyOf(e, NAVAL, "_naval");
const inTable = (names) => names.some((n) => (n === NAMES.house && state.useHouses) ||
  ((n === NAMES.farm || n === NAMES.pasture) && state.useReseed && state.food === "farm")
    || (n === NAMES.fishTrap && trapsOn()) ||
  state.rows.some((r) => r.name === n));
function inReach(e) {
  const b = buildingsOnly(e), nv = navalOnly(e);
  return (!b || state.bldOn || inTable(b)
    || customRows("building").some((r) => { const u = rowUnit(r); return e.m(u) && changes(e, u); })) &&
    (!nv || state.dock || inTable(nv));
}
const fttOn = () => state.ftt && state.civ !== GENERIC;
const inTE = () => state.tab === "te";
const curAge = () => (inTE() ? state.te.research - 1 : state.age);
const teAfter = () => inTE() && state.te.research === TE_AFTER;
function activeFx() {
  const out = [];
  if (!fttOn()) {
    fxOf(state.civ).forEach((e) => out.push({ e, from: null }));
    state.allies.forEach((a) => {
      if (a !== state.civ) fxOf(a).forEach((e) => { if (e.team) out.push({ e, from: a }); });
    });
    civTechs().forEach((t) => {
      if (state.uts.indexOf(t.name) !== -1 && ageOpen(t.age) && navalOk(t)) t.fx.forEach((e) =>
        out.push({ e, tech: t.name }));
    });
  }
  if ((state.consc || freeUp("consc")) && ageOpen(CONSCRIPTION_AGE)) out.push(
    { e: CONSCRIPTION, tech: NAMES.conscription });
  if (state.crane && craneOpen() && state.bldOn && !inTE()) out.push({ e: CRANE, tech: NAMES.crane });
  if (state.shipwright && shipwrightOpen() && state.dock && !inTE()) SHIPWRIGHT.forEach((e) =>
    out.push({ e, tech: NAMES.shipwright }));
  return out;
}
const civTechs = () => (state.civ === GENERIC ? [] : UT[state.civ] || []);
const navalOk = (t) => !t.naval || state.dock;
const teTech = (t) => (t.age < 4 || teAfter())
  && t.fx.some((e) => e.k === "rate" || e.k === "farmgold" || e.k === "woodgold");
const shownTechs = () => civTechs().filter((t) => navalOk(t) && (!inTE() || teTech(t)));
const hasCrane = () => state.civ === GENERIC || state.ftt || CRANE_MISSING.indexOf(state.civ) === -1;
const craneOpen = () => hasCrane() && ageOpen(CRANE_AGE);
const hasShipwright = () => state.civ === GENERIC || state.ftt || SHIPWRIGHT_MISSING.indexOf(state.civ) === -1;
const shipwrightOpen = () => hasShipwright() && ageOpen(SHIPWRIGHT_AGE);
const hasBuildingRow = () => state.rows.some((r) => BLD(rowUnit(r)));
const source = (x) => (x.tech ? say("byTech", { tech: x.tech }) : x.from ? say("fromAlly", { civ: x.from })
  : x.e.team ? TEXT.teamBonus : "");
function allyUnlockAge(name) {
  let best = 0;
  if (fttOn()) return 0;
  state.allies.forEach((a) => fxOf(a).forEach((e) => {
    if (e.k === "unlock" && e.ages[name]) best = best ? Math.min(best, e.ages[name]) : e.ages[name];
  }));
  return best;
}
const pctAt = (e, age) => (Array.isArray(e.p) ? e.p[age] : e.p);
const pct = (e) => pctAt(e, curAge());
const ageOf = (i) => {
  const u = UNITS[i], early = EARLY_UNIQUE[u[0]];
  if (state.civ === GENERIC) return early && state.regional ? Math.min(u[9], early[1]) : u[9];
  const own = +u[8].charAt(CIV_NAMES.indexOf(state.civ));
  let age = state.ftt && !UNIQUE(u) ? u[9] : own;
  if (state.ftt && early && memberHas(early[0])) age = Math.min(age, early[1]);
  const un = allyUnlockAge(u[0]);
  if (un && (!age || un < age)) age = un;
  return age;
};
const available = (i) => { const a = ageOf(i); return a > 0 && a <= curAge() + 1; };
const baseTime = (u) => (AGE_TIME[u[0]] ? AGE_TIME[u[0]][curAge()] : u[6]);
function effective(u) {
  const c = { wood: u[2], food: u[3], gold: u[4], stone: u[5] };
  let t = baseTime(u);
  const applied = [], timeFx = [];
  const fk = u[0] === NAMES.fishTrap && state.food === "fship" ? fishKey() : "";
  if (fk) {
    t = TRAP_TIME[fk];
    applied.push(say("builtIn", { tech: TECH_NAME[fk], t }));
    timeFx.push(applied[0]);
  }
  activeFx().forEach((x) => {
    let e = x.e;
    if (e.k === "rate" && e.src === "fship" && u[0] === NAMES.fishTrap) e =
      Object.assign({}, e, { k: "time", m: () => true });
    if (e.k !== "cost" && e.k !== "flat" && e.k !== "time" && e.k !== "swap") return;
    if (!e.m(u)) return;
    const p = pct(e);
    if (!p) return;
    if (e.k === "cost") (e.res || RES).forEach((r) => { c[r] = c[r] * (1 - p / 100); });
    else if (e.k === "flat") c[e.res] = Math.max(0, c[e.res] - e.v);
    else if (e.k === "swap") { const moved = c[e.from] * e.frac; c[e.from] -= moved; c[e.to] += e.v !== undefined
      ? e.v : moved; }
    else { t = t / (1 + p / 100); timeFx.push(fill(e.label, p) + source(x)); }
    applied.push(fill(e.appliedLabel || e.label, p) + source(x));
  });
  RES.forEach((r) => { c[r] = Math.round(c[r]); });
  return { c, t, applied, timeFx };
}
function fill(label, p) {
  const s = label.replace("{p}", p);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function farmKey() {
  let k = on("hc") ? "hc" : on("wb") ? "wb" : "";
  if (on("hp")) k = k ? k + "+hp" : "hp";
  return k;
}
function rates() {
  const fx = activeFx().map((x) => x.e);
  const tableFx = fx.find((e) => e.k === "farm");
  const farmT = FARM_TABLES[tableFx ? tableFx.t : "generic"];
  const ship = state.food === "fship";
  let food = state.food === "farm" ? farmT[farmKey()] / 60 : ship
    ? FISH_SHIP[fishSpot()][fishKey()] / 60 : FOOD[state.food];
  const boost = fx.reduce((b, e) => (e.k === "ecoboost" ? b * (1 + pct(e) / 100) : b), 1);
  const gain = (ratio) => 1 + (ratio - 1) * boost;
  const m = (keys) => keys.reduce((p, k) => (on(k) ? p * gain(MULT[k]) : p), 1);
  const r = {
    wood: [["dba", ""], ["bs", "dba"], ["tms", "bs"]].reduce((w, [k, prev]) =>
      (on(k) ? w * gain(LUMBER[k] / LUMBER[prev]) : w), LUMBER[""]) / 60,
    food,
    gold: BASE.gold * m(["gm", "gsm"]),
    stone: BASE.stone * m(["sm", "ssm"]),
  };
  fx.forEach((e) => {
    if (e.k !== "rate") return;
    const f = 1 + pct(e) / 100;
    if (e.src === "all") RES.forEach((k) => { if (k !== "food" || !ship) r[k] *= f; });
    else if (e.src === "food") r.food *= f;
    else if (RES.indexOf(e.src) !== -1) r[e.src] *= f;
    else if (e.src === state.food) r.food *= f;
  });
  fx.forEach((e) => {
    if (e.k !== "church" || !ageOpen(CHURCH_AGE)) return;
    RES.forEach((res) => { if (state.church[res] && (res !== "food" || !ship)) r[res] *= 1 + pct(e) / 100; });
  });
  const gtr = activeFx().find((x) => x.tech === NAMES.grandTrunkRoad);
  RES.forEach((res) => {
    const o = nicheOf(res);
    if (!o) return;
    let v = (TRADE_UNIT[o.id] && res === "gold" ? tradePerMin() : o.kind === "whale" ? whalePerMin() : o.perMin) / 60;
    if (res === "gold" && gtr) v *= 1 + pct(gtr.e) / 100;
    r[res] = v;
  });
  RES.forEach((res) => { if (srcOf(res) === "custom") r[res] = (state.customRate[res] || CUSTOM_RATE) / 60; });
  return r;
}
const srcOf = (res) => (res === "food" ? state.food : state.src[res]);
const clampRate = (v) => Math.round(clampNum(v, CUSTOM_RATE_MIN, CUSTOM_RATE_MAX, CUSTOM_RATE) * 10) / 10;
const churchCiv = () => activeFx().some((x) => x.e.k === "church");
const churchShown = (res) => kindOf(res) === "vils" && srcOf(res) !== "custom";
const relicsNow = () => (ageOpen(RELIC_AGE) ? state.relics : 0);
function relicIncome(n = relicsNow()) {
  const xs = activeFx();
  let gold = (n * RELIC_GOLD) / 60;
  xs.forEach((x) => { if (x.e.k === "relicgold") gold *= x.e.mult; });
  const gtr = xs.find((x) => x.tech === NAMES.grandTrunkRoad);
  if (gtr) gold *= 1 + pct(gtr.e) / 100;
  const food = xs.reduce((f, x) => (x.e.k === "relicfood" ? f + (n * x.e.perMin) / 60 : f), 0);
  return { gold, food };
}
const whalePerMin = () =>
  activeFx().reduce((g, x) => (x.e.k === "rate" && x.e.src === "fship" ? g * (1 + pct(x.e) / 100) : g),
  ["fl", "gn"].reduce((g, k) => (on(k) ? g * WHALE_UPGRADE : g), WHALE));
const tradeSrc = () => (TRADE_UNIT[state.src.gold] ? state.src.gold : null);
function tradePerMin() {
  const src = tradeSrc(), u = TRADE_UNIT[src], xs = activeFx();
  if (!u) return 0;
  const boost = xs.reduce((b, f) => (f.e.k === "caravan" ? b * (1 + pct(f.e) / 100) : b), 1);
  let speed = u.speed * (1 + (on("car") ? (CARAVAN_SPEED * boost) / 100 : 0));
  if (src === "cog") {
    ["clk", "crv"].forEach((k) => { if (on(k)) speed *= 1 + HULL_SPEED / 100; });
    speed = Math.ceil(speed * 100 - 1e-9) / 100;
  }
  const x = TRADE_D - u.edge;
  const gold = (TRADE_GOLD.coef * (x / TRADE_D + TRADE_GOLD.add) * 60 * speed) / TRADE_GOLD.div;
  const spanish = xs.reduce((g, f) => (f.e.k === "tradegold" ? g * (1 + pct(f.e) / 100) : g), gold);
  return state.tradeBump && src === "trade" ? spanish * (1 - TRADE_BUMP / 100) : spanish;
}
const forageEach = () =>
  (state.food === "berries" ? activeFx().reduce((w, x) => (x.e.k === "forage" ? w + x.e.perMin / 60 : w), 0) : 0);
const woodFoodShare = () =>
  (state.src.wood === "std" ? activeFx().reduce((m, x) => (x.e.k === "woodfood" ? m + x.e.mult : m), 0) : 0);
const tradeFoodShare = () =>
  (tradeSrc() ? activeFx().reduce((m, x) => (x.e.k === "tradefood" ? m + pct(x.e) / 100 : m), 0) : 0);
const stoneGoldShare = () =>
  (state.src.stone === "std" ? activeFx().reduce((m, x) => (x.e.k === "stonegold" ? m + x.e.mult : m), 0) : 0);
const woodGoldShare = () =>
  (state.src.wood === "std" ? activeFx().reduce((m, x) => (x.e.k === "woodgold" ? m + x.e.mult : m), 0) : 0);
const farmGoldEach = () => (state.food === "farm"
  ? activeFx().reduce((g, x) =>
  (x.e.k === "farmgold" ? g + x.e.perMin[on("hc") ? "hc" : on("wb") ? "wb" : ""] / 60 : g), 0) : 0);
const hasTechFx = (k) => !fttOn() && civTechs().some((t) => t.fx.some((e) => e.k === k));
const hasWoodGold = () => hasTechFx("woodgold");
const foodGoldShare = () =>
  activeFx().reduce((m, x) => (x.e.k === "foodgold" ? m + (x.e.mult[state.food] || 0) : m), 0);
function nicheOf(res) {
  const id = res === "food" ? state.food : state.src[res];
  return NICHE[res].find((o) => o.id === id) || null;
}
const kindOf = (res) => (res === "food" && state.food === "fship" ? "fship" : (nicheOf(res) || { kind: "vils" }).kind);
function nicheAvail(o) {
  if (o.age > curAge() + 1) return false;
  if (!o.civs) return true;
  if (state.civ === GENERIC) return state.regional;
  if (state.ftt) return !!o.unique && o.civs.indexOf(state.civ) !== -1;
  if (o.civs.indexOf(state.civ) !== -1) return true;
  return !!o.team && state.allies.some((c) => o.civs.indexOf(c) !== -1);
}
