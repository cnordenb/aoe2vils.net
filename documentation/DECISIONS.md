# Decisions

- [Rules, and how they are read](#rules-and-how-they-are-read)
- [Requirements, and how they are read](#requirements-and-how-they-are-read)
- [Code and files](#code-and-files)
- [Tests](#tests)
- [Documents](#documents)

The decisions recorded in the development log in [DEVLOG/](DEVLOG/DEVLOG1.md), by subject (Rule 23). Each ends with the
day it was made, and the time where the log has one, as a link to its entry in the log. Where a later decision replaced
an earlier one, the earlier one is named after it, with its own link.

## Rules, and how they are read

- **HTML, CSS and JavaScript only** (Rule 24), served as static files. Any other language or framework is approved
  first. [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **No animations** (Rule 25). No transitions, animations, keyframes, motion driven by JavaScript or smooth
  scrolling; `requestAnimationFrame` may time the layout.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **Code files** for Rules 12 and 13 are those ending in `.sh`, `.yml`, `.yaml`, `.js`, `.css` and `.html`.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **No folder is exempt from Rule 14** beside `documentation/DEVLOG/`.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **WCAG 2.2 at level AA.** The page has a user interface, so the accessibility category stays in `TESTS.md`.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **Claude Code kept from committing.** `.claude/settings.json` denies committing, pushing, merging, rebasing,
  cherry-picking and pull requests, and every edit of `REQUIREMENTS.md`.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **Code is written by ub-mode,** the page's JavaScript included, as `AGENTS.md` says. Where it and `RULES.md` differ,
  the rules win: its log is the development log, its glossary `TERMINOLOGY.md`, and no test is written only to please
  crapper or mutator.
  [2026-11-17 17:44:01](DEVLOG/DEVLOG3.md#174401-code-written-by-ub-mode-whose-tools-cannot-yet-read-the-page)
- **What is data** (Rule 27). Every name and number of the game, every limit and default, and every wording the
  scripts write is in the data file. Keys, ids, classes, selectors, names of keyboard keys, places in an entry, ages
  as numbers, sizes of the layout, arithmetic, punctuation and the key the state is saved under stay in the code, and
  the wording of the markup in `index.html`.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)
- **The data file is not a code file,** so Rules 12 and 13 do not apply to `src/data.json`.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)

## Requirements, and how they are read

- **A requirement says "will"** and is either true or false of the page.
  [2026-11-17 17:59:17](DEVLOG/DEVLOG3.md#175917-a-draft-of-the-requirements-made-from-the-context-files)
- **A draft of the requirements is made from the context files,** `context_a.md` and `context_b.md`, for the chief
  developer to write `REQUIREMENTS.md` from. Where the two disagree, the later one is taken.
  [2026-11-17 17:59:17](DEVLOG/DEVLOG3.md#175917-a-draft-of-the-requirements-made-from-the-context-files)
- **The data file over Requirement 6,** until it is answered: the data is in `src/data.json`, as asked, so the page
  works when served and not when opened as a local file.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)

## Code and files

- **The page in files of its own.** `index.html` holds the markup; `src/css/` three style sheets, applied in order;
  `src/js/` `boot.js` and six classic scripts, cut from one in its own order; `src/data.json` the data and the fonts;
  `src/favicon.ico` the icon. Replaced: `index.html` left whole for now.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)
- **The data is read once, by `boot.js`,** before the other scripts load; the body is hidden until then. Matcher
  specs in the data file stand for the functions that picked entries, and `parseData()` makes them functions again.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)
- **The fonts stay embedded,** as base64 in the data file, so that they make no requests of their own.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)
- **Texts hold names in braces,** filled in by `say()`, so that a wording is changed in the data file alone.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)
- **The comments removed,** not moved: what they said is in Git's history and, in part, in the notes in the log, and
  what a maintainer needs in `MAINTAINER.md`.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)
- **`CLAUDE.md` in `.claude/`, `README.md` in `.github/`, the icon in `src/`,** so that the main folder holds 8 files.
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)
- **The design chat and the notes on the page are kept in the log,** in parts 1 and 2; the chat as exported is
  `aoe2-villagers-required-conversation.md`. Replaced: `overview.pdf`, `context_a.md` and `context_b.md` stay in the
  main folder.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
  [2026-11-17 22:01:28](DEVLOG/DEVLOG3.md#220128-the-log-begun-with-the-design-chat-and-the-notes-on-the-page)
- **`ub-mode` copied unchanged** from the template, the same as github.com/cnordenb/ub-mode, with its MIT licence
  beside it in `LICENSE-ub-mode.txt`.
  [2026-11-17 17:44:01](DEVLOG/DEVLOG3.md#174401-code-written-by-ub-mode-whose-tools-cannot-yet-read-the-page)
- **ub-mode's tools stay outside the project,** in clones beside its folder. dryer runs on `src/js/`; crapper and
  mutator wait for tests. `.gitignore` leaves out `.metrics/` and `target/`, which they write. Replaced: none run
  until `index.html` is split and has tests.
  [2026-11-17 17:44:01](DEVLOG/DEVLOG3.md#174401-code-written-by-ub-mode-whose-tools-cannot-yet-read-the-page)
  [2026-11-17 20:13:33](DEVLOG/DEVLOG3.md#201333-the-page-split-into-markup-style-sheets-scripts-and-one-data-file)

## Tests

## Documents

- **The name is aoe2vils.net**, as on the page, in `README.md` and on GitHub, where the repository is
  `cnordenb/aoe2vils.net`.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **`README.md` in the template's order,** its earlier text kept word for word, with Support and the Ko-fi link last.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **Parts 1 and 2 of the log are read before a change of the page,** as `AGENTS.md` says, for the dictated wording
  and the notes. Replaced: `context_b.md` is read before a change of `index.html`.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
  [2026-11-17 22:01:28](DEVLOG/DEVLOG3.md#220128-the-log-begun-with-the-design-chat-and-the-notes-on-the-page)
- **Security through GitHub's private vulnerability reporting**, and funding through Ko-fi, `hjoerleif`.
  [2026-11-08 11:03:21](DEVLOG/DEVLOG3.md#110321-the-project-set-up-from-the-template-its-code-left-as-it-was)
- **The log in the order things happened,** the design chat first, then the notes on the page, then the log that
  was. The chat's exchanges carry no date, so they are on 2026-09-26, the day it began, in their order; the notes'
  on the days the notes name. A section with no known time has none in its title.
  [2026-11-17 22:01:28](DEVLOG/DEVLOG3.md#220128-the-log-begun-with-the-design-chat-and-the-notes-on-the-page)
