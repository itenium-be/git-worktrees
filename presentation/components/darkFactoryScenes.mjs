import { series as termSeries, seriesStages } from './termScenes.mjs'

export const series = termSeries.map((t) => ({ ...t, title: 'The Dark Factory' }))

export const stagesDarkFactory = seriesStages.map(({ at, title, lines, quip }, i) =>
  i === 2 ? { at, title, lines, quip, note: 'we are here' } : { at, title },
)

export const architectWaiting = [
  {
    title: 'Ubuntu',
    icon: 'ubuntu',
    at: 0,
    panes: {
      id: 'architect',
      focusAt: 0,
      fontSize: '0.7rem',
      lines: [
        '> /architect',
        '',
        "● I've read the architect skill and the bd cheatsheet,",
        "  and I'm waiting for your idea.",
      ],
      prompt: {
        session: 'parnas',
        lines: [
          'In Portal, we need a new thing: indienen ziektebriefje.',
          'This is very much like indienen onkosten.',
          'User enters a start/end date and uploads a file',
          'There is an admin screen for it.',
          'first create html mocks & then the spec, then beadify it.',
          '',
          "I'm doing a presentation, so I don't have time to answer your questions",
          'this is a best effort kind of thing -- do not disappoint me',
          'or the audience will mock me when I show them the results.',
        ].map((text) => ({ at: 1, text })),
      },
    },
  },
]

const workABead = (at, aside) => [
  { at, text: '> /work-a-bead', aside },
  { at, text: '' },
  { at, muted: true, text: '● Bash(bd ready --claim --exclude-type epic,land,spec,' },
  { at, muted: true, text: '       showcase --exclude-label needs:human --json &&' },
  { at, muted: true, text: '       bd dolt push)' },
]

// Gone once the Stop hook's /clear lands in hammer's window.
const firstBead = [
  ...workABead(0),
  { at: 1, muted: true, text: '● Bash(bd show projects-7kq4)' },
  { at: 1, text: '  ⎿ Ziektebriefje: contract, DTOs, fixtures' },
  { at: 2, muted: true, text: '● Bash(git worktree add … -b projects-7kq4)' },
  { at: 2, muted: true, text: '● Write(SickNoteContractTests.cs)' },
  { at: 2, muted: true, text: '● Bash(dotnet test)' },
  { at: 2, text: '  ⎿ Failed: 4, Passed: 0' },
  { at: 3, muted: true, text: '● Write(SickNoteDtos.cs, sickNotes.ts, fixtures)' },
  { at: 3, muted: true, text: '● Bash(dotnet test && bun run test && bun run lint)' },
  { at: 3, text: '  ⎿ Passed: 412 · 88 test files · 0 warnings' },
  { at: 4, muted: true, text: '● Bash(git commit && git push -u origin projects-7kq4)' },
  { at: 4, muted: true, text: '● Bash(bd create "Land projects-7kq4" --type land)' },
  { at: 4, muted: true, text: '  ⎿ ✓ Created issue: projects-a91d' },
  { at: 5, text: '' },
  { at: 5, text: '● Done: 1 bead in the land queue (projects-a91d →' },
  { at: 5, text: '  projects-7kq4, rc 0.39.0-rc.1).' },
  { at: 5, text: '  weld takes it from here.' },
]

// Muted is the noise of a working agent; the plain lines are the beats the audience should catch.
export const implementerClaiming = [
  {
    title: 'Ubuntu',
    icon: 'ubuntu',
    at: 0,
    panes: {
      id: 'implementer',
      focusAt: 0,
      tail: true,
      fontSize: '0.7rem',
      lines: [
        ...firstBead.map((l) => ({ ...l, until: 7 })),
        ...workABead(7, '      ← tender: tmux send-keys'),
        { at: 7, muted: true, text: '● Bash(bd show projects-x8fj)' },
        { at: 7, text: '  ⎿ Ziektebriefje: admin page' },
      ],
      prompt: {
        session: 'hammer',
        color: '#d98a8a',
        lines: [{ at: 6, until: 7, text: '/clear', aside: '      ← Stop hook: tmux send-keys' }],
      },
    },
  },
  {
    title: 'Tongs',
    icon: 'ubuntu',
    at: 8,
    shownAt: 8,
    panes: {
      id: 'tongs',
      focusAt: 0,
      tail: true,
      fontSize: '0.7rem',
      lines: [
        ...workABead(0, '      ← tender: tmux send-keys'),
        { muted: true, text: '● Bash(bd show projects-4mzt)' },
        { text: '  ⎿ Ziektebriefje: SickNote table + migration' },
      ],
      prompt: { session: 'tongs', color: '#d98a8a', lines: [] },
    },
  },
  { title: 'Chisel', icon: 'ubuntu', at: Infinity, shownAt: 8, panes: { lines: [] } },
]

// Steps of the land skill: claim the oldest land bead, rebase in _land, gate the rebased tree,
// fast-forward local main. An app's main stays local; pushing is the deploy.
export const welding = [
  {
    title: 'Ubuntu',
    icon: 'ubuntu',
    at: 0,
    panes: {
      id: 'weld',
      focusAt: 0,
      tail: true,
      fontSize: '0.7rem',
      lines: [
        { text: '> /land', aside: '      ← tender: tmux send-keys' },
        '',
        { muted: true, text: '● Bash(bd list --type land --sort created --reverse)' },
        { text: '  ⎿ projects-a91d · Land projects-7kq4' },
        { at: 1, muted: true, text: '● Bash(bd update projects-a91d --claim --actor weld)' },
        { at: 1, muted: true, text: '● Bash(bd show projects-a91d)' },
        { at: 1, text: '  ⎿ review: APPROVE · branch projects-7kq4' },
        { at: 2, muted: true, text: '● Bash(git -C _land checkout --detach origin/…7kq4' },
        { at: 2, muted: true, text: '       && git -C _land rebase main)' },
        { at: 2, text: '  ⎿ Successfully rebased and updated detached HEAD.' },
        { at: 3, muted: true, text: '● Bash(green-gate.sh --json Portal/…/_land)' },
        { at: 3, text: '  ⎿ PASS · build · test · lint · typecheck · format' },
        { at: 4, muted: true, text: '● Bash(git -C Portal merge --ff-only 3e1c9b2)' },
        { at: 4, text: '  ⎿ Fast-forward main → 3e1c9b2' },
        { at: 4, muted: true, text: '● Bash(bd close projects-a91d projects-7kq4' },
        { at: 4, muted: true, text: '       -r "landed 3e1c9b2 on main" && bd dolt push)' },
        { at: 5, text: '' },
        { at: 5, text: '● Landed projects-7kq4 on main (3e1c9b2).' },
        { at: 5, text: "  main stays local: pushing is Wouter's call." },
      ],
      prompt: { session: 'weld', color: '#b98be0', lines: [] },
    },
  },
]

// The observe skill's sources, in the order it reads them. One error signature is one bead, and a
// red pipeline, a failed deploy or a stack trace goes in at P0.
export const sparkSources = [
  { at: 1, name: 'CI/CD', tool: 'GitHub Actions · gh run list', line: '✗ itenium-ui · publish · build' },
  { at: 2, name: 'Deploys', tool: 'Coolify · deploy logs', line: '✗ Portal · health check timed out' },
  { at: 3, name: 'Backend', tool: 'Loki · {app="backoffice"} |= "Error"', line: 'NullReferenceException ×37' },
  { at: 4, name: 'Frontend', tool: 'GlitchTip', line: 'TypeError: file is undefined ×12' },
]

export const sparkBeads = [
  { at: 5, id: 'projects-v3qe', prio: 'P0', title: 'itenium-ui CI: publish · build failing', labels: ['repo:ui', 'observed'] },
  { at: 5, id: 'projects-j6tk', prio: 'P0', title: 'Portal deploy: health check failing', labels: ['repo:portal', 'observed'] },
  {
    at: 5,
    id: 'projects-n2wb',
    prio: 'P0',
    title: 'BackOffice: NullReferenceException in InvoiceMatcher.Score',
    labels: ['repo:backoffice', 'observed'],
  },
  {
    at: 5,
    id: 'projects-z9fy',
    prio: 'P0',
    title: 'Portal: TypeError in SickNoteForm',
    labels: ['repo:portal', 'observed', 'needs:human'],
  },
]

export const sparkArchitect = {
  at: 6,
  name: 'Hoare',
  who: 'the designated architect, only while a human is watching',
}

// One per tmux session, in the colours of their input boxes on the role slides.
export const fleetWindows = [
  { name: 'parnas', color: '#d9ad0b', bead: '—' },
  { name: 'hammer', color: '#d98a8a', bead: 'projects-x8fj' },
  { name: 'tongs', color: '#d98a8a', bead: 'projects-4mzt' },
  { name: 'chisel', color: '#d98a8a', bead: 'projects-2hd9' },
  { name: 'weld', color: '#b98be0', bead: 'projects-a91d' },
  { name: 'spark', color: '#6a9bcc', bead: 'sweep' },
]

// The worktrees deck's three monitors, in reading order per screen: left 2×2, middle 1×2, right 1.
export const fleetScreens = [
  { name: 'weld', color: '#b98be0' },
  { name: 'hammer', color: '#d98a8a' },
  { name: 'spark', color: '#6a9bcc' },
  { name: 'tongs', color: '#d98a8a' },
  { name: 'parnas', color: '#d9ad0b' },
  { name: 'fowler', color: '#d9ad0b' },
  { name: 'hoare', color: '#d9ad0b' },
]

// Lights off: the fleet still runs, but the screens only show the architects, where the humans talk.
export const fleetScreensDark = [
  { name: 'brooks', color: '#d9ad0b' },
  { name: 'conway', color: '#d9ad0b' },
  { name: 'parnas', color: '#d9ad0b' },
  { name: 'fowler', color: '#d9ad0b' },
  { name: 'hoare', color: '#d9ad0b' },
]

// What Bellows has to answer, and the page that half-answers it today. `needle` is how far along
// that answer is, in degrees: -80 empty, 80 full.
export const bellowsQuestions = [
  { text: 'What is the fleet doing?', page: 'Dashboard', needle: 30 },
  { text: 'What should I be doing?', page: 'Observed', needle: -20 },
  { text: 'What should I be testing?', page: 'Verify', needle: 0 },
  { text: 'What are the blockers?', page: 'Unblocks', needle: -40 },
  { text: 'What is the roadmap?', page: 'Plan', needle: -60 },
]

export const ziektebriefjeBeads = [
  { id: 'projects-7kq4', title: 'contract: DTOs, types, fixtures', lane: 'contract', x: 11, y: 50 },
  { id: 'projects-4mzt', title: 'SickNote table + migration', lane: 'backend', x: 37, y: 24, after: ['projects-7kq4'] },
  { id: 'projects-9bqe', title: 'consultant endpoints', lane: 'backend', x: 63, y: 10, after: ['projects-4mzt'] },
  { id: 'projects-c1rw', title: 'admin endpoints', lane: 'backend', x: 63, y: 37, after: ['projects-4mzt'] },
  { id: 'projects-2hd9', title: 'consultant page', lane: 'frontend', x: 63, y: 63, after: ['projects-7kq4'] },
  { id: 'projects-x8fj', title: 'admin page', lane: 'frontend', x: 63, y: 90, after: ['projects-7kq4'] },
  {
    id: 'projects-6pav',
    title: 'e2e: submit → verwerkt',
    lane: 'e2e',
    x: 89,
    y: 50,
    after: ['projects-9bqe', 'projects-c1rw', 'projects-2hd9', 'projects-x8fj'],
  },
]

// Click-for-click with implementerClaiming: hammer hands its bead to weld, claims the next one, and
// only then does the rest of the fleet show up. `dim` keeps the eye on the bead that just changed.
export const implementerGraph = {
  'projects-7kq4': [
    { at: 0, state: 'ready' },
    { at: 1, state: 'claimed', owner: 'hammer' },
    { at: 2, state: 'claimed', owner: 'hammer', note: 'worktrees/projects-7kq4' },
    { at: 5, state: 'done' },
  ],
  'projects-a91d': [
    { at: 0, state: 'hidden' },
    { at: 5, state: 'landing', owner: 'weld' },
    { at: 7, state: 'landing', owner: 'weld', dim: true },
  ],
  'projects-x8fj': [
    { at: 7, state: 'claimed', owner: 'hammer' },
    { at: 8, state: 'claimed', owner: 'hammer', dim: true },
  ],
  'projects-4mzt': [{ at: 8, state: 'claimed', owner: 'tongs' }],
  'projects-2hd9': [{ at: 8, state: 'claimed', owner: 'chisel' }],
}

export const implementerBeads = [
  ...ziektebriefjeBeads,
  { id: 'projects-a91d', title: 'land projects-7kq4', lane: 'land', x: 37, y: 102, after: ['projects-7kq4'] },
]
