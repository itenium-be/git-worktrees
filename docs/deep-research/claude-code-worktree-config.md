# Claude Code — Worktree-Specific Config

> Source: presenter notes from the *Extending Your Agent* talk (`2026-07-01-Extending-Your-Agent/presentation/slides.md`). These are Claude Code settings/behaviors around its native worktree support — beyond the `-w` flag and `isolation: worktree` frontmatter covered in the main report.

## Worktree creation settings

These tune what `claude -w` / `isolation: worktree` produce when a worktree is created:

| Setting              | Purpose                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| `symlinkDirectories` | Symlink dirs (e.g. `node_modules`) into the new worktree instead of reinstalling — the speedup answer to the per-worktree dependency-install problem |
| `sparsePaths`        | In monorepos, only check out certain directories — smaller, faster worktrees   |
| `baseRef`            | Start the worktree from `HEAD` or from `origin/main`                            |
| `.worktreeinclude`   | gitignore-syntax file listing untracked files (e.g. `.env`) to copy into new worktrees |
| `WorktreeCreate` hook | Relocate/customize the worktree on creation                                   |

**Note on `symlinkDirectories`:** this is Claude Code's built-in take on the round-1 open question "per-worktree install vs. shared store." Symlinking `node_modules` sidesteps N reinstalls, but symlinked deps are shared mutable state — fine for read-only `node_modules`, a footgun if a build writes into it or branches need different dependency versions.

## Managing multiple worktree sessions

- **`/color` & `/rename`** — colorize and name each session so parallel worktrees are distinguishable at a glance. The intended combo: one colored/named session per `git worktree`.
- **`/tui fullscreen` & `/focus`** — zen mode for a single worktree session.

## WSL gotchas (Wouter's environment)

- **`footerLinksRegexes`** requires `FORCE_HYPERLINK` on WSL.
- **`preferredNotifChannel`** has poor Windows support — use a custom notification hook instead.
- **Keybindings with `"EDITOR": "vim"`** on WSL need path-translation handling, or the editor launch breaks.
- `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1` — env var, unrelated to worktrees but noted alongside.

## Reference

- [obra/superpowers — using-git-worktrees SKILL.md](https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md)
