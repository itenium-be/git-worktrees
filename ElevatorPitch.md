Git Worktrees: One Repo, N Coding Agents
========================================

## Abstract

Point two coding agents at one repository and they will quietly destroy each other's work —
not because either wrote bad code, but because a working directory is shared mutable state.
Git worktrees fix that in one command, and then the real trouble starts: ports collide, six
green branches are all green against a `main` that has since moved, and you are merging
faster than you can review. This talk follows that escalation to its conclusion — that
line-by-line review of agent output has to be replaced by mechanical guardrails, a merge
queue and a repair loop — and ends somewhere uncomfortable: your codebase's parallelism
ceiling turns out to be its architecture.

## Target Audience

Developers already running one or more coding agents who have felt the friction and suspect
it gets worse with more. No prior worktree knowledge assumed. The first half is hands-on
git; the second half is for anyone deciding what to automate.

## Key Takeaways

- A worktree is an environment, not a folder — provisioning one is the part nobody warns you about
- Share what the lockfile determines; never share what your source determines
- Humans review what is expensive to reverse: API surface, security, architecture. The rest is mechanical
- A guardrail that only warns is documentation. Every escape is a bug in your guardrails
- A dedicated merging session is a merge queue — and every fix here was invented for human teams decades ago

## Session Format

20 minutes
