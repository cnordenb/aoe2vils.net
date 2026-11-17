requirement - a numbered statement in REQUIREMENTS.md with "will", true or false of the project, e.g. "Requirement 4"
rule - a numbered statement in RULES.md of how the project must be made and kept, e.g. "Rule 12"
chief developer - the person who alone writes the requirements, named in Rule 2
test - a check of the project, run on every push and listed by its number in TESTS.md, e.g. "Test 15"
log - the development log in documentation/DEVLOG/: what changed in the project, why, and what is left
part - one file of the log, DEVLOG1.md, DEVLOG2.md and so on, each of at most 1000 lines
day - the entry of the log for one date, titled by it, e.g. "2026-11-02", never split between two parts
section - one change recorded under its day, titled by its time if it was the first written in that minute
decision - a choice made in a section and listed by subject in DECISIONS.md, with a link to that section
question - a numbered point for the chief developer at the end of a section, open until a later section answers it
code file - a file Rules 10 to 13 apply to, known by its ending: .html, .css, .js, .sh, .yml or .yaml
ub-mode - the principles for writing and changing code, in .claude/skills/ub-mode/, copied from cnordenb/ub-mode
crapper - ub-mode's tool, cloned beside the project: scores each function by its complexity and how much a test runs it
dryer - ub-mode's tool, cloned beside the project: finds code written twice
mutator - ub-mode's tool, cloned beside the project: changes the code on purpose to see whether a test notices
page - the website aoe2vils.net, index.html and what it loads from src/: what the user sees and uses
data file - src/data.json: every name, number and wording the page uses, and its fonts, read once as the page loads
script - a JavaScript file of the page in src/js/, e.g. boot.js, which reads the data file and then starts the rest
style sheet - a CSS file of the page in src/css/: base.css, sheet.css and layouts.css, applied in that order
text - a wording the page shows, kept in `TEXT` in the data file, its names in braces filled in by `say()`
patch - an update of Age of Empires II: Definitive Edition, which may change costs, times and rates, e.g. "185872"
civ - a civilization of the game, picked at the top of the page, or "Generic" for none in particular
age - Dark, Feudal, Castle or Imperial: the stage of the game, which decides what a civ has
resource - wood, food, gold or stone
line - units that are upgraded one into the next, e.g. "Knight-line"
entry - what can be added to the page: a unit, a building, or a line whose units cost the same; one item of `UNITS`
matcher spec - a rule in the data file that picks entries, e.g. {"flag":"U"}, kept in `MATCH` and in the `m` of `FX`
table - the spreadsheet on the page: the resources as columns, the entries added as lines, and the totals at the bottom
row - one line of the table: an entry, how many buildings produce it, and the villagers each resource needs for it
income source - what a resource is gathered from, picked for each resource, e.g. "Trees", "Farm", "Gold Mine"
gather rate - what one gatherer brings in from an income source per minute, upgrades and bonuses included
civ bonus - an effect of the civ on costs, times or gather rates, listed on the page under the civ
team bonus - an effect a civ has on its whole team, its own civ included
ally - a civ on the user's team, picked on the page so that its team bonus applies, e.g. "(from Huns Ally)"
searchable dropdown - a field that lists the choices matching what is typed: the civ, the allies, and the entries
extra-income line - "+x … /min from …" in a resource's box: income that lowers what another resource needs; niche income
Full Tech Tree - the checkbox that gives a civ every unit and technology, without its civ bonuses and team bonuses
Farm Reseeding - the checkbox and row that count the wood for rebuilding farms as villagers on wood
House Building - the checkbox and row that count the wood for houses as villagers on wood
Idle TC Time - the time a Town Center trained nothing, typed into the page; "Villagers missing" shows what it cost
tab - one of the two views of the page, picked at its top
Villagers Required - the tab that shows how many villagers on each resource keep every row in production
Transition Eco - the tab that shows what villagers on each resource gather while an age is researched, or in a set time
