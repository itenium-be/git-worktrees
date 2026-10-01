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

## Backpressure

Old term from streams and queues; popularised for coding agents by Geoffrey Huntley's Ralph loop.

| Source                                       | What                                                   |
| -------------------------------------------- | ------------------------------------------------------ |
| [Huntley: Ralph][ralph]                      | 2025-07-14 — earliest agent use found                  |
| [LinearB: Ralph loops][linearb]              | Huntley's "back pressure engineering"                  |
| [Moss: Don't waste your back pressure][moss] | 2026-01-17 — stop being the agent's human backpressure |
| [SSW rule: back pressure for agents][ssw]    | Back pressure as AI guardrails                         |

[ralph]:   https://ghuntley.com/ralph/
[linearb]: https://linearb.io/blog/ralph-loop-agentic-engineering-geoffrey-huntley
[moss]:    https://banay.me/dont-waste-your-backpressure/
[ssw]:     https://www.ssw.com.au/rules/utilize-back-pressure-for-agents

## Agent factories

Others building what the Dark Factory deck builds by hand.

| Tool                            | What                                                                    |
| ------------------------------- | ----------------------------------------------------------------------- |
| [Gas Town][gastown]             | Yegge: coordinator, ephemeral workers, git-backed ledger, merge queue   |
| [Wasteland][wasteland]          | Federates Gas Towns: shared wanted board, validator stamps (2026-03)    |
| [Gas City][gascity]             | Gas Town extracted into an SDK for custom agent topologies (2026-04)    |
| [Claude Agent Teams][teams]     | Built into Claude Code: lead + teammates, shared task list, messaging   |
| [Ruflo][ruflo]                  | Formerly Claude Flow: orchestrator-worker swarms with persistent memory |
| [Multiclaude][multiclaude]      | Tmux + worktree per agent; every PR that passes CI gets merged          |
| [Augment Intent][intent]        | Coordinator, specialists and verifier working from a living spec        |
| [Antfarm][antfarm]              | YAML pipelines: planner, developer, verifier; stalled since 2026-02     |

[gastown]:     https://github.com/gastownhall/gastown
[wasteland]:   https://github.com/gastownhall/gastown/blob/main/docs/WASTELAND.md
[gascity]:     https://github.com/gastownhall/gascity
[teams]:       https://code.claude.com/docs/en/agent-teams
[ruflo]:       https://github.com/ruvnet/ruflo
[multiclaude]: https://github.com/dlorenc/multiclaude
[intent]:      https://www.augmentcode.com/guides/intent-walkthrough-prompt-to-merge
[antfarm]:     https://github.com/snarktank/antfarm

Parallel-session managers — a human drives each agent, one worktree each:

| Tool                            | What                                        |
| ------------------------------- | ------------------------------------------- |
| [Conductor][conductor]          | Mac app, dashboard plus diff-first review   |
| [Claude Squad][squad]           | Terminal UI on tmux                         |
| [Vibe Kanban][vibe]             | Kanban cards that run as agent attempts     |

[conductor]: https://conductor.build
[squad]:     https://github.com/smtg-ai/claude-squad
[vibe]:      https://www.vibekanban.com
