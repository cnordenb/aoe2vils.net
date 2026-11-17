# Rules

Rule 0: All commits must be made by humans. AI agents may not commit, per policy stated in CONTRIBUTING.md.

Rule 1: The intended UI and behaviour of aoe2vils.net is defined by REQUIREMENTS.md.

Rule 2: Only the chief developer (Carl Nordenbrink @cnordenb) may modify REQUIREMENTS.md. To others and to AI
agents, REQUIREMENTS.md is read-only.

Rule 3: Must be as easy as possible for humans to maintain with as few steps as possible.

Rule 4: Must have tests to ensure the project still works every push.

Rule 5: No JavaScript nor CSS in an HTML file.  

Rule 6: Tests will be documented, without excess clutter, text or story-telling, in TESTS.md.

Rule 7: Must keep up-to-date MAINTAINER.md which explains pedagogically for humans how to maintain the project.

Rule 8: MAINTAINER.md should be beginner-friendly, stick to the essential stuff (don't clutter it with unnecessary
details), and have a table of contents. The steps of the most common maintenance task should always be the first
chapter. Never insert content to before that guide.

Rule 9: The project's terms are defined in TERMINOLOGY.md, one term a line of at most 120 characters, each line using
only terms defined above it.

Rule 10: No comments allowed in the code.

Rule 11: No function may exceed 60 LOC.

Rule 12: No LOC may exceed 120 characters.

Rule 13: No file may exceed 400 LOC.

Rule 14: No folder may exceed 7 files. Root may exceptionally contain up to 8 files. This rule does not apply to
documentation/DEVLOG/.

Rule 15: No two files in this project may have identical file name. This rule does not apply to "SKILL.md".

Rule 16: Document development and changes in DEVLOG.

Rule 17: DEVLOG should never refer to any person(s), actor(s) or AI agent(s). Everything is described passively:
something was decided, something was discovered, a question was posed. Never "the chief developer asked" or the like.
Blame is already automatically logged with commits for designated responsibility, there is no need to mention anyone in
DEVLOG. Obvious exceptions that this rule does not apply to: conceptual general actors ("the user"), a file name and not
a person ("MAINTAINER.md").

Rule 18: DEVLOG may not exceed 1000 lines. DEVLOG parts will be DEVLOG1.md, DEVLOG2.md, etc.

Rule 19: Every DEVLOG file needs a table of contents at the start from which the reader can jump to any day.

Rule 20: A DEVLOG entry is always a day (titled date (YYYY-MM-DD)). The entry may have sub-sections timestamped with
hh:mm:ss.

Rule 21: Every new addition to DEVLOG entry must be timestamped with date if it is the first addition of the day and time
hh:mm:ss if first addition of current minute.

Rule 22: When splitting up the DEVLOG and starting a new DEVLOG file, a day entry may never be broken up. If 1000 lines
is reached, current day entry is moved in its entirety to a new file.

Rule 23: DECISIONS.md must list the decisions made in DEVLOG and refer to the date and time (if available) in the
relevant DEVLOG where each was made.

Rule 24: The page is written in HTML, CSS and JavaScript only and served as static files. Any other language or
framework may be used for it only once the chief developer has approved it.

Rule 25: No animations: no CSS transitions, animations or keyframes, no motion driven by JavaScript and no smooth
scrolling. Every change of state shows at once. `requestAnimationFrame` may still be used to time the layout.

Rule 26: A test may test one thing and one thing only. A test must have one of the following purposes: requirement compliance, rule compliance, regression testing for previous bugs. A test may not test something that another test already tests. A test just for the sake of rule 4 is not a valid test.  

Rule 27: There will be strict data and code separation. All data must be in data.json. No data may reside in code.