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
layout: default
---

<TmuxBoot />

<!--
TMUX COMMAND CENTER aesthetic. Boot log types out, ascii banner phosphor-glows in,
three agents (Claude / Codex / Gemini) attach. One repo, N coding agents.
-->

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

<TmuxCollision />

<!--
The collision. Three agents edit the SAME auth.ts. Their writes interleave in one
pane, glitch, then a SILENT OVERWRITE flash — the last writer (claude) survives and
the other two agents' lines vanish. No error. No conflict. Just missing code.
-->

---
layout: default
---

<TmuxSplit />

<!--
What is a worktree. The single main pane splits (Ctrl-b % then ") into three tmux
panes — feat/auth, feat/api, feat/ui — around one glowing shared .git core. Status
bar flips 1 window -> 3 windows.
- Shared object DB + refs — no re-clone
- Per-worktree HEAD + index
- Same branch can't be checked out twice (git blocks it)
Stable git feature since 2.5 (2015). A linked worktree's .git is a file pointing back
at the main repo via GIT_COMMON_DIR.
-->

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
h1:
  type: braces
  color: primary
  position: 3-4
---

# Why it fits agents

<v-clicks>

- **Private index per worktree** → no `.git/index.lock` fights
- Silent overwrites become **ordinary merge conflicts** — detectable
- Shared object store → cheap: N worktrees, not N clones
- An agent can't see another's uncommitted mess

</v-clicks>

<!-- Private index per worktree is the crux: agents stop fighting over one lock file. -->

---
layout: default
---

<TmuxWiring />

<!--
Claude Code speaks worktree. Each agent runs in its own worktree, in its own pane:
  claude -w feature-auth   ->  .claude/worktrees/feature-auth/  on branch worktree-feature-auth
...or pin a subagent in its frontmatter:  isolation: worktree  (temp worktree, auto-removed if untouched).
Commit hashes stream as each agent works. Private index -> no .git/index.lock fights;
silent overwrites become real merge conflicts. Ecosystem: crystal/Nimbalyst, dmux, git gtr, agentsmesh.
-->

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

<TmuxMerge />

<!--
Merging it all back. The three agent panes collapse into one; ascii art converges the
branches into main; MERGED ✓ pops; a fake `git merge --no-ff` output types out; status
bar returns to 1 window.
- Keep PRs small — 200–400 lines review best
- Stacked PRs -> stack-aware merge queue (CI once, fast-forward the stack)
- No proven ceiling on parallel agents — measure your own
("3-4 PRs per stack" and "GitButler guarantees clean merges" both failed fact-checking — don't repeat them.)
-->

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
