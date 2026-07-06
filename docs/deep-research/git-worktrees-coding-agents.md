# Git Worktrees for Coding Agents

> Deep-research report — 24 sources, 115 claims extracted, 25 adversarially verified (24 confirmed, 1 refuted).

## 1. What a worktree is (the mechanics)

A git worktree lets **one repository check out multiple branches at once**, each in its own linked working directory. Linked worktrees **share the object database and refs** (history, packed-refs) but keep **per-worktree HEAD, index, and logs**. Git refuses by default to check out the same branch in two worktrees (overridable with `--force`). Stable since git 2.5 (2015).

```bash
git worktree add -b feature/auth ../project-auth main   # new branch off main
git worktree add ../hotfix origin/main                  # existing ref
git worktree add -d ../inspect v1.2.0                    # detached HEAD
git worktree list
git worktree remove ../project-auth
git worktree prune                                       # clean stale metadata
```

Target path must not be a non-empty existing dir. Per-worktree state lives in `.git/worktrees/<id>/` (its own HEAD, index, logs). *[git-scm.com/docs/git-worktree — primary, empirically verified on git 2.43]*

**The prune gotcha:** if you `rm -rf` a worktree instead of `git worktree remove`, the stale entry lingers — `git checkout <branch>` and `git branch -d` both fail with `already used by worktree` until you run `git worktree prune`. *[verified, reproduced]*

## 2. Why worktrees suit parallel agents

Most AI agents assume **exclusive access to the project directory**. Two agents in one directory read the same files, generate edits independently, and **the last write silently erases the other's** — an invisible failure. Give each agent its own worktree and:

- **Edits never touch another session's files** — confirmed verbatim in Claude Code's official docs. *[code.claude.com/docs/en/worktrees]*
- **Private index per worktree** eliminates `.git/index.lock` contention — a stale lock in one worktree does **not** block index ops in another. *[verified: planted lock blocked main repo `git add` but not the sibling worktree]*
- **Silent overwrites become ordinary git merge conflicts** — detectable at merge/rebase time instead of vanishing. *[verified]*
- **Shared object store** = cheap on disk vs. full clones (5 worktrees, one object DB, one `git fetch` updates all).

**Scope nuance (important for accuracy):** "can't see the other's work" is the *working-tree* view only. Uncommitted/untracked files are invisible cross-worktree — but **committed changes, refs, and stash ARE shared and visible**, and an agent can still path-traverse into `../other-worktree/file`.

## 3. Tooling — running agents across worktrees

**Claude Code has first-party support** *[primary docs, current ~v2.1.200]*:

```bash
claude -w feature-payments      # creates .claude/worktrees/feature-payments/
claude -w feature-auth          #   on branch worktree-feature-auth, starts Claude there
```

- `--worktree`/`-w` auto-creates an isolated worktree under `.claude/worktrees/<value>/` on branch `worktree-<value>`.
- Subagents: add `isolation: worktree` to frontmatter → temporary worktree, **auto-removed when the subagent finishes with no changes**.
- A `WorktreeCreate` hook can relocate worktrees; `.worktreeinclude` (gitignore syntax) copies untracked files (e.g. `.env`) into new worktrees.

**Patterns:**

- **One agent per terminal**, each pointed at its own worktree (e.g. Claude Code in one, Codex in another). The common manual approach.
- **Orchestration skills** like [parallel-worktrees](https://github.com/spillwavesolutions/parallel-worktrees) fan multiple Claude agents across worktrees ("a team of AI engineers"). *[medium confidence — single-source, vendor framing, no independent benchmark]*

## 4. Pitfalls & limitations

**The headline limitation: worktrees isolate CODE state, not RUNTIME state.** *[verified, self-evident from git's design]*

Two worktrees each have their own checkout but still collide on everything the OS/runtime governs:

- **Ports** — both try to bind `localhost:3000`; second fails `EADDRINUSE`.
- **Databases/migrations** — same `DATABASE_URL`, migrations stomp each other.
- **Shared `.git` state** — hooks, refs, stash, packed-refs locks are shared, *not* isolated.
- **`node_modules`** — each worktree needs its own install (they share the object DB, not the working dir).

> **A claim was actively refuted (0-3):** the popular framing that a worktree is "an isolated filesystem sandbox with no collisions on files, branches, or build locks" **overstates it.** It does not isolate runtime resources, shared `.git` state, or dependencies. Don't repeat this claim uncritically. *[refuted vs. mindstudio.ai blog]*

A real team ([Trigger.dev](https://trigger.dev/blog/parallel-agents-gitbutler)) **abandoned worktrees** for parallel Claude Code on a large TS monorepo — per-worktree `npm install`, port allocation, Docker Compose, and cleanup scripts cost more than the parallelism was worth.

## 5. Best practices

- **Sibling-directory layout** (`../project-auth`) so shared scripts work team-wide.
- **Keep the main worktree clean** as a stable reference.
- **Use worktrees for PR review** instead of stashing.
- **Solve runtime collisions explicitly**: per-worktree `.env`, dynamic port assignment, containerized dev servers, or separate DB schemas per worktree.
- **Always `git worktree remove`** (not `rm -rf`); `prune` if you slip.

## Confidence & gaps

**Rock-solid** (primary sources + empirically reproduced): findings 1–3, the runtime-isolation limitation, and Claude Code's flag/frontmatter. **Softer** (vendor blogs, unbenchmarked framing): the parallel-agent productivity narrative and third-party orchestration efficacy.

**Open questions the research couldn't close:**

1. **Submodules across worktrees** — named as a gotcha but no verified claim survived (shared vs. per-worktree `.git/modules`).
2. **`node_modules` strategy** — per-worktree install vs. shared store (pnpm) — no verified pattern survived.
3. **Runtime-isolation techniques** — no benchmarked solution to the port/DB collision problem.
4. **Measured outcomes** — at what agent count does shared-`.git` contention + merge overhead outweigh the parallelism benefit? No data.

## Sources

### Primary
- [git-worktree documentation](https://git-scm.com/docs/git-worktree) — canonical reference
- [Run parallel sessions with worktrees — Claude Code Docs](https://code.claude.com/docs/en/worktrees)

### Secondary / tooling
- [GitKraken — git worktree](https://www.gitkraken.com/learn/git/git-worktree)
- [GitWorktree.org — prune tutorial](https://www.gitworktree.org/tutorial/prune) · [best practices](https://www.gitworktree.org/guides/best-practices) · [submodules](https://www.gitworktree.org/guides/submodules)
- [parallel-worktrees skill](https://github.com/spillwavesolutions/parallel-worktrees)

### Blogs / case studies
- [MindStudio — multiple agents without conflicts](https://www.mindstudio.ai/blog/git-worktrees-parallel-ai-coding-agents)
- [mabd.dev — the secret weapon](https://medium.com/@mabd.dev/git-worktrees-the-secret-weapon-for-running-multiple-ai-coding-agents-in-parallel-e9046451eb96)
- [Augment Code — parallel AI agent execution](https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution)
- [Penligent — worktrees need runtime isolation](https://www.penligent.ai/hackinglabs/git-worktrees-need-runtime-isolation-for-parallel-ai-agent-development/)
- [Trigger.dev — we ditched worktrees](https://trigger.dev/blog/parallel-agents-gitbutler) (contrarian)
- [Laurent Kempe — from 3 worktrees to N on Windows](https://laurentkempe.com/2026/03/31/from-3-worktrees-to-n-ai-powered-parallel-development-on-windows/)
