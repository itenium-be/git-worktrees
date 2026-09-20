Git Worktrees: One Repo, N Coding Agents
========================================

## Abstract

Point two coding agents at one repository and they will quietly destroy each other's work —
not because either wrote bad code, but because a working directory is shared mutable state.
`git worktree` has fixed that since 2015: one checkout per agent, one object store, and with
separate ports and its own testcontainer each agent gets an environment instead of a folder.
So you scale up — nine agents, three screens — and the bottleneck moves. Every branch is green
against a `main` that has since moved, and you rebase, retest, and lose the race again. This
talk follows that escalation to the merge queue, and then past it: the queue becomes the next
bottleneck, so you stop gating every merge, and you stop reading how the code got written.

## Target Audience

Developers already running one or more coding agents who have felt the friction and suspect it
gets worse with more. No prior worktree knowledge assumed. Part of the Claude transformation
series — homelab, Linux migration, dark factory — this is the worktrees-and-merge-queues stage.

## Key Takeaways

- Two agents in one checkout is a data race: last write wins, `checkout` moves, `stash` vanishes
- A worktree is an environment, not a folder — own ports, hardlinked `node_modules`, own testcontainer
- Green against a `main` that has moved is not green. The fix is to serialize the landing
- A dedicated merging session is a merge queue — and then the queue is the bottleneck: merge on build, stabilize after
- Nobody reads how a function got written anymore. Spend the review on security, architecture, performance, test quality, API surface

## Session Format

20 minutes
