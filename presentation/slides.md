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

<!-- This slide is the laugh and the "oh no". Screenshot goes here — frame it so the Act 3 dashboard shot can echo it. -->

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

---
layout: section
---

# We're not complete animals

::subtitle::

Giving up line-by-line review is not giving up on quality

---
layout: default
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
---

# ③ At build — the heavy artillery

<v-clicks>

- Strict types
- **ArchUnit** / dependency-cruiser / eslint import rules — layering, cycles, "exactly one of these"
- **OpenAPI diffing** for breaking changes → the *API surface* column, automated
- **SAST**, dependency audit, secret scanning → the *security* column, automated
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

<!-- TELL ONE ANECDOTE OVER THIS SLIDE. The pattern line explains all of them at once: nothing fails when the authorisation check is missing. The feature works, the tests pass, the demo is great. There is no signal anywhere in the agent's definition of done. -->

---
layout: default
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

<!-- TELL ONE ANECDOTE OVER THIS SLIDE. The ideal one is where the code was reasonable in isolation and wrong in context. Architecture is a global property; agents operate locally. Not a knowledge problem — a vantage-point problem. Hold that thought, it is Act 3. -->

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

---
layout: section
---

# The loop

::subtitle::

Roles. Signals. Retries. Repair.

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
