# Git Worktrees for Coding Agents — Advanced / Operational Gaps

> Round-2 deep-research report — 23 sources, 110 claims extracted, 25 adversarially verified (24 confirmed, 1 refuted). Companion to `git-worktrees-coding-agents.md`; targets the operational gaps that round 1 left open.

**Headline:** git itself is the easy part. The two real operational gaps are **dependencies** and **runtime state**. Submodules are the sharpest edge. Three research angles — productivity thresholds, alternatives (GitButler etc.), and the N-branch integration endgame — remain **unanswered** (see bottom).

## 1. The sharing mechanism (precise version)

All worktrees share one object store, refs, packed-refs, and config via **`GIT_COMMON_DIR`** — in a linked worktree, `.git` is a *file* containing `gitdir: .../worktrees/<name>`. Only per-worktree files are isolated: **HEAD, index**, plus the exceptions `refs/bisect`, `refs/worktree`, `refs/rewritten`, `logs/HEAD`.

```bash
git rev-parse --git-common-dir   # → main repo's .git  (shared)
git rev-parse --git-dir          # → .git/worktrees/<name>  (per-worktree)
```

*[git-scm.com/docs/git-worktree — primary, verified on git 2.43. Stable since 2.5 (2015)]*

## 2. Submodules — the sharpest edge ⚠️

**Git officially recommends against this.** The `git-worktree` BUGS section, verbatim: *"Multiple checkout in general is still experimental, and the support for submodules is incomplete."* And: *"It is NOT recommended to make multiple checkouts of a superproject."*

**In practice (git ≥ 2.25) it works:** each **linked** worktree gets its own independent submodule gitdir under `.git/worktrees/<name>/modules/<sub>` — so different worktrees can pin the **same submodule to different SHAs** with no conflict. The *primary* worktree uses the legacy `.git/modules/<name>`. **Pre-2.25 shared submodule state and breaks.** *[verified on git 2.43: main and worktree held different submodule SHAs, no cross-effect]*

**The gotcha that bites everyone:** worktree creation does **NOT** auto-init submodules — the directories exist but are empty. Every new worktree must run:

```bash
git submodule update --init --recursive
```

*[reproduced; corroborated by real GitHub issue coleam00/Archon #1187 "Worktrees created from monorepos do not initialize git submodules"]*

**Mental model when agents touch submodules:** the authoritative contract is the **40-char SHA (gitlink)** recorded in the parent tree — `git ls-tree HEAD <path>` → `160000 commit <SHA>`. That's what CI and fresh `clone --recurse-submodules` resolve to. The `branch=` in `.gitmodules` is only an update target for `git submodule update --remote`; it does **not** change the pinned SHA. *[verified vs. gitsubmodules(7)]*

## 3. `node_modules` / dependency strategy

**Default:** `node_modules` is part of the working dir and gitignored → never checked out on worktree creation. **Each new worktree starts empty and needs its own install.** *[verified]*

**Don't naively symlink one `node_modules` across branches** — version conflicts and subtle bugs; only safe when branches have identical deps. Tools like Vite/Vitest choke on symlinked module resolution. *[3-0, one dissent on "requires"]*

**Recommended: pnpm's content-addressable store.** Each worktree keeps its own `node_modules` *tree* (deps stay isolated per branch), but all real package content is hard-linked from one shared store → near-zero extra disk per worktree.

- **`enableGlobalVirtualStore`** (experimental; pnpm 10.12+/v11, 2025): each worktree's `node_modules` contains **only symlinks** into `<store>/links/`. First install populates the store; subsequent worktree installs are nearly instant. *[pnpm primary docs]*
- **Caveats:** experimental, opt-in, disabled by default; breaks tools relying on strict ESM/`NODE_PATH` resolution; "nearly instant" assumes a warm cache (cold CI is slow); editing a file inside `node_modules` mutates the shared store (hard-link footgun).

> **Cross-reference:** this is the robust, tool-supported version of `symlinkDirectories` from the *Extending Your Agent* slides (see `claude-code-worktree-config.md`). `symlinkDirectories` shares whole dirs bluntly; pnpm's store gives per-worktree isolation *with* shared content — safer when branches diverge on dependency versions.

## 4. Runtime isolation (ports / databases)

**Bigger killer than shared files.** Concurrent worktrees collide on ports, databases, and env vars — git isolates none of it. Give each agent isolated runtime state:

- Separate **DB names** (`mydb_auth`, `mydb_api`) or in-memory DBs.
- Separate **ports** per dev server. Claude Code docs suggest a formula: `SERVICE_PORT = BASE_PORT + WORKTREE_INDEX*10 + SERVICE_OFFSET`.
- Separate **Docker containers** per worktree.
- Per-worktree **`.env`**.

*[Claude Code docs + multiple 2026 blogs; "shared runtime is a bigger killer than shared files"]*

## 5. Tooling to close the setup gap

**Claude Code `.worktreeinclude`** (gitignore syntax): auto-copies gitignored files (`.env`, `.env.local`, `config/secrets.json`) into each new worktree. **Only files that are both matched AND gitignored** are copied — tracked files never duplicated. It does **not** install deps or set up virtualenvs — *"Remember to initialize your development environment in each new worktree."* A `WorktreeCreate` hook **replaces** default behavior, so `.worktreeinclude` isn't processed when a hook is set. *[official docs]*

**`git gtr`** ([coderabbitai/git-worktree-runner](https://github.com/coderabbitai/git-worktree-runner)) — closes the rest:

- **`postCreate`** hook (e.g. `npm install` after creation) and **`postCd`** hook (re-source env in current shell).
- File-copy globs `gtr.copy.include` (e.g. `**/.env.example`), `--no-copy` flag, `git gtr copy` to sync env later.
- Launches editors (Antigravity, Cursor, VS Code, Zed) and AI tools (aider, auggie, claude, codex, continue, copilot, cursor, gemini, opencode) directly in the worktree.
- **JetBrains** support is only a "contribution opportunity" — not implemented.

*[tool's primary README, current 2026]*

## Refuted

- ❌ *"Each worktree keeps its own submodule checkout but the submodule `.git` metadata is **shared**."* (1-2) — superseded by the per-worktree-gitdir finding in §2: on git ≥ 2.25 the metadata is **not** shared; each linked worktree has its own submodule gitdir.

## Still open (this round did NOT answer)

The corpus returned essentially no verified claims for three of the seven requested angles. **Treat these as uncovered, not settled:**

1. **Productivity threshold** — at what agent/worktree count do ref contention, merge overhead, and human review load outweigh parallelism? No *measured* (non-anecdotal) data found.
2. **Alternatives & decision framework** — when to prefer GitButler virtual branches, full clones, devcontainers, or plain stash/branch-switching over worktrees. Unaddressed.
3. **Integration endgame** — reconciling N parallel agent branches into main: stacking, rebase/merge order, review workflow. Unaddressed.

Plus: which exact toolchains break under fully-symlinked `node_modules` (pnpm global virtual store production-readiness).

> These three gaps are the strongest candidates for a round-3 fan-out or hands-on experimentation — and #2/#3 are the most audience-relevant for the talk.

## Sources

### Primary
- [git-worktree docs](https://git-scm.com/docs/git-worktree) · [gitsubmodules(7)](https://git-scm.com/docs/gitsubmodules)
- [pnpm — git worktrees](https://pnpm.io/git-worktrees) · [pnpm — global virtual store](https://pnpm.io/global-virtual-store)
- [Claude Code — worktrees](https://code.claude.com/docs/en/worktrees)

### Secondary / tooling
- [GitWorktree.org — submodules](https://www.gitworktree.org/guides/submodules) · [node-modules](https://www.gitworktree.org/guides/node-modules)
- [coderabbitai/git-worktree-runner (`git gtr`)](https://github.com/coderabbitai/git-worktree-runner)

### Blogs
- [ben.abbitt.me — submodules, worktrees & prerelease deps](https://ben.abbitt.me/posts/submodules-worktrees-prerelease-deps/)
- [ashwch gist — worktrees + submodules](https://gist.github.com/ashwch/946ad983977c9107db7ee9abafeb95bd)
- [Penligent — runtime isolation](https://www.penligent.ai/hackinglabs/git-worktrees-need-runtime-isolation-for-parallel-ai-agent-development/)
- [Nicole van der Hoeven — submodules vs subtrees vs worktrees](https://notes.nicolevanderhoeven.com/Submodules+vs+subtrees+vs+worktrees+in+Git)
