# Git Worktrees for Coding Agents — Strategy, Alternatives & Integration

> Round-3 deep-research report — 26 sources, 122 claims extracted, 25 adversarially verified (22 confirmed, **3 refuted**). Companion to `git-worktrees-coding-agents.md` and `git-worktrees-advanced.md`; targets the strategic/framework questions the first two rounds couldn't answer.

**Headline:** the field has converged on a shape. GitButler virtual branches are the leading *architectural* alternative to worktrees; the integration endgame is **stacked PRs → stack-aware merge queues**; coordination is **precise task decomposition + a growing orchestrator ecosystem**; lockfile conflicts have a native pnpm fix. The one thing nobody can answer with evidence: **the concurrency ceiling** — no "run N agents" number survived verification.

## 1. Alternatives & when NOT to use worktrees

**Worktrees' three verified costs** (the decision-framework core — cost rises with service count and install cost):

- **(a) Fresh dependency install per worktree** — `node_modules` is gitignored, so each needs its own `npm/pnpm install`. Non-trivial in large monorepos.
- **(b) Runtime collisions** — dev servers, DBs, and services (Redis, ClickHouse, Elasticsearch) collide on the same ports/instances. *Solvable* with per-worktree `.env`/port scripts, but that's setup overhead.
- **(c) Silent conflict accumulation** — physically separate dirs let parallel branches diverge; conflicts only surface at merge. (Applies to any divergent branches; worktrees amplify it.)

**GitButler virtual branches — the primary architectural alternative** *[gitbutler docs = primary]*: multiple branches applied to **ONE** working directory simultaneously; individual file/hunk changes are **logically assigned** to branches and committed separately. One filesystem tree = one `node_modules` = one running process → **the per-branch install/port overhead simply doesn't exist**. This is exactly why Trigger.dev switched to it for parallel Claude Code.

> ⚠️ **Refuted claim (0-3):** GitButler does **NOT** structurally guarantee clean merges. The idea that its single-working-dir model "prevents two applied branches from holding conflicting work" was refuted — two virtual branches can still touch the same lines; it just surfaces them in one tree instead of at merge time. Don't oversell this in the talk.

### Decision table

| Situation | Prefer |
| --------------------------------------------------- | ------------------------------------------------- |
| Many concurrent branches, heavy per-branch install/services | **GitButler virtual branches** (one dir, one install, one server) |
| Agents need genuine filesystem isolation / different dep versions | **Worktrees** (each branch its own tree + index) |
| Total dependency/runtime isolation, "works on my machine" parity | **Devcontainers / Docker-per-agent** |
| Untrusted or long-running autonomous agents | **Cloud/remote sandboxes** |
| One quick context switch, nothing running | **plain `git stash` / branch switch** |

*(Rows for devcontainers, cloud sandboxes, and stash are structurally sound but were less deeply sourced than the worktree/GitButler rows — treat as directional.)*

## 2. The integration endgame

**Stacked PRs are the dominant pattern**, in two architectures:

| Model | Tool | Mechanism |
| ------------------------- | ------------------- | -------------------------------------------------------------- |
| One branch per PR | **Graphite** | Each branch targets the one below; `gt create/up/down/restack` |
| One branch, many commits | **Mergify / Gerrit** | Each commit → a PR via a **`Change-Id`** trailer that survives rebase/amend/split/reorder |

**GitHub now ships native stacked-PR support** — stack map + enforcement in the PR UI, no extension needed. *[gh-stack docs; but private-preview/waitlist as of April 2026, not GA]*

**Stack-aware merge queues** *[Graphite blog/docs]*: run CI **once on the stack head** (which contains all changes), then fast-forward-merge every PR in the stack **atomically, in order**, if tests pass — avoiding the per-PR rebase-and-CI of traditional queues. Mergify's queue adds batching, priority lanes, speculative checks, queue freeze.

**Small PRs win** *[medium confidence]*: 200–400-line PRs had ~40% fewer defects and ~3× faster approval (GitHub's 1.5M-PR analysis — promotional, but the 200–400 LOC sweet spot is independently corroborated by SmartBear/Cisco over 15+ years).

> ⚠️ **Refuted (1-2):** the claim that traditional merge queues inflate a 5-PR stack from 30 min → 3 hr via dependent-PR eviction did **not** hold up — it's vendor framing.

## 3. Coordination patterns

**Precise task decomposition is the conflict-minimizing lever** *[Anthropic's own multi-agent engineering writeup = primary]*. Each agent needs: an **objective**, an **output format**, tool/source guidance, and **clear task boundaries**. Without this, agents duplicate work — Anthropic observed subagents running the *exact same searches* (under-specified "research the semiconductor shortage" → one chased the 2021 crisis while two duplicated 2025 work).

**Boundary condition for when NOT to parallelize:** domains where all agents need the *same shared context*, or with many *inter-agent dependencies*, are a poor fit — dependencies serialize the work (Amdahl-style). Corroborated by Cognition's anti-multi-agent argument.

**Orchestrator ecosystem** (worktree-based, run Claude Code / Codex / Gemini CLI in parallel worktrees): **crystal (now Nimbalyst)**, **dmux** (tmux + worktrees), **parallel-code**, **agentsmesh** (PTY sandboxes + worktree isolation), **thurbox**, **Jean**. Plus `git gtr` from round 2.

**Beyond file-level isolation — symbol-level locking:** **`wit`** uses Tree-sitter AST parsing so agents declare intents and acquire **function/class/type-level locks** (not whole-file), emitting Intent-Overlap / Lock-Intersection / Dependency-Chain warnings.

## 4. Conflict avoidance at the source (lockfiles)

Lockfile conflicts are the canonical always-conflicts generated file — **~20% of PRs** hit them in one 700-package pnpm monorepo (single practitioner's estimate). Two remedies *[pnpm primary docs]*:

- **Baseline auto-reconcile:** after a `pnpm-lock.yaml` conflict, just run `pnpm install` at the repo root and commit — never hand-edit the YAML. (Review the result; pnpm builds from the most-updated lockfile.)
- **Native prevention — git branch lockfiles** (`gitBranchLockfile: true`): writes a **per-branch** file (`pnpm-lock.feature-1.yaml`) so concurrent branches never touch the same lockfile; reconcile later with `pnpm install --merge-git-branch-lockfiles`.

*(Caveat: config key had a bug — issue #9651, `useGitBranchLockfile` vs `gitBranchLockfile`; auto-merge occasionally needs manual resolution first.)*

## Still open after three rounds

1. **The concurrency ceiling** — the core quantitative ask. **No verified number** for how many parallel agents stay productive. The proposed "3–4 PRs per stack" limit was **refuted (0-3)**. Treat any specific "run N agents" figure as unsupported.
2. **Semantic/logical conflicts git can't detect** — beyond `wit`'s symbol locking, what actually catches "agent A renamed an API agent B still calls" before production? Unanswered.
3. **Independent (non-vendor) benchmarks** — GitButler vs worktrees vs Docker-per-agent on real throughput/failure rate. Corpus covered mechanisms, not measured outcomes.
4. **File-ownership at scale** — concrete partitioning (directory/codeowners boundaries) for monorepos where most changes touch shared infra.

> These are now genuinely at the edge of what's publicly documented (April 2026). #1 and #3 likely require first-party experimentation, not more searching — a good "live demo / we measured it ourselves" angle for the talk.

## Caveats on this round

Integration-endgame claims lean heavily on **vendor comparison pages** (Mergify, Graphite, GitButler, Trigger.dev). Where they describe a *mechanism*, the vendor is a valid primary source; where they assert *superiority* (e.g. Mergify "more configurable" — split 2-1 vote), it's positioning, not benchmarked. Three claims were refuted this round (see inline ⚠️) — the highest refute rate of the three rounds, reflecting how much of this space is vendor marketing.

## Sources

### Primary
- [GitButler — virtual branches](https://docs.gitbutler.com/features/branch-management/virtual-branches)
- [Mergify — Stacks vs Graphite](https://docs.mergify.com/stacks/compare/graphite/) · [GitHub gh-stack docs](https://github.github.com/gh-stack/)
- [Anthropic — multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [pnpm — git](https://pnpm.io/git) · [pnpm — git branch lockfiles](https://pnpm.io/git_branch_lockfiles)

### Tooling / ecosystem
- [awesome-agent-orchestrators](https://github.com/andyrewlee/awesome-agent-orchestrators) · [wit — symbol-level locking](https://github.com/amaar-mc/wit)
- [Graphite — first stack-aware merge queue](https://graphite.com/blog/the-first-stack-aware-merge-queue)

### Blogs / reports
- [Trigger.dev — parallel agents with GitButler](https://trigger.dev/blog/parallel-agents-gitbutler) · [GitButler — worktrees](https://blog.gitbutler.com/git-worktrees)
- [InfoQ — GitHub stacked PRs](https://www.infoq.com/news/2026/04/github-stacked-prs/)
- [Addy Osmani — code agent orchestra](https://addyosmani.com/blog/code-agent-orchestra/)
- [pnpm discussion #4324 — lockfile conflict frequency](https://github.com/orgs/pnpm/discussions/4324)
