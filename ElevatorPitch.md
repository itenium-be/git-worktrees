Git Worktrees & Merge Queues: One Repo, N Coding Agents
=======================================================

## Abstract

Part 2 of the Dark Factory series. Two coding agents in one checkout
quietly destroy each other's work. `git worktree` gives each agent its own checkout, and with its
own ports and testcontainer, its own environment. Scale to 6+ agents and the bottleneck moves:
every branch is green against a main that has since moved. Enter the merge queue, until the
queue becomes the bottleneck too.


## Target Audience

Developers already running one or more coding agents who have felt the friction
and want to know how to have more agents working in parallel.


## Key Takeaways

- Multiple agents in one checkout is a data race: last write wins, `checkout` moves, `stash` vanishes
- A worktree is an environment, not a folder — own ports, hardlinked `node_modules`, own testcontainer
- Green against a `main` that has moved is not green. The fix is to serialize the landing


## Session Format

20 minutes
