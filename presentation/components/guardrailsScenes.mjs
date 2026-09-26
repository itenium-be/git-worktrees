import { seriesStages } from './termScenes.mjs'

export { series } from './termScenes.mjs'

export const stagesGuardrails = seriesStages.map((s, i) => ({ ...s, note: i === 0 ? 'we are here' : undefined }))

export const reallocation = [
  {
    title: 'Machine takes',
    lines: [
      { at: 1, kind: 'keep', text: 'formatting, style, naming' },
      { at: 2, kind: 'keep', text: 'correctness of the happy path' },
      { at: 3, kind: 'keep', text: 'coverage, duplication, dead code' },
    ],
  },
  {
    title: 'Human keeps',
    showAt: 4,
    lines: [
      { at: 5, kind: 'keep', text: 'API surface — what we commit to' },
      { at: 6, kind: 'keep', text: 'security — what cannot be un-leaked' },
      { at: 7, kind: 'keep', text: 'architecture — what we cannot cheaply undo' },
    ],
    tags: ['review what is expensive to reverse'],
    tagsAt: 8,
  },
]

export const twoRules = [
  {
    title: 'A guardrail must be able to say no by itself',
    lines: [
      { at: 1, kind: 'drop', text: 'a warning' },
      { at: 2, kind: 'cost', text: 'a warning is documentation' },
      { at: 3, kind: 'keep', text: 'backpressure: the agent cannot proceed' },
    ],
  },
  {
    title: 'Every escape is a bug in your guardrails',
    showAt: 4,
    lines: [
      { at: 5, kind: 'drop', text: 'I should review more' },
      { at: 6, kind: 'keep', text: 'that check did not exist yet' },
      { at: 7, kind: 'keep', text: 'go and write it' },
    ],
  },
]

export const whenTheyFire = [
  {
    title: "At the agent's hands",
    lines: [
      { at: 1, kind: 'keep', text: 'CLAUDE.md & skills' },
      { at: 1, kind: 'keep', text: 'hooks: refuse the edit' },
      { at: 1, kind: 'keep', text: 'plan before implement' },
    ],
  },
  {
    title: 'At commit',
    showAt: 2,
    lines: [
      { at: 2, kind: 'keep', text: 'gitleaks' },
      { at: 2, kind: 'keep', text: 'prettier + eslint, staged only' },
      { at: 3, kind: 'cost', text: 'under 5s, or --no-verify' },
    ],
  },
  {
    title: 'At build',
    showAt: 4,
    lines: [
      { at: 4, kind: 'keep', text: 'warnings are errors' },
      { at: 4, kind: 'keep', text: 'banned APIs, ArchUnit' },
      { at: 4, kind: 'keep', text: 'coverage ≥ 90%, e2e' },
    ],
  },
  {
    title: 'At merge & after',
    showAt: 5,
    lines: [
      { at: 5, kind: 'keep', text: 'merge queue' },
      { at: 5, kind: 'keep', text: 'adversarial reviewer' },
      { at: 5, kind: 'keep', text: 'logs → beads' },
    ],
  },
]

export const dialedTo11 = [
  {
    title: 'dotnet',
    lines: [
      { at: 1, kind: 'keep', text: 'TreatWarningsAsErrors' },
      { at: 1, kind: 'keep', text: 'AnalysisMode All' },
      { at: 2, kind: 'keep', text: 'Roslynator · Meziantou · Sonar · Threading · BannedApi' },
      { at: 3, kind: 'keep', text: 'NuGetAudit: high, all' },
    ],
  },
  {
    title: 'frontend',
    showAt: 4,
    lines: [
      { at: 4, kind: 'keep', text: 'tsc strict, eslint: 643 lines of config' },
      { at: 5, kind: 'keep', text: 'no-magic-numbers · no-unsafe-type-assertion' },
      { at: 5, kind: 'keep', text: 'prefer-readonly-parameter-types' },
      { at: 6, kind: 'keep', text: 'knip: nothing unused survives' },
    ],
  },
]

const bannedBuild = [
  '$ dotnet build backend/Itenium.Portal.slnx -c Release',
  '',
  '  Itenium.Portal.Application -> failed',
  '',
  'error RS0030: The symbol \'DateTime.Now\' is banned in this project:',
  '              Use BelgianClock — the server runs UTC but the legacy',
  '              DB stores Belgian wall-clock',
  '',
  'error RS0030: The symbol \'Task<TResult>.Result\' is banned in this project:',
  '              Await the task — sync-over-async deadlocks and blocks',
  '              the thread pool',
  '',
  'Build FAILED.  2 Error(s)',
]

const bannedClaude = [
  '● The build refuses DateTime.Now and .Result.',
  '',
  '  The message says why: the legacy DB stores Belgian',
  '  wall-clock time. Switching to BelgianClock.Now and',
  '  awaiting the call.',
  '',
  '● Update(ExpenseService.cs)',
  '  ⎿  -  var now = DateTime.Now;',
  '     +  var now = clock.Now;',
  '',
  '● Bash(dotnet build -c Release)',
  '  ⎿  Build succeeded.  0 Warning(s)  0 Error(s)',
]

export const bannedSymbols = [
  {
    title: 'Ubuntu',
    icon: 'ubuntu',
    at: 0,
    panes: {
      split: 'vertical',
      children: [
        { id: 'build', focusAt: 1, lines: bannedBuild },
        { id: 'agent', focusAt: 2, lines: bannedClaude },
      ],
    },
  },
]

export const archTests = [
  {
    title: 'ArchitectureTests.cs',
    lines: [
      { at: 1, kind: 'keep', text: 'Controllers_DoNotDependOnTheDbContext' },
      { at: 2, kind: 'keep', text: 'InnerLayers_DoNotDependOnTheApi' },
      { at: 3, kind: 'keep', text: 'Data_DoesNotDependOnTheApplication' },
      { at: 4, kind: 'keep', text: 'OnlyTheApi_DependsOnAspNetCoreMvc' },
    ],
    tags: ['the short path is not allowed to be shorter'],
    tagsAt: 5,
  },
]

export const testing = [
  {
    title: 'Testing',
    lines: [
      { at: 1, kind: 'keep', text: 'unit · component — vitest, NUnit' },
      { at: 2, kind: 'keep', text: 'e2e — Playwright, against a mock OIDC issuer' },
      { at: 3, kind: 'keep', text: 'a real database — Testcontainers' },
      { at: 4, kind: 'keep', text: 'architecture — ArchUnit' },
      { at: 5, kind: 'cost', text: 'agents write confident tests that assert nothing' },
      { at: 6, kind: 'keep', text: 'mutation — did these tests test anything?' },
    ],
  },
]
