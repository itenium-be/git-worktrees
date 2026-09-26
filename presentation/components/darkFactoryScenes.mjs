import { seriesStages } from './termScenes.mjs'

export { series } from './termScenes.mjs'

export const stagesDarkFactory = seriesStages.map((s, i) => ({ ...s, note: i === 2 ? 'we are here' : undefined }))

export const loopNodes = [
  {
    at: 1,
    name: 'Architect',
    who: 'parnas · brooks · conway …',
    does: 'idea → bead graph with deps and acceptance criteria. Never code.',
    scar: 'the agent has local context and no taste',
  },
  {
    at: 2,
    name: 'Implementers',
    who: 'hammer · tongs · chisel …',
    many: true,
    does: 'claim a ready bead → own worktree → TDD → green branch',
    scar: 'two Claudes in one checkout',
  },
  {
    at: 3,
    name: 'Reviewer',
    who: 'fresh context, per branch',
    does: 'adversarial pass on the diff against the criteria',
    scar: 'nobody reads the diffs anymore',
  },
  {
    at: 4,
    name: 'weld',
    who: 'the lander, one of them',
    does: 'rebase → verify → merge main, one bead at a time',
    scar: 'green against a main that moved',
  },
  {
    at: 5,
    name: 'main',
    who: 'push = deploy',
    does: 'libraries: weld pushes. Apps: a human does.',
    scar: 'production is my call',
  },
]

export const loopFeedback = {
  at: 6,
  name: 'spark',
  who: 'the observer',
  does: 'logs & errors → beads. Never fixes.',
}

export const roles = [
  {
    title: 'Minds that decide',
    lines: [
      { at: 1, kind: 'keep', text: 'architects: the global view' },
      { at: 2, kind: 'drop', text: 'invent a decision, write crisp criteria' },
      { at: 3, kind: 'keep', text: 'adds surface? ask' },
    ],
  },
  {
    title: 'Tools that do',
    showAt: 4,
    lines: [
      { at: 4, kind: 'keep', text: 'implementers: one worktree per bead' },
      { at: 5, kind: 'keep', text: 'no criteria? bounce it' },
      { at: 6, kind: 'keep', text: '/clear after every bead' },
    ],
  },
  {
    title: 'One act that joins',
    showAt: 7,
    lines: [
      { at: 7, kind: 'keep', text: 'weld: the only one on main' },
      { at: 8, kind: 'keep', text: 'enforced by a hook, not a prompt' },
    ],
  },
]

const bdLines = [
  '$ bd ready --exclude-type epic,land,spec,showcase \\',
  '           --exclude-label needs:human',
  '',
  '○ projects-7kq4 ● P1 Ziektebriefje: contract, DTOs and fixtures',
  '',
  '$ bd ready --claim --json … | jq -r .title',
  'Ziektebriefje: contract, DTOs and fixtures',
  '',
  '$ git worktree add .claude/worktrees/projects-7kq4 -b projects-7kq4 main',
  "Preparing worktree (new branch 'projects-7kq4')",
  '',
  '$ bd create "Land projects-7kq4" --type land -l repo:portal',
  '$ bd dolt push',
]

const graphLines = [
  '$ bd dep add projects-2hd9 projects-7kq4',
  '✓ Added dependency: projects-2hd9 (Ziektebriefje: consultant',
  '  page) depends on projects-7kq4 (Ziektebriefje: contract) (blocks)',
  '',
  '$ bd show projects-2hd9',
  'spec: docs/superpowers/specs/…-ziektebriefje-design.md',
  '',
  '- end before start: inline error, Indienen disabled',
  '- a >10 MB file is refused before upload, same message',
  '  as the onkosten receipt',
  '- after Indienen the row is on top of the list, status',
  '  Ontvangen; vitest covers all three',
]

export const graph = [
  {
    title: 'Ubuntu',
    icon: 'ubuntu',
    at: 0,
    panes: {
      split: 'vertical',
      children: [
        { id: 'graph', focusAt: 1, lines: graphLines },
        { id: 'bd', focusAt: 2, lines: bdLines },
      ],
    },
  },
]

export const tender = [
  {
    title: 'Polling in bash, not in a context',
    lines: [
      { at: 1, kind: 'drop', text: 'N idle windows re-reading their context to learn nothing happened' },
      { at: 2, kind: 'keep', text: 'a Stop hook clears the window at the bead boundary' },
      { at: 3, kind: 'keep', text: 'a tender in bash pokes it when bd ready has work' },
      { at: 4, kind: 'keep', text: 'one drain flag: the off switch' },
    ],
  },
  {
    title: 'The land gate blocks on the build',
    showAt: 5,
    lines: [
      { at: 5, kind: 'drop', text: 'bounce on one red lint rule' },
      { at: 6, kind: 'cost', text: 'the fix for a red main is a bead behind the blockage' },
      { at: 7, kind: 'keep', text: 'red suite: land it, file a P0' },
      { at: 8, kind: 'keep', text: 'a broken build never lands' },
    ],
  },
]

export const stillBroken = [
  {
    title: "What's still broken",
    lines: [
      { at: 1, kind: 'cost', text: 'flaky tests still poison the queue' },
      { at: 2, kind: 'cost', text: 'the architect’s slices are not always as disjoint as it thought' },
      { at: 3, kind: 'cost', text: 'nobody has read some of this code' },
      { at: 4, kind: 'cost', text: 'the guardrails catch what I thought to write a guardrail for — and nothing else' },
    ],
  },
]

export const demoTimeline = [
  {
    title: 'Meanwhile, behind me',
    lines: [
      { at: 1, kind: 'keep', text: 'one prompt: ziektebriefje indienen — mock it, ask me nothing' },
      { at: 2, kind: 'keep', text: 'a second prompt: now the beads' },
      { at: 3, kind: 'keep', text: 'everything else in the graph: on hold' },
      { at: 4, kind: 'keep', text: 'since then: nobody touched a keyboard' },
    ],
  },
]
