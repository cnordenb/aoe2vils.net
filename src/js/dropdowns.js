"use strict";
const relicBox = $("relics"), relicInput = relicBox.querySelector("input");
counter(relicBox, "relics", RELICS_MAX);
const soldierBox = $("soldiers");
counter(soldierBox, "soldiers", SOLDIERS_MAX);
const garrisonBox = $("garrison");
counter(garrisonBox, "garrison", GARRISON_MAX, update, GARRISON_STEP);
const tcBox = $("tc-castles");
counter(tcBox, "tcCastles", TC_MAX, renderRows);
$("age").addEventListener("change", (e) => {
  if (e.target.name !== "age") return;
  state.age = +e.target.value;
  if (state.age !== 3) setPostImp(false);
  syncSettings();
  renderTechs();
  renderCivFx();
  renderRows();
  fit();
  save();
  if (unitCombo.isOpen()) { unitCombo.render(); unitInput.focus({ preventScroll: true }); }
});
function fxText(e, x) {
  if (e.p === undefined || e.label.indexOf("{p}") === -1) return fill(e.label, "") + source(x);
  const p = pct(e);
  if (p) return fill(e.label, p) + source(x);
  if (!Array.isArray(e.p)) return `<span class="off">${fill(e.label, p)}</span>`;
  const first = e.p.findIndex((v) => v);
  return `<span class="off">${say("fromAge", { what: fill(e.label, e.p[first]), age: AGES[first] })}</span>`;
}
function renderCivFx() {
  const el = $("civ-fx");
  if (fttOn()) {
    el.textContent = TEXT.fttInhibits;
    el.title = el.textContent;
    return;
  }
  const own = state.civ;
  const out = [];
  if (own !== GENERIC) {
    const parts = fxOf(own).filter((e) => e.k !== "unlock" && relevant(e)).map((e) => fxText(e, { e, from: null }));
    out.push(`<strong>${own}:</strong> ` + (parts.length ? parts.join("; ") + "." : TEXT.noCivBonuses));
  }
  if (state.allies.length) {
    const parts = [];
    state.allies.forEach((a) => {
      if (a !== own) fxOf(a).filter((e) => e.team && relevant(e)).forEach((e) => parts.push(fxText(e, { e, from: a })));
    });
    out.push(parts.length ? parts.join("; ") + "." : TEXT.noTeamBonuses);
  }
  el.innerHTML = out.length ? out.join(" ") : TEXT.noBonuses;
  el.title = el.textContent;
}
function renderTechs() {
  const utBox = (t) => {
    const open = ageOpen(t.age) && !state.ftt;
    const title = tip(state.ftt ? TEXT.notWithFtt : open ? "" : say("availableFrom", { age: AGES[t.age - 1] }), t.desc);
    return `<label class="opt${open ? "" : " na"}"` +
      ` title="${esc(title)}"${navalOk(t) ? "" : " hidden"}><input type="checkbox"` +
      ` data-ut="${esc(t.name)}"${state.uts.indexOf(t.name) !== -1 && open ? " checked" : ""}${open ? "" : " disabled"}>
        <span><span class="tn">${esc(t.name)}</span><span class="te">${esc(t.desc)}</span></span></label>`;
  };
  const uts = civTechs().filter((t) => !inTE() || teTech(t));
  $("ut-list").innerHTML =
    UT_AGES.map((a) => `<div class="ut-slot">${uts.filter((t) => t.age === a).map(utBox).join("")}</div>`).join("");
  $("ut-list").classList.toggle("none", !shownTechs().length);
  if (!hasCrane()) state.crane = false;
  const cr = $("crane"), crOpen = craneOpen();
  cr.closest(".opt").hidden = !state.bldOn || inTE();
  cr.checked = state.crane && crOpen;
  cr.disabled = !crOpen;
  cr.closest(".opt").classList.toggle("na", !crOpen);
  cr.closest(".opt").title = tip(!hasCrane() ? say("cantResearch", { civ: state.civ, tech: NAMES.crane })
    : crOpen ? "" : say("availableFrom", { age: AGES[CRANE_AGE - 1] }), CRANE_DESC);
  if (!hasShipwright()) state.shipwright = false;
  const sw = $("shipwright"), swOpen = shipwrightOpen();
  sw.closest(".opt").hidden = !state.dock || inTE();
  sw.checked = state.shipwright && swOpen;
  sw.disabled = !swOpen;
  sw.closest(".opt").classList.toggle("na", !swOpen);
  sw.closest(".opt").title = tip(!hasShipwright() ? say("cantResearch", { civ: state.civ, tech: NAMES.shipwright })
    : swOpen ? "" : say("availableFrom", { age: AGES[SHIPWRIGHT_AGE - 1] }), SHIPWRIGHT_DESC);
  const c = $("consc"), open = ageOpen(CONSCRIPTION_AGE), cFree = open && freeUp("consc");
  c.checked = (state.consc || cFree) && open;
  c.disabled = !open || cFree;
  c.closest(".opt").classList.toggle("na", !open);
  c.closest(".opt").classList.toggle("fixed", cFree);
  c.closest(".opt").title =
    tip(!open ? say("availableFrom", { age: AGES[CONSCRIPTION_AGE - 1] }) : cFree
    ? say("freeFor", { civ: state.civ }) : "", CONSC_DESC);
}
$("techs").addEventListener("change", (e) => {
  const t = e.target;
  if (t.classList.contains("postimp-box")) return;
  if (t.id === "consc") state.consc = t.checked;
  else if (t.id === "crane") state.crane = t.checked;
  else if (t.id === "shipwright") state.shipwright = t.checked;
  else if (t.dataset.ut) {
    state.uts = state.uts.filter((n) => n !== t.dataset.ut);
    if (t.checked) state.uts.push(t.dataset.ut);
  } else return;
  if (!t.checked) setPostImp(false);
  renderRows();
  fit();
  save();
});
function syncFtt() {
  const gen = state.civ === GENERIC;
  fttBox.closest("label").hidden = gen;
  fttBox.checked = !gen && state.ftt;
  ruBox.closest("label").hidden = !gen;
  ruBox.checked = state.regional;
}
function setCiv(civ) {
  state.civ = civ;
  if (civ === GENERIC) state.ftt = false;
  if (state.postimp) postImpTechs();
  syncFtt();
  renderTechs();
  renderCivFx();
  syncSettings();
  renderRows();
  fit();
  save();
}
function comboOpen(c) {
  if (!c.isOpen()) { c.list.hidden = false; c.input.setAttribute("aria-expanded", "true"); }
  const r = c.input.getBoundingClientRect();
  c.list.style.maxHeight = Math.max(140, window.innerHeight - r.bottom - 16) + "px";
  comboRender(c);
}
function comboClose(c) {
  c.list.hidden = true;
  c.input.setAttribute("aria-expanded", "false");
  c.input.removeAttribute("aria-activedescendant");
  c.active = -1;
}
function comboPrimeOpen(c) {
  if (c.o.prime) c.o.prime();
  comboOpen(c);
}
function comboOptionHtml(o, it, pos) {
  const selected = o.multi ? !!it.selected : false;
  const disabled = it.disabled ? ' aria-disabled="true"' : "";
  const title = it.title ? ` title="${esc(it.title)}"` : "";
  const check = o.multi ? '<span class="ck"></span>' : "";
  return `<li role="option" id="${o.id}-${pos}" data-pos="${pos}" aria-selected="${selected}"${disabled}${title}>` +
    `${check}<span class="nm">${esc(it.label)}</span>${it.meta || ""}</li>`;
}
function comboRender(c) {
  const o = c.o, q = o.query();
  c.items = o.items(q);
  if (!c.items.length) {
    c.list.innerHTML = `<li class="none" role="presentation">${o.empty(q)}</li>`;
    c.active = -1;
    c.input.removeAttribute("aria-activedescendant");
    return;
  }
  let html = "", grp = null, parent = null;
  c.items.forEach((it, pos) => {
    if (!o.multi && it.parent && it.parent !== parent) {
      parent = it.parent;
      grp = null;
      html += `<li class="parent" role="presentation">${parent}</li>`;
    }
    if (!o.multi && it.group && it.group !== grp) {
      grp = it.group;
      html += `<li class="grp" role="presentation">${grp}</li>`;
    }
    html += comboOptionHtml(o, it, pos);
  });
  c.list.innerHTML = html;
  const start = o.start(c.items, q);
  c.list.scrollTop = 0;
  comboSetActive(c, start, true);
}
function comboScrollTo(list, el) {
  let top = el.offsetTop, prev = el.previousElementSibling;
  while (prev && prev.getAttribute("role") === "presentation") {
    top = prev.offsetTop;
    prev = prev.previousElementSibling;
  }
  const bottom = el.offsetTop + el.offsetHeight;
  if (top < list.scrollTop) list.scrollTop = top;
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
}
function comboSetActive(c, pos, scroll) {
  const prev = c.list.querySelector(".active");
  if (prev) { prev.classList.remove("active"); if (!c.o.multi) prev.setAttribute("aria-selected", "false"); }
  c.active = pos;
  if (pos < 0 || pos >= c.items.length) { c.input.removeAttribute("aria-activedescendant"); return; }
  const el = $(`${c.o.id}-${pos}`);
  el.classList.add("active");
  if (!c.o.multi) el.setAttribute("aria-selected", "true");
  c.input.setAttribute("aria-activedescendant", el.id);
  if (scroll) comboScrollTo(c.list, el);
}
function comboChoose(c, pos) {
  if (pos < 0 || pos >= c.items.length) return;
  const it = c.items[pos], v = it.value;
  if (!c.o.multi) { if (!it.disabled) { c.o.choose(v); comboClose(c); } return; }
  if (it.disabled) {
    c.input.value = "";
    comboRender(c);
    return;
  }
  c.o.choose(v);
  c.input.value = "";
  comboRender(c);
  comboSetActive(c, Math.max(0, c.items.findIndex((x) => x.value === v)), true);
}
const COMBO_KEYS = {
  ArrowDown(c, e) {
    e.preventDefault();
    if (!c.isOpen()) { comboPrimeOpen(c); if (c.active < 0) comboSetActive(c, 0, true); }
    else comboSetActive(c, Math.min(c.items.length - 1, c.active + 1), true);
  },
  ArrowUp(c, e) {
    e.preventDefault();
    if (c.isOpen()) comboSetActive(c, Math.max(0, c.active - 1), true);
  },
  PageDown(c, e) {
    if (c.isOpen()) { e.preventDefault(); comboSetActive(c, Math.min(c.items.length - 1, c.active + 8), true); }
  },
  PageUp(c, e) {
    if (c.isOpen()) { e.preventDefault(); comboSetActive(c, Math.max(0, c.active - 8), true); }
  },
  Enter(c, e) {
    e.preventDefault();
    if (c.isOpen() && c.active >= 0) comboChoose(c, c.active);
    else comboOpen(c);
  },
  Escape(c, e) {
    if (c.isOpen()) { e.preventDefault(); comboClose(c); }
    if (c.o.cancel) c.o.cancel(); else c.input.value = "";
  },
  Tab(c) {
    comboClose(c);
  },
};
function comboCancel(c) {
  comboClose(c);
  if (c.o.cancel) c.o.cancel();
}
function comboListen(c) {
  const { o, input, list } = c;
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "combo-toggle";
  toggle.tabIndex = -1;
  toggle.setAttribute("aria-hidden", "true");
  list.after(toggle);
  toggle.addEventListener("mousedown", (e) => e.preventDefault());
  toggle.addEventListener("click", () => {
    if (c.isOpen()) { comboCancel(c); return; }
    input.focus({ preventScroll: true });
    comboPrimeOpen(c);
  });
  input.addEventListener("input", () => comboOpen(c));
  input.addEventListener("click", () => { if (!c.isOpen()) comboPrimeOpen(c); });
  input.addEventListener("keydown", (e) => { if (Object.hasOwn(COMBO_KEYS, e.key)) COMBO_KEYS[e.key](c, e); });
  list.addEventListener("mousedown", (e) => e.preventDefault());
  list.addEventListener("click", (e) => {
    const li = e.target.closest('[role="option"]');
    if (li) comboChoose(c, +li.dataset.pos);
  });
  list.addEventListener("mousemove", (e) => {
    const li = e.target.closest('[role="option"]');
    if (li && +li.dataset.pos !== c.active) comboSetActive(c, +li.dataset.pos, false);
  });
  document.addEventListener("pointerdown", (e) => {
    if (!c.isOpen() || input.parentNode.contains(e.target)) return;
    if (o.keepOpen && e.target.closest(o.keepOpen)) return;
    comboCancel(c);
  });
  if (o.keepOpen) document.querySelectorAll(o.keepOpen).forEach((el) =>
    el.addEventListener("mousedown", (e) => e.preventDefault()));
  input.addEventListener("blur", () => setTimeout(() => {
    const el = document.activeElement;
    if (el === input || (o.keepOpen && el && el.closest && el.closest(o.keepOpen))) return;
    comboCancel(c);
  }, 150));
}
function combo(o) {
  const c = { o, input: o.input, list: o.list, items: [], active: -1 };
  c.isOpen = () => !c.list.hidden;
  comboListen(c);
  return { isOpen: c.isOpen, open: () => comboOpen(c), close: () => comboClose(c), render: () => comboRender(c) };
}
const groupName = (g) => (GROUP_RENAME[g] && GROUP_RENAME[g].civs.indexOf(state.civ) !== -1 ? GROUP_RENAME[g].name : g);
const unitInput = $("unit-search");
const unitCombo = combo({
  input: unitInput, list: $("unit-list"), id: "uopt", keepOpen: ".adder-opts, #age, .postimp-opt",
  query: () => norm(unitInput.value),
  items: (q) => {
    const tokens = q.split(" ").filter(Boolean);
    const inTable = new Set(state.rows.map((r) => r.name));
    const out = [];
    const customItem = (kind) => {
      const d = CUSTOM[kind], n = customRows(kind).length;
      if (!tokens.every((t) => norm(d.prefix).includes(t))) return null;
      return { value: "custom-" + kind, label: d.prefix + "...", names: [], parent: d.parent, disabled: n >= CUSTOM_MAX,
        meta: n ? `<span class="added">${say("inTableOf", { n, max: CUSTOM_MAX })}</span>` : "" };
    };
    const cu = customItem("unit");
    if (cu) out.push(cu);
    const pv = view();
    UNITS.forEach((u, i) => {
      const s0 = searchOf(i);
      if (pv && pv.hidden.has(i)) return;
      const s = (pv && pv.search.get(i)) || s0;
      if (!available(i) || (!state.dock && NAVAL(u)) || (!state.bldOn && BLD(u))
        || !tokens.every((t) => s.includes(t))) return;
      if (state.civ === GENERIC && !state.regional && REGIONAL_OR_UNIQUE(u)) return;
      let hint = "";
      const shown = displayName(i);
      const names = (pv && pv.search.get(i) ? LINE_NODES[LINE_OF[members(u)[0]]] : members(u)).filter(uniqueShown);
      if (tokens.length && !tokens.every((t) => norm(shown).includes(t))) {
        const m = names.find((x) => tokens.every((t) => norm(x).includes(t)));
        if (m && m !== shown) hint = `<span class="alias">${esc(m)}</span>`;
      }
      const suffix = ` (${u[1]})`;
      const label = shown.endsWith(suffix) ? shown.slice(0, -suffix.length) : shown;
      out.push({ value: i, label, names, group: groupName(u[1]), parent: parentOf(u), title: u[10]
        ? u[10].join(", ") : "",
        meta: hint + (inTable.has(u[0]) ? `<span class="added">${TEXT.inTable}</span>` : "")
          + `<span class="meta">${costMeta(u, false)}</span>` });
    });
    const cb = state.bldOn && customItem("building");
    if (cb) {
      const at = out.findIndex((it) => it.parent === CUSTOM.building.parent);
      out.splice(at < 0 ? out.length : at, 0, cb);
    }
    return out;
  },
  start: (items, q) => {
    if (!q) return -1;
    const i = items.findIndex((it) => it.names.concat(it.label).some((m) => norm(m).startsWith(q)));
    return i < 0 ? 0 : i;
  },
  empty: () => {
    const who = state.civ === GENERIC ? "" : say("forCiv", { civ: esc(state.civ) });
    return unitInput.value.trim()
      ? say("nothingMatches", { q: esc(unitInput.value), who, age: AGES[state.age] })
      : say("nothingAvailable", { who, age: AGES[state.age] });
  },
  choose: (i) => { if (typeof i === "string") addCustom(i.slice("custom-".length)); else addUnit(i); unitInput.value =
    ""; },
});
