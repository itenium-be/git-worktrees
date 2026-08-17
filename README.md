# Git Worktrees

*A lightning talk about parallel AI agents, and how every solution breeds the next problem.*

The structure is a ladder. Each rung solves the problem below it and creates the one
above it. The punchline is at the top: none of these problems are new, and the last
bottleneck is one you can't buy your way out of.

---

## 0. Non-deterministic AI slop

**Problem.** The agent is fast, confident, and occasionally wrong in ways that look
right. It invents a helper that already exists three packages over. It "fixes" a test
by weakening the assertion. Output varies run to run, so you can't even reproduce the
mistake to explain it.

**Solution: guardrails and backpressure.**

You can't review your way out of this. The volume is against you and always will be.
The move is to make the machine's mistakes *mechanically detectable* — every convention
you'd otherwise state in prose becomes something that fails a build:

| Concern | Guardrail |
| --- | --- |
| Style, formatting, obvious smells | linters, formatters, git hooks |
| "Did it actually test anything?" | mutation testing |
| Layering, dependency direction | ArchUnit, dependency-cruiser, import rules |
| Cross-service assumptions | contract tests (Pact) |
| Repo conventions | CLAUDE.md, skills, Claude Code hooks |
| Whole classes of bug | types, exhaustive matching, `strict` everything |

Backpressure is the key word. Not "the agent should be careful" — a wall it hits.

**And now the next problem:** one guarded agent works well. So you run several.

---

## 1. Agents trampling each other

**Problem.** Three Claude sessions, one working directory. It goes wrong immediately:

- one runs `git add .` and commits another's half-finished refactor
- one runs `git checkout main` and vaporises everyone's uncommitted work
- two run the test suite at once against the same build output
- `git stash` — from the wrong session, at the worst moment

The failure isn't that they write bad code. It's that the *filesystem* is shared mutable
state and nobody is holding a lock.

**Solution: git worktrees.**

One checkout per agent, all backed by the same object store.

```bash
git worktree add ../feat-payments -b feat-payments
git worktree add ../fix-flaky-test -b fix-flaky-test
git worktree list
git worktree remove ../feat-payments
```

What you get:

- **Cheap.** No re-clone. One `.git` directory, shared objects and refs. The new tree's
  `.git` is a *file* containing a pointer to `.git/worktrees/<name>`.
- **Isolated.** Separate index, separate HEAD, separate working files. `git add .` in one
  tree cannot see the other.
- **Locked, for free.** Git refuses to check out a branch that's already checked out in
  another worktree. Normally that error is an annoyance. Here it's the feature: it's a
  mutex on branches, enforced by git, that stops two agents landing on the same one.

Worth showing live: `git worktree list` with four trees, then `cat ../feat-payments/.git`
to reveal the pointer. It demystifies the whole thing in about five seconds.

**And now the next problem:** the trees are isolated. Rather more isolated than you wanted.

---

## 2. Worktrees are not hermetic

This is the rung people skip in the blog posts, and the one that actually burns you on
day one.

**Problem.** Worktrees copy what git tracks. Everything git *ignores* is exactly what
your app needs to run:

- no `.env`, no local certs, no `appsettings.Development.json`
- no `node_modules`, no `venv`, no `target/`, no `bin/obj`
- your editor/IDE per-project settings, gone

And then, once you get them running, they collide anyway:

- both agents want port 3000, and port 5432
- both point at the same dev database, and one of them runs the destructive migration test
- `docker compose` uses the directory name as the project name — until it doesn't, and
  then two stacks fight over one set of container names
- testcontainers, file watchers, build caches — all racing
- eight copies of `node_modules` is real disk, and eight test suites is a real CPU spike
  on a laptop

**Solution: treat tree creation as provisioning, not as a checkout.**

A bootstrap script that runs on every `worktree add`:

```bash
cp ../main/.env .env                       # or symlink, if it's stable
export COMPOSE_PROJECT_NAME=$(basename "$PWD")
export PORT=$((3000 + $(git rev-list --count HEAD) % 100))   # or any per-tree allocation
npm ci
```

`direnv` per tree, a devcontainer, or a nix shell all do this more properly. In Claude
Code, a `SessionStart` hook is the natural home for it: the agent's environment is
correct before it types anything.

The mental shift is the point: **a worktree is an environment, not a folder.**

**And now the next problem:** four agents, four green branches. Now land them.

---

## 3. Merging N green branches

**Problem.** Every branch is green. That means nothing.

Agent A's branch was green against `main@abc`. While its 12-minute suite ran, agent B
landed. Now A must rebase, re-run, and hope it wins the race this time. With two agents
it's annoying. With six, nobody ever finishes — you spend the whole day rebasing, and
the branch that gets merged is simply the one whose tests happened to be shortest.

Worse, the *merged* state was never tested. `main` goes red from a combination that no
CI run ever saw.

**Solution: a merge queue.**

The rule it enforces — Graydon Hoare called it "the not rocket science rule of software
engineering", and it is genuinely the whole idea:

> Automatically maintain a repository of code that always passes all the tests.

Not "test the branch". Test the *state that would exist after merging*, and merge only
that exact state. The queue serialises the landing, does the rebase for you, and re-runs
against the real target. Speculative execution lets it test several candidates optimistically
in parallel and throw away the losers.

GitHub merge queue, Mergify, Graphite, Zuul — and Bors, which was doing this in **2014**.
Which is the first hint of where this talk ends up.

**And now the next problem:** you've made landing safe. You've also made it a single lane.

---

## 4. The queue is the new bottleneck

**Problem.** Twenty agents, a fifteen-minute pipeline, one lane. The maths is brutal and
the queue backs up for hours. Agents are idle waiting to land, or worse, they keep working
and the diffs get staler.

Then flakiness stops being annoying and becomes fatal. A speculative batch of five goes
red because of one flaky test; the queue can't tell who's guilty, so it bisects, re-runs,
and burns an hour attributing blame for a failure that wasn't real. The queue's entire
premise is *red means guilty*. A flaky test is an attack on that premise.

**Solution: make CI fast and make it honest.**

- test impact analysis — only run what the diff can affect (Bazel, Nx, Turborepo)
- shard and parallelise; buy the runners, they're cheaper than the engineers waiting
- fail fast, cache aggressively
- **auto-quarantine flakes.** Detect, tag, exile to a non-blocking lane, file the ticket.
  A flaky test is worse than a deleted test, because a deleted test doesn't lie to you.

**And now the next problem:** everything's green, everything's merged, and the product
is broken.

---

## 5. Semantic conflicts

The best material in the talk. Give it the most time.

**Problem.** Git merges *text*. Agents write *meaning*. Both branches green, merge clean,
zero conflict markers, product broken:

- Both agents add a migration numbered `003_`. Git sees two different filenames. Your
  migration runner sees a coin flip.
- Both add the same dependency, at different versions, in different lockfile sections.
- Agent A relaxes a function's contract — it now returns `null` in a case it never used to.
  Agent B, in a different file, writes a caller that assumed it never did. No textual
  overlap. Nothing to conflict.
- Both invent a `UserService`. Different packages. Both correct. Both merged. Now there
  are two, and the next agent picks the wrong one.

Even a merge queue only half-saves you: it tests the merged state, so it catches this
*if you have a test that would notice*. For the duplicate `UserService`, you don't.

**Solution: partly tooling, mostly architecture.**

Tooling: timestamp or hash your migration names instead of sequencing them. Lockfile
discipline. Contract tests for the cross-boundary assumptions. ArchUnit for "there is
exactly one of these, and it lives here".

But the real fix is **disjoint blast radii** — giving each agent a slice of the codebase
that can't semantically collide with the others. Which is to say: your ability to run
agents in parallel is bounded by how well your codebase decomposes.

If everything routes through one 4,000-line service class, you get one agent. That was
always true for humans too. You just never ran ten of them at once, so you never found out.

**And now the next problem:** it all lands, and you have no idea what's in it.

---

## 6. The human is the constraint

**Problem.** Eight agents, eight PRs an hour, one of you. You start skimming. Then you
start trusting the green check. The slop you built all those guardrails against gets in
anyway — laundered through a passing pipeline and your own fatigue.

**Solution: stop reviewing everything equally.**

- **Risk-based review.** A diff touching auth, money, or migrations gets human eyes.
  A copy change and a test refactor do not.
- **Hard size limits.** A PR the agent can explain in three sentences. Stacked PRs to
  keep them that way.
- **Review the interface and the tests, not the implementation.** If you trust the
  guardrails from rung 0, the implementation is the least interesting part of the diff.
  What matters is: is this the right seam, and does the test actually pin the behaviour?
- Agent-authored PR descriptions that state what was tried and what was ruled out.

**And now the next problem:** the same mistake, three times, by three agents.

---

## 7. Lessons die with the session

**Problem.** Agent A spends twenty minutes discovering that this repo's ORM does something
cursed with lazy loading. It works around it, correctly. The session ends. That knowledge
is gone. Agent B rediscovers it tomorrow, and works around it differently, and worse.
Parallel agents don't just fail to share context — they actively diverge, and the codebase
grows three dialects.

**Solution: memory belongs in the repo, not the session.**

> If you've told an agent something twice, it belongs in the repo.

CLAUDE.md, skills, ADRs. And better than any prose: encode it as a rule that fails the
build, because a convention that's merely *documented* is a convention that's optional.
Which is rung 0 again — the ladder closes.

---

## The close

Look at what's on this list. Worktrees are per-developer checkouts. A merge queue is Bors,
2014. Contract tests are microservices, 2015. Quarantining flakes, trunk-based development,
small reviewable diffs, writing your conventions down — every rung is something the industry
built for *human* teams, decades ago, and then half-adopted because you could get away with
half-adopting it.

AI didn't invent new problems. It turned the dial from five developers to fifty and made
every latent weakness in your process load-bearing.

And watch where the bottleneck goes as you climb:

```
agent speed  →  machine resources  →  merge throughput  →  review capacity  →  architecture
```

You can buy your way out of the first four. Faster models, bigger runners, more lanes,
more reviewers.

> **Your codebase's parallelism ceiling is your architecture.
> AI just found it.**

---

## Running this as a lightning talk

Five minutes is four beats, not eight.

**Cut to: 0 → 1 → 3 → 5, then the close.** Slop, worktrees, merge queue, semantic
conflicts, bottleneck migration.

Notes on delivery:

- **Rung 1 is the title, so demo it.** `git worktree list` with four trees and
  `cat ../some-tree/.git` costs thirty seconds and does more than a diagram.
- **Rung 5 is the strongest material.** Nobody sees semantic conflicts coming. Lead with
  the duplicate migration number — it gets a laugh of recognition, and the laugh tells you
  the room has lived it.
- **Rung 2 is your backup slide.** Skip it in the talk; someone will corner you about
  `.env` files afterwards, and you'll want it.
- **Name Bors and the year.** It sets up the close two beats early, and people remember
  the callback.
