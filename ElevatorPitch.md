Six Agents, One main: Git Worktrees & Merge Queues
==================================================

## Abstract

While you're sipping margaritas, six coding agents are fixing bugs and shipping features.

One problem: they're fighting over `.git`. One agent is about to nuke your uncommitted work; another just swept
unrelated changes into its commit. Enter `git worktree`: an obscure, decade-old feature, suddenly becomes
table stakes, and it solves this elegantly.

Did I say one problem? The next bottleneck surfaces shortly after: all six want to merge to main. Merge queues:
another decade-old concept, until now something only the largest agile orgs ever needed; suddenly required
by the lone developer.


## Target Audience

Developers already running one or more coding agents who have felt the friction
and want to know how to have more agents working in parallel.


## Key Takeaways

- Multiple agents in one checkout is a data race: last write wins, `checkout` moves, `stash` vanishes
- A worktree is an environment, not a folder — own ports, hardlinked `node_modules`, own testcontainer
- Green against a `main` that has moved is not green. The fix is to serialize the landing


## Session Format

20 minutes
