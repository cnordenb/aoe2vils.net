"use strict";
const SCRIPTS = ["rates", "totals", "table", "settings", "dropdowns", "controls"];
const members = (u) => u[10] || [u[0]];
const MATCH_KINDS = {
  flag: (f) => (u) => u[7].indexOf(f) !== -1,
  names: (n) => (u) => members(u).some((m) => n.indexOf(m) !== -1),
  entry: (n) => (u) => n.indexOf(u[0]) !== -1,
  groups: (g) => (u) => g.indexOf(u[1]) !== -1,
  any: (specs) => { const fs = specs.map(matcher); return (u) => fs.some((f) => f(u)); },
  all: (specs) => { const fs = specs.map(matcher); return (u) => fs.every((f) => f(u)); },
  not: (spec) => { const f = matcher(spec); return (u) => !f(u); },
  is: (name) => (u) => DATA.MATCH[name](u),
};
function matcher(spec) {
  const [kind] = Object.keys(spec);
  return MATCH_KINDS[kind](spec[kind]);
}
function compileEffect(e) {
  if (e.m) e.m = matcher(e.m);
  if (e.tcStep) Object.defineProperty(e, "p", { get: () => e.tcStep * DATA.STATE.tcCastles, enumerable: true });
  if (e.coef) e.perMin = (f) => e.coef * Math.log(f / e.per + 1);
}
function parseData(data) {
  data.MATCH = Object.fromEntries(Object.entries(data.MATCH).map(([name, spec]) => [name, matcher(spec)]));
  Object.values(data.FX).forEach((list) => list.forEach(compileEffect));
  Object.values(data.UT).forEach((list) => list.forEach((t) => t.fx.forEach(compileEffect)));
  [data.CRANE, data.CONSCRIPTION].concat(data.SHIPWRIGHT).forEach(compileEffect);
}
function addFont({ family, weight, style, data }) {
  const bin = atob(data), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  document.fonts.add(new FontFace(family, bytes, { weight, style, display: "block" }));
}
function addScript(name) {
  const script = document.createElement("script");
  script.src = `src/js/${name}.js`;
  script.async = false;
  document.body.append(script);
}
fetch("src/data.json")
  .then((response) => response.json())
  .then((data) => {
    data.FONTS.forEach(addFont);
    window.DATA = data;
    parseData(data);
    document.body.hidden = false;
    SCRIPTS.forEach(addScript);
  });
