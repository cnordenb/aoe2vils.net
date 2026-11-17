# Development log, part 3

- [2026-11-08](#2026-11-08)
- [2026-11-17](#2026-11-17)

Part 3 of the development log. It follows [part 2](DEVLOG2.md). The decisions made in the log are listed in
[DECISIONS.md](../DECISIONS.md).

## 2026-11-08

### 11:03:21: the project set up from the template, its code left as it was

#### What changed

- **Why.** The repository held the page and its notes, but none of the template's documents, procedures or checks.
  The template's files were added and filled in for aoe2vils.net. Splitting `index.html` to meet Rules 10 to 13 was
  left for a later change, and `index.html` was not changed. What came before this day is in `context_a.md` (the chat
  the page was first built in), `context_b.md` (the notes kept since) and the history of the commits.
- **The project.** aoe2vils.net: a calculator web page for players of Age of Empires II: Definitive Edition, which
  shows how many villagers on each resource keep a set of units and buildings in production, and what a set of
  villagers gathers by an age-up or in any given time. The placeholders were filled in `README.md`, `AGENTS.md`,
  `RULES.md` (Rules 1 and 2), `TESTS.md`, `MAINTAINER.md`, `.github/SECURITY.md` and the issue forms. On GitHub the
  repository is `cnordenb/aoe2vils.net`, its present name; the local `origin` still names it `cnordenb/aoe2vils`,
  which GitHub forwards.
- **Stack.** HTML, CSS and JavaScript, all in `index.html`, with no libraries and no build step; the fonts are
  embedded in it. There is no test tool yet.
- **`README.md`.** Put in the template's order: the badges, Description, Usage, Contributing, Maintaining and
  Acknowledgements. The earlier text was kept word for word: the description, the patch line and the lists with their
  pictures are under Description, the earlier Acknowledgments under Acknowledgements, and Support, with the Ko-fi
  link, is the last chapter. Usage is new. The sentence on the model that sped up the work now reads as the
  template's.
- **Added.** `AGENTS.md`, `CLAUDE.md`, `.gitattributes`; in `documentation/`, `RULES.md`, `REQUIREMENTS.md` (the
  template's, unchanged), `TERMINOLOGY.md`, `TESTS.md`, `MAINTAINER.md`, `DECISIONS.md` and this part of the log;
  in `.claude/skills/`, `devlog`, `maintainer-guide`, `rules-check`, `terminology` and `tests-doc`; in `.github/`,
  the notes on contributing, conduct, security and accessibility, `FUNDING.yml`, the issue and pull request forms,
  `scripts/check-rules.sh` and `workflows/checks.yml`.
- **`AGENTS.md`.** Beside the template's text, it sends an agent to `context_b.md` before a change of `index.html`,
  and forbids changing `context_a.md` and `overview.pdf`.
- **`.claude/settings.json`.** The template describes it but does not hold it. It was made as described: it denies
  `git commit`, `git push`, `git merge`, `git rebase`, `git cherry-pick` and `gh pr`, in Bash and in PowerShell, and
  every edit of `documentation/REQUIREMENTS.md`.
- **`.gitignore`.** `KLADD.md` stays left out; the template's `.vscode/`, `temp/` and `.claude/settings.local.json`
  were added.
- **Checks.** `code_pattern` in `.github/scripts/check-rules.sh` also takes `.js`, `.css` and `.html`. No folder was
  exempted from Rule 14 beside `documentation/DEVLOG/`. `TEST_COMMAND` in `.github/workflows/checks.yml` stays empty.
- **Choices.** WCAG 2.2 at level AA, in `.github/ACCESSIBILITY.md`; the page has a user interface, so the
  accessibility category stays in `TESTS.md`. GitHub's private vulnerability reporting as the security contact.
  `.github/FUNDING.yml` names the Ko-fi page `README.md` already linked, `hjoerleif`, without the template's comments
  (Rule 10). `LICENSE` was already the template's MIT licence, word for word, and stays.
- **Left out.** `.claude/skills/project-setup/` was not brought over, and its row not into `AGENTS.md`: it serves
  only the setting up.
- **Rules.** Added: Rule 24 (HTML, CSS and JavaScript only, served as static files) and Rule 25 (no animations), both
  from the standing rules in `context_b.md`. Rule 25 holds: `index.html` has no transition, animation, keyframes or
  smooth scrolling.
- **Tests.** 0. None were written.
- **Checked.** `bash .github/scripts/check-rules.sh` passes the placeholders, the unique file names, the log and
  `TESTS.md`. It fails Rule 14 (the main folder holds 12 files), and Rules 12 and 13 in `index.html` (605 lines over
  120 characters, 4191 lines of code). Every line of `TERMINOLOGY.md` is within 120 characters, and
  `.claude/settings.json` reads as JSON. Git shows no change to `index.html`.
- **Documents.** All of the above. `MAINTAINER.md`: the first chapter, Updating the data after a patch; How the code
  works, with the table of files, the data tables, the tests and the rules for changing the code. `TERMINOLOGY.md`:
  code file, page, patch, civ, age, resource, line, entry, table, row, income source, gather rate, civ bonus, team
  bonus, ally, extra-income line, Full Tech Tree, Farm Reseeding, House Building, Idle TC Time, tab, Villagers
  Required, Transition Eco. `DECISIONS.md`.

#### Not done

- `index.html` breaks Rule 10 (about 514 comments: 422 in its JavaScript, 84 in its CSS, 8 in its HTML), Rule 11
  (`update()` 201 lines, `combo()` 143, `load()` 72, `syncSettings()` 62, and the function that wraps the whole app,
  2653), Rule 12 (605 lines) and Rule 13 (4191 lines of code). They are left for the change that splits the page.
- Rule 14: the main folder holds 12 files, 4 over. `overview.pdf`, `context_a.md` and `context_b.md` cannot move
  without changing their addresses, aoe2vils.net/overview.pdf and so on, which `overview.pdf` itself names.
- Rule 4: there are no tests. The README's testing badge says "yes", as in the template.
- Until the breaches are mended, the check of the rules on GitHub fails on every push. It has not run there yet.
  GitHub Pages publishes the page apart from it, so the page is not held back.
- `REQUIREMENTS.md` is still to be written by the chief developer; it is the template's, unchanged.
- `context_b.md` was not worked into `MAINTAINER.md`, `DECISIONS.md` and `TERMINOLOGY.md` beyond what is above. Its
  line numbers are older than the code.
- On GitHub, Discussions is off, so the issue form's "Question" link leads nowhere until it is turned on; private
  vulnerability reporting, which `.github/SECURITY.md` names, is still to be turned on.
- GitHub Pages serves `README.md` and `LICENSE` at aoe2vils.net today, so the new files in the main folder and in
  `documentation/` will likely be served as well.
- The deny rules of `.claude/settings.json` were not tried, as trying them means attempting what they forbid.

#### Questions

1. **Splitting `index.html`.** Meeting Rules 10 to 13 means `index.html` in about 15 files of CSS and JavaScript of
   at most 400 lines each, the comments moved into `MAINTAINER.md` and four functions split. Served as they are, the
   page would make about 15 requests instead of the 2 that `README.md` promises. A build step could put them back
   into one file for the served page, but GitHub Pages would then publish through a workflow. The proposal is the
   build step, so the page keeps its 2 requests.
2. **The main folder.** Should the files that must be served at the site's root (`CNAME`, `favicon.ico`,
   `overview.pdf`, `context_a.md`, `context_b.md`) be exempt from Rule 14, or should they move, with a new edition of
   `overview.pdf` naming their new addresses? A build step (1) could also serve them at the root from another folder.
   The proposal is the exemption, written into Rule 14.
3. **Rules 24 and 25** were taken from the standing rules in `context_b.md`. Do they stand? Should "no dependencies"
   be a rule as well, as in the page today? The proposal is yes to both.
4. **Choices made without an answer.** The name "aoe2vils.net", WCAG 2.2 at level AA, GitHub's private vulnerability
   reporting, Ko-fi as the funding, MIT, no folders exempt from Rule 14 beside the log, and `.claude/settings.json`.
   The proposal is to keep them.
5. **`REQUIREMENTS.md`.** Should a draft be made from the standing rules and the dictated wording in `context_b.md`,
   for the chief developer to write in? The proposal is yes.

## 2026-11-17

### 17:44:01: code written by ub-mode, whose tools cannot yet read the page

#### What changed

- **Why.** The template has a skill, `ub-mode`, with principles for writing and changing code, which was not in the
  template when the project was set up from it on 2026-11-08.
- **`.claude/skills/ub-mode/`.** `SKILL.md` and `LICENSE-ub-mode.txt` (MIT), copied unchanged from the template's
  `.claude/skills/ub-mode/`. `SKILL.md` is the same as github.com/cnordenb/ub-mode's.
- **`AGENTS.md`.** The row of `ub-mode` in the table of procedures, and a chapter, ub-mode, as in the template: code
  in JavaScript, among other languages, is written by `ub-mode`; where it and `RULES.md` differ, the rules win; its
  tools stay outside the project. Changed from the template's: no test is written only to please crapper or mutator,
  without naming a rule, since this project's rules on tests are numbered otherwise; where the tools are, when the
  project's folder sits in a folder of its own, as `aoe2vils/aoe2vils/`; the sentence on C left out. Added: the tools
  read files ending in `.js`, `.mjs` and `.ts`, not the JavaScript inside `index.html`, and crapper and mutator need
  tests, so until the page is split and has tests, ub-mode's principles are followed without the tools.
- **`.gitignore`.** `.metrics/` and `target/`, which the tools write in the project, as in the template.
- **Tests.** 0, as before.
- **Checked.** `cmp` found both copied files byte for byte the same as the template's, and `SKILL.md` the same as
  github.com/cnordenb/ub-mode's. Claude Code listed `ub-mode` among its skills once the files were in place.
  `bash .github/scripts/check-rules.sh` fails as before on Rule 14 (the main folder, 12 files) and on Rules 12 and 13
  in `index.html`, and on nothing new: `.claude/skills/ub-mode/` holds 2 files, and no file name is taken twice.
  Every line of `TERMINOLOGY.md`, and every line added to `AGENTS.md`, is within 120 characters. The sources of the
  tools were searched for the endings they read.
- **Documents.** `AGENTS.md`, as above. `MAINTAINER.md`: the row of `.claude/skills/` in the table of files, and in
  Tests, what the three tools do, how to clone them, and that they have nothing to measure here yet.
  `TERMINOLOGY.md`: ub-mode, crapper, dryer, mutator. `DECISIONS.md`.

#### Not done

- crapper, dryer and mutator were not run: the project has no file they read, and no tests.
- ub-mode's first step, a test that fails before the code is changed, cannot be taken until the project has a test
  tool (Rule 4).
- Since 2026-11-08 the template's `.claude/settings.json` has come to deny more, such as `git pull` and `git revert`,
  and its `check-rules.sh` lists placeholders as `todo`. Neither was brought over; this change brought only ub-mode.
- While this change was made, Rule 5 became "No JavaScript nor CSS in an HTML file", and the limit of 100 tests left
  `RULES.md`. `index.html` now breaks Rule 5 as well. `AGENTS.md` (A change is done when, point 1), `TESTS.md`,
  `.github/scripts/check-rules.sh` and the skills `tests-doc` and `rules-check` still name the limit as Rule 5, and
  `check-rules.sh` does not check the new Rule 5. None of them was changed here.

#### Questions

1. **ub-mode before the split.** `AGENTS.md` now has ub-mode write the page's JavaScript, though its tools cannot
   read it until `index.html` is split (Question 1 of 2026-11-08) and has tests. Should its principles be followed
   in the meantime, or only once the tools can run? The proposal is to follow them now, and run the tools from the
   split on. The new Rule 5 puts the JavaScript into files of its own, which the tools read.
2. **The limit of 100 tests.** Is it gone, or does it move to another rule? The proposal: if it is gone, take
   "Rule 5" and the limit out of the places named under Not done; if it moves, name its new number there.

### 17:59:17: a draft of the requirements, made from the context files

#### What changed

- **Why.** Requirements were asked for, drawn from `context_a.md` and `context_b.md`, each saying "will" and either
  true or false of the page.
- **Answers.** Of the questions of 11:03:21 on 2026-11-08, in
  [the project set up from the template](#110321-the-project-set-up-from-the-template-its-code-left-as-it-was): a
  draft of `REQUIREMENTS.md` is made from the context files (5).
- **The draft.** `temp/REQUIREMENTS_DRAFT.md`, which Git leaves out (`.gitignore`), for the chief developer to copy
  from: a Requirement 0 on where they apply, and 207 requirements in groups (the page, tabs and the header, the Clear
  buttons, adding a unit or building, the table, builders, income sources and upgrades, rows added by themselves, the
  technologies, Transition Eco, layout). Each ends with its source, a prompt of `context_a.md` or `context_b.md`.
  `REQUIREMENTS.md` was not changed (Rule 2).
- **How the context files were read.** Where two exchanges disagree, the later one was taken, as `context_b.md`
  says, e.g. "Battering Ram-line" over "Ram-line". Nine choices that `context_b.md` marks as not confirmed are listed
  apart, not as requirements. Rules 24 and 25 were not written as requirements again. "No ads nor cookies" was taken
  from `README.md`.
- **Tests.** 0, as before.
- **Checked.** Every numbered item of the draft says "will", and they run from 0 to 207 with no gap. `index.html` was
  changed once since `context_b.md` was last written, the food of the (Elite) Elephant Archer from 60 to 70, so the
  notes still describe the page.
- **Documents.** `TERMINOLOGY.md`: requirement. `DECISIONS.md`.

#### Not done

- The draft was not checked against the page: whether each requirement holds today was taken from `context_b.md`.
  Requirement 89, the sum for one Knight-line and one Archer, comes from its sanity check and was not computed again.
- Of `context_a.md`, the prompts were read; its answers are summed up in `context_b.md`, which was read whole.
- The draft names the requirements that fail today: no table row fits on phones held sideways (Requirement 4), and
  the page moves in three cases (Requirement 12). None was mended.

#### Questions

1. **The number of requests.** `README.md` promises 2 HTTP requests, and the new Rule 5 puts the JavaScript and CSS
   in files of their own. Should a requirement keep the page at 2 requests when served, through a build step that
   puts the files back into one (Question 1 of 2026-11-08)? The proposal is yes.
2. **The choices not confirmed.** Should the nine choices under "Not confirmed" in the draft become requirements, be
   changed, or be dropped? The proposal is to keep them, as they are what the page does.
3. **Requirement 12.** Should it name its exceptions (a line more for Portuguese foragers and Burgundian relic food,
   when the civ changes), or should the page change? The proposal: name those two, and mend the 412-pixel case.

### 20:13:33: the page split into markup, style sheets, scripts and one data file

#### What changed

- **Why.** The page was to meet Rules 5, 10 to 14 and 27: no CSS or JavaScript in `index.html`, no comments, no
  function over 60 lines, no line over 120 characters, no file over 400 lines, no more than 8 files in the main
  folder, and all data in `data.json`; `index.html` in the main folder, the CSS in `src/css/` and the JavaScript in
  `src/js/`.
- **`index.html`.** Only the markup of both tabs, 344 lines. Its body starts hidden; it links the three style sheets,
  `src/favicon.ico` and `src/js/boot.js`. The title of Full Tech Tree, too long for one line, moved to the data file
  and is set by `controls.js`.
- **`src/data.json`.** The data file, 111 keys: the tables that were in `index.html` (`UNITS`, `MEMBERS`, `FX` and the
  rest), every name of the game the code used, every limit and default (`STATE`), 111 texts in `TEXT` with names in
  braces that `say()` fills in, the matcher specs in `MATCH`, and the four fonts with their copyright. The functions
  that were in the data, such as which entries a bonus applies to, are now matcher specs, turned into functions by
  `parseData()` as the page loads.
- **`src/js/`.** `boot.js` reads the data file, adds the fonts, shows the body and loads six scripts in turn:
  `rates.js`, `totals.js`, `table.js`, `settings.js`, `dropdowns.js` and `controls.js`, 307 to 394 lines each. They are
  the one script of before, cut into six in its own order, where no code that runs at load calls a function of a later
  script.
- **`src/css/`.** `base.css`, `sheet.css` and `layouts.css`: the one style sheet of before, cut into three in its own
  order, at the start of the resource boxes and of the layouts.
- **Functions.** `load()`, 77 lines, is now `loadRow()`, `loadCivs()`, `loadTE()` and `loadOptions()` under it.
  `update()`, 188 lines, is now `showHead()`, `sumRows()`, `coverByRelics()`, `coverBySoldiers()`,
  `coverByGarrison()`, `showExtraLine()` and `showTotals()`; the seven extra-income lines, written out one by one
  before, are rows of `EXTRA_LINES`. `combo()`, 151 lines, keeps its state in one object, which `comboOpen()`,
  `comboRender()`, `comboSetActive()`, `comboChoose()`, `comboListen()` and five more take; its keys are in
  `COMBO_KEYS`. `trapRowHtml()` and `houseRowHtml()`, the same code twice, are now `woodRowHtml()`.
- **Comments.** All removed (Rule 10). What they said is in `context_b.md` and in Git's history of `index.html`; what a
  maintainer needs is in `MAINTAINER.md`.
- **The main folder.** 8 files. `favicon.ico` moved to `src/`, `CLAUDE.md` to `.claude/CLAUDE.md`, which loads
  `@../AGENTS.md` and `@../documentation/RULES.md`, and `README.md` to `.github/README.md`, its two links mended.
  Claude Code and GitHub read both files there.
- **Tests.** 0, as before.
- **Checked.** A harness kept outside the project drove headless Chrome through 863 scenarios and took a snapshot of
  each: every element's place, size, computed style, text, title and ARIA attributes, and what `localStorage` holds.
  829 scenarios cover 16 window sizes, every civ in five states, every food source, the income sources, Transition
  Eco and the buttons; 34 more cover the two older saved formats, saved values out of range or unreadable, and every
  key, click, toggle and blur of the searchable dropdowns. The page before the change gave the same snapshots twice.
  After each step the page was compared with it, and the finished page matches it in all 863. Every action of the 34
  found its element, and 33 of them leave the page in a state of its own. `bash .github/scripts/check-rules.sh`
  passes. No comment is left in a script (read by a JavaScript parser), a style sheet or `index.html`; no function is
  over 60 lines (measured on the syntax tree); `index.html` has no `style` attribute, event attribute, `<style>` or
  script of its own. The six scripts hold the statements of the one before, in the same order. dryer found the one
  duplicate above, and none after it was removed.
- **Documents.** `MAINTAINER.md`: the first chapter now edits the data file and serves the page with
  `python -m http.server`; the table of files; Diagram, How the page starts, The scripts and The data file, new; Tests
  and Rules for changing the code. `TERMINOLOGY.md`: page, changed; data file, script, style sheet, text, matcher spec
  and searchable dropdown, added. `AGENTS.md`: the stack, the note on `context_b.md`, and where dryer runs.
  `DECISIONS.md`.
- **Replaced.** `index.html` left whole, of 2026-11-08, in
  [the project set up from the template](#110321-the-project-set-up-from-the-template-its-code-left-as-it-was); and
  ub-mode's tools not run until the split, in
  [code written by ub-mode](#174401-code-written-by-ub-mode-whose-tools-cannot-yet-read-the-page).

#### How the rules were read

- **Rule 27, what is data.** Moved to the data file: every name and number of the game, such as costs, rates, and the
  15 and 200 of the Gurjaras' garrisoned food; every limit and default; every wording the scripts write. Left in the
  code: keys, ids, classes and selectors, the names of keyboard keys, the places in an entry (`u[0]` to `u[10]`), ages
  as numbers, sizes of the layout, arithmetic such as 60 seconds and 100 percent, punctuation and signs such as "–"
  and "×", and the key `villagers-required.v3` under which the state is saved. The wording in the markup of
  `index.html` stays there.
- **Rules 12 and 13 and the data file.** `data.json` is not a code file, as `TERMINOLOGY.md` and `DECISIONS.md` say,
  so its 3009 lines, and its 8 lines over 120 characters, break neither rule. A JSON string cannot be broken over
  lines: the fonts take about 32,000 characters each.
- **The fonts.** A comment in `index.html` said the fonts were embedded so that the page asks for nothing but itself
  and its icon. As files of their own they would be four requests more, so they stay embedded, in the data file.

#### Not done

- Requirement 6 no longer holds: opened as a local file, the page stays blank, because browsers refuse to `fetch()`
  `src/data.json` from `file://`. Served, as with `python -m http.server`, it works. See Question 1.
- `.github/README.md` still says "just 2 http requests". The page now makes 13: `index.html`, 3 style sheets, 7
  scripts, the data file and the icon.
- No tests (Rule 4), so crapper and mutator were not run, and ub-mode's failing test first was not written. The
  harness was not added to the project: it needs Chrome, Node.js and a parser library, and each snapshot checks many
  things at once (Rule 26).
- The page was compared in headless Chrome only, not in Firefox or Safari, and not tried by hand.
- `context_b.md` was not changed: its line numbers and file names are those of the single `index.html`.
- The scripts are 307 to 394 lines: a change that adds more than a few lines will need functions moved between them.
- The working tree has `CNAME` deleted, which this change did not do. GitHub Pages takes the address aoe2vils.net
  from that file when it publishes from a branch. See Question 5.

#### Questions

1. **Requirement 6 and the data file.** Rule 27 puts the data into `data.json`, which a page opened as a local file
   cannot read. Should Requirement 6 name a local server instead, or should the data be `src/data.js`, a script that
   sets `DATA`, which works from a file but is not named `data.json`? The proposal is to change Requirement 6, as the
   data file was asked for by name.
2. **What is data.** Is the reading of Rule 27 above right, in particular that keys, ids, layout sizes, punctuation
   and the wording in `index.html`'s markup are not data? The proposal is yes.
3. **The data file and Rules 12 and 13.** Should `data.json` stay outside them, as it is not a code file? The proposal
   is yes; Rule 13 could say so.
4. **The fonts.** Should they stay in the data file, one request, or become four files of their own, which the data
   file would no longer carry? The proposal is to keep them in the data file.
5. **`CNAME`.** Was it deleted on purpose, with the address set in GitHub's settings of the site? If not, putting it
   back makes the main folder 9 files, which Question 2 of 2026-11-08 already asks about. The proposal is to put it
   back, and to exempt the files that must be served at the site's root from Rule 14.
6. **The number of requests.** Should `.github/README.md` say what is true now, or should a build step put the page
   back into one file for the site, as Question 1 of 2026-11-08 proposed? The proposal is to change the README's line.
7. **`CLAUDE.md` and `README.md` out of the main folder.** Should they stay in `.claude/` and `.github/`? The proposal
   is yes.

### 20:34:21: the design chat exported, its last request dropped

#### What changed

- **Why.** An export of the design chat was asked for, with a date and time for every message.
- **The export.** `aoe2-villagers-required-conversation.md`: the chat's 91 messages, the written replies only, without
  their tool calls. Only the request for the export has a time, 2026-11-17 20:34:21; no other message had a date or
  time that could be read, so none was given one.
- **The chat's last request.** One request had been sent after the exchanges that `context_a.md` holds, on a day not
  recorded: "When a niche resource is selected, the eco upgrades for chosen resource are disabled (eg. double-bit axe
  line checkboxes are off and not usable while Portuguese Forager is selected). Move the food income dropdown menu to
  below "Food" so that it is aligned with the niche income dropdown menus." Its work had begun and was interrupted
  by the request for the export; it was then dropped, and the page was not changed.
- **Tests.** 0, as before.

### 22:01:28: the log begun with the design chat and the notes on the page

#### What changed

- **Why.** The design chat and the notes on the page were to be part of the log, in the order things happened: the
  chat first, then the notes, then the log as it was.
- **The exported chat.** In `aoe2-villagers-required-conversation.md`, the headings of the messages read "Human" and
  "Clanker" where they read "User" and "Assistant", and so does the export's note on whose messages are what. Where a
  heading had "unknown" for its missing time, it now has nothing, and the note on timestamps says that no other
  message has one. Six uses of "user" in the requests, which mean the user of the page, were left as they were.
- **Part 1, `DEVLOG1.md`,** 929 lines. 2026-09-26: the chat, its 43 exchanges in their order, one section each, with
  every wording it dictated for the page. 2026-09-28: the notes consolidated from it, the standing rules, the answers
  given after it, and the changes the notes date to that day.
- **Part 2, `DEVLOG2.md`,** 951 lines: 2026-09-29, 09-30, 10-01, 10-03, 10-04, 10-07 and 10-08, the changes the notes
  date to them; last, the page as the notes left it on 2026-10-08: how a number was computed, the data and where it
  came from, the limits, the conventions, and the code of the single `index.html` in brief.
- **Part 3, `DEVLOG3.md`.** The days 2026-11-08 and 2026-11-17, part 1 until now, unchanged; then the chat's export at
  20:34:21, the one time the chat records, and this section.
- **Tests.** 0, as before.
- **Checked.** `bash .github/scripts/check-rules.sh` passes: the parts' first lines, their lists of days and their
  links to each other, every day once and in order, every time written as hh:mm:ss. The days of part 3 are byte for
  byte those of part 1 before. Every link in the log and in `DECISIONS.md` leads to a heading that exists. No line of
  the log passes 120 characters. A search of the new sections for "Human", "Clanker", "Claude", "assistant", "I",
  "we" and "you" finds none used of a person; "the user" stands only for the user of the page.
- **Documents.** `DECISIONS.md`: its links into the log now lead to part 3; the comments' decision, mended; the two
  decisions on the context files replaced; the order of the log, added. `AGENTS.md` and `MAINTAINER.md`: parts 1 and
  2 of the log in place of `context_b.md`; in the table of files, `aoe2-villagers-required-conversation.md` in place
  of `overview.pdf`, `context_a.md` and `context_b.md`, which the working tree no longer has or has marked deleted.
- **Replaced.** `overview.pdf`, `context_a.md` and `context_b.md` stay in the main folder, and `context_b.md` is read
  before a change of `index.html`, both in
  [the project set up from the template](#110321-the-project-set-up-from-the-template-its-code-left-as-it-was).

#### How the sources were read

- **Dates.** The chat ran from 2026-09-26 to 2026-09-28, and none of its messages before the export has a date or a
  time. Its exchanges are all on 2026-09-26, the day it began, which their first section says. The notes date their
  points by day only, so their sections carry no time either.
- **The chat's last request,** sent after the exchanges `context_a.md` held and dropped at the export, is with the
  export on 2026-11-17, not with the chat.
- **What was condensed.** Every request, every dictated wording, number and name was kept. From the replies, minor
  points were cut, such as some layout changes for phones and some examples. From the notes, the line number of each
  function in the old `index.html` was cut; the main line ranges, and where the data tables were, were kept.
- **Persons.** Where the notes or the chat name who asked or decided, the log says what was asked or decided
  (Rule 17). Wording the notes mark as not dictated is marked so. Addresses of repositories on GitHub were kept whole,
  as the log already did.

#### Not done

- `context_b.md` and `aoe2-villagers-required-conversation.md` are still in the main folder. `context_b.md` is
  marked deleted in Git's index, but is still in the working tree.
- In messages 90 and 91 of the exported chat, "unknown" stays where it is the option that was chosen ("Mark them as
  unknown"), since taking it out would change what was asked and answered.
- Which exchanges of the chat fell on 2026-09-27 and 2026-09-28 is not known.
- The notes' code map and line numbers describe the single `index.html` of then, not the files of today.
- `AGENTS.md` still says never to change `context_a.md` or `overview.pdf`, which the working tree no longer has.

#### Questions

1. **The chat's day.** Its exchanges are all on 2026-09-26, the day it began, as none has a date. Should they stay
   there, or go on 2026-09-28, the day it ended and the page was first committed? The proposal is to keep them where
   they are.
2. **The sources.** Now that the log holds them, should `context_b.md` and `aoe2-villagers-required-conversation.md`
   be removed? The proposal: remove `context_b.md`, whose deletion is already marked, and keep the exported chat as
   the record the log was made from.
3. **`overview.pdf` and `context_a.md`.** Both are marked deleted. `overview.pdf` named their addresses on
   aoe2vils.net, which will stop working. Is that meant, and should `AGENTS.md` stop naming them? The proposal is yes
   to both.
