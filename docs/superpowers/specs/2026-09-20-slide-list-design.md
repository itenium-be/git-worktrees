# Slide list — Git Worktrees: One Repo, N Coding Agents

FrontMania, 2026-10-06. Twenty minutes. This is the agreed slide list; `docs/talk.md` remains
the script and stays the source of truth for wording.

## Decisions

The talk keeps its submitted title and runs the three-act arc from `docs/talk.md` underneath it.
Act 1 pays off the title with real worktree mechanics; "the bottleneck moved" is the hinge into
the back half, where the audience gets an argument they did not sign up for.

Act 3 is a tour of a system that exists and is running, with real screenshots and real numbers.
Nothing on those slides is aspirational.

The existing 10-minute deck in `presentation/slides.md` is a donor, not a base: slides 8, 9, 12,
13, 14, 15 below are adapted from it. Everything else is new.

Dropped: the GitButler / virtual-branches comparison slide. It cost 40 seconds, needed a
correctness check the talk cannot afford to get wrong on stage, and the deck now carries no
"when not to use worktrees" counterpoint — accepted, because the Q&A can hold it.

## Budget

| Act   | Title               | Slides | Runs | Ends  |
| ----- | ------------------- | ------ | ---- | ----- |
| Act 1 | It gets out of hand | 1–19   | 9:00 | 9:00  |
| Act 2 | The capitulation    | 20–36  | 7:00 | 16:00 |
| Act 3 | The loop            | 37–45  | 3:00 | 19:00 |
| Close | The ceiling         | 46–50  | 1:00 | 20:00 |

Fifty slides across twenty minutes averages 24 seconds. That only works because twelve of
them are `statement` or `quote` slides that hold the screen for eight. Act 3 is the
tightest: nine slides in three minutes, and 43 through 45 all want dwell time. If anything
overruns, it overruns here.

## Act 1 — It gets out of hand

| #  | Layout          | Beat                                                                                    |
| -: | --------------- | --------------------------------------------------------------------------------------- |
|  1 | `cover`         | Git Worktrees / One Repo, N Coding Agents                                               |
|  2 | `agenda`        | Agenda                                                                                  |
|  3 | `default-aside` | **Cold open:** one Claude. You spend most of your time waiting                          |
|  4 | `default-aside` | Two Claudes, split screen. Best hack you ever found — for twenty minutes                |
|  5 | `default`       | What breaks: `git add .`, `checkout main`, shared build outputs, a stray `stash`        |
|  6 | `statement`     | Neither agent wrote bad code. The working directory is shared mutable state             |
|  7 | `section`       | Worktrees                                                                               |
|  8 | `default`       | One checkout per agent, one object store. Per-tree HEAD and index                       |
|  9 | `code`          | `git worktree add / list / remove / prune`                                              |
| 10 | `code`          | 🪿 **Live demo** — `git worktree list`, then `cat ../feat/.git` is a *file*             |
| 11 | `code`          | The branch mutex: `fatal: already used by worktree at …`, free, enforced by git         |
| 12 | `code`          | Claude Code speaks worktree: `claude -w`, `isolation: worktree`                         |
| 13 | `statement`     | Worktrees isolate your **code**. Not your **runtime**                                   |
| 14 | `default`       | Everything git ignores is what your app needs: `.env`, certs, `node_modules`, `bin/obj` |
| 15 | `default`       | …and they collide anyway: `:3000`, one dev DB, `COMPOSE_PROJECT_NAME`, 8× disk          |
| 16 | `statement`     | A worktree is an **environment**, not a folder. Creating one is provisioning            |
| 17 | `code`          | The bootstrap: derive port from tree name, copy `.env`, `SessionStart` hook             |
| 18 | `quote`         | Share what the lockfile determines. Never what your source determines                   |
| 19 | `default-aside` | Six Claudes, three screens. Six green branches against a `main` that moved              |

Lands on: **the bottleneck moved — it is merging now.**

## Act 2 — The capitulation

| #  | Layout          | Beat                                                                                        |
| -: | --------------- | ------------------------------------------------------------------------------------------- |
| 20 | `section`       | Code review is dead                                                                         |
| 21 | `default`       | More diff per hour than is *possible* to read. You skim, you trust green, you approve       |
| 22 | `statement`     | **Fuck the code.** ← pause here                                                             |
| 23 | `VClickTable`   | Human keeps: API surface · security · architecture ‖ Machine takes: the rest                |
| 24 | `quote`         | Humans review what is expensive to reverse                                                  |
| 25 | `section`       | We're not complete animals                                                                  |
| 26 | `default`       | ① at the agent's hands: CLAUDE.md, skills, `PreToolUse` refuses ② at commit: hooks under 5s |
| 27 | `default`       | ③ at build: strict types, ArchUnit, OpenAPI diff, SAST, **mutation testing**                |
| 28 | `default`       | ④ at merge and after: queue, stabiliser, feature flags                                      |
| 29 | `quote`         | A guardrail must be able to say no by itself. Every escape is a bug in your guardrails      |
| 30 | `default-aside` | **War story: security** → *security is the absence of behaviour*                            |
| 31 | `default-aside` | **War story: architecture** → *the agent has local context and no taste*                    |
| 32 | `default`       | The merge queue. Test the state that would exist **after** merging                          |
| 33 | `statement`     | A dedicated session whose only job is merging **is** a merge queue                          |
| 34 | `default`       | Merge on build, stabilise later. Optimistic concurrency plus a reconciler                   |
| 35 | `default`       | **Git merges text. Agents write meaning.** Two `003_` migrations. Nothing conflicts         |
| 36 | `statement`     | Architects, implementers, a merger, a stabiliser — a control loop I run by hand             |

Slide 22 is the line the talk is built around. Pause after it. Half the room will think you have
lost it, which is the tension slides 25–29 then resolve.

## Act 3 — The loop

| #  | Layout          | Beat                                                                                     |
| -: | --------------- | ---------------------------------------------------------------------------------------- |
| 37 | `section`       | The loop                                                                                 |
| 38 | `default-aside` | **The realisation.** The specific straw, at the specific hour                            |
| 39 | `VClickTable`   | The roles: Architects · Implementers · Spark · Weld · Gauge · Dashboard                  |
| 40 | `default`       | The wiring diagram. *Every box on this diagram is a scar*                                |
| 41 | `quote`         | Decomposition stopped being a design preference and became my parallelism strategy       |
| 42 | `default`       | Where the memory lives: told an agent twice → it belongs in the repo, as a failing check |
| 43 | `default-aside` | **Dashboard screenshot**, framed to echo slide 19                                        |
| 44 | `default`       | What it costs. Real tokens, real money, real setup time                                  |
| 45 | `default`       | What's still broken. Two or three, genuinely unsolved                                    |

Slide 43 is the payoff shot. Compose it to echo slide 19 as directly as the framing allows.

## Close

| #  | Layout                   | Beat                                                                            |
| -: | ------------------------ | ------------------------------------------------------------------------------- |
| 46 | `default`                | Every fix here predates AI: Bors 2014, contract tests 2015, trunk-based dev     |
| 47 | `code`                   | `agent speed → filesystem → machine → merge throughput → review → architecture` |
| 48 | `statement`              | Your codebase's parallelism ceiling is your architecture. **AI just found it**  |
| 49 | `quote`                  | I stopped reviewing code. I review the system that writes it now                |
| 50 | `socials` `source` `end` | Outro                                                                           |

## Cut order

If it runs long, cut in this order. Slides 26 and 27 are never cut — they are the only part of
the talk that sends people home with something to do on Monday.

| Order | Slide    | What goes                                                                 |
| ----: | -------: | ------------------------------------------------------------------------- |
|     1 |       28 | Guardrail tier ④ — the merge queue slides cover it again                  |
|     2 |       34 | Stabiliser detail. The trade survives being stated once on 33             |
|     3 |       42 | Where the memory lives. Real, but it is the least load-bearing block      |
|     4 |       44 | Cost. Only if the room is already with you                                |
|     5 | 30 or 31 | One war story. Keep the one with the better reveal, not the worse outcome |

## Still to fill in

| Slide        | What is needed                                                   |
| ------------ | ---------------------------------------------------------------- |
| 3, 4, 19, 43 | Screenshots: one Claude, two Claudes, six Claudes, the dashboard |
| 30, 31       | The two war stories, one security and one architecture           |
| 38           | The moment you decided to automate the orchestration             |
| 39, 40       | What Spark, Weld and Gauge actually do, and the real wiring      |
| 42           | One lesson that became a hook, a lint rule or an ArchUnit test   |
| 44, 45       | Real cost numbers; two or three things genuinely still broken    |

## Open

The aesthetic bake-off in `presentation/prototypes/` has no verdict. Variants A (multiplayer
IDE), B (living git graph) and C (tmux command center) each have working Vue components under
`presentation/components/`, and `presentation/slides-ide.md`, `slides-graph.md` and
`slides-tmux.md` hold the five-beat storyline for each. The winner decides how slides 5, 6, 19
and 40 are drawn. Picking it is the next decision, and it blocks nothing before then.
