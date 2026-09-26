Dark Factory — live demo runbook
================================

One feature, built live while the three decks run: **ziektebriefje indienen** in Portal.

| When                          | Where                  | What                                                    |
| ----------------------------- | ---------------------- | ------------------------------------------------------- |
| Day before                    | workspace terminal     | [Preflight](#1-preflight), [hold](#2-hold-every-other-bead), dress rehearsal |
| Before the Guardrails deck    | architect window       | [Prompt 1 — the mocks](#3-prompt-1--the-mocks)          |
| Mocks pop up (≈ 5–10 min)     | browser                | show them, straight back to the deck                    |
| End of the Guardrails deck    | same architect window  | [Prompt 2 — the beads](#4-prompt-2--the-beads)          |
| Worktrees deck                | fleet runs unattended  | implementers, `weld`, reviewer                          |
| Dark Factory deck             | Bellows `:5170`        | plan view, fleet, land queue, verify queue              |
| Last slide                    | Bellows Repos → Push   | [Deploy](#6-deploy), show portal.itenium.be             |
| After the talk                | workspace terminal     | [Restore](#7-restore)                                   |


## Scope of the feature

The ask was start date, end date and a file. What it needs beside that, and what it deliberately
leaves out so it lands inside one session:

| In                                                                    | Why                                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------------- |
| start + end date, inclusive, end ≥ start                              | the ask                                                    |
| one file: PDF / JPG / PNG, same limits as an onkosten receipt          | the ask — reuses the attachment store                      |
| optional opmerking                                                    | "verlenging", "hospitalisatie" — free text beats fields     |
| consultant sees own history + status                                  | otherwise "did it arrive?" is an email                      |
| admin list: Te verwerken / Verwerkt, filter per consultant, file preview | the second screen                                          |
| admin marks it **Verwerkt**                                           | the only state change                                      |

| Out                                                                     | Why                                                      |
| ----------------------------------------------------------------------- | -------------------------------------------------------- |
| email / Teams notifications                                             | a job and a dependency                                   |
| SD Worx push, BambooHR sync                                             | integrations — not landable in 40 minutes                |
| "mag de woning verlaten", type (ziekte / ongeval / kind ziek), half days | fine as a follow-up bead on stage, if someone asks       |
| edit or delete after submit                                             | system of record; a wrong one is a new one + an opmerking |


## 1. Preflight

Day before, and again an hour before.

```sh
cd ~/projects

bd list --status in_progress                  # empty — drain or release every claim first
bd list --type land                           # empty — weld lists land beads regardless of defer
git -C Portal fetch && git -C Portal log --oneline origin/main..main   # empty — or the demo push deploys it too
git -C Portal status --short                  # clean
systemctl --user is-active bellows.service    # active — no tender, no second bead per window
bd --version && bd defer --help | head -3     # the hold below was verified on bd 1.3.0
```

- Launch the windows in a permission mode that does not stop for `Write`, `bun`, `dotnet`,
  `explorer.exe` — a permission prompt on stage is a dead minute.
- Dress rehearsal: run prompts 1 and 2 end to end once, time it, then throw it away
  (`bd close` the demo beads with reason `rehearsal`, reset Portal's local `main`, delete the
  branches). Keep the rehearsal's mocks and a screen recording as the fallback.
- Decide the fleet size from the rehearsal: the graph is shaped for 4 implementers.


## 2. Hold every other bead

Defers every **open** bead that is not part of the demo, and records exactly which, so the restore
touches nothing that was already deferred before the talk.

```sh
cd ~/projects
bd list --status open --json --limit 0 |
  jq -r '.[] | select((.labels // []) | index("demo") | not) | .id' > .claude/state/demo-held.txt
wc -l < .claude/state/demo-held.txt
xargs -r bd defer --reason "held for the dark factory demo" < .claude/state/demo-held.txt
bd dolt push
bd ready --exclude-type epic,land,spec,showcase --exclude-label needs:human   # → nothing
```

The same thing as a prompt, for a window instead of a terminal:

```text
Put every open bead on hold for the demo. List open beads (`bd list --status open --json --limit 0`),
drop any labelled `demo`, write the remaining ids one per line to .claude/state/demo-held.txt, then
`bd defer` exactly those ids with reason "held for the dark factory demo". Do not touch in_progress,
closed or already-deferred beads. `bd dolt push`, then show me the count and a filtered `bd ready`,
which must be empty.
```


## 3. Prompt 1 — the mocks

Into a fresh architect window (`./start-rolling.sh architect`), once it has read the skill.

```text
Portal: ziektebriefje indienen. Best effort — ask me nothing. Wherever this leaves something open,
pick what onkosten / admin-onkosten already do, and list each such pick in a small "Aannames"
footer on the mock.

This step is mockups only: no spec, no beads, no app code.

Consultant screen — a consultant submits a sick note:
- van (start date) and tot en met (end date), both default today; end before start is refused inline
- one file, PDF/JPG/PNG, drag & drop or browse, like the onkosten receipt
- optional opmerking
- "Indienen", then a confirmation
- below it: my ziektebriefjes, newest first — periode, aantal dagen, bestand, ingediend op,
  status Ontvangen / Verwerkt

Admin screen — HR processes them:
- tabs Te verwerken / Verwerkt, with the open count on the first
- rows: consultant, periode, aantal dagen, ingediend op, bestand; filter on consultant
- clicking the file opens the same preview dialog as admin-onkosten
- "Markeer als verwerkt" per row

Match the Portal: read frontend/src/styles.css, the shell, the expenses and admin-expenses pages and
portal-mockup.png, and copy their header, navigation, colours, type and components. Dutch labels,
realistic fake data (7 rows, one of them spanning a weekend, one with an opmerking).

Two self-contained HTML files — no CDN, no build step — at
  Portal/docs/superpowers/specs/mockups/ziektebriefje-consultant.html
  Portal/docs/superpowers/specs/mockups/ziektebriefje-admin.html
Then open both in my Windows browser:
  explorer.exe "$(wslpath -w <file>)"
and stop. Say only which assumptions you made.
```


## 4. Prompt 2 — the beads

Same window, so it still has the mocks in context.

```text
Good. Turn it into beads now — best effort, no questions. Every decision below is mine and made; do
not file needs:human, do not ask.

1. Write the design straight from the mocks and this message — skip the brainstorming dialogue — to
   Portal/docs/superpowers/specs/<today>-ziektebriefje-design.md. Commit it on Portal's main
   together with the two mocks (docs only).

2. File the graph. Decided:
   - Product feature, Portal only. Every bead: `repo:portal` and `demo`. Epic "Ziektebriefje indienen".
   - A new SickNote table + EF migration is approved. The file goes through the existing attachment
     store, with the onkosten receipt's size and type limits. No new dependencies, no background job,
     no notifications, no edit or delete after submit.
   - Status is Ontvangen → Verwerkt, set by an admin; record who and when.
   - Consultant endpoints are scoped to the caller's own oid. Admin endpoints use the same policy as
     admin-onkosten. Days = calendar days, inclusive.
   - Menu: consultant page next to Onkosten, admin page next to admin-onkosten.
   - Tests: NUnit for the backend, vitest for the frontend, one Playwright e2e for submit → verwerkt.

3. Shape it for four implementers at once: first a contract bead (DTOs, frontend types, fixtures),
   then backend and frontend beads in parallel against it, the e2e last. Six to eight beads, each
   landable in about twenty minutes. Acceptance criteria as observable behaviour, per the skill.

4. `bd dolt push`, then show me `bd ready` and the graph.
```

Then start the fleet, if it is not running:

```sh
./start-rolling.sh fleet 4        # 4 implementers + weld + spark; the tender picks up the rest
```


## 5. During the Dark Factory deck

| Show                         | Where                                                        |
| ---------------------------- | ------------------------------------------------------------ |
| the epic's DAG, beads greying out as they land | Bellows `/plan`                            |
| who holds what               | Bellows fleet panel                                          |
| a worktree per bead          | Bellows `/repos` → Portal → worktrees                         |
| the reviewer's verdict       | the `weld` window                                            |
| what is waiting for me       | Bellows `/verify`                                            |

If a bead bounces on stage: that is the point of the deck, not a failure of the demo. Say so.


## 6. Deploy

Every demo bead closed, `bd list --type land` empty.

```sh
git -C ~/projects/Portal log --oneline origin/main..main    # only the ziektebriefje commits
```

Bellows `/repos` → Portal → **Push** — or `git -C ~/projects/Portal push origin main` from your own
terminal (the pre-push guard lets a tty through). Coolify builds on push; open
portal.itenium.be once the deployment goes green.

Portal is production, behind real Entra, and a system of record: what is deployed is live for every
consultant, and rows submitted during the demo stay.


## 7. Restore

```sh
cd ~/projects
xargs -r bd undefer < .claude/state/demo-held.txt
bd dolt push
rm .claude/state/demo-held.txt
```
