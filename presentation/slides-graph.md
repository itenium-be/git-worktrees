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

<GraphTitle />

::image::

![](./images/cover-art.jpg)

---
layout: agenda
items:
  - The parallel-agent problem
  - Worktrees in 90 seconds
  - Wiring up the agents
  - The catch — and the fix
  - Merging it all back
---

---
layout: section
---

# N agents, one directory

::subtitle::

Last write wins — silently

---
layout: default
---

<GraphCollision />

<!-- HERO. Three agents (Claude, Codex, Gemini) rush the same working-tree tip. Claude writes last and wins; the other two commit-nodes flicker and fade red with × marks. Agents assume exclusive access to the working dir — same directory means the failure is invisible until you notice code vanished. No error. No conflict. Just missing code. -->

---
layout: default
---

<GraphSplit />

<!-- HERO / centrepiece. One trunk node splits into three parallel working trees (feat/auth, feat/api, feat/ui) over a glowing shared .git core. Shared object database + refs — no re-clone. Per-worktree HEAD and index. Same branch can't be checked out twice (git blocks it). Stable git feature since 2.5 (2015); a linked worktree's .git is a file pointing back via GIT_COMMON_DIR. -->

---
layout: code
code-size: 0.85em
---

# The whole API

```bash
git worktree add -b feat/auth ../auth main   # new branch, new dir
git worktree list                            # what's checked out where
git worktree remove ../auth                  # clean up
git worktree prune                           # forgot remove & rm -rf'd? fix it
```

<!-- prune is the one gotcha: rm -rf leaves stale metadata that blocks re-checkout until pruned. -->

---
layout: default
---

# Why it fits agents

<v-clicks>

- **Private index per worktree** → no `.git/index.lock` fights
- Silent overwrites become **ordinary merge conflicts** — detectable
- Shared object store → cheap: N worktrees, not N clones
- An agent can't see another's uncommitted mess

</v-clicks>

<!-- Runtime isolation is the next slide's problem; here the win is filesystem + index isolation. -->

---
layout: default
---

<GraphWiring />

<!-- HERO (light). `claude -w feature-auth` creates .claude/worktrees/feature-auth/ on branch worktree-feature-auth. Pin a subagent with `isolation: worktree` in its frontmatter (temp worktree, auto-removed if untouched). Each agent works in its own worktree in parallel; commit dots stream along each colored branch. One agent per terminal is the common manual pattern. Ecosystem: crystal/Nimbalyst, dmux, git gtr, agentsmesh. -->

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

# The catch — and the fix

<v-clicks depth="2">

- `node_modules` is per-worktree & gitignored → **install every time**
  - `pnpm` content-addressable store → near-free extra worktrees
- Two dev servers, one `:3000` → `EADDRINUSE`
  - port per worktree: `BASE + INDEX*10 + OFFSET`
- Secrets don't copy across
  - `.worktreeinclude` pulls `.env` into each new worktree
- Lockfiles always conflict
  - `pnpm install` auto-reconciles; or per-branch lockfiles

</v-clicks>

<!-- Runtime collision is a bigger killer than file collision. Submodules are the sharpest edge: worktree creation never auto-inits them. -->

---
layout: comparison
---

# When *not* to: virtual branches

<div class="cols">
<div class="col">

### Git Worktrees

- Separate dir per branch
- Real filesystem isolation
- Pay: install + ports each time

</div>
<div class="col">

### GitButler

- All branches in **one** working dir
- Assign each change to a branch
- One `node_modules`, one server

</div>
</div>

<!-- Virtual branches attack the per-worktree overhead directly — but they do NOT guarantee conflict-free merges. Two virtual branches can still touch the same lines. -->

---
layout: default
---

<GraphMerge />

<!-- HERO. The three branches curve back into one merge node on the trunk — clean merge, green check. Keep PRs small (200–400 lines review best). Stacked PRs → stack-aware merge queue (CI once, fast-forward the stack). No proven ceiling on parallel agents — measure your own. "GitButler guarantees clean merges" and a fixed "max N" both failed fact-checking; don't repeat them. -->

---
layout: quote
---

# One repo. N agents.<br>Real conflicts instead of silent ones.

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
