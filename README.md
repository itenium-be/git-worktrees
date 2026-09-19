Git Worktrees: One Repo, N Coding Agents
========================================


Werk van op reis staat hier:
origin/claude/git-worktrees-talk-qov18y



1 Merge queue (the actual fix)

This is precisely the problem merge queues exist to solve. You mark a PR ready; the queue:
- rebases/merges it onto the current main tip,
- runs tests on that exact combination,
- merges atomically only if main hasn't moved (and re-runs if it did).

The human never races main — the bot does, serially. Options:
- GitHub merge queue (built in, if you're on GitHub) — least setup.
- Mergify — more flexible, batching/optimistic merging.
- bors-ng / Kbot / GitLab merge trains depending on host.

2 If you can't add a queue yet: rebase + FF-only + retry

- git rebase origin/main instead of merging main in (linear, easier to re-do).
- Merge with --ff-only. If it's rejected because main moved, that's the signal to git
fetch && git rebase and retry. Cheap when rebases are clean.
- Accept the occasional retry loop — a queue just automates exactly this.

3 Reduce the race window

- Push the branch and let CI test the merge result, not your local worktree, so "tested"
and "on the server" are closer together.
- Land smaller/faster PRs so the test window is short enough that main rarely moves during
it.
- Keep worktrees rebased frequently so each integration is tiny.




## Presentation

```bash
cd presentation
bun install
bun run dev
```

Update the theme:
```bash
cd presentation/theme
git pull
```
