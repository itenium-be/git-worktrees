# Git Worktrees Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `presentation/slides.md` from the 10-minute worktree deck into the 52-slide, 20-minute three-act deck specified in `docs/superpowers/specs/2026-09-20-slide-list-design.md`, and fill `ElevatorPitch.md`.

**Architecture:** One Slidev markdown file, `presentation/slides.md`, rewritten act by act. Layouts come from the itenium theme submodule at `presentation/theme` (documented in `presentation/theme/LAYOUTS.md`) — no new components, no CSS. Six slides from the existing deck are adapted rather than rewritten. Four slides need screenshots that do not exist yet; they are authored as `layout: default` now and converted to `default-aside` in Task 11 once the images land, so the build never references a missing file.

**Tech Stack:** Slidev 51, bun, the itenium theme (git submodule).

**Two rules that override the skill's defaults here:**

1. **Never invent Wouter's material.** Tasks 9 and 10 contain questions to ask him, not answers to guess. Slides about a system he runs must describe the system he runs.
2. **Ask before every commit** (CLAUDE.md). Commit steps below are written out, but the executor stops and asks first.

**There is no test suite.** Verification per task is: the deck builds, and the slide count matches. Both commands are given in every task.

---

## File Structure

| File | Responsibility |
| ------------------------------------ | ------------------------------------------------------------------- |
| `presentation/slides.md`              | The deck. Rewritten in place — git history holds the 10-minute one   |
| `ElevatorPitch.md`                    | Conference abstract, audience, takeaways. Feeds the talks index site |
| `presentation/images/`                | Four screenshots, added in Task 11                                   |
| `docs/talk.md`                        | Read-only here. The script; source of truth for wording              |

Untouched: `presentation/slides-graph.md`, `slides-ide.md`, `slides-tmux.md` and `presentation/components/` — those belong to the aesthetic bake-off, which is deferred.

## Verification commands

Run from `presentation/`:

```bash
bun install          # once, before Task 1
bun run build        # must exit 0
grep -c '^layout:' slides.md
```

The `grep` count is every slide except the cover, which has no `layout:` key. Expected counts are given per task.

---

### Task 1: Frontmatter, cover, agenda

**Files:**
- Modify: `presentation/slides.md` (replace entire file)

- [ ] **Step 1: Replace the file with the cover and agenda**

````markdown
---
theme: ./theme
title: "Git Worktrees"
subTitle: One Repo, N Coding Agents
transition: fade
session-time: 20min
track: Git
type: Theoretical
first: 2026-10-06
aspectRatio: 16/10
---

# Git Worktrees
## One Repo, N Coding Agents

::image::

![](./images/cover-art.jpg)

---
layout: agenda
items:
  - It gets out of hand
  - Worktrees — and what they do not isolate
  - The capitulation
  - Guardrails
  - The loop
---
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun install && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `1`.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Restructure deck as the 20-minute three-act talk"
```

---

### Task 2: Act 1a — the collision (slides 3–6)

**Files:**
- Modify: `presentation/slides.md` (append)

- [ ] **Step 1: Append the four slides**

````markdown
---
layout: default
---

# One Claude

<v-clicks>

- One terminal, one agent, one human watching it work
- The agent works for four minutes
- You read for forty seconds. You type for ten.
- **Your expensive tool is idle most of the time. So are you.**

</v-clicks>

<!-- Everyone here has already done this, and it feels like the whole story. It is not, because of that last line — which leads to an idea that seems entirely reasonable. -->

---
layout: default
---

# Two Claudes

<v-clicks>

- Split the screen. Two agents, two tasks, **one repository**
- For about twenty minutes this is the best productivity hack you have ever found

</v-clicks>

<!-- Twenty minutes. Then. -->

---
layout: default
---

# Then

<v-clicks>

- One runs `git add .` — and commits the other's half-finished refactor
- One runs `git checkout main` — both sets of uncommitted changes evaporate
- Both run the test suite at once, against **one** set of build outputs
- Someone's `git stash` lands at the worst possible moment

</v-clicks>

<!-- Note what is NOT going wrong here. Neither agent wrote bad code. -->

---
layout: statement
textSize: lg
---

# The working directory is **shared mutable state**

::author::

…and nobody is holding a lock

<!-- Two agents in one checkout is a data race, and you have been taught how those end. -->
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `5`.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 1a: two agents, one checkout, one data race"
```

---

### Task 3: Act 1b — worktree mechanics (slides 7–12)

Slides 8, 9 and 12 are adapted from the pre-rewrite deck; recover their wording from `git show HEAD~2:presentation/slides.md` if you want to compare.

**Files:**
- Modify: `presentation/slides.md` (append)

- [ ] **Step 1: Append the six slides**

````markdown
---
layout: section
---

# Worktrees

::subtitle::

One checkout per agent. One object store underneath.

---
layout: default
h1:
  type: braces
  color: primary
  position: 2-3
---

# What a worktree is

<v-clicks>

- One repo → **many working directories**, each on its own branch
- Shared object database and refs — **no re-clone**
- Per-worktree **HEAD** and **index**
- A linked worktree's `.git` is a *file*, not a directory

</v-clicks>

<!-- Stable since git 2.5, 2015. The .git file holds a pointer back at the main repo via GIT_COMMON_DIR. -->

---
layout: code
code-size: 0.85em
---

# The whole API

```bash
git worktree add -b feat/auth ../auth main   # new branch, new dir
git worktree list                            # what is checked out where
git worktree remove ../auth                  # clean up
git worktree prune                           # you rm -rf'd one. fix the metadata
```

<!-- prune is the one gotcha: rm -rf leaves stale metadata that blocks re-checkout until pruned. -->

---
layout: section
---

# 🪿 Let's Demo

::subtitle::

`git worktree list`, then `cat ../auth/.git`

<!-- Thirty seconds, no network. The payoff is that .git is a one-line file. That demystifies the entire feature. Do NOT demo a GUI — worktree support there is uneven and version-dependent. -->

---
layout: code
code-size: 0.9em
---

# A branch mutex, for free

```console
$ git worktree add ../another feat/auth
fatal: 'feat/auth' is already used by worktree at '/scratch/auth'
```

<!-- Normally this error is an irritation. Here it is a branch mutex enforced by git, and it is the reason two agents cannot collide on the same branch. -->

---
layout: code
code-size: 0.8em
---

# Claude Code speaks worktree

```bash
claude -w feature-auth      # → .claude/worktrees/feature-auth/
                            #   on branch worktree-feature-auth
```

```yaml
# ...or pin a subagent, in its frontmatter:
isolation: worktree         # temp worktree, auto-removed if untouched
```

<!-- A plumbing command from 2015 became a checkbox in AI tooling in about eighteen months. That is the whole ecosystem agreeing on what the contended resource is: the filesystem. -->
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `11`.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 1b: worktree mechanics, demo and the branch mutex"
```

---

### Task 4: Act 1c — what worktrees do not isolate (slides 13–19)

**Files:**
- Modify: `presentation/slides.md` (append)

- [ ] **Step 1: Append the seven slides**

````markdown
---
layout: statement
textSize: lg
---

# Worktrees isolate your **code**. Not your **runtime**.

::author::

ports · databases · node_modules

---
layout: default
---

# Everything git ignores

<v-clicks>

- No `.env`, no local certs, no `appsettings.Development.json`
- No `node_modules`, no `venv`, no `bin/obj`
- Git gave you everything it **tracks**
- Your application needs everything it **ignores**

</v-clicks>

<!-- Nobody mentions this part, and it is where you lose your first afternoon. -->

---
layout: default
---

# …and then they collide anyway

<v-clicks>

- Both agents want port `3000`. And port `5432`
- Both point at the same dev database — one runs the destructive migration test
- `docker compose` project names clash; containers fight over names
- Eight `node_modules` is real disk. Eight test suites is a real laptop fire

</v-clicks>

<!-- Git isolated the filesystem and nothing else. -->

---
layout: statement
textSize: lg
---

# A worktree is an **environment**, not a folder

::author::

Creating one is provisioning

---
layout: code
code-size: 0.7em
---

# Bootstrap on create

```bash
# .claude/hooks/session-start.sh
INDEX=$(git worktree list --porcelain | grep -c '^worktree ')

cp ../main/.env .env
echo "PORT=$((3000 + INDEX * 10))" >> .env
export COMPOSE_PROJECT_NAME="$(basename "$PWD")"

pnpm install
```

<!-- A SessionStart hook is the natural home: the environment is correct before the agent types anything. -->

---
layout: quote
---

# Share what the **lockfile** determines.<br>Never share what your **source** determines.

<!-- node_modules is a function of the lockfile — pnpm's content-addressed store makes eight trees cost about what one costs. bin, obj, dist, target are functions of your code, which is the thing that differs per tree. Share those and you have rebuilt the exact collision you just escaped. -->

---
layout: default
---

# Three screens. Six Claudes.

<v-clicks>

- Six worktrees, six green branches
- Every one of them green against a `main` that has **since moved**
- A's suite ran for twelve minutes. B landed during minute three.
- The branch that lands is simply the one whose tests were shortest
- **The bottleneck is not writing code any more. It is merging.**

</v-clicks>

<!-- This slide is the laugh and the "oh no". Screenshot goes here in Task 11 — frame it so the Act 3 dashboard shot can echo it. -->
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `18`.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 1c: worktrees are not free, and the bottleneck moves"
```

---

### Task 5: Act 2a — code review is dead (slides 20–24)

**Files:**
- Modify: `presentation/slides.md` (append)

The `VClickTable` cells must not contain apostrophes — the rows are a JS array inside a single-quoted Vue attribute and an apostrophe terminates the string. The wording below is already apostrophe-free; keep it that way.

- [ ] **Step 1: Append the five slides**

````markdown
---
layout: section
---

# Code review is dead

::subtitle::

The second thing that moved, which nobody wants to say out loud

---
layout: default
---

# You cannot read it

<v-clicks>

- Six agents produce more reviewable diff per hour than you can read
- Not *more than is comfortable* — more than is **possible**
- So you skim, you trust the green check, and you approve
- **The full cost of review, for a rubber stamp**

</v-clicks>

<!-- That is the worst outcome available: you pay the time, the latency and the context switching, and the slop gets in anyway — laundered through a passing pipeline and your own fatigue. -->

---
layout: statement
textSize: xl
---

# Fuck the code.

::author::

Not nihilism — reallocation

<!-- PAUSE HERE. Half the room will think you have lost it. That is exactly the tension the guardrails block then resolves. -->

---
layout: default
---

# Move the attention

<VClickTable
  :headers="['Human keeps', 'Machine takes']"
  :rows="[
    ['<b>API surface</b> — what we commit to', 'formatting, style, naming'],
    ['<b>Security</b> — what cannot be un-leaked', 'correctness of the happy path'],
    ['<b>Architecture</b> — what we cannot cheaply undo', 'test coverage, duplication, dead code'],
  ]"
/>

<!-- Everything in the right-hand column becomes somebody else's problem. That somebody is not a person. -->

---
layout: quote
---

# Humans review what is<br>**expensive to reverse**

<!-- A badly named variable is a five-minute fix forever. A leaked credential, a published API, a wrong seam between modules — those you pay for at compound interest. -->
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `23`. If the build fails with a Vue template parse error, an apostrophe crept into the `VClickTable` rows.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 2a: the capitulation on line-by-line review"
```

---

### Task 6: Act 2b — guardrails and war stories (slides 25–31)

**Files:**
- Modify: `presentation/slides.md` (append)

Slides 30 and 31 carry bullet lists that are true of agents generally; the anecdote Wouter tells over them is spoken, not written. The speaker notes say so. Do not invent an anecdote.

- [ ] **Step 1: Append the seven slides**

````markdown
---
layout: section
---

# We're not complete animals

::subtitle::

Giving up line-by-line review is not giving up on quality

---
layout: default
textSize: sm
---

# Guardrails ① at the agent's hands ② at commit

<v-clicks depth="2">

- **Before the code exists**
  - `CLAUDE.md` conventions and skills; a planning step before an implementing step
  - `PreToolUse` refuses an edit outright — nothing touches `/migrations`, nothing writes a secret
  - `PostToolUse` runs the formatter the instant a file changes
- **At commit — git hooks**
  - format, lint, secret scan (gitleaks, trufflehog), commit message shape
  - under five seconds, or they get `--no-verify`'d out of existence, by a human, within a week

</v-clicks>

---
layout: default
textSize: sm
---

# ③ At build — the heavy artillery

<v-clicks>

- Strict types
- **ArchUnit** / dependency-cruiser / eslint import rules — layering, cycles, "there is exactly one of these and it lives here"
- **OpenAPI diffing** for breaking changes → that is the *API surface* column, automated
- **SAST**, dependency audit, secret scanning → that is the *security* column, automated
- **Mutation testing** — it answers "did these tests test anything?"<br>Agents write confident tests that assert nothing

</v-clicks>

---
layout: default
---

# ④ At merge, and after

<v-clicks>

- The merge queue
- The stabiliser
- Feature flags, progressive delivery

</v-clicks>

<!-- Both of the first two get their own slides in ninety seconds. -->

---
layout: quote
---

# A guardrail must be able to say **no** by itself.<br>Every escape is a bug in your guardrails.

<!-- One that emits a warning is documentation. Backpressure means the agent cannot proceed, not that it feels discouraged. And when you catch something by hand, the lesson is never "I should review more" — it is "that check did not exist yet". Go and write it. -->

---
layout: default
textSize: sm
---

# War story: security

<v-clicks>

- Auth on every endpoint except the one added last Tuesday
- Loads the record by ID straight from the request, never checks who owns it
- `rejectUnauthorized: false` — because that made the thing work
- Raw SQL with string interpolation, the moment the ORM gets awkward
- Binds the whole request body onto the entity. `isAdmin` included
- **Security is the absence of behaviour, and the agent optimises for behaviour**

</v-clicks>

<!-- TELL ONE ANECDOTE OVER THIS SLIDE — Wouter supplies it. The pattern line explains all of them at once: nothing fails when the authorisation check is missing. The feature works, the tests pass, the demo is great. There is no signal anywhere in the agent's definition of done. -->

---
layout: default
textSize: sm
---

# War story: architecture

<v-clicks>

- Writes a second `UserService` because it never found the first
- Controller reaches straight into the database — the short path was shorter
- Solves the ticket perfectly and leaves the abstraction leaking behind it
- Copies a pattern from the worst corner of your codebase, because it looked authoritative
- Mocks the unit under test, producing a test that will pass forever
- **The agent has local context and no taste**

</v-clicks>

<!-- TELL ONE ANECDOTE OVER THIS SLIDE — Wouter supplies it. The ideal one is where the code was reasonable in isolation and wrong in context. Architecture is a global property; agents operate locally. Not a knowledge problem — a vantage-point problem. Hold that thought, it is Act 3. -->
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `30`.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 2b: guardrails by when they fire, plus the two war stories"
```

---

### Task 7: Act 2c — merge queue and stabiliser (slides 32–36)

**Files:**
- Modify: `presentation/slides.md` (append)

- [ ] **Step 1: Append the five slides**

````markdown
---
layout: default
---

# The merge queue

<v-clicks>

- `run the tests → main moved → rebase → run the tests → main moved again → …`
- Graydon Hoare, *the not rocket science rule of software engineering*:<br>**automatically maintain a repository of code that always passes all the tests**
- Not *test the branch*. Test the state that would exist **after** merging
- Serialise the landing. Let the queue do the rebasing.

</v-clicks>

<!-- GitHub merge queue, Mergify, Graphite, Zuul — and Bors, doing exactly this in 2014. Remember that date, it comes back in ninety seconds. -->

---
layout: statement
textSize: lg
---

# A dedicated session whose only job is merging **is** a merge queue

::author::

A contended free-for-all becomes a single-consumer queue

<!-- You do not need to buy this. The agents building features then never rebase again and never race each other — the same fix you would apply to any other data race. -->

---
layout: default
---

# Merge on build. Stabilise later.

<v-clicks>

- The queue is the bottleneck now: one lane, a fifteen-minute pipeline, six producers
- So: **merge if it builds**
- A *second* dedicated session watches the full suite, fixes what broke, reverts what cannot be fixed fast
- Yes — `main` is sometimes red. You traded correctness-at-merge for **throughput plus a repair loop**

</v-clicks>

<!-- Say the objection out loud before the room does. This is a blocking lock versus optimistic concurrency with a reconciler: let writes through, detect conflict after the fact, repair. Every distributed system that had to scale made this exact trade. It is only survivable because of the guardrails four slides ago. -->

---
layout: default
---

# Git merges text. Agents write meaning.

<v-clicks>

- Both agents add a migration numbered `003_`. Git sees two filenames; your runner sees a coin flip
- Both add the same dependency, different versions, different lockfile sections
- A relaxes a contract — that function now returns `null`. B writes a caller that assumed it never did
- **Both green. Clean merge. Zero conflict markers. Product broken.**

</v-clicks>

<!-- No merge strategy catches these, because nothing is in conflict. The only thing that catches them is something running against main AFTER the fact — the stabiliser, again. This is the failure mode nobody in the room has thought about yet. -->

---
layout: statement
textSize: lg
---

# That is not six terminals any more.<br>That is a **control loop I operate by hand**.

::author::

architects · implementers · a merger · a stabiliser
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `35`.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 2c: the merge queue, merge-on-build and the stabiliser"
```

---

### Task 8: Act 3 scaffolding — the slides that need no input (slides 37, 41, 42)

The rest of Act 3 is Task 9, because it needs facts only Wouter has. These three do not.

**Files:**
- Modify: `presentation/slides.md` (append)

- [ ] **Step 1: Append the section divider**

````markdown
---
layout: section
---

# The loop

::subtitle::

Roles. Signals. Retries. Repair.
````

- [ ] **Step 2: Append slides 41 and 42** — these come *after* the Task 9 slides in the final deck, so append them now and Task 9 inserts its slides between the section divider and this block. Mark the insertion point with nothing; Task 9 states the exact anchor line.

````markdown
---
layout: quote
---

# Decomposition stopped being a design preference.<br>It became my **parallelism strategy**.

<!-- If everything routes through one 4,000-line service class, the architect can only ever hand out one non-conflicting slice — and you have one implementer. The number of agents you can usefully run is a direct readout of how well your codebase decomposes. That was always true for humans; you just never ran ten of them at once, so you never found out. -->

---
layout: default
---

# Where the memory lives

<v-clicks>

- Six agents rediscover the same quirk six times, then solve it in six different styles
- Parallel agents do not merely fail to share what they learn — they **diverge**, and the codebase grows dialects
- Sessions end, so session context is the wrong place for a lesson
- **Told an agent something twice? It belongs in the repo** — CLAUDE.md, a skill, an ADR
- Better than any prose: **a check that fails**. A documented convention is an optional one

</v-clicks>

<!-- Which is the guardrails block again, arriving from a different direction: guardrails are not just quality control, they are how a system remembers. -->
````

- [ ] **Step 3: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `38`.

- [ ] **Step 4: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 3 opening, the decomposition callback and where memory lives"
```

---

### Task 9: Act 3 — the system Wouter actually runs (slides 38, 39, 40, 43, 44, 45)

**Do not write these slides from `docs/talk.md`.** The role names and descriptions there are marked as guesses. Ask first.

**Files:**
- Modify: `presentation/slides.md` (insert after the `# The loop` section slide; append slides 43–45 after `# Where the memory lives`)

- [ ] **Step 1: Ask Wouter, in one message, all six questions**

1. The realisation (slide 38) — what was the actual moment you decided to automate the orchestration rather than keep doing it by hand? The specific straw, with the hour on it.
2. The roles (slide 39) — what do **Spark**, **Weld** and **Gauge** each do, in one line? Are there roles missing from that list?
3. The wiring (slide 40) — confirm or correct this shape: work item → Architect decomposes → Spark starts one session per worktree → implementers in parallel → Weld merges serially → Gauge verifies → red goes to the stabiliser, green goes to main.
4. The dashboard (slide 43) — which two or three numbers do you actually look at first thing in the morning?
5. Cost (slide 44) — tokens or money per day or week, machine specs, how long the setup took, how much you would rebuild versus keep.
6. What is still broken (slide 45) — two or three things that genuinely do not work yet.

- [ ] **Step 2: Write slides 38, 39 and 40 from his answers, inserted directly after the `# The loop` section slide**

Structure to fill — the prose is his, the shape is fixed:

````markdown
---
layout: default
---

# I appointed myself the scheduler

<v-clicks>

- Something deciding what to build. Several things building it. Something merging. Something repairing `main`.
- That is a control loop, and I had built one by hand
- Schedulers hold every task's state at once, switch context for free, and never sleep
- **I was the slowest component in a system I had accidentally designed**

</v-clicks>

<!-- HIS STRAW GOES IN THE SPEAKER NOTE, told over the slide. Talks live on specifics. -->

---
layout: default
---

# The system

<VClickTable
  :headers="['Role', 'What it does', 'Why it exists']"
  :rows="[
    ['<b>Architects</b>', '...', 'the agent has local context and no taste'],
    ['<b>Implementers</b>', '...', 'two Claudes overwriting each other'],
    ['<b>Spark</b>', '...', 'you cannot hand-start six agents'],
    ['<b>Weld</b>', '...', 'rebase, test, main moved, repeat'],
    ['<b>Gauge</b>', '...', 'you stopped reading the diffs'],
    ['<b>Dashboard</b>', '...', 'you cannot watch six terminals'],
  ]"
  textSize="sm"
/>

<!-- The "why it exists" column is the part that matters on stage: every entry ties a box back to a scar from Act 1 or Act 2. -->

---
layout: code
code-size: 0.6em
---

# The wiring

```text
(his confirmed shape, as an ASCII diagram)
```

<!-- The line to say while this is on screen: every box on this diagram is a scar. None of it was designed. Each one was added the week something broke, and the shape only looks deliberate in retrospect. -->
````

The `'...'` cells are the answers from Step 1, question 2. If an answer is not available, stop and ask again — do not ship a guess.

- [ ] **Step 3: Append slides 43, 44 and 45 after `# Where the memory lives`**

````markdown
---
layout: default
---

# One screen

<v-clicks>

- (his two or three numbers, one bullet each, each with why he reads it)

</v-clicks>

<!-- I stopped watching six terminals and started watching one system. That contrast is the entire talk in one image. A dashboard nobody reads is a slide nobody believes — so say why these numbers and not others. -->

---
layout: default
---

# What it costs

<v-clicks>

- (tokens or money, per day or week)
- (machine specs)
- (setup time)
- (how much he would rebuild versus keep)

</v-clicks>

<!-- Real numbers, no hedging. This is what buys back the credibility that "fuck the code" spent eleven minutes ago. An audience forgives ambition and does not forgive vagueness. If the honest answer is "more than I expected", say exactly that. -->

---
layout: default
---

# What is still broken

<v-clicks>

- (two or three, genuinely unsolved)

</v-clicks>

<!-- Do not end on "and it all works great" — the room stops believing you and you lose the Q&A. One slide of what remains unsolved is worth more than any feature on the diagram. -->
````

- [ ] **Step 4: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `44`.

- [ ] **Step 5: Verify slide order**

```bash
grep -n '^# ' presentation/slides.md | sed -n '35,50p'
```

Expected order: `The loop`, `I appointed myself the scheduler`, `The system`, `The wiring`, `Decomposition stopped…`, `Where the memory lives`, `One screen`, `What it costs`, `What is still broken`.

- [ ] **Step 6: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add Act 3: the system, the dashboard, the cost and what is still broken"
```

---

### Task 10: The close (slides 46–50)

**Files:**
- Modify: `presentation/slides.md` (append)

- [ ] **Step 1: Append the close and the outro slides**

````markdown
---
layout: default
---

# None of this is new

<v-clicks>

- Worktrees are per-developer checkouts
- A merge queue is **Bors, 2014**
- Optimistic merging with a reconciler is every distributed database
- Contract tests are microservices, 2015
- Trunk-based development, small diffs, writing conventions down
- **Every fix in this talk was invented for human teams, decades ago — and half-adopted**

</v-clicks>

<!-- AI did not invent new problems. It turned the dial from five developers to fifty and made every latent weakness in your process load-bearing. -->

---
layout: code
code-size: 0.7em
---

# Watch where the bottleneck went

```text
agent speed → filesystem → machine resources → merge throughput → review capacity → architecture
```

<!-- You can buy your way out of the first four. Faster models, more RAM, more lanes, more reviewers. The last one you cannot. -->

---
layout: statement
textSize: xl
---

# Your codebase's parallelism ceiling is your architecture.<br>**AI just found it.**

---
layout: quote
---

# I stopped reviewing code.<br>I review the **system that writes it** now.

---
layout: socials
---

---
layout: source
source: itenium-be/git-worktrees
---

---
layout: end
---
````

- [ ] **Step 2: Verify**

```bash
cd presentation && bun run build && grep -c '^layout:' slides.md
```

Expected: build exits 0, count is `51` — 52 slides, of which the cover has no `layout:` key.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Add the close: none of this is new, and where the bottleneck ended up"
```

---

### Task 11: Screenshots

Four slides currently carry no image and are `layout: default`. Converting them is a two-part change per slide: frontmatter and a trailing `::image::` slot.

**Files:**
- Create: `presentation/images/one-claude.png`, `two-claudes.png`, `six-claudes.png`, `dashboard.png`
- Modify: `presentation/slides.md`

- [ ] **Step 1: Ask Wouter for the four screenshots**

In order of how much work they do: six Claudes across three screens; the dashboard; one Claude; two Claudes split vertically. The dashboard shot should be framed to echo the six-Claudes shot as directly as possible — same framing if he can manage it.

- [ ] **Step 2: Size and compress each to the `default-aside` circle target**

Per `presentation/theme/LAYOUTS.md`: 1:1, 600×600, under 150 KB, subject centred.

```bash
cd presentation/images
magick six-claudes-raw.png -resize 600x600^ -gravity center -extent 600x600 six-claudes.png
pngquant --quality=70-85 --strip --output six-claudes.png --force six-claudes.png
ls -la six-claudes.png
```

Expected: under 150 KB. Repeat for each.

- [ ] **Step 3: Convert the four slides**

REQUIRED SUB-SKILL: use the `adding-slide-image` skill — it handles the `default` → `default-aside` conversion for this theme.

The four slides are `# One Claude`, `# Two Claudes`, `# Three screens. Six Claudes.` and `# One screen`. Each becomes:

````markdown
---
layout: default-aside
image-position: middle-right
---

# One Claude

(bullets unchanged)

::image::

![](./images/one-claude.png)
````

- [ ] **Step 4: Verify**

```bash
cd presentation && bun run build && grep -c '^layout: default-aside' slides.md
```

Expected: build exits 0, count is `4`. A missing image file fails the Vite build — that is the check.

- [ ] **Step 5: Commit** *(ask Wouter first)*

```bash
git add presentation/images presentation/slides.md
git commit -m "Add the four talk screenshots and wire them into the aside slides"
```

---

### Task 12: ElevatorPitch.md

This file feeds the presentations index site, so it is read by people deciding whether to attend.

**Files:**
- Modify: `ElevatorPitch.md` (replace entire file)

- [ ] **Step 1: Replace the template**

```markdown
Git Worktrees: One Repo, N Coding Agents
========================================

## Abstract

Point two coding agents at one repository and they will quietly destroy each other's work —
not because either wrote bad code, but because a working directory is shared mutable state.
Git worktrees fix that in one command, and then the trouble really starts: ports collide,
six green branches are all green against a `main` that moved, and you are merging faster
than you can review. This talk follows that escalation to its conclusion, which is that
line-by-line review of agent output has to be replaced by mechanical guardrails, a merge
queue, and a repair loop — and ends somewhere uncomfortable: your codebase's parallelism
ceiling turns out to be its architecture.

## Target Audience

Developers already running one or more coding agents who have felt the friction and suspect
it gets worse with more. No prior worktree knowledge assumed. Team leads deciding what to
automate will get the second half; the first half is hands-on git.

## Key Takeaways

- A worktree is an environment, not a folder — and provisioning one is the part nobody warns you about
- Share what the lockfile determines; never share what your source determines
- Humans review what is expensive to reverse: API surface, security, architecture. Everything else is mechanical
- A guardrail that only warns is documentation. Every escape is a bug in your guardrails
- A dedicated merging session is a merge queue, and every fix here was invented for human teams decades ago

## Session Format

20 minutes
```

- [ ] **Step 2: Verify**

```bash
grep -c 'TODO\|TBD\|Takeaway 1\|A brief description' ElevatorPitch.md
```

Expected: `0`.

- [ ] **Step 3: Commit** *(ask Wouter first)*

```bash
git add ElevatorPitch.md
git commit -m "Fill in the elevator pitch for the worktrees talk"
```

---

### Task 13: Timing dry run

The spec budgets 9:00 / 7:00 / 3:00 / 1:00. Fifty-two slides at an average of 23 seconds only works if the statement and quote slides really do go by in eight.

**Files:** none — this task produces a decision, not a diff.

- [ ] **Step 1: Present it out loud, once, against a clock**

```bash
cd presentation && bun run dev
```

Record the wall-clock time at the end of each act: slide 19 (`Three screens. Six Claudes.`), slide 36 (`That is not six terminals any more`), slide 45 (`What is still broken`).

- [ ] **Step 2: Compare against the budget**

| Checkpoint | Target |
| ------------------------------------ | ------ |
| End of slide 19                      | 9:00   |
| End of slide 36                      | 16:00  |
| End of slide 45                      | 19:00  |
| End                                  | 20:00  |

- [ ] **Step 3: If over, cut in the spec's order**

Delete slides in this order, one at a time, re-running the dry run after each: 28 (`④ At merge, and after`), 34 (`Merge on build. Stabilise later.`), 42 (`Where the memory lives`), 44 (`What it costs`), then one of the two war stories. **Never cut 26 or 27** — the guardrail slides are the only part of the talk that sends people home with something to do on Monday.

- [ ] **Step 4: Commit any cuts** *(ask Wouter first)*

```bash
git add presentation/slides.md
git commit -m "Trim the deck to the 20-minute budget after the dry run"
```

---

## Deferred, deliberately

The aesthetic bake-off — variants A (multiplayer IDE), B (living git graph), C (tmux command center) in `presentation/prototypes/`, with Vue components already built under `presentation/components/` and storylines in `slides-graph.md`, `slides-ide.md` and `slides-tmux.md`. Wouter decides the visual direction after the content is settled. When it is picked, the slides it touches are 5 (`# Then`), 6 (the shared-mutable-state statement), 19 (six Claudes) and 40 (the wiring diagram), and `presentation/prototypes/` gets deleted.
