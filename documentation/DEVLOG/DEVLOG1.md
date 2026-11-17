# Development log, part 1

- [2026-09-26](#2026-09-26)
- [2026-09-28](#2026-09-28)

Part 1 of the development log. It goes on in [part 2](DEVLOG2.md). The decisions made in the log are
listed in [DECISIONS.md](../DECISIONS.md).

## 2026-09-26

### a static remake of an older villager calculator asked for

#### What changed

- **Why.** The page was built over one chat, 2026-09-26 to 2026-09-28, recorded here in its order; its exchanges carry
  no date or time.
- **Asked.** A remake of https://aoe2-de-tools.herokuapp.com/villagers-required/ (code on GitHub: `aoe2-de-tools`), a
  static page of HTML, CSS and JavaScript only, but: no images or buttons to pick a unit, only a dropdown that is also a
  search bar; no scrolling, all in one page, the window; the results a simple spreadsheet, a column per resource (wood,
  food, gold, stone), a row per unit, the bottom row always the total; a radio button per resource's income, the user
  picking one for food (farm or berries, not both); eco upgrades as checkboxes. Follow-up questions were invited.
- **Done.** No written reply: the original site and its code were studied, and three questions were posed.

#### Questions

1. **Cost and time modifiers** (the Goths discount, Conscription): generic costs only, a few global checkboxes, or full
   options per unit by civ, as in the original?
2. **Civ eco bonuses** (Celts wood, Turks gold, Slavs farms…): one civ dropdown, or a generic civ only?
3. **Buildings per row.** How many buildings produce each unit: a count editable on each row, or always 1?

### the unit picker a searchable dropdown, the results a spreadsheet

#### What changed

- **Answers.** Of the questions in [the section before](#a-static-remake-of-an-older-villager-calculator-asked-for):
  generic costs only (1), a generic civ only (2), a count editable on each row (3).
- **Done.** One HTML file, CSS and JavaScript inline. Typing in the search box, then the arrow keys and Enter or a
  click, adds a row, or 1 more building to a row already there. Each row has an editable count of buildings; the bottom
  row totals each resource, and all. Food sources as radio buttons: Farm, Berries, Hunt, Sheep, Fishing. Eco upgrades as
  checkboxes in the game's order (Bow Saw ticks Double-Bit Axe, unticking Wheelbarrow unticks Hand Cart); Heavy Plow,
  Wheelbarrow and Hand Cart under Farm, greyed out for other sources. The text shrinks as rows are added, until a
  message asks for a row to be removed; only the list of about 240 units scrolls. The browser keeps it all.
- **Unlike the original.** Upgrades are entries of their own, as some train faster (Crossbowman 27s, Archer 35s). Costs,
  times and rates from its data of June 2026, the code new. Wheelbarrow and Hand Cart change only the farm rate, as
  there; Hand Cart without Heavy Plow estimated at 23.9 food per minute. Horse Collar and Crop Rotation left out: they
  add food to a farm, not speed to a farmer.

### a civ picked at the top right, its bonuses applied

#### What changed

- **Asked.** A civ bonus dropdown search on the right, "generic" (no bonuses) default, by aoe2techtree.net.
- **Done.** The civ picker at the top right, Generic by default; a line under the title lists the bonuses applied. Civs
  whose bonuses change by age (Goths, Incas, Persians, Vikings and others) get Dark, Feudal, Castle and Imperial
  buttons, Castle first. The list shows what the civ can build; a row it cannot turns red, "not in Goths tree". A value
  changed by a bonus is underlined, hovering the base value and the bonus. Khitans farm on Pasture; Aztec, Berber and
  Khmer farms take the original tool's rates. Discounted costs are whole numbers.
- **Data.** From aoe2techtree.net (2026-09-22), costs and times too: Galley 45s instead of 60s, Janissary 21s, Huskarl
  13s; Hulk, Carrack and the Varangian units new. The bonus texts are short summaries, not the game's wording.
- **Left out.** All but faster gathering, cheaper units and buildings, faster training or building: combat and HP;
  situational (Georgian Fortified Churches, the Saxon discount per Town Center); side income of unknown rates (Shu
  lumberjacks making food, Pole stone miners and Varangian food gatherers gold); unique technologies; carry capacity
  (Goth hunters, Dravidian fishermen), as the rates are raw.

### villager counts whole numbers, rounded up

#### What changed

- **Asked.** No decimals: there are only whole villagers, so every villager value is rounded up.
- **Done.** A resource's total rounds up the exact sum, not the rounded rows, as its villagers serve every unit at once:
  two units of 1.2 wood villagers show 2 each and a wood total of 3, not 4. The overall total sums the four whole
  totals. Gather rates (23.4/min) and shortened train times (20.8s) keep one decimal; rounding them was offered.

### the exact counts on hover, to two decimals

#### What changed

- **Asked.** The value to two decimals in a tooltip when the mouse is over a number.
- **Done.** On every row's cells and every total, e.g. "5.91 villagers" on a 6, none on "–". A Knight and an Archer:
  gold 10, 9.96 exact; overall 18, 17.71 exact. Phones and tablets, without a mouse, show the whole numbers only.

### team bonuses applied with the civ's own

#### What changed

- **Asked.** Team bonuses, missing, applied like any other bonus (e.g. 20% faster Barracks for Goths).
- **Done.** A civ's team bonus stacks with its own, marked "(team bonus)": a Goths Champion in Castle Age costs 25% less
  and trains in 17.5s instead of 21s; the Goths' Huskarl entry, the Barracks one, is sped up. Faster training: Goths
  Barracks +20%, Huns Stables +20%, Celts Siege Workshops +20%, Britons Archery Ranges +10%, Lithuanians Monasteries
  +20%, Bohemians Markets +80% (Trade Carts), Turks gunpowder units +25%, Magyars mounted archers +25%, Gurjaras camel
  and elephant units +25%; faster building: Wu houses twice as fast; cheaper: Mayans walls −50%, Vikings Docks −15%,
  Sicilians Transport Ships −50%, Ethiopians Outposts without stone.
- **Left out.** Line of sight, attack, HP, population space, conversion resistance; unit unlocks (Condottiero, Genitour,
  Imperial Skirmisher); relic and trade income; faster research; repair; Chinese farms +10% food. A picker of allied
  civs was offered, as only the civ's own team bonus applies.

### the entries grouped by where they are made, filtered by civ and age

#### What changed

- **Asked.** The dropdown's categories rearranged: "Units" (a parent category, in a bolder font) with Town Center, Dock,
  Barracks, Archery Range, Stable, Siege Workshop and Castle; "Buildings" (a parent category, in a bolder font) with
  every building, sorted economic before military, then alphabetically. Age radio buttons always shown, "Dark Age",
  "Feudal Age", "Castle Age", "Imperial Age", Imperial Age by default. Only the units and buildings of the age, and of
  the civ (Generic: all), in the dropdown. Data from https://aoe2techtree.net/.
- **Done.** The age also drives the age-based civ bonuses. Ages are each civ's own (Cuman rams in Feudal Age, Burgundian
  Cavaliers in Castle Age). Rows no longer fitting stay, marked "needs Imperial Age" or "not in Franks tech tree".
- **Choices.** Monastery (Monk, Missionary, Warrior Priest) and Market (Trade Cart) added at the end. A unit of a second
  building is an entry of its own only if something differs: Huskarl (Barracks) and Tarkan (Stable) by team bonuses,
  Serjeant (Donjon) by time. Headings "Economic" and "Military" under Buildings: Blacksmith, Monastery, University,
  Fortified Church and Outpost military; Dock, Harbor, Market and Wonder economic. Moving any was offered.

### dock entries hidden unless Include Dock is ticked

#### What changed

- **Asked.** A checkbox "Include Dock" over the unit dropdown, off by default; off, the Dock and its units hidden.
- **Done.** It sits at the top right of the "Add a unit or building" box, its choice saved. Off, the dropdown hides the
  Dock group (Fishing Ship, Trade Cog, Transport Ship, every warship), the Dock, the Fish Trap and the Harbor (the Malay
  Dock). Dock rows already in the table stay and count.

### upgrades of the same cost and time merged into one entry

#### What changed

- **Asked.** Units of identical values merged in the dropdown, one entry "militia line" instead of five (militia,
  man-at-arms and so on), still found by any of their names: "militia" or "champion" yields the same entry.
- **Done.** 190 entries instead of 284. "champion" or "man at arms" brings up Militia line, the name matched in grey
  beside it; hovering a line shows what it covers. Civ bonuses still apply (Byzantines on the Camel Rider line, Mayans
  on walls). Saved Champion and Militia rows became one Militia line row, their counts added.
- **Merged.** Wholly: the Militia, Spearman, Scout Cavalry, Knight (with Savar), Battering Ram, Mangonel and Scorpion
  lines, most unique units ("Samurai line"), the Watch Tower line (Guard Tower, Keep), the Stone Wall line (Fortified
  Wall). In part: Archer (35s) apart from Crossbowman / Arbalester (27s), Skirmisher from Elite and Imperial Skirmisher,
  Galley from War Galley / Galleon, Imperial Camel Rider from the Camel Rider line. Not: Eagle Scout, Eagle Warrior,
  Elite Eagle Warrior, and unique units whose Elite trains faster, such as Berserk and Chu Ko Nu.

### lines named with a dash, castle unique units with (Elite)

#### What changed

- **Asked.** For unique units from the Castle whose costs and creation times are identical, e.g. "(Elite) Plumed Archer"
  instead of "Plumed Archer line"; for others a dash, "Militia-line" instead of "Militia line".
- **Done.** "(Elite) Plumed Archer", "(Elite) Samurai", "(Elite) Konnik", "(Elite) Huskarl (Barracks)" and "(Elite)
  Tarkan (Stable)". With a dash: Militia-line, Spearman-line, Knight-line, Scout Cavalry-line, Mangonel-line; the Dock's
  unique ships, Caravel-line, Turtle Ship-line, Longship-line; Watch Tower-line, Stone Wall-line. Partial merges keep
  the slash, "Crossbowman / Arbalester". The bonus line too: "Spearman-line, Skirmishers and Camel Riders −25%".

### eco upgrades a civ lacks switched off and greyed out

#### What changed

- **Asked.** An eco upgrade toggled off and disabled when the civ lacks it, by aoe2techtree.net.
- **Done.** Hovering says why, e.g. "Goths can't research Gold Shaft Mining". Back on a civ that has it, the box is
  usable but unticked. Four of the ten are ever missing: Two-Man Saw for 20 civs (Aztecs, Berbers, Celts, Franks,
  Mongols, Romans among them), Stone Shaft Mining for 19 (Britons, Huns, Japanese, Turks, Vikings among them), Gold
  Shaft Mining for 13 (Goths, Italians, Portuguese, Spanish, Teutons among them), Heavy Plow for Khitans only.
- **Not done.** The age locks no upgrade: Two-Man Saw can be ticked in Feudal Age. Locking by age was offered.

### a Full Tech Tree checkbox that gives a civ every non-unique entry

#### What changed

- **Asked.** A checkbox "Full Tech Tree" next to Include Dock, off by default: on, every unit and building, unique ones
  apart, shows whatever the civ, and every technology checkbox is available. "Generic" unchanged.
- **Done.** Goths get Arbalester, Paladin and Siege Onager, 73 entries instead of 43. Units the civ lacks come at their
  usual age, the rest at its own (Cuman rams in Feudal Age). Unique units and buildings stay the civ's own: Goths keep
  Huskarls, without Samurai or the Donjon. Civ bonuses apply to all. Off, rows stay, marked "not in … tech tree". Unique
  is what aoe2techtree labels so: Eagle Warriors, Battle Elephants, Camel Riders, Steppe Lancers, Fire Lancers, the
  Fortified Church, Pasture and Settlement are regional there, so shown for every civ; civ-only was offered.

### allies picked beside Your Civilization, their team bonuses applied

#### What changed

- **Asked.** The original tool's link and the description ("How many villagers[...]") deleted. A searchable dropdown
  "Allied Civilization(s)", 0 to 7 civs, 0 by default, left of the civ picker, renamed "Your Civilization" and kept in
  place. The allies' team bonuses apply, marked in brackets, e.g. "Stables work 20% faster (from Huns Ally)".
- **Done.** A click or Enter ticks or unticks a civ, the list staying open; "None", the default, clears all; past 7 the
  rest are greyed out. Each civ in the list shows its team bonus; the closed box the allies, e.g. "Huns, Celts". The
  civ's own keeps "(team bonus)". A Huns ally: Knights in 25s instead of 30s. An ally of no effect is noted, e.g.
  "Franks ally's team bonus doesn't change these numbers." No team bonus counts twice. A Berbers ally adds Genitours, an
  Italians ally the Condottiero in Imperial Age.

### unique technologies and Conscription as checkboxes right of the table

#### What changed

- **Asked.** Checkboxes of unique technologies and Conscription right of the table, Conscription the lowest; the unique
  ones hidden for Generic, and for any that changes no unit cost or creation time. Data from aoe2techtree.net.
- **Done.** A Technologies column: the civ's unique technologies that change costs or training times, the Castle Age one
  first, then Conscription, which every civ has, each with a line on its effect. A civ without any has a note, e.g. "No
  Georgians unique technology changes these numbers." Hovering shows e.g. "Barracks work 100% faster (Perfusion)".
- **Included.** 18 in 17 civs. Faster training: Perfusion (Goths), Chivalry (Franks), Kasbah (Berbers), Steppe Husbandry
  (Cumans), Comitatenses (Romans), Circumnavigation (Portuguese), Clerical Recruitment (Saxons), Huaracas (Muisca).
  Cheaper: Ordonnance Companies (Franks), Szlachta Privileges (Poles), Kshatriyas (Gurjaras), Silk Road (Italians),
  Butalmapu (Mapuche). Food instead of gold: Forced Levy (Malay, Militia-line), Corvinian Army (Magyars, Magyar
  Huszars), Hussite Reforms (Bohemians, Monks). Wood: Kamandaran (Persians), Archers instead of gold, 70 wood; Detinets
  (Slavs), 40% of the stone of Castles and towers.
- **Left out.** Technologies of combat, population, free units or availability, and four of extra income, offered:
  Burgundian Vineyards, Grand Trunk Road (Hindustanis), Paper Money (Vietnamese), Tuntian (Wei). Kasbah and Butalmapu,
  which help teammates in the game, apply only to Berbers or Mapuche as the civ.

### techs locked by age, the column headers counting villagers

#### What changed

- **Asked.** Deleted: the help texts "Search for a unit" and the Conscription description, and "Technologies No [...]
  unique technology changes [...]". "[...] ally's team bonus doesn't change" becomes "No applicable team bonuses from
  allies." when allies are picked but none applies; "none of their bonuses change these numbers" becomes "No applicable
  civ bonuses." for the civ. Techs of later ages disabled, not hidden, unique techs and Conscription too: in Dark Age
  all, with exceptions like the Burgundians; in Feudal Age Bow Saw, Hand Cart and so on. Headers renamed: Buildings to
  "# Buildings", Wood to "# Wood vils", and so on. Data from aoe2techtree.net.
- **Done.** Removed as asked, with the heading "Technologies", with which the quote began; bringing it back was offered.
  A tech not yet available is greyed out, hovering "Available from Castle Age"; in Dark Age all are, except Burgundian
  Double-Bit Axe, Wheelbarrow, Gold Mining and Stone Mining. Unique techs follow their own age (Franks: Ordonnance
  Companies in Castle Age, Chivalry in Imperial); Conscription is Imperial Age. An earlier age unticks locked techs, a
  later restores them. The headers read "# Buildings", "# Wood vils", "# Food vils", "# Gold vils", "# Stone vils".
- **Fixed.** After Escape in a civ picker and a click on it again, typing went on from the old name. Steppe Husbandry
  (Cumans) and Circumnavigation (Portuguese) are Castle Age, not Imperial.

### the unit list kept open while Include Dock or Full Tech Tree is ticked

#### What changed

- **Asked.** An open unit dropdown not closed by toggling the Dock or Full Tech Tree checkboxes.
- **Done.** The list stays open and updates, the search text kept, the cursor back in the search box.

### a Clear button that resets the page, a Post-Imp button that ticks every tech

#### What changed

- **Asked.** A "Clear" button at the top, between the title and the allies dropdown, resetting the whole page: the table
  cleared, the allies deselected, the civ Generic, Imperial Age, every checkbox off. A "Post-Imp" button between the civ
  and the unique techs and Conscription, setting Imperial Age and ticking every available technology checkbox.
- **Done.** Clear, beside the title, also sets the food source back to Farm, part of the starting state; an "Undo" link
  shows in the status line for 8 seconds. Post-Imp, above the Technologies column, ticks what the civ can research (for
  Franks, all but Two-Man Saw and Stone Shaft Mining), all with Full Tech Tree, the farm upgrades whatever the food
  source; it leaves the table, the allies, Include Dock and Full Tech Tree.

### no undo after Clear

#### What changed

- **Asked.** The undo deleted.
- **Done.** Clear resets the page at once, showing "Page cleared." in the status line.

### the status line empty after Clear

#### What changed

- **Asked.** "Page cleared" deleted, as redundant.
- **Done.** Clear also wipes an earlier status message, such as "Knight-line added.".

### the Clear button hidden on a cleared page, and centred

#### What changed

- **Asked.** Clear hidden when the page is already cleared, and centred between the title and the allies dropdown.
- **Done.** It shows once anything differs from the starting state: a row, a civ or ally, an age but Imperial, a food
  source but Farm, a ticked checkbox. Hidden, it keeps its space, so nothing shifts.

### more lines named (Elite) or (Heavy), Full Tech Tree locked on for Generic

#### What changed

- **Asked.** Renamed: "Clear" to "Clear All", "Varangian Guard-line" to "(Elite) Varangian Guard", "Battering Ram-line"
  to "Ram-line", "Ibirapema Warrior-line" to "(Elite) Ibirapema Warrior"; every other line of two units whose latter is
  just "elite" or "heavy" (e.g. the elephant archer) named "(Elite)..." instead of "-line", by aoe2techtree.net. With
  Generic, Full Tech Tree shown ticked and disabled; with any other civ, enabled and toggled off.
- **Done.** Nine more were reported, ten named: "(Elite)" Elephant Archer, Battle Elephant, Shrivamsha Rider, Cannon
  Galleon, Longship, Caravel, Turtle Ship; "(Heavy)" Scorpion, Rocket Cart, Hei Guang Cavalry. Still "-line", of more
  than two units or another upgrade: Militia, Spearman, Scout Cavalry, Knight, Camel Rider, Ram, Mangonel, Armored
  Elephant (to Siege Elephant), Bombard Cannon (with Houfnice), Watch Tower, Stone Wall. "siege ram" finds Ram-line.
  Full Tech Tree stays as it is between two civs other than Generic.

### a Donjon group for the Serjeant, the one unit slower at a second building

#### What changed

- **Asked.** The cases where a unique building trains a unit in another time (e.g. serjeants from donjons with
  Sicilians), each a unit category (e.g. Donjon for Sicilians) in the dropdown, for those civs and Generic; not where
  the time is the same (Konniks need no Krepost category). Data from aoe2techtree.net.
- **Done.** Only the Serjeant: 16s at the Donjon, 12s at the Castle. A "Donjon" heading after Castle, for Sicilians from
  Feudal Age and for Generic; "Serjeant" there, "Serjeant (Donjon)" in the table. Conscription was held not to speed the
  Donjon. The Warrior Priest, of the Fortified Church only, stays under Monastery; its own heading was offered.
- **No group.** The same time: Krepost (Bulgarians: Konnik, Elite Konnik, Petard), Donjon (Elite Serjeant,
  Spearman-line), Settlement (Mapuche: Spearman-line, Skirmishers), Fortified Church (Armenians, Georgians: Monk),
  Monastery (Muisca: Temple Guards).

### no civ bonus, team bonus or unique technology under Full Tech Tree

#### What changed

- **Asked.** With Full Tech Tree on, all civilisation bonuses (including team bonuses) inhibited, unique techs disabled.
- **Done.** No civ bonus, team bonus or ally's team bonus applies. Unique technologies stay, greyed out, hovering "Not
  available with Full Tech Tree", their ticks kept. Goths with a Huns ally and Post-Imp train Champions in 6.6s; with
  Full Tech Tree, by Conscription alone, in 15.8s, the bonus line reading "Goths: No applicable civ bonuses. No
  applicable team bonuses from allies." Also gone: Burgundian eco upgrades an age early; early units such as Cuman rams
  and Burgundian Cavaliers; Khitan Pastures; the faster farms of Aztecs, Berbers and Khmer; Genitours and Condottieri
  from allies. Kept: the civ's unique units, eco upgrades and Conscription.

#### Questions

1. **Generic and the allies.** Generic has Full Tech Tree always ticked, so the allies' team bonuses no longer apply
   with it. Should Generic be exempt, so that they still count?

### the Full Tech Tree checkbox hidden for Generic, which is exempt from it

#### What changed

- **Answers.** Of the question in [the section
  before](#no-civ-bonus-team-bonus-or-unique-technology-under-full-tech-tree): Generic is exempt (1).
- **Asked.** The Full Tech Tree checkbox hidden entirely for Generic, not only disabled.
- **Done.** With Generic, the allies' team bonuses count: a Huns ally gives Knights in 25s. Another civ shows the box
  unticked. Generic, or Clear All, hides it. Its tooltip: Full Tech Tree gives every non-unique unit, building and
  technology, without civ bonuses, team bonuses or unique technologies.

### one sentence in the bonus line while Full Tech Tree is on

#### What changed

- **Asked.** With Full Tech Tree on, instead of "No applicable bonuses", the text "When Full Tech Tree is enabled, all
  civilization bonuses and unique technologies are unavailable."
- **Done.** It replaces the civ's name and both "No applicable…" messages, through any change of civ.

### a Treadmill Crane checkbox while the table holds a building

#### What changed

- **Asked.** With building(s) in the table, a Treadmill Crane checkbox under Conscription, disabled if the civ lacks it
  and Full Tech Tree is off; with none, hidden. Data from aoe2techtree.net.
- **Done.** Builders work 20% faster: a House in 20.8s instead of 25s. 20 civs lack it, among them Celts, Spanish,
  Teutons, Persians and Romans: off and greyed, hovering "Celts can't research Treadmill Crane", unless Full Tech Tree
  is on. Castle Age for every civ that has it. Post-Imp ticks it, Clear All unticks it.

### a Post-Imp checkbox that names each line by its last unit

#### What changed

- **Asked.** Post-Imp a checkbox instead of a button, off by default. Checked: Imperial Age, every available technology
  on, early units hidden from the dropdown (e.g. Eagle Scout for civs that get it, leaving only the Elite Eagle Warrior
  entry), each line named after its latest available version: Militia-line becomes Champion, or Two-Handed Swordsman for
  a civ without Champion, e.g. Malay. Unchecked: the dropdown as usual, early units and "-line" too. A tech checkbox
  toggled off while Post-Imp is checked unchecks Post-Imp. Data from aoe2techtree.net.
- **Done.** Under Full Tech Tree it ticks no unique tech. The dropdown shows, and the table names, the latest version of
  each line the civ can reach (by aoe2techtree's links): Militia-line Champion (Malay Two-Handed Swordsman, Romans
  Legionary, Persians Long Swordsman), Knight-line Paladin (Persians Savar, Poles and Romans Cavalier), Scout
  Cavalry-line Hussar (Poles Winged Hussar), Fire Galley line Fast Fire Ship (Chinese Dragon Ship), Camel line Heavy
  Camel Rider (Hindustanis Imperial Camel Rider), Watch Tower-line Keep, Stone Wall-line Fortified Wall.
- **Off.** Unticking Post-Imp restores the dropdown, the techs and the age left; unticking a tech, leaving Imperial Age
  and Clear All untick it. A change of civ or of Full Tech Tree keeps it on.

### the civs and the techs cleared by buttons of their own

#### What changed

- **Asked.** A Clear Civs button right of Clear All: the allies set to None, the civ to Generic; hidden when no civ is
  picked. A Clear Techs button below the Post-Imp checkbox: every enabled tech toggled off; hidden when all are off.
- **Done.** Clear All and Clear Civs are centred between the title and the allies. Clear Techs also unticks Post-Imp; a
  tick greyed by the age (Double-Bit Axe in Dark Age) does not count but is cleared. Hidden, both keep space.

### the unit list kept open while the age or Post-Imp changes

#### What changed

- **Asked.** An open unit dropdown not closed by a change of age or a toggle of Post-Imp.
- **Done.** The list updates, the cursor back in the search box: with "mil" typed, Post-Imp turns "Militia-line" into
  "Champion". On phones the open list covers Post-Imp; the age buttons sit above it.

### one civ picker opened straight from the other

#### What changed

- **Asked.** A bug fixed: with Your Civilization open, Allied Civilization(s) cannot be opened.
- **Fixed.** One click closes one and opens the other, either way, and the unit search too. Your Civilization selected
  its name, so that typing replaces it, a moment after closing, taking the focus back from the allies box; it now does
  so only while it has focus. A click into its open box put the cursor inside "Generic"; the name is now selected.

### minus and plus buttons beside each building count

#### What changed

- **Asked.** The count of buildings with a - button left of its field and a + button right of it, in place of its
  arrows, square (1:1) and as tall as the field and the row.
- **Done.** One control at every screen size; − greys out at 0 and + at 99, the limits as before, and typing still
  works. The # Buildings column is slightly wider, its heading centred.

### the buildings totalled in the table, the villagers required beside it

#### What changed

- **Asked.** The Total row showing the total of buildings in the buildings column, where the total of villagers was, and
  that total right of the table, below the Conscription checkbox.
- **Done.** "Villagers required", large, under Conscription and Treadmill Crane, hovering two decimals; on phones
  "Villagers", in the strip above the table. A 360×640 screen then held no row; with the phone layout tightened (a wider
  Wood column, smaller age buttons, lower civ pickers), it holds 2, and 390×740 8 or more.

### a list of niche income sources drawn up, the page unchanged

#### What changed

- **Asked.** Nothing in the page changed: a list of niche income sources, whose gather rates are to be found out, e.g.
  Vietnamese gold from wood, Portuguese wood from berries, and any other unique tech or civ bonus that gives a resource
  a new income source. Data from aoe2techtree.net.
- **Done.** From every civ bonus, unique tech and team bonus there, which give no amounts: every number is to be checked
  in the game; bonuses that only change existing sources were left out. A second resource: Portuguese foragers make
  wood; Vietnamese lumberjacks gold (Paper Money); Shu lumberjacks food; Polish stone miners gold; Varangian shepherds,
  fishermen and hunters gold; Burgundian farmers gold (Burgundian Vineyards).
- **Not from gathering.** Gurjara livestock garrisoned in a Mill makes food; Wei soldiers food (Tuntian); Varangian
  Guards gold, 50% more by their bonus; the Portuguese Feitoria, Imperial Age, resources; Khitan Pastures in place of
  Farms; the Polish Folwark in place of the Mill, its effect not said.
- **Other income.** Mapuche mounted units 3 gold per military unit defeated; Danes 25% of the cost of each enemy
  building destroyed; Spanish 20 gold per technology. At each age-up, Dravidians 200 wood, Ethiopians 100 gold and 100
  food; Lithuanians 100 food per Town Center; Saxons 35 food and 10 stone per Mill, Lumber Camp or Mining Camp; Wu 55
  food per military production building or Dock; Tatars 2 sheep per new Town Center from Castle Age; Incas (team bonus)
  a free Llama; Gurjaras 2 extra forage bushes; Armenians a free Relic in the first Fortified Church. Relics and trade,
  by team bonuses: relics making food (Burgundians), 33% more gold (Aztecs); trade units food of 10% of their gold
  (Bengalis), 25% more gold (Spanish). Grand Trunk Road (Hindustanis): all gold 10% faster, a Market fee of 10%. The
  Caravanserai, Imperial Age (Persians, Hindustanis); a Market fee of 5% (Saracens); Atheism (Huns), enemy relics 50%
  less.

### the unique technologies 19, Grand Trunk Road among them

#### What changed

- **Asked.** Grand Trunk Road, the Hindustanis' missing unique tech, added; the unique techs checked again for others
  affecting creation times, costs or gather rates. Data from aoe2techtree.net.
- **Done.** Castle Age: gold miners 10% faster, 25.1 gold per villager per minute instead of 22.8, 33.2 with both mining
  techs. Of all 112 unique techs, it alone was missing with a stated amount: 19, the other 18 matching.
- **Not done.** Burgundian Vineyards, Paper Money (Vietnamese), Tuntian (Wei): no amount stated, until rates are known.
- **Left out.** Cuman Mercenaries (5 free Elite Kipchaks per Castle, once); Anarchy and Marauders (Huskarls and Tarkans
  at the Barracks and Stable at the same speed, already entries); Atheism (enemy relics only).

### a Buildings checkbox, and a # Builders column that shortens build times

#### What changed

- **Asked.** With a building in the table, a sixth column "# Builders" between the Unit column and the # Buildings
  column: 1 to 20, 1 by default, which changes nothing; more alter the creation time by the formula "(3 t / n + 2)", t
  the regular time and n the builders, e.g. a castle with 4 builders 100 seconds instead of 200. Builders are villagers,
  added to the villagers required. The Unit column renamed "Unit/Building". A checkbox "Buildings" next to "Include
  Dock", off by default: off, buildings hidden from the dropdown, renamed "Add a unit"; on, the # Builders column and
  the buildings shown, the dropdown named "Add a unit or building".
- **Done.** The time is 3t / (n + 2), as the example gives, after other building speed (Spanish builders, Treadmill
  Crane). The Total row sums the builders, added to Villagers required: two Castles of 4 builders add 8. The column
  shows while Buildings is ticked or a building row is in the table. Clear All unticks Buildings.

#### Questions

1. **The first builder.** Every builder counts, so one House adds 1 villager. Should only those beyond the first count?

### the stone column hidden without buildings

#### What changed

- **Asked.** The dropdown always "Add a unit or building", whether Buildings is on or not, and the column "Unit" again.
  With Buildings off and no building in the table, the stone column hidden.
- **Done.** Then # Stone vils, its total and the Stone settings (rate, Stone Mining, Stone Shaft Mining) hide: in
  aoe2techtree's data only buildings cost stone. Stone Mining ticks are kept while hidden.

### the stone column blanked in place, so that nothing moves

#### What changed

- **Asked.** Hiding or showing the stone column moving no other component or checkbox: an empty space while hidden.
- **Done.** Its heading, numbers, total, tint and Stone settings go, its width stays. Checked at four screen sizes,
  Stone shown and hidden: nothing moves. Toggling Buildings still shifts the columns, through the # Builders column.

#### Questions

1. **The # Builders column.** Should it keep its space when hidden as well, so that toggling Buildings moves nothing?

### the list's checkboxes on a line of their own under its name

#### What changed

- **Asked.** The dropdown's checkboxes below its name, so that they do not move when Full Tech Tree is hidden or shown.
- **Done.** Include Dock, Buildings and Full Tech Tree on one line under "Add a unit or building"; Full Tech Tree,
  hidden for Generic, leaves a gap. Checked at six screen sizes from phone to wide desktop: nothing moves.

### the names following Buildings again, every tech checkbox with a tooltip

#### What changed

- **Asked.** The names conditional again: with Buildings enabled, "Add a unit or building" and "Unit/Building";
  otherwise "Add a unit" and "Unit". Tooltips on the technology checkboxes without one, by aoe2techtree.net. Treadmill
  Crane shown while Buildings is toggled on, no longer while a building is selected.
- **Done.** Tooltips such as "Lumberjacks work 20% faster" (Double-Bit Axe, Bow Saw), "Villagers carry 50% more and move
  10% faster" (Hand Cart), "Military buildings except Siege Workshops work 33% faster" (Conscription), "Builders work
  20% faster" (Treadmill Crane). On a greyed-out box the reason comes first: "Available from Castle Age. Lumberjacks
  work 20% faster", "Goths can't research Gold Shaft Mining. Gold miners work 15% faster".
- **Corrected.** Conscription speeds every military building but Siege Workshops, the Donjon Serjeant too, contrary to
  [the section](#a-donjon-group-for-the-serjeant-the-one-unit-slower-at-a-second-building): with it 12s, not 16s.

### one row per unit line, with an Upgrade button on earlier units

#### What changed

- **Asked.** The text rewritten: "Civilization bonuses, team bonuses, and unique technologies are inhibited when Full
  Tech Tree is enabled." Include Dock, Buildings and Full Tech Tree not affected by "Clear All", nor of themselves
  making it appear. No two entries of one unit line in the table at once: Crossbowman added with Archer in it removes
  Archer, and the other way round. An earlier unit, such as Archer, has an "Upgrade" button after its name in the Unit
  column, which upgrades it (Archer to Crossbowman) unless the civ lacks access (Spanish have Archer but not
  Crossbowman). Tech trees and lines by aoe2techtree.net.
- **Done.** A new entry of a line replaces its row in place, keeping # Buildings: Archer ×2 becomes Crossbowman /
  Arbalester ×2. "Upgrade" goes to the next version the civ can reach, branches included: Chinese Fire Ship to Dragon
  Ship, Hindustani Camel Rider to Imperial Camel Rider. Greyed out, it hovers why: "Spanish can't upgrade to
  Crossbowman", "Eagle Warrior needs Castle Age".
- **Choices.** One unit of two buildings may keep two rows: Castle and Donjon Serjeants, Castle and Barracks Huskarls.
  An upgrade into a version already in the table merges the rows, their counts added, as an upgraded Donjon Serjeant
  does with the Castle's Elite Serjeant. Old saves are merged as the page loads.

### the wood for rebuilding farms counted in a Farm Reseeding row

#### What changed

- **Asked.** The row's delete button left of the Unit/Building column, its X red, to be more noticeable. A special entry
  not in the dropdown, "Farm Reseeding", added by itself with farmers (not other food), with no # Builders or #
  Buildings, and three checkboxes: Horse Collar, Heavy Plow, Crop Rotation, Heavy Plow in step with the food column's. A
  farm depleted costs 60 wood (with exceptions, e.g. the Teuton civ bonus): from the gather rates, how often, and how
  many lumberjacks keep it up. Food per farm: unupgraded 175, Horse Collar 250, Heavy Plow 375, Crop Rotation 550. The
  entry e.g. "Farm Reseeding 60w / [build time + depletion time]s". Exceptions and civ bonuses by aoe2techtree.net.
- **Done.** A red × at each row's left. The row shows while Farm is the food source and a farmer is needed, its name
  across # Builders and # Buildings; not for Khitans, unless Full Tech Tree is on. A farm's cycle is its build time and
  the time one farmer takes to empty it, e.g. "60w / 532.2s"; farmers × the farm's wood ÷ the cycle ÷ a lumberjack's
  rate gives the lumberjacks, in # Wood vils. 6 farmers, no upgrades: 175 food at 20.3 per minute, 517s, and 15s to
  rebuild, a 532s cycle: 1.73 lumberjacks, shown as 2. In the game's order, Heavy Plow ticks Horse Collar, Crop Rotation
  ticks both; 20 civs lack Crop Rotation.
- **Exceptions.** Teuton farms 40% cheaper, 36 wood; Malian buildings 15% less wood, 51 wood; Sicilian farm upgrades
  125% more food, a full farm about 1,019 food; Mayan resources 15% longer; the Chinese team bonus, 10% more food per
  farm; Spanish builders, Romans and Treadmill Crane (with Buildings ticked) shorten the rebuild. The Polish Folwark was
  left out: aoe2techtree says only that it replaces the Mill.

### the food source a plain dropdown on the Food heading

#### What changed

- **Asked.** The food income sources a dropdown instead of radio buttons, without search, as the entries are few.
- **Done.** Farm, Berries, Hunt, Sheep, Fishing, between "Food" and the gather rate; Heavy Plow, Wheelbarrow and Hand
  Cart under it, greyed out unless Farm; "Pasture" for Khitans. The Food box is as tall as the Wood box.

### niche income sources picked per resource behind a Niche Incomes checkbox

#### What changed

- **Asked.** Farm Reseeding showing the total wood, not one farm's: with 30 farmers "[30 x 60]w" instead of "60w". A
  checkbox "Niche Incomes" between the Post-Imp checkbox and the Clear Techs button, off by default; on, unusual income
  sources picked from dropdowns, as for food; off, those dropdowns hidden, food's usual one apart. Rates per minute:
  wood, Portuguese Forager 5, Feitoria 42; food, Shu lumberjack 1, Feitoria 97, Gurjara garrisoned livestock 6, Gurjara
  garrisoned livestock (large) 8, Burgundian relic 20; gold, Relic 30, Varangian shepherd the sheep rate x0.1, Varangian
  hunter the hunt rate x0.1, Varangian fisherman the fishing rate x0.1, Polish stone miner 6, Feitoria 60, Burgundian
  Farmer 0.8, Vietnamese Lumberjack 0.8; stone, Feitoria 18.
- **Done.** 6 farmers show "360w / 532.2s". With Niche Incomes on, Wood, Gold and Stone get a source dropdown under
  their heading (Lumberjack, Gold Miner, Stone Miner), and Food's gains the niche sources; off, the three hide and a
  niche choice goes back. Feitorias, relics and livestock get columns of their own, "# Relics", "# Feitorias", "#
  Livestock", and are not villagers: Relic for gold with a Knight takes Villagers required from 15 to 8.
- **Availability.** A source shows for its civ only, all for Generic; Burgundian relic food with a Burgundian ally too;
  Relic for every civ, from Castle Age; the Feitoria from Imperial Age; Burgundian Farmer with Burgundian Vineyards,
  Vietnamese Lumberjack with Paper Money. Full Tech Tree keeps only Relic, and for Portuguese the Feitoria.
- **Bonuses.** Varangian gold is 10% of the food rate with bonuses: a shepherd 2.0 gold per minute. The Aztec team bonus
  gives relics 33% more, 39.9 per minute; Grand Trunk Road niche gold 10% more.
- **Limits.** The Feitorias needed are the largest of their columns, not the sum, as one makes all four resources.
  Burgundian Farmers for gold are counted apart from the food column's farmers, so twice if they are the same.

## 2026-09-28

### notes on the page, consolidated from its design chat

#### What changed

- **Why.** The page was built in one design chat, from 2026-09-26 to this day, whose log is `context_a.md`. On this day
  the notes in `context_b.md` were consolidated from that log and a full read of `index.html`; they were updated after
  each later change, and the later days of this log are taken from them. Their line numbers match the 2,927-line
  `index.html` of this day.
- **The page.** "Villagers required · AoE2 DE": one static file, `index.html`, with no dependencies, no build, no tests
  and no CI; it is opened in a browser. It answers how many villagers on each resource keep N buildings producing unit X
  non-stop, or N copies of a building under construction non-stop: per resource, cost ÷ time ÷ gather rate, rounded up
  to whole villagers.
- **Origin.** A from-scratch remake of the "Villagers required" page at aoe2-de-tools.herokuapp.com
  (github.com/PeterWhiteJavascript/aoe2-de-tools), built as an artifact over that one chat; `index.html` is the artifact
  as of the chat's last exchange.
- **Data.** From aoe2techtree.net's source data, updated 2026-09-22: unit and building costs, train and build times,
  civs, bonuses, tech trees, ages and upgrade lines. From the original tool's dataset: base gather rates and farm
  tables. Measured by hand: the alternative-income rates. Bonus and tech texts on the page are short summaries, not the
  game's wording.
- **Repository.** `origin` is github.com/cnordenb/aoe2vils, branch `main`, with one commit, `e03199e` "Initial commit"
  (LICENSE and a one-line README). Git has no history of the page, so `context_a.md` serves as its change history,
  prompt by prompt.
- **Reading `context_a.md`.** It holds 42 prompt/response pairs labelled 1–44: the labels skip twice ("prompt 11" →
  "output 12", "prompt 34" → "output 35"), but each output answers the prompt just above it, so nothing is missing. The
  outputs are summaries and tool calls are collapsed ("Ran N commands"), so no diffs are recorded. Examples from before
  output 42 leave out the Farm Reseeding lumberjacks. Its last exchange (44: total wood in Farm Reseeding, and the Niche
  Incomes checkbox, since removed) is the state `index.html` arrived in.
- **Reversals in the chat.** Where exchanges contradict each other, the later one wins. Food source: radio buttons →
  dropdown (43). Horse Collar / Crop Rotation: left out → added with Farm Reseeding (42). Full Tech Tree for Generic:
  shown disabled (21) → hidden (24). Full Tech Tree ages: the civ keeps its early ages (12) → standard ages, no bonuses
  (23). Clear: with Undo (17) → no Undo (18) → no "Page cleared" (19). Clear All and the view toggles: resets them (17)
  → leaves them alone (41). Post-Imp: button (17) → checkbox (27). Conscription: skipped the Donjon (22) → includes it
  (40). Treadmill Crane: shown when a building row exists (26) → when Buildings is ticked (40). Adder and column labels:
  switched with Buildings (36) → fixed (37) → switch again (40). Stone column: collapsed (37) → blanked in place (38).
  Unique techs: 18 → 19 (35).

### standing rules from the chat: the page and its wording

#### What changed

- **Why.** The notes keep the standing rules from the chat together with what was added to them on later days, up to
  2026-10-08, each addition with its date. They are kept together here, as in the notes, and the sections of the later
  days point to them.
- **Stack.** Static HTML, CSS and JavaScript only.
- **No animations whatsoever.** Made a strict, project-wide standing rule on this day: no CSS `transition`, `animation`
  or `@keyframes`, no motion driven by JavaScript, no smooth scrolling. State changes are instant, e.g. the dropdown
  arrow flips direction at once. `requestAnimationFrame` is fine for timing the layout. The arrow's rotation transition
  and the 1 s highlight on added or upgraded table rows (`@keyframes flash`, `flash()`) were removed.
- **No page scrolling.** Everything fits the viewport; only dropdown lists scroll.
- **The table.** Units are picked from a searchable dropdown, with no images or unit buttons. Results show as a
  spreadsheet: resources as columns, units as rows, and a Total row that is always visible. Totals are whole villagers,
  always rounded up. Row cells (units, Farm Reseeding, House Building) show one decimal, rounded normally (decided
  2026-09-29; they were whole numbers, rounded up). The exact value, to 2 decimals, shows in the hover tooltip.
- **Source of truth.** aoe2techtree.net, for civs, bonuses, tech trees, ages and upgrade lines.
- **Layout stability.** Showing or hiding something must not move other UI; this was said explicitly for the Stone
  column and the dropdown checkboxes. Hidden controls keep their space. The # Builders column is a deliberate exception:
  it collapses, and is to be left as it is.
- **No redundant text.** Removed on request: help texts, the original tool's link and description, the Conscription
  description, the "Page cleared" message, Undo (no undo function is wanted) and, on this day, the whole status line. No
  confirmation or status messages are added: the table itself shows what changed.
- **Dictated wording.** UI wording is dictated, and kept verbatim: "No applicable civ bonuses."; "No applicable team
  bonuses from allies."; "Civilization bonuses, team bonuses, and unique technologies are inhibited when Full Tech Tree
  is enabled."; the ally tag "(from Huns Ally)"; "Villagers required"; "Add a unit" / "Add a unit or building" and
  "Unit" / "Unit/Building" (both follow the Buildings box); "# Buildings", "# Builders", "# Wood vils" and the other
  column headers.
- **Wording added later.** "Naval" (was "Include Dock", 2026-09-30); the fishing spots "Shore" / "Deep" / "Trap"; the
  gold source "Trade Carts" with its "Caravan" and "Bump factor" boxes (2026-10-04; the heading "# Trade Carts" is the
  source's name, its short form "# Carts", wording not dictated); "Trade Cogs" with "Caravan", "Clinker Construction"
  and "Carvel Hull" (heading "# Trade Cogs", short "# Cogs"); "+x w/min from Foragers"; the income sources "Trees" (was
  Lumberjack), "Gold Mine" (was Gold Miner), "Stone Mine" (was Stone Miner), "Custom Rate", and the Gurjara one
  "Garrisoned Food Amount" (2026-10-04; the "Garrisoned Sheep" / "Garrisoned Cows" sources it replaced are gone); "+x
  f/min from Lumberjacks"; "+x g/min from Stone Miners" (wording not dictated, after the heading); the column headings
  by source (`HEADS`): "# Lumberjacks" (Trees), "# Gold Miners" (Gold Mine; "# Gold Miner" was written, read as a typo),
  "# Stone Miners" (Stone Mine), "# Farmers" (Farm, also Khitan Pasture), "# Foragers", "# Shepherds", "# Hunters", "#
  Fishermen".
- **And.** The adder footer's tooltips "Take wood expense of farm reseeding into account" (since 2026-09-30 "Take wood
  expense of farm reseeding and fish trap rebuilding into account": mentioning fish traps was agreed to, wording not
  dictated) and "Take wood expense of house building into account"; the row name "Fish Trap Rebuilding"; "Idle TC Time"
  (checkbox) and "Villagers missing" (2026-10-01); Transition Eco's fourth radio "After [] seconds", and its heading
  "After 45s" / "After 5m" / "After 5m30s" in place of "On reaching <Age>" (2026-10-01); Transition Eco's "Clear Values"
  button (2026-10-08; its tooltip "0 on every resource", wording not dictated); Transition Eco's "Total villagers used"
  (2026-10-08; "Villagers" in the strip above the table, wording not dictated, after Villagers required's phone form).
- **Questions.** Follow-up questions are routinely invited.

### standing rules from the chat: bonuses, incomes, headings and entry names

#### What changed

- **Bonus labels (2026-09-30).** Each `FX` label says what the number does, with one verb ("Foragers work +15% faster",
  "Castles cost −25%", "Villagers carry +3"), and no explanation after a comma; when in doubt, aoe2techtree.net's civ
  bonus list (`strings.json`, the civ help texts) is copied. All labels were rewritten that way; the page keeps "−" for
  minus. Berbers' farm-table label carries per-age numbers (+5% Dark, +10% from Feudal). Romans' one bonus is two labels
  (gather / build), as the page models them apart.
- **Custom income (2026-09-30).** Every source dropdown ends with "Custom Rate" (was "Custom..."), so the wood / gold /
  stone dropdowns always show now (the rule that hid one with nothing to choose, and the selects' `hidden` attribute,
  are gone). While it is picked, that box's heading rate becomes a number field (`#rate-in-<res>`, 0.1–999.9 per
  villager per minute, one decimal; as tall as the text, so the box does not grow). It starts from the rate the resource
  had before and is remembered per resource (`state.customRate`, saved; Clear All empties it). The rate is taken as
  typed: no upgrades (hidden, like any non-standard source) and no gathering bonuses (`rates()` sets it last). While
  typing, an empty or invalid field keeps the last rate. The column reads "# Villagers" ("# Villager" was written, read
  as the plural). Farm Reseeding, Foragers and Varangian food gold do not apply to custom food; Shu lumberjack food does
  not apply to custom wood. Checked: 50/min wood halves the lumberjacks (4.79 → 2.43); Transition Eco uses it (10 ×
  45/min × 130 s = 975).
- **Headings follow the source (2026-09-30).** See the wording above. `fitHeads()` (in `update()`, and after `fit()`
  sizes the text) shows each such heading only where it neither overflows nor makes the heading row taller than the
  plain forms ("# Wood vils", "# Gold vils", "# Food vils") would; otherwise that heading shows the plain form
  (`th.plain`, spans `.hl` / `.hs`). The heading row is then held at the plain forms' height (an inline `height` on the
  row), so a heading that fits in fewer lines (e.g. "# Villagers" against "# Wood vils" at 1,000 px with Buildings on)
  does not move the table either, and the row is never taller than before. Wide layouts and landscape phones show every
  name; 600–1,150 px with Buildings off shows "# Wood vils" / "# Gold vils" (they would wrap to two lines) but the food
  names; phones vary by what fits. `th.dataset.label` holds the name for the labels of Transition Eco's steppers.
- **Varangian food gold (2026-09-30).** Replaces the Varangian Shepherd / Hunter / Fisherman gold sources (old saves
  fall back to Gold Mine). `FX.Varangians` = `foodgold` ("Shepherding, fishing, and hunting also generate gold",
  aoe2techtree): 10% of the food rate for Sheep, Hunt and Fisherman villagers, 1 gold per 20 food for Fishing Ships.
  While one of those is the food source, the Gold box shows "+x g/min from Shepherds / Hunters / Fishermen / Fishing
  Ships" ("from Ships" in narrow layouts) under Relics (`#food-gold`, styled like the Forager line; the line exists
  while Varangians, kept for other sources; both as chosen). x = food gatherers (the food total rounded up, or Fishing
  Ships) × gold each. That gold, divided by the gold rate, comes off the gold total after the relics; the gold total's
  tooltip lists both ("after 2 relics cover 2.63 and 13 shepherds cover 1.13"). Transition Eco adds it to "On reaching"
  gold (10 hunters, Feudal: 53.3). Checked: 13 shepherds +25.7 g/min (19.8 food each), 10 Fishing Ships (deep) +12.7.
- **Shu lumberjack food (2026-09-30).** Replaces the Shu Lumberjack food source (old saves fall back to Farm). `FX.Shu`
  = `woodfood` ("Lumberjacks generate food in addition to wood", aoe2techtree): 6.859% of the lumberjack rate (upgrades
  and wood bonuses included), only while Trees is the wood source. The Food box shows "+x f/min from Lumberjacks" under
  the upgrades (`#wood-food`; the line exists while Shu, kept for other wood sources). x = lumberjacks (the wood total
  rounded up, Farm Reseeding and House Building included) × food each; that food, divided by the food rate, comes off
  the food total (tooltip "after N lumberjacks cover X"). Farm Reseeding counts the farmers before this, so its
  lumberjacks are sized for slightly more farmers (about 0.08 per lumberjack): a small overestimate, accepted rather
  than iterating. Transition Eco adds the wood villagers' food to "On reaching" food (10 lumberjacks, Feudal: 34.6).
  Checked: 5 lumberjacks +8 f/min, covering 0.39 farmers.
- **Polish stone gold (2026-09-30).** Replaces the "Polish Stone Miner" gold source (old saves fall back to Gold Mine).
  `FX.Poles` = `stonegold` ("Stone Miners generate gold in addition to stone", aoe2techtree, capital M as there): 33% of
  the stone rate (upgrades and stone bonuses included; `stoneGoldShare()`), only while Stone Mine is the stone source.
  The Gold box shows "+x g/min from Stone Miners" under Relics (`#stone-gold`, the Varangian line's place; the two never
  coexist, since both are civ bonuses; the line exists while Poles, kept for other stone sources). x = stone miners (the
  stone total rounded up) × gold each; that gold, divided by the gold rate, comes off the gold total after the relics
  (tooltip "after N stone miners cover X"). Only buildings cost stone, so in Villagers Required the line (space kept)
  and its entry in the bonus line hide while the Stone column is blanked (`relevant()` checks `showStone()`), like Inca
  stone. Transition Eco adds the stone villagers' gold to "On reaching" gold (10 stone miners, Feudal: 154.4). "from
  Stone Miners" is longer than the Varangian line's narrow "from Ships", so `fitIncome()` gives it 2 lines at 768 px
  (the box 17 px taller than Varangians'), small type at 412 px, and 3 lines at 360 px (like Shu). Checked: Poles
  Imperial, Knight-line + Castle: 10 stone miners +71.3 g/min, gold 6.58 → 3.45 → 4; with Stone Mining and Stone Shaft
  Mining 7 miners +66 g/min; at 13 sizes × both tabs nothing overflows, and the Gold box is one height across stone
  sources and with Buildings on or off.
- **Bengali Trade Cart food (2026-10-04).** Asked for as "implement this bonus exactly like varangian shepherds": one of
  the extra-income lines, also called niche incomes; there is no Trade Carts food source. `FX.Bengalis` = team
  `tradefood`, p 10 ("Trade Units generate +10% food in addition to gold", aoe2techtree), so a Bengali civ or ally, not
  under Full Tech Tree. Only while Trade Carts or (since that evening) Trade Cogs is the gold source
  (`tradeFoodShare()`; "Trade Units" covers both). The Food box shows "+x f/min from Trade Carts" ("from Trade Cogs" for
  cogs, `#trade-food-who`; Bengalis with Caravan and Clinker, 4 cogs: +15.2) after the relic food line (`#trade-food`;
  it exists while the bonus applies, hidden but kept for other gold sources). x = Trade Carts (the gold total rounded
  up) × 10% of the cart's gold rate as shown (Caravan, Bump factor, Spanish and Grand Trunk Road included), so 10 carts
  at 25.9 g/min bring 25.9 f/min (the example given). That food, divided by the food rate, comes off the food total
  (tooltip "after N Trade Carts cover X"). It is counted after every gold line, so the carts are final; Farm Reseeding,
  Varangian food gold and Burgundian Vineyards counted the food gatherers before it (a small overestimate, as with Shu
  food). Transition Eco adds the carts' food to the food amount, summed with Shu lumberjack food when both apply ("by
  lumberjacks and Trade Carts"). A Bengali civ or ally makes the Food box one line taller, like Burgundian relic food:
  +20 px at 1,920 and on tablets; "from Trade Carts" takes two lines at 600 / 412 px and 640×360 / 700×400, two in small
  type at 390 / 360 px (`fitIncome()`), +15 to +38 px there; Shu with Burgundian and Bengali allies (three lines) +20 to
  +45 px. Checked: Bengalis Imperial, Villager + 2 Knight-line: 14 carts +30.2 f/min, with Caravan 12 carts +31.1;
  Spanish with a Bengali ally and Caravan, 10 carts +32.4; Gold Mine: line hidden; Full Tech Tree, and Generic alone: no
  line; Generic with a Bengali ally: works; Transition Eco Researching Imperial, 10 carts 68 food (82 with Caravan), Shu
  with a Bengali ally and 10 lumberjacks 119. At 20 sizes × both tabs × Gold Mine / Trade Carts: nothing overflows, no
  page scroll, the box's height the same for both gold sources; Britons unchanged.
- **Extra-income lines.** Forager, Shu food, Burgundian relic food, Bengali Trade Cart food, Varangian gold, Polish
  gold, Paper Money gold and Burgundian Vineyards gold (class `.extra-inc`): "+x … /min" and "from …" (`.inc-from`, the
  name in `.inc-who`). `fitIncome()` (in `applyLayout()`) measures the longest text a line can show ("999.9", every
  source name) and picks one line, two lines (`html.inc-2l`), two in smaller type (`html.inc-small`), or three, the name
  on its own (`html.inc-3l`; "from Lumberjacks" at 360 px), so the box's height never depends on the numbers or the
  source. Checked at 14 sizes in both tabs: box heights equal across food sources, nothing overflows.
- **Building bonuses (2026-09-30).** A civ or team bonus that changes only buildings (`buildingsOnly(e)`: every `UNITS`
  entry its matcher changes is a building, taking the cost resource into account) is left out of the bonus line and the
  ally picker's preview while Buildings is off, unless it still reaches the table (`inReach()`): a building row in the
  table, Houses with House Building on, or Farms / Pastures with Farm Reseeding on and Farm food. E.g. Franks' Castles
  hide; Malians' "Buildings cost −15% wood" and Spanish builders stay (Houses, Farms); Teutons' Farms show with Farm
  food only; Inca stone hides (Houses and Farms cost no stone). The effects themselves still apply. `update()`
  re-renders the line, and re-fits if its height changed.
- **Naval bonuses (2026-09-30).** Likewise, a bonus that changes only naval entries (`navalOnly(e)`: every entry its
  matcher changes passes `isDock`: Dock units, Dock, Harbor, Fish Trap) is left out of the bonus line and the ally
  preview while Naval is off, unless it reaches the table (`inTable()`, shared with the building rule: a row it changes,
  or the Fish Traps of Fish Trap Rebuilding). `buildingsOnly()` / `navalOnly()` share `onlyOf()`; `inReach()` needs both
  rules to pass. Hidden with Naval off: Koreans "Warships cost −20% wood", Vikings "Warships cost −20%" and team "Docks
  cost −15%", Italians "Fishing Ships cost −15%", Sicilians team "Transport Ships cost −50%", Malay's two Fish Trap
  bonuses (shown with Fish Trap Rebuilding or a Fish Trap row). Kept: gathering bonuses (Japanese "Fishing Ships work
  faster", Danes' drop-off) and mixed ones (Persians' Town Centers and Docks, Wei's Traction Trebuchets and Lou Chuans).
  Checked for every civ, own and as an ally.
- **Unused upgrades (2026-09-30).** Upgrades a source does not use are hidden, not greyed, e.g. Heavy Plow unless Farm
  is the food source, Stone Mining while Feitoria is the stone source. Space and ticks are kept. Greying stays for age
  locks and techs the civ lacks.
- **Entry names.** "(Elite) X" or "(Heavy) X" for two-step Elite/Heavy lines, including Castle unique units whose Elite
  version has identical cost and time. "X-line" for longer lines, named after the first unit: "Battering Ram-line"
  (2026-09-30; was "Ram-line"). "A / B" when only part of a line merges (e.g. "Crossbowman / Arbalester"). Not a line
  when the only extra member is one civ's unique upgrade: named after the common unit, "Bombard Cannon" (Houfnice) and
  "Elite Skirmisher" (Imperial Skirmisher) (2026-09-30). A two-step line with different names: "Stone/Fortified Wall",
  "Armored/Siege Elephant" (2026-09-30); with a unique extra: "(Heavy) Camel Rider" (Camel Scout, Gurjaras). Renamed
  entries keep working in old saves through `RENAMED` in `load()`.
- **Unique members.** An entry may show its unique member where it can be had (`NAME_WITH_UNIQUE`, `displayName()`):
  "Elite Skirmisher" reads "Elite/Imperial Skirmisher" for Generic with Include Regional & Unique (Post-Imp too) and for
  Vietnamese, or a civ with a Vietnamese ally, outside Post-Imp (Post-Imp: "Imperial Skirmisher") (2026-09-30; the ally
  2026-10-07). A unique member's name finds its entry only where that member can be had (`uniqueShown()`: the civ has
  it, or Generic with Include Regional & Unique), Post-Imp included: e.g. "camel scout" finds (Heavy) Camel Rider only
  for Gurjaras or Generic with Include Regional & Unique, "houfnice" finds Bombard Cannon only for Bohemians or Generic
  with it (asked for Camel Scout, applied to every unique member). Search strings are built per query (`searchOf()`), no
  longer the fixed `SEARCH`.
- **Camel Scout (2026-09-30).** An entry whose unique member comes before the rest of its line (`EARLY_UNIQUE`; only
  "(Heavy) Camel Rider" → Camel Scout, Feudal Age; Gurjaras have Camel Scout in Feudal and Camel Rider only from Castle,
  and so here, but for the name): where the member can be had (`uniqueShown()`: Gurjaras, or Generic with Include
  Regional & Unique) the entry reads "Camel Scout" until its own age (Castle), in the list and the table. `ageOf()`
  opens it in Feudal for Generic with Include Regional & Unique (was Castle) and for Gurjaras under Full Tech Tree (they
  keep their unique units; the entry is not `U`-flagged, so it had gone to Castle). Gurjaras already had it from Feudal
  (per-civ age 2), named "(Heavy) Camel Rider". The row's identity stays "(Heavy) Camel Rider", so saves and age changes
  just rename it. Checked: Gurjaras Dark / Feudal / Castle / Full Tech Tree / Post-Imp, Generic with and without Include
  Regional & Unique, Berbers (with and without Full Tech Tree), Hindustanis.

### answers settled after the chat

#### What changed

- **Builders (output 36).** Every builder counts toward Villagers required, including the default 1 per building: that
  is what the page does, and it stays. Farms (2026-09-29) and Fish Traps (2026-09-30) were later made to count none.
- **# Builders space (output 38).** The column stays as it is: it collapses when hidden, and toggling Buildings may
  shift columns. Nothing about it is to change.
- **Regional units (output 12).** Showing them for every civ under Full Tech Tree is intended.
- **Warrior Priest (output 22).** No heading of its own: instead the Monastery heading reads "Fortified Church" while
  Armenians or Georgians is selected, with or without Full Tech Tree (`groupName()`). Done on this day.
- **Grouping (output 6).** The Monk and Trade Cart groups and the Economic / Military split of the buildings stay as
  they are.
- **Technologies heading (output 15).** Left out: tech checkboxes appear all over the page, so a heading on this panel
  alone would be redundant and misleading.
- **Decimals (output 3).** Gather rates and bonus-shortened times keep 1 decimal.

### dropdown arrows that open and close the list

#### What changed

- **Arrow buttons.** In all three searchable dropdowns (unit, allies, civ) the arrow at the right of the box is a real
  button (`.combo-toggle`, made in `combo()`), in place of the `.combo::after` decoration, which ignored clicks.
  Clicking it opens a closed list and closes an open one, like clicking outside: typed unit text is kept, and the civ
  box restores the civ's name. It points down while closed and up while open, and flips at once; the CSS keys off the
  input's `aria-expanded`. It takes no focus (`mousedown` is prevented, `tabindex=-1`, `aria-hidden`), so the text box
  keeps focus and typing still works; keyboard users keep ArrowDown and Escape.
- **Checked.** With real mouse clicks through the Chrome DevTools Protocol, switching between pickers included.

### no status line, and the ally count in the allies label

#### What changed

- **Status line.** `#status`, `say()` and all 8 messages are gone: "Unit added.", "Unit: now N buildings.", "New
  replaced Old.", "Old upgraded to New.", "Unit removed.", "Table cleared.", "The sheet is full. Remove a row to add
  another." and "Up to 7 allies. Untick one to add another." A full sheet now refuses a new row silently; the allies
  list already greys out civs at 7.
- **Ally count.** The Allied Civilization(s) label shows "n/7", e.g. "Allied Civilization(s) 3/7" (`#ally-count`, set in
  `syncButtons()`). It always shows, 0/7 included, so the label's width never changes.

### alternative incomes in the source dropdowns, and upgrades that follow the source

#### What changed

- **Niche Incomes.** The checkbox and its box were removed: every `NICHE` source joins its resource's dropdown whenever
  it is available. Relic gold is offered in every age. The food dropdown moved under the Food heading; hidden dropdowns
  keep their space (`visibility: hidden`), so switching civ moves nothing. Dropdowns are compact on phones. The desktop
  settings row grew 4–12 px.
- **Upgrades.** Wood, gold and stone eco upgrades are greyed out unless the standard gatherer is selected, like the farm
  upgrades for Food.

### resource boxes side by side, in four columns of one width

#### What changed

- **Narrow layout.** The four resource boxes form one row under the unit adder, which takes its own full-width row, in
  the table's order: Wood, Food, Gold, Stone. Before, Food took a full-width row above Wood / Gold / Stone; a layout
  with Food on a row of its own was explicitly rejected. The table's Unit / # Builders / # Buildings columns sitting
  under the resource boxes is fine. The settings area got shorter: 245–277 px on phones (was 295) and 253 px on tablets
  (was 342–380). Rows that fit: 360×640 = 3, 390×740 = 9, 412×780 = 12, 768×1024 = 18. The old mangled `.lanes` selector
  for phones is gone.
- **Phones.** At 599 px and less the boxes are compacted: each heading's rate goes under the name, padding and Food's
  indent are tighter, and labels wrap. "Wheel&shy;barrow" carries a soft hyphen, because headless Chrome on Windows does
  not apply `hyphens: auto`.
- **Equal columns.** The four resource columns are always the same width, a rule of their own: Wood, Food, Gold and
  Stone share `--w-res` (were 10 / 16 / 11 / 11.5 rem wide and 8.6 / 14 / 9.4 / 9.8 rem mid). It was first set to the
  measured minimum (11 / 10.25 rem), then widened on request to 12 / 11 rem, so that the resource block sits nearer the
  page's centre: at 1,920 px its centre is now 151 px right of the board's centre (183 px at 11 rem).
- **Checked.** Headless Chrome from 360 to 1,150 px found no label, heading or dropdown overflowing its box; at 360 px
  the Wood and Stone dropdowns truncate with an ellipsis ("Lumberja…").

### a second tab, Transition Eco

#### What changed

- **Tabs.** Villagers Required, the default (the page always opens on it; the tab is not restored on reload), and
  Transition Eco, after the title; arrow keys switch tabs.
- **Choices.** Made on this day: the Researching radio sets the age; civ age-up bonuses apply; villager counts use −/+
  steppers; the right panel shows only gather-rate unique techs.
- **The tab.** The same page, with the adder, the Unit / # Builders / # Buildings columns, the table rows, the Age
  radios, Post-Imp, Conscription, Treadmill Crane and Villagers required hidden. In the wide and mid layouts they keep
  their space (`visibility: hidden`), so the resource boxes do not move between tabs; in the stacked layout the adder's
  and the Age radios' own lines collapse, or a phone could not show the Transition Eco row. Stone always shows. Left of
  the table, where the Unit column is: "Researching Feudal Age (130s)", "Researching Castle Age (160s)" and "Researching
  Imperial Age (190s)" ("Feudal Age (130s)" … on phones). Under each resource column a −/+ stepper (0–200) for the
  villagers working it, or the Feitorias or livestock of such a source; the heading says which. The right panel: the
  unique techs that change gathering (`teTech()`), Clear Techs, and "On reaching <Age>" with the Wood / Food / Gold /
  Stone gathered during the research.
- **The age.** Researching Feudal means Dark Age, Castle means Feudal, Imperial means Castle. That decides which eco
  upgrades, alternative incomes and per-age civ bonuses apply.
- **Amounts.** Count × `rates()[res]` (per second) × research time, rounded down, plus any `agebonus` for that resource;
  the hover shows the gathered part to one decimal. Research time: `ageUp(target)` = 130 / 160 / 190 s ÷ (1 + p/100) for
  each active `ageup` effect, p taken in the age being left. Farm Reseeding plays no part.
- **Age-up bonuses.** The times include them, underlined, with the base and the bonus on hover; new `ageup` FX: Malay
  advancing +66% faster, Portuguese technologies +25% faster, Persians' Town Centers +5/10/15% faster in the age being
  left (`[5,10,15,20]`), with a label of its own, "Town Centers research Ages {p}% faster". Persians' Town Center `time`
  effect is a Villagers Required bonus.
- **Age-up resources.** What the civ receives on reaching the age is added to the "On reaching" totals, even with nobody
  working (`agebonus` FX): Dravidians +200 wood, Ethiopians +100 food and +100 gold. The hover breaks it down ("247.0
  gold gathered + 100 on reaching Feudal Age").
- **Left out.** Checked against aoe2techtree on this day and not applied: Bengalis' 2 villagers on age-up (villagers,
  not resources); the Byzantine, Italian and Muisca age-up discounts (paid before the research, so they do not change
  what is gathered); Khmer needing no buildings to advance; Wei's villager per eco upgrade; Spanish +20 gold per
  technology researched, as it was decided on this day that age-ups do not count.
- **Bonus line per tab.** Each tab lists only the bonuses that matter to it (`relevant(e)`), for the civ, the allies'
  team bonuses and the allies picker's preview column: Transition Eco gathering and age-ups (`rate`, `farm`, `ageup`,
  `agebonus` and `relicgold`: `TE_KINDS`), Villagers Required everything but `ageup` / `agebonus`. With nothing left,
  the usual "No applicable civ bonuses." / "No applicable team bonuses from allies." shows. So Transition Eco hides unit
  costs, training and build times, unlocks and "farms hold more food" (Farm Reseeding only), and Byzantines show "No
  applicable civ bonuses." there.
- **Header.** Its arrangement is measured, not tied to widths: `fitHeader()` (from `applyLayout()`) tries none → `hdr-b`
  → `hdr-b hdr-c` → `hdr-b hdr-c hdr-d`, measuring under `hdr-measure` (items at natural width, wrapping), and keeps the
  first arrangement whose line holds its items. So it uses one line when everything fits; otherwise the picker labels go
  above the boxes, then the pickers get their own line, then the tabs too. One line at about 1,450 px and up, `hdr-b`
  down to about 1,151, `hdr-c` on tablets, `hdr-d` at about 600 px and on phones. The old `html.mid .civpick` and phone
  picker rules became `hdr-*`, and the old 600–700 px overlap of Clear Civs and the allies picker is gone.
- **Phones.** The tabs cost one table row: 360×640 = 2, 390×740 = 8, 412×780 = 11, 768×1024 = 18.

### short windows for phones held sideways

#### What changed

- **Short windows.** `@media (max-height: 520px)` with the stacked layout: the header and the resource boxes take the
  phones' compact sizes, the civ bonus line clamps to one line, and the Technologies panel becomes the strip above the
  table, as at 820 px wide and less (that query now reads `(max-width: 820px), (max-height: 520px)`). In Transition Eco
  the Researching radios share one line, with the short labels. So Transition Eco fits at every size and orientation
  tried.
- **Checked.** Transition Eco in headless Chrome at 21 sizes × 2 setups, from 1,920×1,080 through short desktop windows,
  tablets both ways up, and phones upright and sideways down to 640×360: no header overlaps, no page scroll, the
  Transition Eco row and the totals always fully visible, nothing sticking out of its box.

#### Questions

1. **Villagers Required on phones held sideways.** Found on this day: at 640×360 to 915×412 no table row fits, as the
   adder and the resource boxes (240 px) fill the height. It predates the day's changes. It needs a design decision,
   e.g. a different arrangement for short windows, and has not been put forward yet.

### an Include Regional & Unique checkbox for Generic

#### What changed

- **The box.** Include Regional & Unique, default off, for Generic only, in Full Tech Tree's spot: Generic shows this
  box, any other civ Full Tech Tree. Off, Generic's dropdown hides every regional or unique unit and building; on, it
  lists them all. It filters only Generic's dropdown: rows already in the table, the numbers, the Upgrade button and
  other civs are untouched. It is a view option, like Include Dock: Clear All leaves it alone, ticking it does not make
  Clear All appear, and it is saved (`state.regional`).
- **Classification.** Unique = the entry's `U` flag; regional = any member listed in `REGIONAL`: the member names
  aoe2techtree labels `RegionalUnit` or `RegionalBuilding` in its per-civ tree files (`data/trees/*.json`, fetched on
  this day). aoe2techtree's `UniqueUnit` / `UniqueBuilding` labels match the `U` flag in `UNITS` exactly.
  `REGIONAL_OR_UNIQUE(u)` combines both checks; only Generic's dropdown filter uses it.
