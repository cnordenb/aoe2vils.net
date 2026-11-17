# Development log, part 2

- [2026-09-29](#2026-09-29)
- [2026-09-30](#2026-09-30)
- [2026-10-01](#2026-10-01)
- [2026-10-03](#2026-10-03)
- [2026-10-04](#2026-10-04)
- [2026-10-07](#2026-10-07)
- [2026-10-08](#2026-10-08)

Part 2 of the development log. It follows [part 1](DEVLOG1.md) and goes on in [part 3](DEVLOG3.md). The
decisions made in the log are listed in [DECISIONS.md](../DECISIONS.md).

## 2026-09-29

### the Xolotl Warrior, pastures for Khitans, and Fishing Ships and lumberjacks at measured rates

#### What changed

- **The entry.** As specified, a regional Stable unit (in `REGIONAL`): 60 food, 75 gold, 30 s, flags `MSL`, from Castle
  Age for Aztecs, Inca, Maya, Mapuche, Muisca and Tupi; an entry of its own (no `EDGES`, not the Knight-line) after Hei
  Guang in the Stable group, the 191st. Those six are exactly the civs that cannot build a Stable (age string 0), but
  can train it if they have one, it was said, so it is in their dropdown from Castle Age, with or without Full Tech
  Tree: nothing on the page ties a unit to its building. Under Full Tech Tree it opens for every civ, like the other
  regional units (the settled rule). Aztec military training speed, the Inca military food discount, the Huns' Stable
  team bonus, Conscription and Chivalry reach it. This entry, the Castle order and the pastures shifted the notes' line
  numbers by a few from about line 931 on.
- **Checked.** In headless Chrome: Aztecs Imperial 60f 75g / 26.1 s, with a Huns ally 21.7 s; Inca Castle 45f 75g;
  Generic lists it only with Include Regional & Unique.
- **Pasture Reseeding.** For Khitans (pastures, so not under Full Tech Tree), in place of Farm Reseeding, with
  Domestication, Pastoralism and Transhumance: the `hcol`, `hp` and `crop` ticks under other names (`PASTURE_TECH`,
  `techName()`, `techTitle()`), same ages and chain, so a Horse Collar / Heavy Plow tick carries over; Khitans left
  `NO_TECH` for the three. Under Full Tech Tree they have Farms and the normal row. Their Food box's Heavy Plow is
  invisible, space kept (`#food-ups .opt[hidden]`): Pastoralism does not change what farmers carry, so it is only in the
  row. Clear Techs counts `hp` like `hcol` / `crop` for Khitans while the row shows.
- **The numbers.** 2 villagers per pasture: ⌈farmers ÷ 2⌉ pastures (9 → 5), each 110 w and 22 s (the `Pasture` entry,
  through `effective()`). `pastureFood()` = 345 + Domestication 115 + Pastoralism 230 + Transhumance 345 (345 / 460 /
  690 / 1035, the figures given). Cycle = build time + pastureFood ÷ (2 × food rate); lumberjacks = pastures × 110 ÷
  cycle ÷ wood rate. No `farmfood` bonus applies (e.g. a Chinese ally's +10% farm food). Khitans, 1 Town Center of
  villagers, no techs: 6 farmers → 3 pastures, 330w / 475.9 s, 1.79 lumberjacks (with the day's wood rates).
  `FARM_TABLES`' pasture table, from figures given, per minute: 22.8, 24.4 with Wheelbarrow, 25.4 with Hand Cart (were
  22.89 / 23.96 / 25.26); Pastoralism (`hp`) does not change it.
- **Fishing Ship.** A food source at the rates given (`FISH_SHIP`, per minute: 14.4, 15.84 with Fishing Lines, 17.42
  with Gillnets), Fishing Lines and Gillnets in place of Wheelbarrow and Hand Cart; "Fishing" renamed "Fisherman"
  (villagers fishing from the shore). The Japanese Fishing Ship bonus was added (`fship` +5/10/15/20% by age), and the
  Danes' drop-off bonus now says it covers Fishing Ships ("Fishing Ships and Villagers drop off +5% food").
  aoe2techtree, checked on this day: all 56 civs have the Dock, the Fishing Ship (Dark Age), Fishing Lines and Gillnets,
  so neither tech is in `NO_TECH` (from `data/data.json`, `civs[civ].Tech` / `.Unit`, and the per-civ
  `data/trees/<CIVNAME in capitals>.json`, giving each node's `age_id` and `node_status`; aoe2techtree still says Incas
  and Mayans). The same lists match `NO_TECH` for Two-Man Saw, Crop Rotation, Heavy Plow and Horse Collar exactly.
- **`LUMBER`.** Per minute, as given: 23.3, 27.9 Double-Bit Axe, 33.2 Bow Saw, 36.6 Two-Man Saw, replacing .39/s × 1.2 ×
  1.2 × 1.1. Shu Lumberjack food is 6.859% of the lumberjack rate (was a flat 1 per minute).
- **Checked.** Headless Chrome, 8 sizes, 1,920×1,080 to 360×640: Food box and table unmoved. Transition Eco, Generic, 10
  lumberjacks, Researching Feudal = 10 × 23.3/60 × 130 = 504 wood; Malay 304 (78.3 s); Persians 480 (123.8 s).

#### Not done

- Whether every civ having the Xolotl Warrior under Full Tech Tree matches the game was not asked.
- That no farm-food bonus applies to pastures is a choice not confirmed.

### builder limits by footprint, farms with no builders counted, and a relic count in the Gold box

#### What changed

- **Limits.** 1×1 → 14, 2×2 → 22, 3×3 → 33, 4×4 → 44, 5×5 → 53 (`BUILDERS_BY_SIZE`; corrected from 1×1 4 then 8, 2×2 8
  then 16, 3×3 24, 4×4 32 and 5×5 40). `SIZE` holds each building's footprint, from the game data (HSZemi/aoe2dat
  `full.json.xz`, DE update 147949, June 2025; footprint = 2 × `CollisionSize`). As decided: Gate and Palisade Gate
  (4×1) 38 (was 20), in `MAX_BUILDERS`; Pasture by its 2×2 foundation (4×4 when finished); Settlement, newer than the
  data, 3×3. The Mule Cart is built by villagers, as the data says. Fish Traps count in the # Builders total, not in
  Villagers required. Steppers read their limits from their input's `min` / `max` (`limits()`; the `FIELDS` table is
  gone); saved builder counts are clamped on load.
- **By size.** 14: Fish Trap, Mule Cart, Bombard Tower, Outpost, Palisade Wall, Stone/Fortified Wall, Watch Tower-line.
  22: House, Lumber Camp, Mill, Mining Camp, Pasture, Donjon. 33: Dock, Farm, Folwark, Harbor, Settlement, Archery
  Range, Barracks, Blacksmith, Fortified Church, Krepost, Monastery, Stable. 38: Gate, Palisade Gate. 44: Caravanserai,
  Market, Town Center, Castle, Siege Workshop, University. 53: Feitoria, Wonder (53 builders: 3,500 × 3 ÷ 55 = 190.9 s).
- **Farm.** No # Builders stepper, an empty cell, 0 builders counted (the builder is always a villager moved over, or a
  new one who will farm it), so nothing added to the builders total or Villagers required; its time is still the
  one-builder build time (`MAX_BUILDERS` 1, for that only; old saves clamped to 1). `FARM = named("Farm")`. A box
  labelled with the Villager's training time, "25s" (renamed from "One per Villager (25s)"), after the cost on the
  name's line ("Farm 60w / 15s  ☐ 25s"; right after the name in narrow layouts, which hide the cost), so the row is no
  taller (`.row-opts`, inline; its input needs `font: inherit`, or its em is the control's own 13.3px). Ticked
  (`row.perVil`, saved with the row, default off), the row's time is the Villager's training time: 60w every 25 s, not
  15 s. It follows `villagerTime()` = `effective(Villager).t`, so Persian Town Center bonuses shorten it (20.8 s in
  Imperial), the label showing the figure; build-speed bonuses (Spanish, Treadmill Crane) leave the tooltip, cost
  bonuses (Teutons) stay. `effective()` now also returns `timeFx`, the time labels applied. Farm Reseeding still uses
  the build time. Checked from 1,920 to 360 px, Persians' "22.7s" included.
- **Relics.** Below Gold Shaft Mining: a −/+ count 0–99 (`state.relics`, saved, reset by Clear All) and the relics' gold
  per minute (`#relic-out`, e.g. "90g/min", whole numbers from 100 up; the tooltip gives the rate per relic), replacing
  the Relic gold source and the Burgundian Relic food source (old saves with either fall back to the standard source).
  Before Castle Age (`RELIC_AGE`) it shows 0, greyed and locked ("Available from Castle Age"), the number kept for
  Castle Age like an age-locked tick (`relicsNow()`; locking in `syncSettings()`). Hidden, space kept, in Transition
  Eco, where relics do not count; `relicgold` left `TE_KINDS`. The Gold dropdown, always shown before because of Relic,
  now hides like the others.
- **Relic income.** `relicIncome(n)`, Villagers Required only: 30 gold per minute each, × 1.33 with an Aztec civ or ally
  (`relicgold`), × 1.1 with Grand Trunk Road; plus 20 food each with a Burgundian civ or ally (the team bonus
  `relicfood`, so off under Full Tech Tree and never for Generic alone; Burgundians now have an `FX` entry, so their
  bonus line shows it, and no team-bonus income source is left). In `update()` the income ÷ the resource's rate per
  gatherer comes off that total (never below 0) before Farm Reseeding counts farmers; row cells are unchanged, and the
  total's tooltip says how much the relics cover. Britons, Knight-line + Villager, 3 relics: gold 6.58 − 3.95 = 2.63 →
  3. Checked at 11 sizes (1,920×1,080 to 360×640, phones sideways too), both tabs, 99 Aztec relics ("3950g/min")
  included: it fits the line spare below Gold's two upgrades, so no box grows; phones wrap it to two lines (three at 360
  px), inside the height Food's box already sets.

### a House Building row, boxes to leave out either automatic row, rows in one decimal and idle rows greyed

#### What changed

- **The row.** After Farm Reseeding while units (not buildings) are trained, i.e. a unit row has a count above 0, unless
  the civ needs no houses (Huns, not under Full Tech Tree) (`houseBuilding()`, `houseRowHtml()`, `#house-row`, class
  `houses`); not in the dropdown, with no remove button, counts or checkboxes. It reads "[house wood]w / [seconds
  between houses]s", e.g. "25w / 150s" for one Stable of Knights, "25w / 75s" for two. Its wood cell counts lumberjacks
  for the house wood plus the build time as lumberjack time lost ("Lumberjack builds a house, so for every house there
  is 25 seconds of lost villager income on wood"); its tooltip splits the two.
- **The numbers.** `houseBuilding(r, tot, popRate)`, after `reseed()`: `popRate` = Σ over unit rows of count ×
  `unitPop(u)` ÷ train time with its bonuses; `unitPop` = 1, 0.5 for Karambit Warriors (`HALF_POP`), × (1 − p/100) per
  active `pop` effect. Population per house, `housePop()` = 5 + `housepop` effects (Inca +5); seconds between houses =
  housePop ÷ popRate. Cost and build time from `effective(House)`: Wu's team bonus (+100%, 12.5 s), Spanish (+30%),
  Romans (+5%), Treadmill Crane (+20%, only with Buildings ticked). Lumberjacks = houses per second × (house wood ÷ wood
  rate + build time); Britons, 1 Stable of Knights: 25 ÷ 150 ÷ 0.388 = 0.43 + 25 ÷ 150 = 0.17 → 0.60. New FX kinds
  `nohouses` (Huns), `housepop` (Inca) and `pop`, for two Imperial unique techs added to `UT`: Mahayana (Villagers and
  Monks −10%) and Aznauri Cavalry (mounted −20%). Left out, as one-off: Chinese Town Centers +15, Goths +10 in Imperial,
  Slav military buildings +5, Dravidian Docks +5, Tupi towers and Castles +10 (those three team bonuses), Mongol Nomads.
  The builders' time goes into the Wood column even with a non-villager wood source (Feitoria).
- **Opt-outs.** Farm Reseeding and House Building checkboxes at the left of the adder's footer, where the status line
  used to be, both on by default and saved (`state.useReseed`, `state.useHouses`); unticking one hides its row and its
  lumberjacks. They are preferences like Include Dock, so Clear All leaves them. The footer's "Clear table" link is
  right-aligned and keeps its space while hidden (`.adder-foot .linkbtn[hidden]`).
- **Checked.** By hand-calculation in headless Chrome: Britons, Aztecs, Inca, Huns (with and without Full Tech Tree, as
  an ally), Wu (own and ally), Spanish, Treadmill Crane, Malay Karambits, Mahayana (locked in Castle too), Aznauri
  Cavalry. The row costs phones 1 unit row: with both automatic rows 412×780 fits 10, 390×740 7, 360×640 1 (11 / 8 / 2
  without); no page scroll at any size tried. The adder unchanged at 10 sizes; its footer no longer grows 1 px when
  Clear table appears.
- **Cells.** Row cells (units, Farm Reseeding, House Building) show one decimal, rounded normally (e.g. 0.6; was 1,
  rounded up); only the totals round up to whole villagers. Checked from 1,920×1,080 to 360×640 with values up to
  "1989.8": no cell overflows.
- **Idle rows.** At # Buildings 0 a row's whole "name cost / time" string, coloured amounts too, greys to the tone of
  its zero cells (`tr.idle`, set in `update()`); a red "can't make" flag wins. Farm Reseeding and House Building lost
  their wood tint, so they look like unit rows; their names stay italic. Fixed: Crop Rotation for civs without it (e.g.
  Dravidians) was disabled but not greyed after Post-Imp, a civ or age change, or on load; as `renderRows()` runs after
  `syncSettings()` in every refresh chain and rebuilds the row, `reseedRowHtml()` now sets each box's `disabled`, `na`
  (greyed) and tooltip itself.
- **Names.** In the Castle group the unique units come first, alphabetically, then Trebuchet and Petard (moved in
  `UNITS`). "Mayans" → "Maya", "Incas" → "Inca"; `CIV_NAMES` keeps its order, so the per-civ age strings are unchanged,
  and `load()` maps the old names in a saved civ and allies.

## 2026-09-30

### Fishing Ships on Shore, Deep or Trap, fish trap rebuilding, and a helper for headless Chrome

#### What changed

- **Spots.** Radios "Shore" / "Deep" / "Trap" (`state.fish`, default Deep, saved, reset to Deep by Clear All, checked by
  `isCleared()`) in a column right of the upgrades (`.food-row`, `#fish-spot`), in the checkboxes' font and size, one
  per upgrade line; hidden, space kept, for other sources; Transition Eco uses the spot too. Deep, as given: 25.3 / 27.8
  / 30.5 per minute; 2026-09-29's rates became the shore rates. Trap used them (tooltip "(shore fish rate for now)")
  until, later in the day, its own: 20.9 / 23 / 25.3. Japanese Imperial with Gillnets: Deep 36.6, Trap 30.4.
- **Upgrades.** Fishing Lines and Gillnets take Heavy Plow's and Wheelbarrow's places (each pair shares an `.opt-stack`
  grid cell, so nothing moves; ticks kept when the boxes swap); Hand Cart's line stays empty. With Fishing Ship the
  swapped-out boxes stop reserving width (`#food-ups.ship`), leaving room for the radios. The block is `#food-ups` (was
  `#farm-ups`); the indented line to its left (`.nested`) was removed.
- **No room.** On phones and below about 720 px (600 px tablets, 640×360), as chosen: `fitFish()` (in `applyLayout()`)
  measures whether the radios fit beside Fishing Lines / Gillnets, else sets `html.fish-dd`: no radios, and the Food
  dropdown lists the ship per spot, "Ship: Shore" / "Ship: Deep" / "Ship: Trap" (values `fship:shore` and so on, titled
  from the radios' tooltips; the change handler splits the value); resizing across the line keeps the choice. Room to
  spare where they fit: 10 px at 1,920, 6 px mid (1,151–1,320), 13 px at 768, 4 px at 730 and 700×400. The column reads
  "# Fishing Ships" ("# Ships" in the narrow layout, via `.wide-only`, as the long form wraps and pushes the table down
  at 600–1,150 px); Fishing Ships do not count toward Villagers required.
- **Trap from Feudal Age.** Last in the day (`TRAP_AGE`, `fishSpot()`, `spotTip()`): in Dark Age (Transition Eco:
  Researching Feudal) the Trap radio, and "Ship: Trap" in the split dropdown, are greyed and disabled (`.opt.na`,
  tooltip "Available from Feudal Age. Fish Traps"). A Trap choice is kept like an age-locked tick: meanwhile Deep shows
  and counts (its rate, no Fish Trap Rebuilding), and Trap returns in Feudal Age; picking another spot in Dark Age
  replaces it. The radios' tooltips come from `SPOT_TIP` in `syncSettings()`. Everything that computes reads
  `fishSpot()`; `state.fish` stays the saved choice, which `isCleared()` checks.
- **Checked.** The day's first changes, in headless Chrome against HEAD at 23 sizes × 3 food sources × both tabs: no box
  or table moved, but at 360×640, where the removed Food indent makes the boxes 6 px shorter.
- **Helper.** Later in the day: `cdp-lib.mjs` in the session's scratchpad, run with `node --experimental-websocket`
  (Node 21 has no global WebSocket otherwise); Chrome is at `C:/Program Files
  (x86)/Google/Chrome/Application/chrome.exe`. To compare with the last commit, it is written with a byte-safe redirect,
  `cmd /c "git show HEAD:index.html > <file>"` (PowerShell's pipe re-encodes; `git show --output` does not apply to a
  blob), and the helper run with `PAGE=<file>`. That version is to be copied into a new session's scratchpad. Each run
  makes a Chrome profile `%TEMP%\cdp-*` (about 45 MB), never removed by the old helper: 135 of them (6 GB, 28–30 Sep)
  filled the C: drive on this day, and edits failed with ENOSPC; `index.html` was unharmed. They were deleted, and the
  helper now removes earlier runs' profiles (older than 10 min) as it starts; a detached cleanup after exit does not
  survive the tool's process teardown.
- **The row.** Last in the day, "Fish Trap Rebuilding" (`rebuildTraps()`, `trapRowHtml()`, `#trap-row`, class `reseed`,
  so italic and counted in `fillRows()`): Farm Reseeding's counterpart, added by itself between Farm Reseeding and House
  Building while Fishing Ship on Trap is the food source (`trapsOn()`), a ship is needed and the adder's Farm Reseeding
  box is ticked: one box for both, chosen over a third footer box; only one of the two rows can show at a time, so
  nothing moves. No checkboxes (Fishing Lines / Gillnets are in the Food box). It reads "[traps × trap wood]w /
  [cycle]s", its lumberjacks in the wood column; one unit row tall at every size (checked at 13 sizes, no overflow).
- **The numbers.** Traps = the food total rounded up (Fishing Ships, one trap each). Cycle = trap build time
  (`effective(Fish Trap).t`) + `trapFood()` ÷ trap rate per ship (Japanese bonus included); lumberjacks = traps × trap
  wood ÷ cycle ÷ wood rate, trap wood following cost effects (Malay 67 w, Malians 85 w). `trapFood()` = 715
  (`TRAP_FOOD`, as given) × each `trapfood` effect (Malay × 3); no farm-food bonus applies (Maya, Chinese, Sicilians).
  Britons, Knight-line, no upgrades: 6 traps, 600w / 2099.6 s, 0.74 lumberjacks; Gillnets: 5 traps, 500w / 1735.7 s,
  0.74; Malay with Gillnets: 335w / 5127 s, 0.17.
- **Build time.** As given: 47 s, 42 s with Fishing Lines, 40 s with Gillnets (`TRAP_TIME`; the `UNITS` entry says 47,
  was aoe2techtree's 40). `effective()` sets it for the Fish Trap only while Fishing Lines / Gillnets show (Fishing Ship
  food), "Gillnets: built in 40s" in the tooltip; the upgrades' change handler refreshes a Fish Trap row's cost text
  (`refreshRowMeta()`), as it does not re-render rows. Fishing Ships build Fish Traps, so Treadmill Crane (now: builders
  20% faster on every building but the Fish Trap) and the villager builder bonuses (Spanish, Romans) skip it: they match
  `VIL_BLD`, buildings but the Fish Trap. The Japanese "Fishing Ships work +5/10/15/20% faster" bonus does speed it up:
  `effective()` turns a `rate` effect on `fship` into a time effect for the Fish Trap, always, not only with Fishing
  Ship food. Japanese Imperial with Gillnets: 40 ÷ 1.2 = 33.3 s; rebuilding with a Knight-line: 4 traps, 400w / 1446.4
  s, 0.71 lumberjacks.
- **No builders.** Fish Traps are now like Farms: no # Builders stepper, an empty cell, no builders counted anywhere
  (`NO_BUILDERS`, `MAX_BUILDERS` 1, old saves clamped to 1).
- **One per Fishing Ship.** Like the Farm's "25s", a box after the Fish Trap row's cost, labelled with the Fishing
  Ship's training time ("40s"; Persians' Docks and Shipwright shorten it: 33.3 s Imperial, 26.7 s with Shipwright).
  Ticked, the row's time is that training time: 100w every 40 s. Shared code: `WORKER` (Farm → Villager, Fish Trap →
  Fishing Ship), `perWorker()`, `workerTime()`, `perWorkerHtml()` (were `farmPerVil`, `villagerTime`, `farmOptHtml`;
  `FARM` is gone), saved in the same `row.perVil`. The tooltip drops the time effects (Gillnets, Japanese) and adds "One
  per Fishing Ship: a Fishing Ship every 40s". It greys with the row at 0 buildings. "Fish Trap ☐ 40s" is as long as the
  longer unit names, so it wraps where they do (phones and 600 px, where the Unit column is 29 px and every row wraps);
  one line from 768 px. An idle Farm row's "25s" box greys too: its label in that tone, the box at .45 opacity, still
  usable (not disabled: a choice not dictated, like the rest of the row).
- **Malay.** aoe2techtree's "Fish Traps cost -33% and provide +200% food" as two labels, "Fish Traps cost −33%" (`cost`)
  and "Fish Traps provide +200% food" (`trapfood`, a Fish Trap matcher `m` making `buildingsOnly()` treat it as a
  building bonus), listed with Buildings ticked, a Fish Trap row, or Fish Trap Rebuilding in effect (`inReach()`).
- **Tooltips.** The adder's footer boxes were reworded on this day, the farm one again with this row, to name fish trap
  rebuilding: see the dictated wording, on 2026-09-28.

#### Not done

- That the villager builder bonuses (Spanish, Romans) skip the Fish Trap is a reading not confirmed.

### sources renamed, extra-income lines in place of villager sources, Naval with its techs, technologies in fixed places

#### What changed

- **Renames.** The income sources "Trees" (was Lumberjack), "Gold Mine" (was Gold Miner), "Stone Mine" (was Stone
  Miner), "Garrisoned Sheep" / "Garrisoned Cows", and "Custom Rate" (was "Custom...") ending every source dropdown; that
  rate and the headings by source (`fitHeads()`) are with the standing rules, on 2026-09-28. Checked against HEAD:
  unchanged at every size but 360×640 (the Food indent, 6 px more table) and 900×700 (Britons' bonus line a line shorter
  with Buildings off, 20 px more table).
- **Unused upgrades.** Hidden, not greyed (the standing rule; greyed until this day): with a non-standard source,
  `#wood-ups`, `#gold-ups` and `#stone-ups` get `hidden` in `syncSettings()`, `.ups[hidden]` keeping the space; Heavy
  Plow, Wheelbarrow and Hand Cart show only while Farm is the food source (`laneShown()`). Clear Techs counts only ticks
  whose box shows (`anyTechOn()` uses `laneShown()`).
- **Generic's own incomes.** Last, as decided: Generic lists a civ's own incomes (the Feitoria, Garrisoned Sheep / Cows)
  only with Include Regional & Unique ticked (was every source, always), so the box filters Generic's alternative
  incomes too. `nicheAvail()` checks `state.regional` for Generic, and the box runs `syncSettings()`, so unticking it
  puts a chosen one back to the standard source (Trees / Farm / Gold Mine / Stone Mine), the headings following.
- **Extra-income lines.** Sources worked by villagers (Portuguese Forager, Varangian Shepherd / Hunter / Fisherman gold,
  Shu Lumberjack food, then Polish Stone Miner, Vietnamese Lumberjack and Burgundian Farmer gold) counted those
  villagers apart from their main job. Each became an extra-income line that lowers what another resource needs, old
  saves falling back to the standard source; since then no source is worked by villagers. Varangian food gold, Shu
  lumberjack food, Polish stone gold (later in the day) and `fitIncome()`, with its new three-line mode, are with the
  standing rules, on 2026-09-28. Varangian food gold's shares were restated on this day, unchanged: Fishing Ships 5%
  (every spot, Fish Traps included), villagers 10%.
- **Foragers.** Portuguese (own civ, not under Full Tech Tree), `forage` FX, 5 wood per minute per forager, in both
  tabs' bonus lines: with Berries as food source the Wood box reads "+x w/min from Foragers" under the upgrades
  (`#forage`; as asked, centred, italic, all in the muted colour, the number not highlighted, the plus to stress it is
  added). The line exists whenever the civ is Portuguese (`.forage.gone` otherwise), invisible but kept for other food
  sources, so picking Berries moves nothing, and switching to or from Portuguese moves the table one line (20 px, 37 px
  on phones where it wraps), as chosen. `forageEach()`, in `update()` after House Building: foragers = the food total
  rounded up; their wood ÷ wood rate comes off the wood total, never below 0 (in Feitorias if Feitoria is the wood
  source); tooltip "after N foragers cover X". Portuguese Imperial, Knight-line + Villager on Berries: 13 foragers, 65
  w/min, cover all 1.31 lumberjacks → wood 0. Transition Eco adds it to "On reaching" wood (tooltip "(x by foragers)"):
  10 berry villagers, Researching Feudal (104 s) = 86.7.
- **Paper Money.** Last in the day: Vietnamese, Imperial, a unique-tech box in the Technologies panel's Imperial slot,
  desc "Lumberjacks slowly generate gold in addition to wood" (aoe2techtree). `woodgold` (`woodGoldShare()`): 3.55% of
  the lumberjack rate, as given (upgrades and wood bonuses included; was a flat 0.8 per minute), so 0.83 g/min
  unupgraded and 1.30 with Two-Man Saw, only while Trees is the wood source: "+x g/min from Lumberjacks" in the Gold box
  (`#wood-gold`, the same place; exists while the civ has the tech, `hasWoodGold()`, so ticking moves nothing; hidden
  until ticked and in Imperial), x = lumberjacks (the wood total rounded up) × gold each ("after 27 lumberjacks cover
  0.98"). Not in Transition Eco: not a `rate` tech, and Imperial is never the age being left. Checked: 5 Knight-line + 5
  Crossbowman / Arbalester, 27 lumberjacks, +22.3 g/min, gold 54.82 → 53.85; with Two-Man Saw 18 lumberjacks, +23.4,
  53.80; the Gold box's height unchanged by the tick at 13 sizes.
- **Burgundian Vineyards.** Last: Burgundians, Castle Age, built like Paper Money, desc "Farmers slowly generate gold in
  addition to food" (aoe2techtree). `farmgold` (`farmGoldEach()`): gold per farmer per minute by the best of Wheelbarrow
  / Hand Cart, as given, 0.8 / 0.9 / 1, only with Farm food: "+x g/min from Farmers" (`#farm-gold`, the other gold
  lines' place; exists while the civ has the tech, `hasTechFx("farmgold")`), x = farmers (the food total rounded up,
  after relic food) × gold each ("after 12 farmers cover 0.42"). Listed in Transition Eco (`teTech()`), counting when
  Researching Imperial: 10 farmers × 0.8 × 190 s = 25 gold. Checked: Knight-line + Villager, 12 farmers +9.6 g/min;
  Wheelbarrow 11 farmers +9.9; Hand Cart 11 farmers +11; the settings row unchanged by the tick, food source or relics.
- **Relic food line.** Last in the day, as the food was only in the tooltip: with a Burgundian civ or ally
  (`relicfood`), "+x f/min from Relics" in the Food box under the upgrades, after Shu's line (`#relic-food`). It exists
  while the bonus applies (`relicIncome(1).food`; gone under Full Tech Tree), reads "+0" with no relics, and is blank
  (space kept) before Castle Age and in Transition Eco. So a Burgundian civ or ally makes the Food box a line taller
  (+20 px at 1,920; the table moves down), and Shu with a Burgundian ally gets two lines. With this line and the
  Vineyards line, Burgundians' settings row is 10–18 px taller at 600, 412 and 360 px and 640×360, where the Gold box is
  now the taller. Checked at 13 sizes: no overflow or page scroll, one height at 0 / 3 / 99 relics and in Feudal.
- **Naval.** "Include Dock" was renamed "Naval". Besides hiding the Dock group and the Dock, Fish Trap and Harbor, it
  shows and puts into effect the naval techs, as Buildings does Treadmill Crane: Circumnavigation (Portuguese unique
  tech; `naval: true` in `UT`, through `ut()`'s new optional fifth argument of extra properties; `navalOk()`) and
  Shipwright, ticks kept while hidden. Bonuses for buildings only, and, last in the day, naval entries only, leave the
  bonus line while Buildings or Naval is off, unless they reach the table: see the standing rules, on 2026-09-28.
- **Shipwright.** `state.shipwright`, `#shipwright`: Imperial Age, ships (`DOCK` = flag `D`) −20% wood and trained 50%
  faster (aoe2techtree: "Ships cost -20% wood and build +50% faster"; now researched at the University).
  `SHIPWRIGHT_MISSING`, from aoe2techtree's `data.json`, unchanged since 2026-09-28: 29 civs, Armenians, Bohemians,
  Bulgarians, Burgundians, Burmese, Cumans, Franks, Georgians, Hindustanis, Huns, Jurchens, Khitans, Khmer, Lithuanians,
  Malians, Mapuche, Muisca, Persians, Poles, Portuguese, Saracens, Slavs, Tatars, Teutons, Tupi, Vietnamese, Vikings,
  Wei, Wu. Handled like Treadmill Crane: greyed with "X can't research Shipwright" for them, greyed before Imperial,
  ticked by Post-Imp, cleared by Clear Techs and Clear All, hidden in Transition Eco. Britons War Galley / Galleon 90w /
  27 s → 72w / 18 s.
- **Fixed places.** Wide and mid layouts (`html:not(.narrow):not(.tab-te)`), top to bottom: the Castle Age unique tech,
  the Imperial Age one (two `.ut-slot`s in `#ut-list`; no civ has two of one age), Conscription, Shipwright, Treadmill
  Crane (CSS `order`; the DOM and narrow order stay Conscription, Crane, Shipwright). A hidden tech keeps its space
  (Circumnavigation with Naval off, Shipwright, Crane); a missing unique tech leaves a checkbox-high gap. So ticking
  Naval or Buildings moves nothing; switching civ can, as unique techs differ in height.
- **One cell with Post-Imp.** The Post-Imp cell covers the settings row's bottom line (`margin-bottom: -1px` and a
  background), and `placeTechs()` (in `fit()`) moves the column up (negative inline `top` on `#techs`) so the first
  unique tech's place is level with Gold / Stone Shaft Mining (anchored to Gold's, always laid out). `.sheet-wrap` no
  longer clips in the wide layout; `.board` still does. The column's top stays about 14 px below Clear Techs, both
  clickable. With the room gained Franks fit in four rows at 1,366 px and up (the mid layout still adds one or two).
- **Minimum rows.** Wide layout only: at least four rows (`MIN_ROWS`); empty filler rows (`tr.filler`, after the
  automatic rows, each with a hidden stepper so it is as tall as a unit row) give way as rows appear. `fillRows()` also
  adds fillers while Villagers required would cover the technologies above it: Portuguese get one, Franks two (three
  mid), everyone else four. Villagers required is absolutely placed, its number centred on the Totals row
  (`placeGrand()`, from `fillRows()` in `update()` and `fit()`).
- **Checked.** Narrow layouts, phones and Transition Eco unchanged, in the day's regression check.

#### Not done

- On phones (412 px), ticking any unique tech moves the table 19 px, as Clear Techs appears in the strip; found while
  checking Paper Money, true of Goths' Perfusion too; not changed.
- The extra filler rows were not asked about.

### custom units and buildings, rows upgraded by Post-Imp, the Serjeant (Donjon) alone, the Eagle Scout's time by age

#### What changed

- **Dropdown.** `CUSTOM`, `customRowHtml()`, `addCustom(kind)`: "Custom Unit..." first under the Units heading and, with
  Buildings ticked, "Custom Building..." first under Buildings. Each shows with nothing typed or while the text matches
  "custom unit" / "custom building", reads "n/5 in table", and greys out, unpickable, at 5 of its kind (`CUSTOM_MAX`);
  single-select lists (`combo()`) now honour a disabled option. Picking one adds "Custom Unit n" / "Custom Building n"
  (the lowest free n), 0 costs and 30 s, the cursor in its first field.
- **Fields.** On a line under the name (`.cu-fields`), the name's line being too short at all widths (page up to about
  1,440 px; the Unit column 334 px at 1,920, 218 px mid): one line from 1,400 px and on tablets, 2–3 on narrower mid
  widths and phones. Costs 0–999 for a unit, 0–9999 for a building; time 1 s to the same maximum, one decimal. A unit
  has wood, food and gold (a unit cannot cost stone) and a training time; a building wood, gold and stone (no food), a
  build time and a # Builders stepper up to 53 (`CUSTOM_BUILDERS`, the largest building's limit, its size unknown;
  `maxBuilders()`). Last in the day its minimum became 0, the only building below 1: 0 builders counts none (# Builders
  total, Villagers required) but takes the time of 1 (`row.builders || 1` in `rowTime()` / `costMeta()`; `update()`
  counts `row.builders` as it is for custom rows); `load()` keeps 0, clamps below 0 to 0, gives a missing value 1.
- **Saving.** In `state.rows` as `{ name, count, builders, custom: { wood, food, gold, stone, t } }`; `load()` keeps
  names 1–5 of each kind, zeroes the resource the kind cannot have, clamps numbers and builders (`cleanCustom()`), drops
  duplicates. `rowUnit(row)` gives the `UNITS`-style row (group "Custom", flags "" or "B", every age), used wherever
  rows were looked up by name.
- **Bonuses.** Without a type they get only bonuses for every unit or building: Portuguese gold for units; Malians'
  wood, Inca stone, Spanish and Roman builders, Treadmill Crane for buildings. The name's line then shows "→ cost and
  time after bonuses (and builders)" (`.cu-eff`). A custom unit takes 1 population (House Building); a building none,
  and it counts as a building row (the # Builders and Stone columns show) and keeps building bonuses in the bonus line
  with Buildings off (`inReach()`).
- **How many rows fit.** Answered on this day: no fixed number. `addUnit()` / `addCustom()` add the row, `fit()` shrinks
  the table text down to 9 px, and a row that still does not fit is taken out silently. With both automatic rows:
  1920×1080 54 unit rows, 1600×900 38, 1366×768 30, 1280×720 23, 768×1024 34, 412×780 15, 390×740 10, 360×640 1.
- **Wording.** "Custom Unit...", "Custom Building...".
- **Names.** The entries' new names ("Battering Ram-line", "Bombard Cannon", "Elite Skirmisher", "Stone/Fortified Wall",
  "Armored/Siege Elephant", "(Heavy) Camel Rider"), the unique member's name and, last in the day, Camel Scout in Feudal
  Age are with the standing rules, on 2026-09-28.
- **Post-Imp.** Rows move up their line as far as the civ can reach: `postImpTechs()` presses Upgrade (`upgradeRow()`,
  shared with the button) on every row until it cannot, e.g. Archer → Crossbowman / Arbalester, Skirmisher → Elite
  Skirmisher / Imperial Skirmisher, Eagle Scout → Elite Eagle Warrior, Stone Wall-line → Fortified Wall; a row reaching
  one already in the table merges into it. It runs whenever Post-Imp is applied: on ticking it, on a change of civ or
  Full Tech Tree while it is on, and at startup with a saved Post-Imp. `upgradeRow()` also caps builders at the new
  building's limit. Custom rows stay.
- **Serjeant (Donjon).** Last in the day: no Upgrade button; its `EDGES` link to Elite Serjeant (the Castle's entry) is
  gone, so it is a line of its own. Upgrade and Post-Imp used to turn a Donjon row into the Castle's (Elite) Serjeant
  (12 s instead of 16 s); Post-Imp now leaves it "Serjeant (Donjon)".
- **Eagle Scout.** Last in the day, a base time by age (`AGE_TIME`, `baseTime(u)`): 40 s in Feudal Age, 30 s in Castle
  and Imperial, without upgrading (the `UNITS` entry says 40; was aoe2techtree's 46). `baseTime()` is the starting time
  in `effective()` and the base in `costMeta()`'s underline test and tooltip, so 30 s in Castle is not marked as changed
  and bonuses start from it: Aztecs 34.8 s Feudal, 26.1 s Castle ("Base 20f 50g / 30s"); Imperial with Conscription 22.6
  s. Only the Eagle Scout has one.

### aoe2techtree's bonus labels, and bonuses from Mule Carts to Fortified Churches, Saxon Town Centers and Wei soldiers

#### What changed

- **Labels.** The civ and team bonus labels were rewritten to aoe2techtree's wording (the standing rule, on 2026-09-28);
  unique tech descriptions were left as they were. Portuguese "Technologies research +25% faster" is now a team bonus,
  as aoe2techtree lists it: a bonus that moves the numbers as a civ bonus moves them as a team bonus too. Every other
  modelled team bonus already matched. Checked: Britons with a Portuguese ally research Feudal in 104 s, Malay with one
  in 62.7 s, and a Portuguese ally does not count twice.
- **Mule Cart technologies.** Armenians (`ecoboost` FX, label "Mule Cart technology effects +40%", aoe2techtree): each
  Lumber / Mining Camp tech's gain is 40% larger. Gold and stone: each `MULT` 1.15 becomes 1.21. Wood: each step of the
  measured `LUMBER` table (Double-Bit Axe 27.9 / 23.3 = +19.7%, Bow Saw 33.2 / 27.9 = +19.0%, Two-Man Saw +10.2%) grows
  by 40%, so wood = 23.3 × Π(1 + step gain × 1.4); without the bonus, the table itself. Armenians: wood 29.7 with
  Double-Bit Axe, 37.6 with Bow Saw (Britons 27.9 / 33.2); gold 27.6 / 33.4; stone 26.1 (they lack Two-Man Saw and Stone
  Shaft Mining). In `TE_KINDS`, so listed and counted in Transition Eco too.
- **Free techs.** `freeups` FX, aoe2techtree's wording: Bohemians "Mining Camp technologies free" (Gold Mining, Gold
  Shaft Mining, Stone Mining, Stone Shaft Mining); Burmese "Lumber Camp technologies free" (Double-Bit Axe, Bow Saw,
  Two-Man Saw; Burmese wood 27.9 Feudal, 33.2 Castle, 36.6 Imperial); Vikings "Wheelbarrow, Hand Cart free" (farm 23.0
  Feudal, 23.9 from Castle, 24.0 with Heavy Plow; aoe2techtree's other Vikings bonuses: Warships and team Docks were
  already in, Infantry +20% HP is combat); Vietnamese "Conscription free" ("not an optional tech for Vietnamese unless
  Full Tech Tree"; `ups: ["consc"]`, handled in `activeFx()`, `renderTechs()` and `anyTechOn()`, as Conscription is not
  in `UPS`; kept out of Transition Eco's bonus line by `relevant()`; Knight-line 30 → 22.6 s in Imperial). For that civ,
  not under Full Tech Tree, they count as ticked from their age (`freeUp(k)`; `on(k)` = (stored tick or free) and open):
  ticked and disabled (`.opt.fixed`, normal label, default cursor; tooltip "Free for Bohemians. …"), greyed before their
  age as usual. The stored tick is untouched, so another civ gets the user's own ticks back; `anyTechOn()` ignores free
  ticks (Clear Techs stays hidden), `isCleared()` reads stored ticks. In `TE_KINDS`. Checked: Feudal gold 26.2 / stone
  24.8, from Castle 30.2 / 28.6, Transition Eco Researching Castle, 10 gold miners = 699.
- **Kamandaran.** Persians: the `swap` takes the Archer-line's gold away for +25 wood, 25w 45g → 50w (was 70w); desc and
  label "Archer-line costs +25 wood instead of gold". Hussite Reforms, Corvinian Army and Forced Levy stay 1:1.
- **Near Fortified Church.** Georgians, not under Full Tech Tree (`church` FX; bonus line "Fortified Churches provide
  Villagers in a 9 tiles radius with +10% work rate", aoe2techtree): a checkbox "Near Fortified Church" at the bottom of
  each resource box (`[data-church]`, `state.church`, saved, reset by Clear All, checked by `isCleared()`). Ticked, that
  resource's villagers gather +10% (`rates()`, after the `rate` effects; not Fishing Ships; a niche or custom source
  replaces the rate). Greyed and locked before Castle Age (`CHURCH_AGE`, the Fortified Church's age; tick kept), hidden
  (space kept) for a source not worked by villagers (`churchShown()`: Fishing Ship, Feitoria, livestock, Custom Rate).
  Both tabs (`TE_KINDS`). `html.church` (set in `applyLayout()`) makes the resource fieldsets flex columns with the box
  at `margin-top: auto`, so the four sit level whatever each holds; without it the boxes are `display: none`, the
  fieldsets unchanged (Britons, Generic pixel-identical to HEAD at 13 sizes). Georgians' settings row grows a line: +22
  px at 1,920, +20 at 768–1,250; the label wraps to two lines at 412–600 px and three at 360–390, +35 to +51 there.
  Checked: rates 25.6 / 22.3 / 25.1 / 23.8 with all four; Transition Eco Researching Imperial, 10 lumberjacks = 811.
- **TCs/Castles.** Saxons, not under Full Tech Tree: a −/+ count "TCs/Castles", 0–4 (`TC_MAX`), default 1
  (`state.tcCastles`, saved; Clear All resets it to 1, `isCleared()` checks it), where asked: under Clear table, above
  the # Buildings column (`#tc-castles` in the adder, `align-self: flex-end; margin-top: auto`; `.gone` for other civs).
  The bonus (aoe2techtree "Foot Soldiers cost -5% per Town Center or Castle controlled (maximum -20%)") is a `cost` FX
  whose `p` is a getter, 5 × the count. The bonus line always reads "Foot Soldiers cost −5% per Town Center or Castle
  controlled (maximum −20%)" (aoe2techtree's text with the page's "−"; `fxText()` prints a label without "{p}" as it
  is), a unit's cost tooltip what applies ("Foot Soldiers cost −10%", the FX's `appliedLabel`, used by `effective()`).
  Foot Soldiers, as chosen, are infantry and foot archers (`FOOT_SOLDIER` = military and (`I`, or `A` without `M`)):
  Militia-line, Spearman-line, Archer-line, Skirmishers, Hand Cannoneers, Slingers and so on; not cavalry, cavalry
  archers, siege, ships, Monks or Villagers. `fxText()` no longer calls `findIndex` on a plain 0 `p`: it greys the
  label. The count's −/+ redraws the rows (`counter(…, renderRows)`), as costs change. The adder had about 10 px spare,
  so Saxons' settings row is 13 px taller in the wide layout (149 against 136 at 1,920); in narrow layouts the count is
  a line at the adder's right end (+23 px). Checked, 1 TC: Militia-line 48f 19g, Archer 24w 43g, Skirmisher 33w 24f,
  Hand Cannoneer 43f 48g; 4 TCs −20%; Knight-line, Cavalry Archer, Monk, Villager unchanged.
- **Tuntian.** Wei, Castle Age: a unique-tech box, desc "Soldiers passively produce food" (aoe2techtree). Ticked and in
  effect, the Food box shows a "Soldiers" count under the upgrades (`#soldiers`, −/+ like Relics, 0–999 =
  `SOLDIERS_MAX`, default 0, `state.soldiers`, saved, reset by Clear All, checked by `isCleared()`) and the food per
  minute ("18f/min"): 1.8 food per soldier per minute (`soldierfood`), taken off the food total right after the relics,
  before Farm Reseeding ("after 10 soldiers cover 0.89"). The row exists only for Wei, not under Full Tech Tree (`.gone`
  otherwise), keeps its space while Tuntian is off or before Castle Age, so ticking moves nothing, and is hidden in
  Transition Eco like Relics (Tuntian is not listed there). The food figure has a minimum width (4.1em; "1798f/min" =
  4.05em) and the row may wrap in any layout, so its height follows the box, not the number: it wraps under the count at
  1,920 (the box has 169 px, the line needs 178), 1,250, 600 px and phones, one line at 768–1,000 and 915×412. Wei's
  settings row: +37 px at 1,920, +18 at 768. Relics and Soldiers share `counter(box, key, max)` (was the Relics-only
  `setRelics` and its handlers); the CSS lists `#relics, #soldiers` side by side (the same specificity as before).
  Checked at 13 sizes: one height at 0 / 10 / 999 soldiers and with Tuntian off, no overflow; Britons unchanged.
- **Situational bonuses.** With the church and the Town Centers and Castles, none is left out any longer. Wording: "Near
  Fortified Church", "TCs/Castles", "Foot Soldiers cost −5% per Town Center or Castle controlled (maximum −20%)".

#### Not done

- +40% on each step of the measured wood table is a reading, not confirmed; no measured Armenian rates were given.

## 2026-10-01

### the Idle TC Time checkbox under Villagers Required

#### What changed

- **The box.** "Idle TC Time", a checkbox under the Villagers required number (`#idle-tc` in `.grand-box`), default off,
  wide and mid layouts only (`html.narrow .idle-tc` hides it), hidden in Transition Eco with the grand box. Ticked, it
  shows a slider in seconds (`#idle-t`, `state.idleT`, default 0) and under it "Villagers missing" and its number
  (`#vils-missing`) = ⌊idle seconds ÷ 25⌋ (`IDLE_VIL_T`): as answered, always the base 25 s whatever the civ (Persians'
  faster Town Centers ignored), so 10:00 = 24; shown apart from Villagers required, not added to it. Both saved
  (`state.idleTc`, `state.idleT`), both reset by Clear All, as answered, and checked by `isCleared()`. Unticking resets
  the time to 0, so ticking again starts at 00:00; `load()` keeps no time for an unticked box. `syncIdle()` (in
  `refreshAll()` and at startup) draws it; nothing else depends on it, so its handlers skip `update()`.
- **Typed in.** First the slider ran 00:00–10:00, a 10:01 step meaning ">10:00" / "24+". Later the time came in a text
  field that takes typing (`#idle-t-out`, "mm:ss"), up to 59:59 (`IDLE_MAX` = 3599), and the slider went back to
  00:00–10:00 (an old save's 601 reads 10:01, 24). `parseIdle()` takes "12:30", "2:5" or plain seconds ("90"); over
  59:59 becomes 59:59. While typing, an incomplete or invalid time keeps the last; leaving the field or Enter writes it
  out as mm:ss; `syncIdle()` leaves the field alone while focused. A typed time past 10:00 puts the slider at its end
  and counts exactly (25:00 = 60, 59:59 = 143). The field is 3.3em wide, the slider 105 px at 1,920, 81 px mid.
- **Colour.** The slider (moved above Villagers missing, as asked), the time's text, the label and the number share one
  colour, `--idle` on `.idle-out` (the field's border stays `--rule`): green at 00:00 (`.idle-none`, new token `--good`:
  #2f7a3c light, #6cc07a dark), `--ink` (white in dark mode) at 00:01–00:24 (`.idle-some`, no villager missing yet), red
  `--food` (the page's red) from 00:25. It switches at once (checked: 0 s transition on every part). The slider takes it
  through `accent-color`, its thumb and filled part changing, the unfilled track the browser's grey.
- **Space.** Count and slider keep their space while unticked (`.idle-out[hidden]` is `visibility: hidden`), so ticking
  moves nothing. The block is 89 px tall at 1,920 px, also with the field, and hangs below the Totals row; `fit()` now
  also requires it to end inside the Technologies column (`idleFits()`), shrinking the table text or refusing a row
  otherwise. Cost: 5–6 fewer table rows at most (Generic, Include Regional & Unique, Naval: 1,920×1,080 36 → 31,
  1,600×900 27 → 22, 1,366×768 20 → 14, 1,280×720 18 → 12), and windows about 600 px tall get smaller table text sooner
  (1,366×600 with Franks: 15 → 14.5 px). Every other element is where HEAD has it at 15 sizes (1,920×1,080 to 360×640,
  short windows included); narrow layouts and phones unchanged.

#### Not done

- Collapsing the block while unticked would avoid the cost, but let ticking it shrink a full table's text; not yet
  offered as a choice.

### the After [] seconds radio and typed amounts in Transition Eco, and aoe2vils.net with its fonts embedded

#### What changed

- **The radio.** "After [] seconds" (value 4, `TE_AFTER`): [] is a number field (`#te-after`, `.te-after-in`, styled
  like a Custom Rate field, as tall as the text) of whole seconds, first 0–3,600, 300 to start (`TE_AFTER_SECS`), saved
  as `state.te.after`. Clicking the field does not pick the radio; typing a time does (`setTeAfter()`). While typing, an
  empty or invalid field keeps the last time; leaving it puts the time back. `renderTE()` leaves the field alone while
  focused; the `#te-row` change / input handlers skip it for the villager steppers. The label's tooltip: "What the
  villagers gather in that time, in Imperial Age".
- **Imperial Age.** As answered, always: `curAge()` = research − 1 = 3, `teAfter()` telling it apart. In place of "On
  reaching <Age>" the heading reads "After 45s", "After 5m" (whole minutes) or "After 5m30s" (`minSec()`); the amounts
  are what is gathered in that time, without age-up resources, as no age is reached, and so the bonus line leaves out
  `ageup` / `agebonus` there (`relevant()`): Malay and Dravidians show "No applicable civ bonuses.". The right panel
  adds Paper Money, the only Imperial unique tech `teTech()` lets in.
- **98 hours.** Later, as asked, "specifically": up to 98h14m53s = 353,693 s (`TE_AFTER_MAX`), the field 4.3em wide for
  6 digits; from an hour the heading reads "After 1h", "After 1h2m5s", "After 98h14m53s", zero parts left out, so 3,601
  s is "After 1h1s" and 0 s "After 0s" (this extension not dictated). With it a slider (`#te-after-slide`), first 0–300
  s, right after the label in `.te-after-line` (flex, wrapping), shown only while After is picked, else hidden with its
  space kept (`[hidden]` = `visibility: hidden`), so switching radios moves nothing. Field and slider stay in step
  (`syncTeAfter()`, from `renderTE()` and `setTeAfter()`); a time past the slider's end puts it at its end.
- **Narrower.** Late in the day the field became half as wide, as asked ("half as short", read as half as wide): 2.15em,
  room for 3 digits, widening for a longer time through a hidden copy (`.te-after-wrap` / `.te-after-size` after the
  field, `sizeTeAfter()`): 3600 → 2.33em, 353693 → 3.28em, never clipped, line height unchanged. The slider became 0–900
  s. It sits on the label's line at 1,160 px and wider (at 1,160×700 since the narrower field, 94 px wide), on tablets
  and at 915×412, with no extra height; on a line of its own (+16 px) at 600 px and on upright phones, where with the
  narrower field "seconds" no longer wraps at 412 / 360 px. In short windows (`max-height: 520px`) its flex-basis is
  3em, so it stays beside the label (65 px at 640×360), as a line more there would cut the row off.
- **Checked.** Generic, 10 lumberjacks, 300 s = 1165 (10 × 23.3/60 × 300); Dravidians with all Lumber Camp techs 1830
  (no +200); Vietnamese with Paper Money +41 gold. The first version at 15 sizes against the page before: the Transition
  Eco row a radio line taller (+23–24 px; +39 on 412 / 390 px phones, where "seconds" wraps under the field; +57 at 360
  px), fully visible, no page scroll, the resource boxes unmoved; at 640×360 the table text shrinks from 11 to 9.5 px to
  fit it; on phones the strip above the table is one or two lines, by the amounts' width, for every radio (not new). The
  narrower field at 15 sizes against the version before: nothing worse; the slider wider at several sizes, beside the
  label at 1,160×700, the row 17–18 px shorter on 412 / 360 px phones.
- **Typed amounts.** Each "On reaching" / "After" amount is a text field (`.te-amt`, `#te-wood` …). A whole number typed
  (spaces and commas ignored) sets that resource's count to the fewest gathering at least that much, up to 200
  (`TE_MAX`): n = ⌈(amount − age-up bonus − extra) ÷ per villager⌉, from `teCalc`, which `updateTE()` fills per resource
  (`per` = rate × time, `extra` = what other gatherers bring in, as Portuguese foragers' wood, `bonus` = Dravidian /
  Ethiopian age-up resources). The other counts stay; their amounts may change through the extras. While typing,
  anything but a whole number changes nothing, the text kept (`updateTE()` skips a focused field); Enter or leaving
  shows what that many gather (`dataset.shown`). With nothing gathered per villager (After 0s), typing does nothing.
- **Width.** Each field lies over a hidden copy of its text (`.te-amt-wrap` grid, `.te-amt-size`, `sizeAmt()`; the input
  is `width: 0; min-width: 100%`, so its default 20-character width does not size the cell), so it is exactly as wide as
  the number: boxed like the panel's other fields, underlined only in the strip above the table (820 px and less, short
  windows), so the strip is as wide as with plain numbers. A first try sized the fields in `ch`, but the digits are
  narrower than "0"'s `ch` here, so the strip grew 2–13 px and could wrap.
- **Name.** In the commit "name change", the page's heading (`<h1>`) and `<title>` became "aoe2vils.net" (were
  "Villagers required" / "Villagers required · AoE2 DE"); the grand total's label "Villagers required" is unchanged.
- **Checked.** Researching Feudal, 1000 wood → 20 lumberjacks, 1009; 999999 → 200, 10096; Dravidians 150 → 0 (the +200
  covers it), 300 → 2; Portuguese with 10 foragers, wood 50 → 0, 500 → 11 (530). Against plain numbers at 15 sizes × 0 /
  10 / 200 villagers each: identical layout, no clipped digits.
- **Embedded.** Chosen over system fonts: no more requests to Google Fonts for Alegreya and Alegreya Sans, so the page
  makes no network requests. Alegreya 700 and Alegreya Sans 400 / 500 / 700, the Latin subset only (Google's
  `unicode-range`: every character the page uses that the fonts have; ✓ ☐ → are not in Alegreya at all and come from a
  fallback, as before). About 96 KB of font, 128 KB as base64: the page went from 278 KB to 407 KB. `display: "block"`.
  The comment above the font data carries the fonts' copyright lines and the SIL Open Font License 1.1, required to
  redistribute them; the files' name tables hold the copyright and the OFL URL too. Italics are synthesized, as before:
  no italic face was ever loaded. To redo: fetch
  `https://fonts.googleapis.com/css2?family=Alegreya:wght@700&family=Alegreya+Sans:wght@400;500;700` with a Chrome user
  agent (else Google serves TTF) and take the `/* latin */` blocks' woff2 URLs.
- **Two requests.** That night: "6 HTTP requests, want 2". On the live site (GitHub Pages, `CNAME` aoe2vils.net, through
  Cloudflare, no injected scripts) DevTools' Network panel showed the page, `favicon.ico` and four `data:` fonts: it
  counted the `@font-face url(data:…)` rules as four requests. The fonts moved to `FontFace` objects: base64 woff2 in a
  `<head>` `<script>` before the `<style>`, decoded and added with `document.fonts.add(new FontFace(family, bytes, {
  weight, display: "block" }))`. Now 2 requests hosted (the page and `/favicon.ico`), 1 from a local file.
- **Gill Sans.** Firefox's console warned "Request for font "Gill Sans" blocked at visibility level 3 (requires 4)",
  which was asked about: Firefox's fingerprinting protection lets pages use only some local fonts, and Gill Sans
  (installed with Microsoft Office, next to Gill Sans MT, on the machine used) is not one at its default level, so every
  lookup was refused and logged. The body stack reaches past Alegreya Sans only for glyphs it lacks (✓ in the allies
  list, → on custom rows; U+2192 is not in Google's Latin subset), and Gill Sans was a look-alike for when Google Fonts
  failed, so it was dropped: `"Alegreya Sans", "Segoe UI", system-ui, sans-serif`.
- **Checked.** Embedded: no resource requests at all, the four faces load, layouts identical to the hosted fonts at 15
  sizes × 3 setups × both tabs (6 of 90 cases differ by under 0.5 px in Villagers required's position, `placeGrand()`
  rounding). `FontFace`: served over HTTP locally, exactly 2 requests, the fonts load, the layout identical at 15 sizes
  × 3 setups × both tabs. Gill Sans: headless Firefox drew a "Gill Sans" test text in Segoe UI (blocked, as reported);
  Chrome's layout identical at 15 sizes × 3 setups × 2 tabs, ✓ and → unchanged; the page renders in the embedded fonts
  in headless Firefox.

#### Not done

- With the 98-hour maximum the amounts can reach 8 digits (27,470,156 wood with 200 lumberjacks); at 640×360 the strip
  then wraps and 7 px of the row are cut off at the 9 px minimum text (50 villagers per resource still fit). Not fixed.
- Firefox's warning goes to the web console only (not to `MOZ_LOG=fontlist`), so it could not be read headlessly.

## 2026-10-03

### farm upgrades free for the Franks, and units listed before buildings

#### What changed

- **Franks.** Testing for anything missing found the Franks' Mill bonus missing ("Mill upgrades mandatory for Franks").
  Now "Farm upgrades free" (aoe2techtree "Farm upgrades free (require Mill)"; the Mill is not modelled), locked on like
  Bohemians' Mining Camp techs: Horse Collar from Feudal, Heavy Plow from Castle, Crop Rotation from Imperial; Heavy
  Plow's box in the Food box and all three in the Farm Reseeding row, whose `reseedRowHtml()` now sets `fixed` /
  `disabled` for a free tech itself. Under Full Tech Tree they are ordinary boxes again.
- **Row order.** As asked: units first, then buildings, each kind in the order added (custom units with the units,
  custom buildings with the buildings): Villager, Farm, Knight, Castle added show as Villager, Knight-line, Farm,
  Castle. `orderRows()` stable-sorts `state.rows` itself at the start of `renderRows()`, so the saved and DOM orders
  match (the remove handler's focus on the next row relies on it); old saves are sorted on load. The automatic rows
  (Farm Reseeding, Fish Trap Rebuilding, House Building) still come after them all.
- **Checked.** Franks Imperial farm 21.2/min, reseeding 720w / 1571.6 s, as with the three ticked by hand. In headless
  Chrome: Villager, Farm, Knight, Castle added through the dropdown show as Villager, Knight-line, Farm, Castle, in the
  save too; custom rows follow their kind; removing a row focuses the next; Franks Feudal / Castle / Imperial / Full
  Tech Tree, Transition Eco; no errors.

## 2026-10-04

### gold from Trade Carts, Trade Cogs and whaling, Bengali trade food, and the Gurjaras' garrisoned food

#### What changed

- **Trade Carts.** Every civ from Feudal Age (`NICHE.gold` id `trade`, kind `trade`; no `civs`, so Generic always has it
  and Full Tech Tree keeps it). Not villagers: not in Villagers required; Near Fortified Church hides. The column reads
  "# Trade Carts", or "# Carts" where that does not fit (`HEADS.gold.trade`, so `fitHeads()` decides; its plain form is
  "Carts", not "Gold vils"): at 360 px in Villagers Required, at 412 px and below in Transition Eco, where the long form
  wrapped and made the heading row taller. Transition Eco's gold stepper counts Trade Carts ("# Trade Carts") from
  Researching Castle Age (Feudal); in Dark Age the source snaps back to Gold Mine, like a Feitoria before Imperial.
- **Caravan and Bump factor.** As answered, in Gold Mining's and Gold Shaft Mining's places with Trade Carts (two
  `.opt-stack`s in `#gold-ups`, like Fishing Lines / Gillnets in Food; `#gold-ups .opt[hidden]` keeps the space;
  `#gold-ups` shows for Trade Carts too, `syncSettings()`). Caravan, a tech: `car` in `UPS` (`laneShown("car")` = Trade
  Carts), Castle Age, Burgundians Feudal (aoe2techtree's trees: all 56 civs have it and the Trade Cart, Feudal); greyed
  before its age, ticked by Post-Imp, cleared by Clear Techs and Clear All; tooltip "Trade units move 20% faster". Bump
  factor is not: `state.tradeBump`, `#trade-bump`, default off, saved, unticked by Clear All (`isCleared()` checks it),
  left by Post-Imp and Clear Techs; tooltip "Trade Carts bumping into each other: 20% less gold" (wording not dictated).
  A Map Size dropdown (1v1 / 2v2 / 3v3 / 4v4 = Tiny / Medium / Normal / Large, side to side, from the trade tool's
  formula) was built first and dropped the same day, as asked, for one rate, no map size or distance.
- **Rates.** `tradePerMin()`, as github.com/cnordenb/aoe2_tradeprofit computes it ("should have correct answers"), the
  three trade bonuses too (Spanish, Varangian Caravan, Grand Trunk Road), as answered: gold per minute = 0.46 × (x / d +
  0.3) × 60 × speed ÷ 2, always a 2v2 map side to side (`TRADE_D` = 168, Medium), x = d − 8 for a cart (`TRADE_UNIT`);
  speed 1.25 tiles/s, × 1.2 with Caravan (× 1.3 for Varangians: `caravan` FX, "Caravan effects +50%"; aoe2techtree
  "Bloodlines and Caravan effects +50%"). So a cart makes 21.6 gold per minute, 25.9 with Caravan, as set; first stored
  as those two constants (`TRADE`). Then × 1.25 with a Spanish civ or ally (`tradegold` team bonus, "Trade Units
  generate +25% gold", aoe2techtree), × 0.8 with Bump factor (`TRADE_BUMP`; carts only), × 1.1 with Grand Trunk Road, as
  for all niche gold. Relics and the other gold lines come off the cart count as off gold miners.
- **Bengali trade food.** Later in the day the Bengali team bonus became an extra-income line, "+x f/min from Trade
  Carts" in the Food box, in the evening from Trade Cogs too: see the standing rules, on 2026-09-28. Checked in headless
  Chrome: rates, tooltips, Transition Eco, layout at 20 sizes; no errors.
- **Trade Cogs.** Evening: every civ from Feudal Age (the Dock; `NICHE.gold` id `cog`, kind `cog`, heading "# Trade
  Cogs" / "# Cogs"); `tradeSrc()` gives the trade source picked ("trade" or "cog"). With cogs: Caravan (the same `car`
  tick) in Gold Mining's place, Clinker Construction (`clk`) in Gold Shaft Mining's, Carvel Hull (`crv`) on a third
  line; no Bump factor (hidden, tick kept, not applied). Not gated by Naval, like Fishing Ships. Clinker Construction:
  Castle Age, every civ but Saxons. Carvel Hull: Imperial Age, needs Clinker (`REQUIRES`: ticking Carvel ticks Clinker,
  unticking Clinker unticks Carvel, like the mining techs); 13 civs lack it: Aztecs, Bohemians, Bulgarians, Chinese,
  Cumans, Ethiopians, Georgians, Inca, Magyars, Maya, Muisca, Saxons, Tupi (`NO_TECH`). Both University techs (building
  209), "Ships move +10% faster" (desc "Ships move 10% faster"), early for no civ, Burgundians included; from
  aoe2techtree's per-civ trees, techs 907 / 908 (`data.json`'s 909 / 910 carry the same internal names but are Siphons /
  Incendiaries, by their name strings). Post-Imp ticks them, Clear Techs and Clear All untick.
- **Cog rates.** Carts and cogs share the trade tool's formula (its version of this day, with Grand Trunk Road and the
  cog's University techs): x = d − 6, speed 1.65 tiles/s; Caravan × 1.2, Clinker Construction and Carvel Hull × 1.1
  each, the speed then rounded up to two decimals (the tool's rule: 1.65 × 1.2 × 1.1 × 1.1 = 2.3958 → 2.40). A cog makes
  28.8; Caravan 34.5; Clinker 31.8; Clinker + Carvel 34.9; Caravan + Clinker 38.0; all three 41.9 (Varangians 45.4,
  Spanish 52.3, Grand Trunk Road 46.1). Carts exactly 21.60 / 25.92, Varangians 28.08 (was 28.05).
- **Third line.** Chosen over growing the box for Trade Cogs only: the Gold box keeps a line for Carvel Hull for every
  civ and source, so picking Trade Cogs moves nothing. Against the version before: +17–20 px on desktop, tablets and
  phones held sideways (1,200×800 +1, 1,151×800 none: they had room), +36 at 600 px and +30 at 412 px (the Clinker line
  wraps there), +14 at 390, +35 at 360. "Clinker Con&shy;struction" has a soft hyphen: at 360 px "Construction" alone is
  wider than the box (6 px overflow; headless Chrome on Windows does not apply `hyphens: auto`), so three lines there.
- **Muisca.** At night: "Caravan free" (`freeups` with `car`; aoe2techtree "Caravan, Guilds free"; Guilds not modelled),
  like other free techs: ticked and locked from Castle Age, greyed before, ordinary under Full Tech Tree.
- **Checked.** All in headless Chrome, no errors. Carts: 21.6 / 25.9; Bump 17.3, with Caravan 20.7; Spanish (civ or
  ally) 27.0, with Caravan 32.4; Varangians with Caravan 28.1, under Full Tech Tree 25.9; Grand Trunk Road 23.8;
  Transition Eco Researching Imperial, 10 carts × 190 s = 684; saving, Clear All, Post-Imp, Clear Techs, ages,
  Burgundians, Full Tech Tree; at 20 sizes × both tabs × Gold Mine / Trade Carts against HEAD every box, the table and
  the heading row unmoved, nothing overflows, no page scroll; at 360 px "Bump factor" wraps to two lines, as "Shaft
  Mining" already did. Cogs: every rate against the tool, prerequisites, ages, Saxons / Aztecs, Post-Imp, Clear Techs,
  Transition Eco (Researching Imperial, 10 cogs with Caravan and Clinker: 1204), carts unchanged; at 20 sizes × both
  tabs × Gold Mine / Trade Carts / Trade Cogs switching moves nothing, nothing overflows, no page scroll. Muisca cog
  34.5 / cart 25.9 from Castle Age, 28.8 in Feudal, Clear Techs stays hidden.
- **Whaling.** Late at night (`NICHE.gold` id `whale`, kind `whale`, "# Whaling Ships", "# Ships" in narrow layouts like
  Fishing Ships): every civ from Dark Age, as the Fishing Ship (the tree was not to be checked). Not villagers. 30 gold
  per minute each (`WHALE`, as given), × 1.1 each for Fishing Lines and Gillnets ("Fishing Ships work 10% faster"), ×
  the Japanese Fishing Ship bonus, × 1.1 with Grand Trunk Road (`whalePerMin()`); the Danes' food drop-off bonus does
  not apply, as whales bring gold (a choice not dictated). Fishing Lines / Gillnets show in Gold Mining's / Gold Shaft
  Mining's places (`#gold-ups` copies of the `fl` / `gn` boxes, the same ticks as the Food box's; `laneShown()` covers
  both); the Food box's copies, and the Fish Trap's build time, follow Fishing Ship food only. Checked: 30 / 33 Feudal /
  36.3 Castle and after; Japanese Imperial 43.6; Grand Trunk Road 39.9; Danes 36.3; Burgundians' Fishing Lines in Dark
  Age (33); ticking Gillnets in the Gold box ticks it in the Food box; a Fish Trap row stays 47 s with Whaling alone; no
  errors; switching to Whaling moves nothing at 7 sizes.
- **The count.** Last in the day: "Garrisoned Food Amount" replaces the Garrisoned Sheep / Cows food sources (old saves
  with them fall back to Farm). A count in the Food box like Relics / Soldiers (`#garrison`, `state.garrison`, 0–9999 =
  `GARRISON_MAX`, default 800 = `GARRISON_START`; −/+ by 100, `counter()`'s new `stepBy`; any whole number can be typed;
  saved; reset to 800 by Clear All, checked by `isCleared()`). The row exists for Gurjaras, not under Full Tech Tree
  (`.gone` otherwise), and is invisible in Transition Eco, like relics, as asked.
- **The food.** `FX.Gurjaras` gains `garrison` (label "Can garrison livestock in Mills to passively produce food",
  aoe2techtree; not in `TE_KINDS`): 15 × ln(F / 200 + 1) food per minute for F garrisoned food (a correction the same
  day; first built as 6 per 100), so 200 → 10.4, 800 → 24.1, 9999 → 59 f/min, shown after the count ("24.1f/min"); taken
  off the food total with the relics and soldiers, before Farm Reseeding (tooltip "after 800 garrisoned food covers
  1.19"). Checked: Gurjaras' Food box +19 px at 1,920 (+16 to +32 on narrower screens, as the row wraps), the same at
  800 and 9999; nothing overflows at 11 sizes; other civs unchanged; steps, limits, typing 12345 → 9999, Clear All, Full
  Tech Tree, Transition Eco, an old save; no errors.

#### Not done

- At 360 px "Fishing Lines" wraps to two lines, so Gold Mining's line is two lines tall and every civ's settings row 16
  px taller there; not yet raised.

## 2026-10-07

### the Imperial Skirmisher from a Vietnamese ally

#### What changed

- **Team bonus.** The Vietnamese Imperial Skirmisher is a team bonus like the Italian Condottiero: team `unlock`
  "Imperial Skirmisher upgrade available" in `FX.Vietnamese`. The Imperial Skirmisher is a member of the Elite
  Skirmisher entry, not an entry, so the unlock works through `memberHas()` (names, searches, Post-Imp), not `ageOf()`;
  with a Vietnamese ally the entry reads "Elite/Imperial Skirmisher" outside Post-Imp. An upgrade an ally unlocks needs
  the version before it (`PARENTS`, from `EDGES`): Turks have no Elite Skirmisher, so a Vietnamese ally gives them
  nothing, though their bonus line still lists it, as a Condottiero is listed for any civ. Off under Full Tech Tree;
  Generic names it only with Include Regional & Unique, as with the Condottiero.
- **Checked.** In headless Chrome: Britons with a Vietnamese ally "Elite/Imperial Skirmisher" (Post-Imp "Imperial
  Skirmisher"), bonus line "Imperial Skirmisher upgrade available (from Vietnamese Ally)"; Full Tech Tree: plain Elite
  Skirmisher; Turks with a Vietnamese ally keep Skirmisher in Post-Imp ("Turks can't upgrade to Elite Skirmisher");
  Vietnamese' own line unchanged; the ally preview shows the bonus.

## 2026-10-08

### the counts of Transition Eco taken from Villagers Required, with Clear Values and Total villagers used

#### What changed

- **Counts.** First on this day, as asked: switching to Transition Eco (click or arrow key) sets each stepper to
  Villagers Required's Total row for its column (7 wood vils → 7 lumberjacks), at most 200 (`TE_MAX`); `update()` keeps
  those totals in `vrTot` while Villagers Required shows. One way only: Transition Eco's radios, counts and typed
  amounts never touch Villagers Required, its age included. Each switch starts over, so changes in Transition Eco do not
  survive a trip to Villagers Required and back, and an empty table starts at 0.
- **Radio.** Later, as asked, the switch also picks the radio from Villagers Required's age, so the age stays
  (`state.te.research = state.age + 1`: Dark → Researching Feudal, Feudal → Castle, Castle → Imperial, Imperial → "After
  [] seconds", its time as it was); `setTab("te")` copies both before `refreshAll()`. So every source Villagers Required
  uses exists on arrival; the first version gave a source the research age lacked 0 (Trade Carts while Researching
  Feudal). An earlier radio picked afterwards can still send a source back to the standard one, in both tabs, as before.
  `state.te`'s `research` and `vils` are still saved; each switch overwrites them.
- **Clear All.** In Transition Eco it resets the radio to "After [] seconds" (Imperial Age's, as Clear All sets
  Imperial; was Researching Feudal, also the starting state), the After time to 300 s and the steppers to 0.
  `isCleared()` checks the time always, the radio (Villagers Required's age + 1) and the counts (0) only while
  Transition Eco shows, as each switch sets them anew; so neither a visit to the tab nor an old save with Researching
  Feudal makes Clear All appear.
- **Checked.** Headless Chrome, no errors. Britons, 2 Villagers: Dark / Feudal / Castle / Imperial → radios 1 / 2 / 3 /
  After 5m, counts 5 / 12 / 0 / 0; Researching Imperial picked in Transition Eco left Villagers Required in Feudal, and
  the next switch picked Researching Castle again; Portuguese Imperial with a Castle: 22 Feitorias → 22 Feitorias, After
  5m; 2 Villagers + 3 Knight-line + Castle: 12 / 30 / 20 / 19 in both tabs, +1 Knight → 15 / 36 / 27 / 19 on the next
  switch; 99 + 99 rows → 200 each. A fresh page, both tabs: Clear All hidden; picking Researching Feudal shows it; Clear
  All in Transition Eco → After 5m, hidden.
- **Clear Values.** Later, as asked: every stepper to 0, so the amounts read 0 but for age-up resources (Dravidians'
  +200 wood, Ethiopians' +100 food and gold), which need no workers. The radios and the After time stay (a correction
  the same day; the first version also picked "After [] seconds" at 300 s), and techs, sources, civs. Where asked, the
  bottom right corner of the space left of the resource boxes and above the radios (first built top left, then moved):
  in wide and mid layouts over the hidden adder (`.te-clear`, first child of `.adder`, absolute at its padding,
  `visibility: visible` inside it), at Clear Techs' size. Stacked layouts (`html.narrow`) have no adder in Transition
  Eco, so a copy (`.te-clear-alt`) sits in the Unit heading cell's bottom right corner, over the radios, absolute and
  sized in the heading's em so the row never grows (`#unit-head` holds the text in `#unit-head-t`, set by
  `applyLayout()`; 2–3 px from the cell's edges at 640×360's 9 px text). `display: none` in Villagers Required. Hidden,
  space kept, while every count is 0 (`teCleared()`, in `syncButtons()`), like the other Clear buttons. Checked, no
  errors: layout identical to HEAD at 13 sizes × both tabs × 2 setups; Britons Researching Imperial, 5 / 12 / 14 / 0 → 0
  / 0 / 0 / 0, radio and 450 s kept; Dravidians Researching Castle → wood 200; +1 farmer → back; the copy works at 412
  px.
- **Total villagers used.** Last, as asked: under the amounts, the villager steppers added up (2 lumberjacks + 3 farmers
  = 5), from `updateTE()` (`#te-vils` in `.te-vils`, label in `.grand-label`, the number like an amount). Only villager
  columns count (`kindOf() === "vils"`, as in Villagers required): not Fishing Ships, Feitorias, livestock, Whaling
  Ships or Trade Carts / Cogs; the number's tooltip names what was left out ("Not counted: 10 Fishing Ships, 22
  Feitorias"; wording not dictated). In the panel (wide, mid, narrow down to 821 px), a line under a rule at the panel's
  width (two lines in the 9.5rem column at 1,000 px with three digits); in the strip above the table (820 px and less,
  short windows), inline after the amounts, no rule, labelled "Villagers" (`.tv-long` / `.tv-short`), on the amounts'
  line where there is room: no change at 768, 915×412, 640×360 (small counts) and 600 with After. Where the line is full
  it wraps below the amounts, a line more (+21–22 px against HEAD, same radio): 600 px with Researching Feudal; 412 /
  390 px with large amounts or After; 360×640 always (table text 13 → 11.5 px); 640×360 with 200 per resource and
  Researching Feudal, where 26 px of the Transition Eco row are then cut off at the 9 px minimum (was 4). Villagers
  Required unchanged at 13 sizes. Checked, no errors: 2 + 3 → 5; Clear Values → 0; typing 1000 gold → 9; Portuguese,
  Fishing Ship and Feitoria: 2 lumberjacks, 10 ships, 22 Feitorias → 2.

#### Not done

- That an empty table starts at 0 is the literal reading, and Clear Values hides while every count is 0; neither was
  asked about. The extra line and the 26 px cut off at 640×360 were not raised beyond the report.

### the page as the notes left it

#### The page

- **Why.** What the notes hold undated, needed to understand the page: the single `index.html` of then. Line numbers are
  its 2,927-line version's of 2026-09-28.
- **Header and settings.** Title, tabs, Clear All and Clear Civs, centred; Allied Civilization(s), 0–7, each civ's team
  bonus on the right; Your Civilization, Generic by default; under them the bonus line `#civ-fx` (2 lines at most, all
  on hover) and the Age radios (Imperial by default). The settings row shares the table's column grid, each resource's
  settings above its column: the adder (label; Naval / Buildings / slot; the unit combo; the footer), then each box: the
  rate per villager per minute, a plain source `<select>` (`.src-sel`) under the heading so all four line up, the
  eco-upgrade checkboxes. Food: Farm ("Pasture" for Khitans), Berries, Hunt, Sheep, Fisherman, Fishing Ship and the
  alternative incomes available; the others their standard source and theirs; these follow civ (Portuguese get
  Feitorias) and age. Post-Imp and Clear Techs sit over the Technologies column, copied into the panel in narrow layouts
  (`.postimp-box`, `.clear-techs`; the handlers keep both in step).
- **Table.** Red × remove · Unit · # Builders (1 to the building's limit, building rows only; `SIZE` / `maxBuilders()`)
  · # Buildings (0–99, square −/+ steppers) · # Wood / Food / Gold / Stone vils. The name cell: display name, an Upgrade
  button (earlier line versions only), cost / time; modified values underlined, the hover giving the base values and
  every effect applied. Rows the civ or age cannot make stay, flagged red ("not in Goths tech tree" / "needs Castle
  Age"). The Total row sums builders, buildings and each resource. The Technologies panel, right of the table: the civ's
  relevant unique techs with a one-line effect (none for Generic), Conscription, Treadmill Crane (with Buildings),
  Shipwright (with Naval), the Villagers required total.
- **Unit dropdown.** Units: Town Center, Dock, Barracks, Archery Range, Stable, Siege Workshop, Castle, Donjon,
  Monastery, Market; Buildings: Economic, Military; each alphabetical, groups in `UNITS`' order. Only what the civ can
  make by the age; Generic every common entry, the regional and unique ones with Include Regional & Unique. Any member's
  name finds its entry, a grey hint naming the match (`norm()` lowercases, collapses hyphens and whitespace; every token
  must match, in any order; under Post-Imp every name in the line: "eagle scout" finds Elite Eagle Warrior). An entry
  already in the table gets +1. It stays open while Naval, Buildings, Full Tech Tree, Include Regional & Unique, the Age
  radios or Post-Imp are toggled.
- **Toggles.** Naval (default off) hides the Dock group and the Dock, Fish Trap and Harbor; table rows stay. Buildings
  (default off) adds buildings, switches the two labels, shows Treadmill Crane; # Builders and Stone show while it is on
  or a building row is in the table, Stone otherwise blanked in place, as only buildings cost stone. Full Tech Tree
  (default off; Include Regional & Unique in its place for Generic) starts unticked from Generic to a civ, stays ticked
  between civs; it adds every non-unique unit, building and tech (aoe2techtree's regional ones count as non-unique), the
  civ keeping its unique units, and switches off civ bonuses, own and allies' team bonuses and unique techs (greyed,
  ticks kept), early-age exceptions (Burgundian eco upgrades, Cuman Feudal rams…), farm tables (Khitans get Farms back)
  and ally unlocks. Generic is exempt: allies' team bonuses always apply with it. Include Regional & Unique: off, 58 of
  the 191 entries; on, all; Knight-line (with Savar), Militia-line (Legionary), Scout Cavalry-line (Winged Hussar),
  Elite Skirmisher (Imperial Skirmisher) and Bombard Cannon (Houfnice) count as common, (Heavy) Camel Rider as regional.
- **Post-Imp.** Default off: Imperial Age and every tech the civ can research ticked, Treadmill Crane too (unique techs
  not under Full Tech Tree). Dropdown and table show only the latest version of each line the civ can reach, named for
  it: Militia-line is Champion, but Two-Handed Swordsman for Malay, Legionary for Romans. Unticking any tech or leaving
  Imperial unticks it; a change of civ or Full Tech Tree keeps it and re-ticks.
- **Rows and sources.** One entry per line: another version replaces the row in place, count kept; Upgrade moves it to
  the next version the civ can reach now (greyed with the reason if none), merging with that version's row; the Castle
  and Donjon Serjeant can coexist, as can the Castle and Barracks Huskarl. Tech boxes are greyed, never hidden, until
  their age, off and greyed if the civ lacks the tech, each with a tooltip "reason. effect". The Farm Reseeding row
  comes by itself while Farm (or Pasture) is the food source, a farmer is needed and its box ticked (`state.useReseed`,
  default on), with Horse Collar, Heavy Plow (the Food box's tick) and Crop Rotation, reading "[farms × farm wood]w /
  [cycle]s". A non-villager source renames its column ("# Feitorias", "# Livestock", "# Fishing Ships"; `kindOf()` gives
  `fship` for the ship) and is left out of Villagers required. Losing a chosen source (civ, age, ally, Full Tech Tree)
  snaps it back to the standard one (`toggleAlly()` runs `syncSettings()`); a team-bonus source (`team: true`) would
  come with an ally, but none is left. Each ally's team bonus applies once, tagged "(from X Ally)"; a Berber ally
  unlocks Genitours, an Italian ally the Condottiero.
- **Buttons.** Shown only when they would do something; Clear All, Clear Civs and Clear Techs keep their space when
  hidden. Clear All resets table, civ, allies, age, food and sources, every tick and Post-Imp, and leaves Naval,
  Buildings, Include Regional & Unique, Farm Reseeding and House Building, whose ticking does not make it appear; Full
  Tech Tree just hides, as Clear All returns to Generic. Clear Civs: Generic, no allies. Clear Techs unticks everything,
  remembered age-locked ticks too, and ends Post-Imp. Clear table empties the table.
- **Layout and storage.** Works down to about 360×640; at 820 px and less the Technologies panel is a strip above the
  table; `fit()` shrinks the table text (15 px, less on narrow screens, down to 9 px); a row that still does not fit is
  refused (`addUnit()`). Light and dark come from CSS tokens, dark through `prefers-color-scheme` or `data-theme="dark"`
  (the artifact viewer's convention; nothing on the page sets it). State: `localStorage`.

#### How a number was computed

- **Rows and totals.** `update()`: v = count × cost[res] ÷ t ÷ rate[res], per second, shown to 1 decimal (`fmt`), 2 on
  hover; only totals use `vils()` = ceil(v − 1e-9). Building rows: t = the build time after effects, then
  `withBuilders(t, n)` = 3t ÷ (n + 2) for n > 1 (a 200 s Castle with 4 builders takes 100 s, the example given). A
  resource's total is the ceiling of the exact sum, not the sum of rounded cells, as its villagers serve every row; Farm
  Reseeding lumberjacks join before rounding. Villagers required = the rounded totals of the resources worked by
  villagers plus every builder (count × builders per building row, the single default builder too); Farms and Fish Traps
  count none (`NO_BUILDERS`).
- **`effective(u)`.** `activeFx()` in order: the civ's `FX`; each ally's team `FX` (not when the ally is the civ);
  ticked unique techs whose age is reached; Conscription; Treadmill Crane (with Buildings). Full Tech Tree (not Generic)
  skips the first three. `cost` × (1 − p/100) on `e.res` or all four; `flat` minus v, floored at 0; `swap` moves `frac`
  of one resource's cost into another (with `v`, a fixed v); `time` t ÷ (1 + p/100). Costs are `Math.round`ed only at
  the end; times not rounded, shown to 1 decimal. Order matters: `flat` against `cost`, and a `swap` sees the discounted
  cost. Time effects multiply: Goths with a Huns ally and Post-Imp train Champions in 21 s ÷ 1.2 ÷ 2 ÷ 1.33 = 6.6 s.
- **`rates()`.** Farm `FARM_TABLES[active table][farmKey()] / 60`; Fishing Ship `FISH_SHIP[state.fish][gn | fl | ""] /
  60`; other food `FOOD[src]`; wood `LUMBER[best of tms | bs | dba | ""] / 60`; gold and stone `BASE` × `MULT` per
  ticked upgrade. Then `rate` effects: `all`, every resource but food from Fishing Ships (the Romans' villager bonus);
  `food`, food, Fishing Ships too (Danes); a resource's name, that resource; a food source's name (`farm`, `berries`,
  `hunt`, `sheep`, `fship`), food while it is picked (Japanese `fship`). Last, a chosen niche source replaces the rate:
  `perMin / 60` (the Varangian sources, gone since 2026-09-30, took 10% of the bonus-adjusted food rate), niche gold ×
  1.1 with Grand Trunk Road.
- **Farm Reseeding.** `reseed()`: farmers = the food total rounded up (Farm only); cycle = farm build time (1 builder,
  with build-speed effects) + `farmFood()` ÷ farm rate; lumberjacks = farmers × farm wood ÷ cycle ÷ wood rate;
  `farmFood()` = 175 + Horse Collar 75 + Heavy Plow 125 + Crop Rotation 175, the upgrade part × 2.25 for Sicilians, then
  × 1.15 for Maya and × 1.1 with a Chinese civ or ally. Farm wood follows cost effects: Teutons 36 w, Malians 51 w.
  `pct(e)` reads `e.p` as a number or a `[Dark, Feudal, Castle, Imperial]` array by `curAge()` (`state.age`, or in
  Transition Eco the age being left); `pctAt(e, age)` takes an age.
- **Sanity check.** Generic, Imperial, no techs, Farm, Knight-line ×1 and Archer ×1, by hand from the code: wood 5 (1.84
  + 1.74 reseeding + 1.11 houses), food 6 (5.91), gold 10 (9.96), Villagers required 21 (20.56); the chat's output 4
  quotes 18 (17.71), from before Farm Reseeding.

#### The data

- **Entries.** `CIV_NAMES` (862): 56 civs; `CIVS` = ["Generic", …CIV_NAMES]. `UNITS` (864): 191 entries, `[name, group,
  wood, food, gold, stone, seconds, flags, ageString, genericAge, members?]`, `ageString` a character per civ in
  `CIV_NAMES` order (`0` not in its tree, `1`–`4` the first age). By group: Castle 72, Dock 20, Barracks 19, Military
  18, Economic 17, Archery Range 17, Siege Workshop 11, Stable 11, Monastery 3, Town Center, Donjon and Market 1 each.
  Line members of equal cost and training time share an entry: 284 became 190 (191 with the Xolotl Warrior). Flags: the
  comment at 1423 documents I, A, M, G, S, W, X, D, N, L, B, U; `R` Archery Range, `K` Barracks, `C` camel, `E` elephant
  are used undocumented. `REGIONAL` (1432): the Eagle, Champi, Camel Rider, Battle Elephant, Armored/Siege Elephant,
  Elephant Archer, Steppe Lancer, Fire Lancer, Hei Guang, Rocket Cart, Mounted Crossbowman, Longship and Varangian Guard
  lines, Slinger, Traction Trebuchet, Catapult Galleon, Dromon, Lou Chuan, Xolotl Warrior; Caravanserai, Fortified
  Church, Mule Cart, Pasture, Settlement.
- **Lines.** `MEMBERS` (1057) maps every unit and building to `[unique 0/1, 56-char availability]`, `EDGES` (1335) holds
  the upgrade links; through `LINE_OF`, `KIDS` and `ENTRY_OF` they drive Post-Imp naming, Upgrade and one entry per
  line. `ALIAS` (1568) maps a member's name to its entry's, for `load()`'s old saves only: the search strings already
  hold the member names, the group and "units" or "buildings".
- **Rates and techs.** `BASE` per second: gold .38, stone .36; `FOOD` per second: berries .31, hunt .41, sheep .33, fish
  .43 (Fisherman); `FARM_TABLES` per minute, for generic, aztecs, berbers, khmer and pasture, keyed `"" | hp | wb |
  wb+hp | hc | hc+hp` (generic `hc` without Heavy Plow, 23.87, is an estimate); `MULT` × 1.15 per mining tech; Heavy
  Plow, Wheelbarrow and Hand Cart change only the farm rate. `UPS`: `dba bs tms hp wb hc fl gn gm gsm sm ssm car clk crv
  hcol crop`; `REQUIRES`: `bs→dba`, `tms→bs`, `gsm→gm`, `ssm→sm`, `hc→wb`, `hp→hcol`, `crop→hp`, `gn→fl`, and Carvel
  Hull's on Clinker; `setUp()` cascades both ways. `TECH_AGE` is 1-based; `TECH_AGE_CIV` gives Burgundians every eco
  upgrade an age early; Fishing Lines Feudal, Gillnets Castle (Burgundians Dark / Feudal). `NO_TECH`, civs lacking:
  Two-Man Saw 20, Gold Shaft Mining 13, Stone Shaft Mining 19, Crop Rotation 19. No unique tech or team bonus changes
  what Fishing Ships gather; carry capacity (Dravidians +15, the techs' +5) is not modelled.
- **Incomes and effects.** `NICHE` (1359), per minute: Feitoria wood 42, food 97, gold 60, stone 18 (Portuguese, from
  Imperial, a unique building that survives Full Tech Tree); Trade Carts 21.6 and Trade Cogs 28.8 gold. `FX` (1462, and
  1509–1514 for five civs whose only entries are team bonuses): kinds `cost`, `flat`, `time`, `rate`, `farm` (farm
  table), `swap`, `unlock` (ally-unlocked units), `relicgold` (Aztec team bonus), `farmfood` (Maya, Sicilians, Chinese
  team bonus), `ageup`, `agebonus`, `forage`, `tradegold`, `caravan`, `tradefood` and those of their days; `team()`
  marks team bonuses. Jurchens, Tatars and Tupi have no entry and show "No applicable civ bonuses.". The Vietnamese's
  other eco bonus (upgrades cost no wood, research faster) is not modelled, nor are tech costs and research times. `UT`
  (1518): 24 unique techs of 23 civs (Franks two) that change cost, training time, gather rate (Grand Trunk Road, gold
  +10%), income (Paper Money, Burgundian Vineyards, Tuntian) or population space (Mahayana, Aznauri Cavalry).
  Conscription (Imperial) applies to Barracks, Archery Range, Stable, Castle and Donjon; its tooltip ("Military
  buildings except Siege Workshops") is broader, as Docks are not included: the game is to be checked before "fixing"
  either. `CRANE_MISSING`: the 20 civs without Treadmill Crane (Castle).

#### Limits and modelling choices

- **Left out.** Raw gather rates: walking and drop-off distance are not modelled, so carry-capacity bonuses (Goth
  hunters, Dravidian fishermen) change nothing, and Wheelbarrow and Hand Cart affect only farms, as in the original
  tool. Left out on purpose: combat, HP, line of sight and population effects; research speed and repair; lump sums
  (resources on age-up or when a building is placed, one-off population space); the Caravanserai (Trade Carts +50% speed
  near it); the Poles' Folwark; what Kasbah and Butalmapu do for allies; no situational bonus since 2026-09-30.
- **Counting.** A Feitoria yields all four resources at once: picked for several, the real need is the largest of those
  columns, not their sum. Huskarl (Barracks) and Tarkan (Stable) are separate entries so that the building's team bonus
  applies; the Donjon Serjeant is the only such unit whose time differs (16 s, 12 s at the Castle). Farm Reseeding
  assumes one farm per farmer, rebuilt by that farmer (1 builder); pastures, two villagers each, rebuilt at the
  1-builder time, an odd farmer a whole pasture at the 2-villager cycle. Fish Trap Rebuilding assumes one trap per
  Fishing Ship, rebuilt by it. All is a snapshot (aoe2techtree as of 2026-09-22, and the hand-measured rates), so a
  balance patch silently makes the tables wrong.

#### Conventions and gotchas

- **Ages.** `state.age` is 0-based (0 Dark … 3 Imperial, the default), every table age 1-based (`UNITS[8]` / `[9]`,
  `TECH_AGE`, `UT[].age`, `NICHE[].age`, `CRANE_AGE`, `CONSCRIPTION_AGE`); `ageOpen(a) => a <= state.age + 1` bridges
  them, messages use `AGES[a - 1]`, per-age `p` arrays go by `state.age`. `inTE()` and `curAge()` bridge the tabs:
  `ageOpen`, `pct`, `available` and `nicheAvail` use `curAge()`. `fttOn()` means ticked and not Generic; `hasTech`,
  `hasCrane`, `ageOf`, `nicheAvail`, `renderTechs` and `anyTechOn` read `state.ftt`, safe only as `setCiv()` and startup
  force `state.ftt = false` for Generic: an invariant to keep.
- **Ticks and views.** An age-locked tick is kept, filtered (`on(k)` = stored tick && `techOpen(k)`), and comes back
  later; a tick for a tech the civ lacks is erased (`syncSettings()` for eco techs, `renderTechs()` for Treadmill
  Crane). Unique-tech ticks (`state.uts`, by name) survive civ switches and Full Tech Tree. `setPostImp(false)` runs on
  any untick and on leaving Imperial. `postImpView()` is memoised in `piView`: `renderRows()` and `setPostImp()` call
  `invalidateView()`, and anything else that changes availability must too.
- **Rows.** A row is known by its entry's name `UNITS[i][0]` (`data-name`, `state.rows[].name`, `byName`);
  `displayName(i)` is for display, and differs under Post-Imp; the dropdown drops a "(Group)" suffix under its group's
  heading ("Serjeant (Donjon)" shows as "Serjeant"). `update()` reads rows from the DOM (`tr[data-name]`), so render
  first. Farm Reseeding and House Building are not in `state.rows`: `renderRows()` appends them, `reseed()` shows or
  hides, and their boxes' `data-up` shares the Food box's state. `addUnit()` is speculative: it pushes the row, renders,
  and takes it out again (by reference, not `pop()`, as `renderRows()` may move it before the buildings; `addCustom()`
  likewise) if `fit()` fails; raising a count or replacing a row does not re-check the fit.
- **Layout.** `applyLayout()` sets classes on `<html>`: `mid` (1,320 px and less, or 1,600 while # Builders shows),
  `narrow` (1,150 and less, or 1,320 with # Builders), `show-bld`, `no-stone`, and `tab-te`, on which all of Transition
  Eco's showing and hiding keys (end of the stylesheet; its row is `#te-row` in the tfoot). The "Mid" and "Narrow" CSS
  blocks (about 507–537) are top-level rules on those classes, though indented like media-query bodies; `@media
  (max-width: 820px)` and `(max-width: 599px)` refine `html.narrow`. `.lanes`, `.lane-bg` and the table's `<col>`s share
  `--cols` and the `--w-*` widths; the four resource widths all read `--w-res` (12 rem, 11 mid; measured minimum 10.9 /
  10.2 rem, set by the longest income options, then "Gurjara Livestock (large)" and "Vietnamese Lumberjack"), and narrow
  and phone layouts set all four to one value: change `--w-res`, never one resource. The Technologies panel lies
  absolutely over the last column (`--w-tech`), the table `calc(100% - var(--w-tech))` wide.
- **Space kept.** `.pagebtn[hidden]` and `.dockopt[hidden]` use `visibility: hidden`; `html.no-stone` blanks Stone; #
  Builders collapses to 0 width, so toggling Buildings is the one action that shifts columns, as confirmed. Full Tech
  Tree and Include Regional & Unique share `.opt-slot`, an inline grid of both labels in one cell, as wide as the longer
  (about 151 px). With Buildings off the checkbox line does not fit between about 1,151 and 1,245 px (mid) or 1,321 and
  1,329 px (wide) and wraps, the settings row 22 px taller; a wider `--w-res` widens these bands. The wrap is the same
  for every civ at a width: headless Chrome at 20 widths (360–1,920 px) found nothing moving on the swap.
- **Saving.** Under `villagers-required.v3`, falling back to v2 and v1; the age is restored only from v3. Old row names
  ("Militia line", members like "Champion") go through `ALIAS`, renamed entries through `RENAMED`; duplicate rows of a
  line merge at startup. `state.tab` ("vr" / "te") is saved, ignored by `load()`; `state.te` = `{ research: 1–4, after:
  0–353693, vils: { wood, food, gold, stone } }` (4 = "After [] seconds"). Switching tabs or the Researching radio calls
  `refreshAll()`, as the age changes.
- **The code.** 2,927 lines: CSS 10–677, markup 679–860, global data tables 862–1335, the app's IIFE 1336–2924. Refresh
  chain: `syncSettings()` (source dropdowns, eco boxes) → `renderTechs()` → `renderCivFx()` → `renderRows()` (the
  table's HTML, then `update()`) → `fit()` (`applyLayout()`, then the font shrink) → `save()` (`syncButtons()`, then
  `localStorage`); `refreshAll()` (2827) runs it all; a count or source change needs only `update()` and `save()`.

#### Not done

- The notes' next steps: oysters still missing; more testing for anything missing (last found: Franks' Mill bonus,
  2026-10-03); testing whether Khmer farms need rates of their own. Trade carts and cogs, also listed, came 2026-10-04.
