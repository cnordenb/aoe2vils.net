# Instructions for AI agents

aoe2vils.net: a calculator web page for players of Age of Empires II: Definitive Edition. It shows how many villagers
on each resource keep a set of units and buildings in production, and what a set of villagers gathers by an age-up or
any given time.

- Stack: HTML, CSS and JavaScript, with no libraries and no build step: the markup in `index.html`, the style sheets in
  `src/css/`, the scripts in `src/js/`, and every name, number and text, and the fonts, in `src/data.json`. No test
  tool yet.
- Run the tests: no tests yet
- Check the rules a script can check: `bash .github/scripts/check-rules.sh` (Git Bash on Windows)

## Read before changing anything

1. `documentation/RULES.md`: how the project must be made. The rules come before any habit or default of yours.
2. `documentation/REQUIREMENTS.md`: what the project must do.
3. `documentation/TERMINOLOGY.md`: the project's words. Use them, in the documents and in the code.
4. The newest part of `documentation/DEVLOG/`: what was done last, what was left undone, and the open questions.
5. `documentation/DECISIONS.md`: what has been decided. Do not reopen a decision without a new reason.
6. `documentation/MAINTAINER.md`, when the change touches code: how the code works.
7. Parts 1 and 2 of the log, when the change touches the page: the design chat the page was first built in, and the
   notes on the page, its data and the wording the chief developer dictated, 2026-09-26 to 2026-10-08. Their line
   numbers and file names are older than the code.

## Never

- Commit, push, merge, rebase, cherry-pick, or open or merge a pull request (Rule 0). Leave every change in the working
  tree for a human to review and commit.
- Change `documentation/REQUIREMENTS.md` (Rule 2). If a requirement looks wrong, unclear or in conflict with a rule, ask.
- Change `documentation/RULES.md` unless the chief developer asks for that change.
- Name a person or an agent in the development log (Rule 17).
- Rewrite an earlier section of the log. A correction is a new section that says what it corrects.
- Change `context_a.md` or `overview.pdf`.

## A change is done when

1. The tests pass, and what changed is tested, within the 100 tests Rule 5 allows.
2. `TESTS.md` matches the tests: their numbers, files, lines and purposes (Rule 6).
3. `MAINTAINER.md` still explains the code and how to maintain it, its first chapter still first (Rules 7 and 8).
4. `TERMINOLOGY.md` defines every new term (Rule 9).
5. The development log has a section on the change, and `DECISIONS.md` lists every decision in it (Rules 16 to 23).
6. `bash .github/scripts/check-rules.sh` passes.

Then report what was done, how it was checked, and what was not done. "Not done" is never left out to look complete.

## When something is unclear

Do not guess silently, and do not stop at the first doubt. Take the reading that breaks the fewest rules and
requirements, carry it out, and write it under "Questions" in the log's section, numbered, with what the chief developer
needs to decide and a proposal. Ask the same questions in your reply. When they are answered, the next section records
the answers and `DECISIONS.md` the decisions.

## Procedures

Each procedure is a file in `.claude/skills/`. Claude Code loads them by itself; any other agent reads the matching
`SKILL.md` before that task.

| Task | Procedure |
| --- | --- |
| Write in the development log, record decisions and answers, start a new part | `devlog` |
| Add, remove, renumber or describe a test in `TESTS.md` | `tests-doc` |
| Keep `MAINTAINER.md` true after a change | `maintainer-guide` |
| Add or change a term in `TERMINOLOGY.md` | `terminology` |
| Check the project against `RULES.md` and `REQUIREMENTS.md` | `rules-check` |
| Write or change code in a language that ub-mode's tools support, see [ub-mode](#ub-mode) | `ub-mode` |

## ub-mode

Code is written and changed by `ub-mode` whenever its tools, crapper, dryer and mutator, support the language: Python,
TypeScript, JavaScript, Go, C, Java, Rust or Clojure. In any other language, use it only when asked, as with
`/ub-mode`. It is copied unchanged from github.com/cnordenb/ub-mode, under the MIT licence in `LICENSE-ub-mode.txt`
beside it. Where it and `RULES.md` differ, the rules win: its log is the development log, its glossary
`TERMINOLOGY.md`, and no test is written only to please crapper or mutator.

The tools are not part of the project, and are never copied into it. Run them from clones next to the project's
folder, from that folder, in Git Bash on Windows: `../crapper/crapper`, `../dryer/dryer`, `../mutator/mutator`.
Where the project's folder sits in a folder of its own, as in `aoe2vils/aoe2vils/`, and the tools are cloned beside
that folder, they are `../../crapper/crapper` and so on. Where a tool is missing or does not work for the language,
skip it, say so, and name it under "Not done".

All three tools were tried on small projects on 2026-11-10 under Windows 11, and worked for Python, TypeScript,
JavaScript, Go and C. Java, Rust and Clojure were not tried: Maven, Cargo and the Clojure CLI were not installed.

The page's JavaScript is in `src/js/`, which dryer reads: `../../dryer/dryer -s src/js`. crapper and mutator need
tests to run. Until the project has tests, skip those two and name them under "Not done".
