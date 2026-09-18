# I Stopped Reviewing Code

*20 minutes on parallel AI agents, git worktrees, and everything that broke afterwards.*

A talk in three acts. Act 1 is a productivity hack that gets out of hand. Act 2 is the
capitulation — the moment code review stops being possible and something has to replace it.
Act 3 is what you end up building once you admit you're no longer a developer driving
terminals, but an operator running a system.

Every step is something that actually happened, in order. The audience should recognise
themselves somewhere around minute four, and be slightly alarmed by minute twelve.

## The budget

| | Beat | Runs |
| --- | --- | --- |
| 0:00 | **Cold open:** one Claude. A screenshot. | 1 min |
| 1:00 | Two Claudes → they overwrite each other → worktrees | 3 min |
| 4:00 | Worktrees aren't free: ports, DBs, `.env` | 2 min |
| 6:00 | Three screens, six Claudes. Merging is the bottleneck. | 1.5 min |
| 7:30 | **The capitulation:** code review is dead | 1.5 min |
| 9:00 | **Guardrails.** We're not complete animals. + war stories | 4 min |
| 13:00 | The merge queue as a dedicated session | 2 min |
| 15:00 | Merge on build, stabilise later | 1.5 min |
| 16:30 | **The loop.** The system I actually run now. | 2.5 min |
| 19:00 | Close | 1 min |

That's 20 tight. First things to cut if you're running long: the stabiliser detail (15:00)
and one war story. Never cut the guardrails block — it's the only part of the talk that
sends people home with something to do on Monday.

## Still to fill in

Everything below is written; these are the holes only you can plug. Each is marked
**FILL IN** in place.

| Where | What's needed |
| --- | --- |
| Act 2 — war stories | one security anecdote, one architecture anecdote |
| Act 3 — the realisation | the specific moment you decided to automate the orchestration |
| Act 3 — the system | what Spark, Weld and Gauge actually do (my guesses are in the table) |
| Act 3 — the diagram | confirm the wiring, then redraw |
| Act 3 — memory | one lesson that became a hook, lint rule or ArchUnit test |
| Act 3 — dashboard | which two or three numbers you actually read each morning |
| Act 3 — cost | real tokens/money/hardware, and the setup time |
| Act 3 — what's broken | two or three things that genuinely still don't work |
| Screenshots | one Claude, two Claudes, six Claudes, the dashboard |

---

# Act 1 — It gets out of hand

## One Claude

Open on the screenshot. One terminal, one agent, one human watching it work. This is the
part everyone in the room has already done, and it feels like the whole story.

It is not the whole story, because of one observation: **you spend most of your time
waiting.** The agent works for four minutes, you read for forty seconds, you type for ten.
Your expensive tool is idle most of the time, and so are you.

Which leads to an idea that seems entirely reasonable.

## Two Claudes

Split the screen vertically. Two agents, two tasks, one repository. For about twenty
minutes this is the best productivity hack you've ever found.

Then:

- one runs `git add .` and commits the other's half-finished refactor
- one runs `git checkout main` and both sets of uncommitted changes evaporate
- both run the test suite at once, against one set of build outputs
- someone's `git stash` lands at the worst possible moment

Note what's *not* going wrong here. Neither agent wrote bad code. The problem is that the
working directory is shared mutable state and nobody is holding a lock. Two agents in one
checkout is a data race, and you've been taught how those end.

## Worktrees

One checkout per agent, one shared object store underneath.

```bash
git worktree add ../feat-payments -b feat-payments
git worktree add ../fix-flaky-test -b fix-flaky-test
git worktree list
git worktree remove ../feat-payments
```

Three things to land, and no more — the appendix has the rest:

- **Cheap.** No re-clone. One object database, shared refs. The new tree's `.git` is a
  *file* holding a pointer. `cat ../feat-payments/.git` on stage costs five seconds and
  demystifies the entire feature.
- **Isolated.** Separate index, separate HEAD, separate files. `git add .` in one tree
  cannot see the other.
- **Locked, for free.** Git refuses to check out a branch that's already checked out
  elsewhere. Normally that error is an irritation. Here it's a branch mutex enforced by
  git, and it's the reason two agents can't collide on the same branch:

```console
$ git worktree add ../another feat-payments
fatal: 'feat-payments' is already used by worktree at '/scratch/feat-payments'
```

**You don't have to take my word that this is the answer** — Claude Code will run each
parallel subagent in its own worktree as a built-in option. A plumbing command from 2015
became a checkbox in AI tooling in about eighteen months. That's the ecosystem agreeing on
what the contended resource is: the filesystem.

## Worktrees aren't free

Nobody mentions this part, and it's where you lose your first afternoon.

Worktrees give you everything git tracks. Everything git *ignores* is exactly what your
application needs in order to run:

- no `.env`, no local certs, no `appsettings.Development.json`
- no `node_modules`, no `venv`, no `bin/obj`

And once you've fixed that, they collide anyway — because git isolated the filesystem and
nothing else:

- both agents want port 3000, and port 5432
- both point at the same dev database, and one of them runs the destructive migration test
- `docker compose` project names clash, containers fight over names
- eight `node_modules` is real disk; eight test suites is a real laptop fire

The fix is a mindset change more than a script: **a worktree is an environment, not a
folder.** Creating one is provisioning, so it gets a bootstrap script — copy `.env`, derive
a port from the tree name, set `COMPOSE_PROJECT_NAME`, install. In Claude Code a
`SessionStart` hook is the natural home: the environment is correct before the agent types
anything.

One rule covers the caching question, which someone will ask:

> **Share what the lockfile determines. Never share what your source determines.**

`node_modules` is a function of the lockfile — pnpm's content-addressed store makes eight
trees cost about what one costs. `bin/`, `obj/`, `dist/`, `target/` are functions of *your
code*, which is the thing that differs per tree. Share those and you've rebuilt the exact
collision you just escaped. (Details per ecosystem in the appendix.)

## Three screens, six Claudes

Second screenshot, and this is the laugh. Six agents, six worktrees, six green branches.

Except six green branches means nothing, because every one of them was green against a
`main` that has since moved. Agent A's suite ran for twelve minutes; agent B landed during
minute three. Now A rebases, re-runs, and races again. With two agents that's annoying.
With six, nobody ever finishes — and the branch that lands is simply the one whose tests
happened to be shortest.

**The bottleneck has moved.** It isn't writing code any more. It's merging.

And there's a second thing that's moved, which nobody wants to say out loud.

---

# Act 2 — The capitulation

## Code review is dead

Six agents produce more reviewable diff per hour than you can read. Not "more than is
comfortable" — more than is *possible*. So you do what everyone does: you skim, you trust
the green check, you approve.

That's the worst outcome available. You're paying the full cost of review — your time, the
latency, the context switching — and getting a rubber stamp. The slop you were guarding
against gets in anyway, laundered through a passing pipeline and your own fatigue.

So: stop. **Fuck the code.**

Not as nihilism — as reallocation. Line-by-line review of agent output is a bad use of the
only scarce resource you have left, which is human attention. Move all of it to three
things, and let the machine handle the rest:

| Human keeps | Machine takes |
| --- | --- |
| **API surface** — what we're committing to | formatting, style, naming |
| **Security** — what can't be un-leaked | correctness of the happy path |
| **Architecture** — what we can't cheaply undo | test coverage, duplication, dead code |

The through-line: **humans review what is expensive to reverse.** A badly named variable
is a five-minute fix forever. A leaked credential, a published API, a wrong seam between
modules — those you pay for at compound interest.

Everything in the right-hand column becomes somebody else's problem. That somebody is not
a person.

## We're not complete animals

This is the longest block in the talk and the one people came for. The claim to defend:
*giving up line-by-line review is not giving up on quality.* It's moving quality from a
human bottleneck to a mechanical one.

Guardrails by when they fire:

**1. At the agent's hands — before the code exists.**
CLAUDE.md conventions and skills; Claude Code hooks, where `PreToolUse` can refuse an edit
outright (nothing touches `/migrations`, nothing writes a secret) and `PostToolUse` runs
the formatter the instant a file changes; a planning step before an implementing step.

**2. At commit — git hooks.**
Format, lint, secret scan (gitleaks, trufflehog), commit message shape. Keep them under
five seconds or they will be `--no-verify`'d out of existence, by a human, within a week.

**3. At build — the heavy artillery.**
Strict types. ArchUnit or dependency-cruiser or eslint import rules for layering, cycles,
and "there is exactly one of these and it lives here". Pact for cross-service contracts.
OpenAPI diffing for breaking-change detection — that's your *API surface* column, automated.
SAST, dependency audit, secret scanning — that's your *security* column, automated. And
mutation testing, which is the one that actually matters against agents: it answers "did
these tests test anything?", and agents write confident tests that assert nothing.

**4. At merge and after.**
The merge queue, the stabiliser, feature flags, progressive delivery.

Two rules make this work:

> **A guardrail must be able to say no by itself.** One that emits a warning is
> documentation. Backpressure means the agent cannot proceed, not that it feels discouraged.

> **Every escape is a bug in your guardrails.** When you catch something by hand, the
> lesson is never "I should review more". It's "that check didn't exist yet". Go and
> write it.

### War stories: security

> **FILL IN — two war stories, one here and one under architecture. These are the buckets
> yours will fall into; pick the one with the best reveal, not the worst outcome.**

- auth on every endpoint except the one added last Tuesday
- loads the record by ID straight from the request, never checks who owns it
- `rejectUnauthorized: false` / `verify=False` / CORS widened to `*`, because that made
  the thing work
- drops to raw SQL with string interpolation the moment the ORM gets awkward
- a secret in a commit, a token in a log line, PII in the new debug statement
- binds the whole request body onto the entity, `isAdmin` included

The pattern worth naming on the slide, because it explains all of them at once:

> **Security is the absence of behaviour, and the agent optimises for behaviour.**

Nothing fails when the authorisation check is missing. The feature works. The tests pass.
The demo is great. There is no signal anywhere in the agent's definition of done — which
is precisely why this one cannot be left to review-by-vibes, and has to be mechanical.

### War stories: architecture

> **FILL IN — your story. The ideal one is where the code was *reasonable* in isolation
> and wrong in context: that's the whole point you're making.**

- writes a second `UserService` because it never found the first
- controller reaches straight into the database, because the short path was shorter
- solves the ticket perfectly and leaves the abstraction leaking behind it
- copies a pattern from the worst corner of your codebase, because your codebase has a
  worst corner and it looked authoritative
- mocks the unit under test, producing a test that will pass forever

And the pattern:

> **The agent has local context and no taste.** It sees the files it opened, not the system.

Architecture is a global property. Agents operate locally. You cannot fix that with a
better prompt, because it isn't a knowledge problem — it's a *vantage point* problem.

Which tells you exactly what's missing: a role whose entire job is the global view. Hold
that thought, it's Act 3.

## The merge queue

Back to the actual bottleneck. The loop you're stuck in:

```
run the tests → main moved → rebase → run the tests → main moved again → ...
```

The rule that breaks it, which Graydon Hoare called "the not rocket science rule of
software engineering":

> Automatically maintain a repository of code that always passes all the tests.

Not *test the branch*. Test the state that would exist **after** merging, and merge only
that exact state. Serialise the landing; let the queue do the rebasing.

And here's the local twist: you don't need to buy this. **A dedicated session whose only
job is merging** is a merge queue. It takes a signal, rebases, runs, lands, repeats. The
agents building features never rebase again and never race each other. You've turned a
contended free-for-all into a single-consumer queue, which is the same thing you'd do to
fix any other data race.

GitHub merge queue, Mergify, Graphite, Zuul — and Bors, doing this in **2014**. Remember
that date, it comes back in ninety seconds.

## Merge on build. Stabilise later.

Except now the queue is the bottleneck, because it's one lane and your test suite is long.
Six agents feeding a fifteen-minute pipeline through a single consumer does not converge.

So, the second capitulation — and this is the spicy slide:

**Merge if it builds.** Then run a *second* dedicated session whose only job is to
stabilise `main` — watch the full suite, fix what broke, revert what can't be fixed fast.

Say the obvious objection out loud before the room does: yes, `main` is sometimes red now.
You have deliberately traded *correctness at merge time* for *throughput plus a repair
loop*. That's a real trade with real costs, and it's only survivable because of the
guardrails block four slides ago — the build gate is doing more work than "it compiles",
and the stabiliser is a machine that never gets bored.

It's also not new. It's the difference between a blocking lock and optimistic concurrency
with a reconciler: let writes through, detect conflict after the fact, repair. Every
distributed system that had to scale made this exact trade.

And there's a second reason the stabiliser has to exist, which would bite you even with
infinite CI budget. **Git merges text. Agents write meaning.** Both branches green, merge
clean, zero conflict markers, product broken:

- both agents add a migration numbered `003_`. Git sees two filenames. Your migration
  runner sees a coin flip.
- both add the same dependency, at different versions, in different lockfile sections
- agent A relaxes a contract — that function now returns `null` in a case it never used
  to. Agent B, in a different file, writes a caller that assumed it never did. No textual
  overlap. Nothing to conflict.

No merge strategy catches these, because nothing is in conflict. The only thing that
catches them is something running against `main` *after* the fact — which is the
stabiliser, again. Worth thirty seconds, because it's the failure mode nobody in the room
has thought about yet.

Now count what's running: architects, implementers, a merger, a stabiliser. Roles, signals,
retries, repair.

That's not six terminals any more. **That's a control loop I'm operating by hand.**

---

# Act 3 — The loop

## The realisation

Count what was running by the end of Act 2: something deciding what to build, several
things building it, something merging, something repairing `main`. Roles. Signals. Retries.
Repair.

That's a control loop. I had built one by hand, and then appointed myself its scheduler —
which is the single worst job to give a human. Schedulers need to hold every task's state
at once, switch context for free, and never sleep. I can do none of those things. I was the
slowest component in a system I had accidentally designed.

So: stop operating it by hand.

> **FILL IN — the honest version of this beat.** What was the actual moment you decided to
> automate the orchestration rather than keep doing it? The specific straw. Talks live on
> specifics: "it was 1am and I was rebasing for the fourth time" beats any amount of
> reasoning about control loops.

## The system

> **FILL IN — I've laid out the slide with my guesses so there's something to correct
> rather than a blank form. Replace the italics; the "why it exists" column is the part
> that matters on stage, because it ties each box back to a scar from Act 1 or 2.**

| Role | What it does | Why it exists |
| --- | --- | --- |
| **Architects** | *global view; cut work into pieces with disjoint blast radii* | "the agent has local context and no taste" |
| **Implementers** | *local, parallel, disposable; one worktree each* | two Claudes overwriting each other |
| **Spark** | *??? my guess: spawns sessions from work items* | you can't hand-start six agents |
| **Weld** | *??? my guess: the merger — the dedicated merge-queue session* | rebase, test, main moved, repeat |
| **Gauge** | *??? my guess: measurement — quality gates, the "is this done" verdict* | you stopped reading the diffs |
| **Dashboard** | *the one screen that replaced the six terminals* | you can't watch six terminals |
| **CLI tooling** | *how you intervene when it goes wrong* | it will go wrong |

A shape to verify — redraw once the roles are confirmed:

```
     work item
         │
    ┌────▼─────┐   decompose into
    │ Architect│   disjoint slices
    └────┬─────┘
         │
    ┌────▼─────┐   one worktree,
    │  Spark   │   one session each
    └────┬─────┘
    ┌────┼────┬─────────┐
    ▼    ▼    ▼         ▼
  impl impl impl  …  impl        ← parallel, isolated, disposable
    └────┴────┴────┬────┘
              ┌────▼────┐   merge-on-build,
              │  Weld   │   serialised landing
              └────┬────┘
              ┌────▼────┐   did it actually work?
              │  Gauge  │   ── red ──▶ stabiliser ──┐
              └────┬────┘                            │
                   │◀───────────────────────────────┘
                 main
```

The line to say while this is on screen: **every box on this diagram is a scar.** None of
it was designed. Each one was added the week something broke, and the shape only looks
deliberate in retrospect.

## Architects and implementers

This is the direct payoff to "the agent has local context and no taste", so land the
callback explicitly.

The fix for a vantage-point problem is not a better prompt — it's a different vantage
point. So one role holds the global view and does nothing else: read the system, decide
the seams, cut the work into pieces that *cannot* semantically collide. The implementers
are then deliberately local, parallel, and disposable, because that's the only thing you
can safely run six of.

And here's where the talk's argument closes:

> **Decomposition stopped being a design preference and became my parallelism strategy.**

If everything routes through one 4,000-line service class, the architect can only ever hand
out one non-conflicting slice, and you have one implementer. The number of agents you can
usefully run is a direct readout of how well your codebase decomposes. That was always true
for humans — you just never ran ten of them at once, so you never found out.

## Where the memory lives

The last failure mode, and it's the one that creeps up quietly: six agents rediscovering
the same quirk in six different ways, then solving it in six different styles. Parallel
agents don't merely fail to share what they learn — they actively diverge, and the codebase
grows dialects.

Session context is the wrong place for a lesson, because sessions end. The rule:

> **If you've told an agent something twice, it belongs in the repo.**

CLAUDE.md, skills, ADRs — and better than any prose, a check that fails, because a
convention that is merely documented is a convention that is optional. Which is the
guardrails block again, arriving from a different direction: guardrails aren't just quality
control, they're how a system remembers.

> **FILL IN:** one concrete example of a lesson that made this trip — something an agent
> got wrong twice, that is now a hook, a lint rule, or an ArchUnit test.

## The dashboard

Screenshot. This is the payoff shot, and it should be composed to echo the six-terminals
slide from Act 1 as directly as possible — same framing if you can manage it.

Say the contrast out loud, because it's the entire talk in one image:

> **I stopped watching six terminals and started watching one system.**

> **FILL IN:** what's actually on it — queue depth, who's building what, how long the
> stabiliser has been red, cost burn? Pick the two or three numbers you genuinely look at
> first thing in the morning, and say that's why they're there. A dashboard nobody reads
> is a slide nobody believes.

## What it costs

One slide, real numbers, no hedging. This is what buys back the credibility that "fuck the
code" spent eleven minutes ago — an audience forgives ambition and does not forgive vagueness.

> **FILL IN:** tokens or money per day/week; machine specs you needed; how long the setup
> took; how much of it you'd rebuild versus keep. If the honest answer is "more than I
> expected", say exactly that — it's the most trustworthy sentence available to you here.

## What's still broken

Do not end on "and it all works great" — the room stops believing you, and you lose the
Q&A. One slide of what remains genuinely unsolved is worth more than any feature on the
diagram.

> **FILL IN — candidates, pick two or three that are actually true for you:**
> flaky tests still poison the queue; the architect sometimes cuts slices that aren't as
> disjoint as it thought; nobody has read some of this code; cost is not linear in output;
> onboarding a colleague to this is a nightmare; you still can't leave it running unattended
> overnight; the guardrails catch what you thought to write a guardrail for, and nothing else.

That last one, if it's true, is the strongest possible setup for the close.

# The close

Look at what's on the list. Worktrees are per-developer checkouts. A merge queue is Bors,
2014. Optimistic merging with a reconciler is every distributed database. Contract tests
are microservices, 2015. Trunk-based development, small diffs, writing conventions down —
every single fix in this talk was invented for *human* teams, decades ago, and then
half-adopted, because you could get away with half-adopting it.

AI didn't invent new problems. It turned the dial from five developers to fifty and made
every latent weakness in your process load-bearing.

Watch where the bottleneck went while I was talking:

```
agent speed → filesystem → machine resources → merge throughput → review capacity → architecture
```

You can buy your way out of the first four. Faster models, more RAM, more lanes, more
reviewers. The last one you cannot.

> **Your codebase's parallelism ceiling is your architecture. AI just found it.**

And the personal version, which is the better closing line if you want the room quiet:

> **I stopped reviewing code. I review the system that writes it now.**

---

# Delivery notes

**Screenshots you need**, in order of how much work they do:

1. Six Claudes across three screens — the laugh, and the "oh no" of recognition
2. The dashboard, in Act 3 — the payoff shot, deliberately echoing #1
3. One Claude, cold open — sets up both of the above
4. Two Claudes, split vertical
5. Optional and very effective: a real `git log` showing one agent committing another's work

**Live demo**: only one, `git worktree list` plus `cat ../tree/.git`. Thirty seconds, no
network, no slides. Do not demo a GUI — worktree support in GUIs is uneven and version-
dependent (lazygit and GitKraken are fine, VS Code needs an extension, JetBrains varies).

**Pacing traps.** The guardrails block wants to eat eight minutes; hold it to four by
picking exactly two war stories, one security and one architecture, and cutting the lists
to what's on the slide. Act 1 wants to eat ten minutes because worktree mechanics are fun
to explain; it gets six, and everything else is in the appendix for Q&A.

**The line to land clean** is "fuck the code" at 7:30 — pause after it. Half the room will
think you've lost it, which is exactly the tension the guardrails block then resolves.

**Questions you will get**: how much does it cost; how do you share `node_modules`; what
about ports; doesn't `main` being red make CI useless; why not just use containers; have
you tried GitButler/jj. Appendix and parking lot cover all six.

---

# Appendix: worktrees in depth

Backup-slide material. Mostly you won't show this, but it's what people ask about
afterwards.

### The command surface

| Command | What it's for |
| --- | --- |
| `git worktree add <path> -b <branch>` | new branch, new tree — the 90% case |
| `git worktree add <path> <branch>` | check out an existing branch |
| `git worktree add <path>` | branch is named after the directory |
| `git worktree add --detach <path>` | no branch — throwaway tree for bisecting or "just look" |
| `git worktree add --guess-remote <path>` | track `origin/<dir-name>` if it exists |
| `git worktree list [--porcelain]` | what exists; `--porcelain` is the scripting hook |
| `git worktree remove <path>` | **the correct way to delete one** (`--force` if dirty) |
| `git worktree prune` | clean up after someone `rm -rf`'d a tree instead |
| `git worktree move <from> <to>` | relocate a tree |
| `git worktree repair` | fix the pointers after you moved things by hand |
| `git worktree lock / unlock` | stop `prune` touching a tree on a detached drive |

What it actually looks like (git 2.43, real output):

```console
$ git worktree list
/scratch/demo           d2aff83 [main]
/scratch/feat-payments  d2aff83 [feat-payments]

$ cat ../feat-payments/.git
gitdir: /scratch/demo/.git/worktrees/feat-payments
```

The branch mutex, verbatim:

```console
$ git worktree add ../another feat-payments
Preparing worktree (checking out 'feat-payments')
fatal: 'feat-payments' is already used by worktree at '/scratch/feat-payments'
```

And the gotcha everyone hits — delete the directory by hand and git still has the
metadata, so the branch stays locked until you prune:

```console
$ rm -rf ../feat-payments
$ git worktree list
/scratch/demo           d2aff83 [main]
/scratch/feat-payments  d2aff83 [feat-payments] prunable   # ← still there

$ git worktree prune      # now the branch is free again
```

**GUI support is the weak spot.** This is a CLI-first feature and the tooling is uneven:
lazygit has a worktrees panel, GitKraken and Tower support them, VS Code has no native
UI (each tree is simply another window — extensions fill the gap), and JetBrains varies
by version. Support moves fast enough that you should check your own machine before
demoing anything. **Demo the CLI.**

### What's shared, what isn't

The single most useful table in the talk, because everything below is a consequence of it:

| Per-tree (isolated) | Shared (one copy, common dir) |
| --- | --- |
| HEAD, index, working files | objects, refs, branches, tags |
| in-progress rebase / merge / bisect | **`git stash`** ← surprises everyone |
| HEAD's reflog, `ORIG_HEAD` | hooks, remotes, config |
| sparse-checkout settings | submodule git dirs (`.git/modules/*`) |

`refs/stash` lives in the common dir, so there is **one stash stack for every worktree**.
Agent A stashes, agent B pops, and the isolation you just bought evaporates. If you need
per-tree config, `git config --worktree` works — but only after
`git config extensions.worktreeConfig true`.

### Sharing `node_modules` but not `bin/obj`

One rule decides every case:

> **Share what the lockfile determines. Never share what your source determines.**

`node_modules` is a pure function of the lockfile — two trees on the same lockfile want
byte-identical contents, so sharing is free. `bin/`, `obj/`, `dist/`, `target/` are
functions of *your code*, which is precisely the thing that differs per tree. Share those
and you have rebuilt the original problem: agent A's build output overwrites agent B's and
the tests run against the wrong binary. (In .NET it's worse than wrong — `obj/project.assets.json`
bakes in absolute paths, so even copying it is broken.)

How to actually share the shareable half:

1. **pnpm.** The right answer. Content-addressed global store, each tree's `node_modules`
   is links into it. Eight trees cost about what one costs. No configuration.
2. **npm / yarn.** The *cache* (`~/.npm`) is already global, so `npm ci` is network-free —
   but still writes a full copy per tree. Fine at three trees, painful at ten.
3. **`cp -al ../main/node_modules node_modules`.** Hardlink copy: near-instant, almost no
   disk. Works because installers replace files rather than edit them in place. Verify with
   native modules before trusting it.
4. **CoW filesystems.** `cp --reflink=auto` on btrfs/XFS, or ZFS/btrfs snapshots — provision
   an entire tree, dependencies included, instantly.
5. **Symlinking `node_modules` to another tree.** Cheap, and a trap. The moment two branches
   disagree about the lockfile, one agent is silently testing against the other's dependencies
   and nothing warns you.

Per ecosystem:

| | Share | Never share |
| --- | --- | --- |
| Node | store via pnpm, or `~/.npm` cache | `dist/`, `.next/` |
| .NET | `~/.nuget/packages` (already global) | `bin/`, `obj/` |
| Java | `~/.m2`, Gradle cache | `target/`, `build/` |
| Rust | `CARGO_TARGET_DIR` *can* be shared — cargo locks and fingerprints it, saving real disk, at the cost of builds serialising on that lock | — |
| Python | the wheel cache; use `uv` | the venv itself — absolute paths are baked into shebangs and `pyvenv.cfg`, so it is neither shareable nor movable |

One .NET-specific landmine: if someone has set a shared `BaseOutputPath` or `ArtifactsPath`
in `Directory.Build.props`, every worktree writes build output to the same place and you get
the collision anyway. Check before you scale up.

### The bare repo layout

```bash
git clone --bare git@github.com:org/repo .bare
echo "gitdir: ./.bare" > .git
git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
git fetch origin
git worktree add main
git worktree add feat-payments -b feat-payments
```

```
repo/
├── .bare/           # the object database
├── .git             # a file: "gitdir: ./.bare"
├── main/            # just a worktree
└── feat-payments/   # also just a worktree
```

That third command is not optional. `git clone --bare` sets **no** fetch refspec, so
without it `git fetch` populates no remote-tracking branches and you will spend twenty
confusing minutes wondering where `origin/main` went.

**Why bother?**

- **No privileged checkout.** In the normal layout your original clone owns the real `.git`
  directory and every other tree hangs off it. Delete it by accident and you've deleted the
  repository. Here, `main` is an ordinary worktree — remove it, recreate it, nobody cares.
- **One folder is the project.** The normal layout sprawls siblings — `../feat-x`, `../feat-y`,
  `../fix-z` — through your projects directory, with nothing indicating they're related.
  Bare layout nests them, and `rm -rf repo/` disposes of everything cleanly.
- **Git works from the root.** The `.git` file means `git fetch` and `git worktree list` run
  from the top level, even though it isn't a worktree.
- **It matches the mental model.** A shared database plus N disposable workspaces, with no
  copy that's more "real" than the others. Which is exactly the story this talk is telling —
  for agents, no checkout should be special.

Cost: the setup ritual, that refspec footgun, and the occasional tool that assumes a normal
clone.

### Submodules: where the isolation stops

Two problems, both verified rather than folklore.

**They don't come along.** `git worktree add` leaves submodule directories empty. Every new
tree needs `git submodule update --init --recursive` by hand — one more reason tree creation
should be a script, not a command.

**They aren't isolated.** A submodule's git dir lives in the *superproject's* common
directory:

```console
$ cat libs/sub/.git
gitdir: ../../.git/modules/libs/sub
```

`.git/modules/` is shared by every worktree. So the isolation you bought at the top level
does not reach all the way down: two trees pinning different submodule commits are contending
over the same submodule state. `git worktree repair` fixes pointers after moves, but it
doesn't fix the underlying sharing.

If you're on submodules and going parallel: test it hard before betting a workflow on it.
This is one of the better arguments for package registries over submodules.

# Parking lot

Candidate topics, none currently in the cut. Written up to be argued about later.

### Jujutsu (`jj`)

The "here's where this is heading" slide. `jj` is git-backed — `jj git init --colocate`
adopts an existing repository, so this isn't a migration — and its equivalent of worktrees
is *workspaces*. But the interesting part isn't the workspaces, it's the model underneath,
which happens to remove three of this talk’s problems by construction:

- **No staging area.** The working copy *is* a commit, re-snapshotted on every command.
  "The agent staged the wrong files" stops being a category of error that can occur.
- **Automatic snapshots plus an operation log.** Every repository operation is recorded and
  reversible — not just file changes, but rebases, merges, and branch moves. An agent
  cannot destroy work, and you can undo a bad *operation*, not just a bad commit.
- **Conflicts are first-class objects.** A rebase always succeeds; the conflict is recorded
  in the resulting commit and resolved whenever you like. In a world of N agents rebasing
  against a moving `main`, "the rebase never blocks" is a structural change to the merge-queue
beat, not
  a convenience.

Read together: most of what we're bolting onto git for agents, `jj` already treats as the
default. **Verdict: excellent closing slide, dangerous middle slide.** It opens a second
front — half the room won't know it, and "consider replacing your VCS" is a large ask in
five minutes. Best as a single forward-looking beat after the real close, if at all.

### Sparse checkout and partial clone

The strongest candidate, because it reinforces the architects/implementers split in Act 3
instead of adding a topic.

```bash
git clone --filter=blob:none git@github.com:org/monorepo    # history without the blobs
git sparse-checkout set --cone apps/web libs/ui             # materialise only this slice
```

Crucially, **sparse-checkout settings are per-worktree** (see the shared/per-tree table),
so every agent's tree can carry a different cone. On a large monorepo that's the difference
between eight trees being unthinkable and being routine: eight 200 MB slices instead of
eight 4 GB clones.

The conceptual payoff is better than the disk saving, though. "Disjoint blast radii" stops
being an instruction you give an agent and becomes a property of its filesystem — it cannot
edit, or even read, code that was never materialised. That is context engineering by way of
git plumbing: a smaller tree is also a smaller space for an agent to wander into.

Caveats: `--filter` needs server support (GitHub has it), and build tools or IDEs that assume
a complete checkout will need convincing. **Verdict: the one I'd actually add.** It costs
about forty seconds and makes the "disjoint blast radii" argument land harder.

### Containers as the next step of isolation

"Worktrees aren't free" established that they aren't hermetic. This generalises it into a spectrum:

```
worktree        →  devcontainer       →  remote VM / cloud session
filesystem         + ports, services     + CPU, network, blast radius
                     toolchain versions
```

Each step isolates more and costs more. Worktrees do nothing about ports, databases, global
caches, the version of Node on your PATH, or anything an agent does *outside* the repository
— `npm i -g`, docker state, system files. Containers cover that; remote sessions cover the
machine itself.

The useful framing is a rule rather than a recommendation: **isolate at the cheapest level
that separates the thing actually colliding.** Most teams need worktrees plus a bootstrap
script, not a container per agent. **Verdict: one line inside "Worktrees aren’t free", not
its own slide.**
Low novelty — everyone already knows containers exist — but it stops the "why not just use
Docker?" question from derailing Q&A.

### `git rerere`

Small, practical, chronically underused.

```bash
git config rerere.enabled true
```

Git records how you resolved a conflict and replays that resolution automatically when the
same conflict reappears. With a merge queue this is worth more than it looks: agents rebase
repeatedly against a moving target and hit *the same conflict* on every retry. Enable rerere
and you resolve it once.

There's a neat tie-in with the shared/per-tree table — `rr-cache` lives in the common dir,
so it's shared across every worktree. Agent A's resolution silently helps agent B. That's
the sharing model working *for* you for once.

The catch is the same mechanism: it applies a remembered resolution quietly, so if the right
answer has changed since, you get a stale merge with no announcement. `git rerere diff` to
inspect, `git rerere forget <path>` to reset. **Verdict: a one-line "turn this on" aside
during the merge-queue beat.** Real value, no narrative weight.

### "Or don't branch at all"

The honest counter-argument, and worth taking seriously because the whole talk assumes
branch-per-agent.

Trunk-based development says the merge problem is self-inflicted: don't accumulate divergence
and you won't need machinery to reconcile it. Agents commit small increments straight to
main, incomplete work hides behind feature flags, integration happens continuously, and the
whole of Act 2 shrinks dramatically — there's no rebase race, no stale branch, no week of semantic
drift to discover at merge time.

What it costs: the guardrails have to be much stronger, because there's no branch quarantine — bad
code reaches main immediately. You've traded *merge* risk for *production* risk, which you
then manage with flags and progressive delivery. Whether that's a good trade depends on how
much you trust your guardrails, which is a nice callback.

And note what survives: agents still need separate working directories even when every one of
them targets main. **Branches are the optional part; worktrees aren't.** That's the sharpest
line in this section and it arguably belongs in the talk regardless.

**Verdict: worth thirty seconds of steelmanning.** Naming the strongest objection yourself
makes everything before it more credible.
