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

### The tooling has already conceded this point

You don't have to take my word for it — watch what the agent tools ship:

- Claude Code can run each parallel subagent in its own worktree, as a built-in option.
  Not a blog-post workaround; a flag.
- Agent-oriented editors keep growing "run these sessions in parallel" modes, and every
  one of them lands on a worktree or a container underneath.
- A small industry of wrappers has appeared to make them ergonomic — `phantom`,
  `git-worktree-switcher`, worktree panels in GitKraken and lazygit.
- GitButler bets the *other* way: one directory, multiple virtual branches applied at
  once. Different answer, same admission.

A plumbing command from 2015 became a checkbox in AI tooling in about eighteen months.
That's the ecosystem agreeing on what the contended resource actually is: **the filesystem.**

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

## Appendix: worktrees in depth

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
- **Show the shared/per-tree table with `stash` boxed in red.** Fifteen seconds, genuinely
  surprising, and it sets up rung 2 perfectly: worktrees isolate the *filesystem*, and every
  problem after that is something they didn't isolate.
- **Rung 2 is your backup slide.** Skip it in the talk; someone will corner you about
  `.env` files afterwards, and you'll want it.
- **Name Bors and the year.** It sets up the close two beats early, and people remember
  the callback.

The appendix is your Q&A ammunition — commands, `node_modules` vs `bin/obj`, the bare
layout, submodules. Expect the `node_modules` question every single time.
