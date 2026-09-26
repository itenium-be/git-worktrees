Git Worktrees: One Repo, N Coding Agents
========================================

FrontMania, 2026-10-06 — 20 minutes, AI track.

Material for the session on running several coding agents against one repository: what dies
when they share a checkout, what `git worktree` brings back, and why merging becomes the next
bottleneck.

- [Elevator pitch](ElevatorPitch.md) — abstract, audience, takeaways
- [Dark Factory demo](DarkFactoryDemo.md) — the live build that runs through the three-deck session

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

The Dark Factory session runs three decks from the same project, in this order:

| Deck                             | Run                         |
| -------------------------------- | --------------------------- |
| `presentation/guardrails.md`     | `bun run dev:guardrails`    |
| `presentation/slides.md`         | `bun run dev`               |
| `presentation/dark-factory.md`   | `bun run dev:dark-factory`  |

The live demo that runs through all three — prompts, bead hold, deploy — is
[`DarkFactoryDemo.md`](DarkFactoryDemo.md).

The worktrees deck is `presentation/slides.md`. Every visual slide is a local Vue component in
`presentation/components/`, and all of their content — terminal panes, gravestones, merge-race
lines, queue branches — lives in `presentation/components/termScenes.mjs`.

## Docs

`docs/` is background material, written for a 50-slide three-act version that was cut down to
the current deck. The arguments survive; the slide numbers do not.

| Path                         | What                                                                       |
| ---------------------------- | -------------------------------------------------------------------------- |
| [`talk.md`][talk]            | Long-form script of the three-act version — the source for the wording     |
| [`rough-slides.md`][rough]   | The 50-slide Slidev draft that came out of that script                     |
| [`superpowers/specs/`][spec] | Slide list, budget and cut order for the three-act version                 |
| [`superpowers/plans/`][plan] | Implementation plan for building it                                        |
| [`deep-research/`][research] | Four verified reports: worktrees, operations, strategy, Claude Code config |
| [`prototypes/`][proto]       | Throwaway aesthetic bake-off, never given a verdict                        |
| [`midjourney-raw/`][mj]      | Source renders for the cover art                                           |
| [`FrontMania/`][fm]          | Venue template and speaker photo                                           |

[talk]:     docs/talk.md
[rough]:    docs/rough-slides.md
[spec]:     docs/superpowers/specs/2026-09-20-slide-list-design.md
[plan]:     docs/superpowers/plans/2026-09-20-worktrees-deck.md
[research]: docs/deep-research/
[proto]:    docs/prototypes/
[mj]:       docs/midjourney-raw/
[fm]:       docs/FrontMania/
