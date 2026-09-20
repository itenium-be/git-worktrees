// Content for the three merge-queue slide candidates. Same facts in all three, so the
// bake-off compares the visuals and not the writing.

export const priorArt = [
  { name: 'Bors', note: '2014' },
  { name: 'Zuul' },
  { name: 'Mergify' },
  { name: 'Graphite' },
  { name: 'GitHub Merge Queue', note: '💰' },
]

export const holding = [
  { branch: 'feat/checkout', fl: 'FL020', tests: '134 ✓' },
  { branch: 'fix/cart', fl: 'FL030', tests: '96 ✓' },
  { branch: 'feat/discount', fl: 'FL040', tests: '111 ✓' },
  { branch: 'chore/deps', fl: 'FL050', tests: '128 ✓' },
  { branch: 'feat/auth', fl: 'FL060', tests: '87 ✓' },
  { branch: 'fix/i18n', fl: 'FL070', tests: '140 ✓' },
]

export const landerTabs = [
  {
    title: 'feat/checkout',
    icon: 'ubuntu',
    at: 0,
    lines: [
      { at: 0, text: 'wouter@dev:~/wt/checkout$ claude', tone: 'cmd' },
      { at: 0, text: '' },
      { at: 0, text: '> stop rebasing. who else does this?', tone: 'you' },
      { at: 0, text: '' },
      { at: 0, text: '  Serialising the landing is a solved problem:', tone: 'dim' },
      { at: 0, text: '    Bors ................ 2014, "not rocket science"', tone: 'dim' },
      { at: 0, text: '    Zuul · Mergify · Graphite', tone: 'dim' },
      { at: 0, text: '    GitHub Merge Queue .. you already pay for this one', tone: 'dim' },
      { at: 0, text: '' },
      { at: 0, text: '  All of them do one thing: one branch lands at a time.', tone: 'ok' },
      { at: 0, text: '' },
      { at: 0, text: '> so be one. stop touching main.', tone: 'you' },
      { at: 0, text: '  Understood. Pushing feat/checkout and standing down.', tone: 'ok' },
    ],
  },
  {
    title: 'lander',
    icon: 'lander',
    at: 1,
    lines: [
      { at: 1, text: 'wouter@dev:~/wt/lander$ claude', tone: 'cmd' },
      { at: 1, text: '' },
      { at: 1, text: '> you are the only session allowed to touch main.', tone: 'you' },
      { at: 1, text: '> take one branch off the queue at a time.', tone: 'you' },
      { at: 2, text: '' },
      { at: 2, text: '● Bash(git rebase main feat/checkout && bun test)', tone: 'tool' },
      { at: 2, text: '  ⍿ 0 conflicts · 134 pass, 0 fail', tone: 'dim' },
      { at: 2, text: '● Bash(git merge --ff-only feat/checkout)', tone: 'tool' },
      { at: 2, text: '  ⍿ Fast-forward. landed.', tone: 'ok' },
      { at: 3, text: '' },
      { at: 3, text: '● Bash(git rebase main fix/cart && bun test)', tone: 'tool' },
      { at: 3, text: '  ⍿ 2 conflicts resolved · 96 pass, 0 fail', tone: 'dim' },
      { at: 3, text: '● Bash(git merge --ff-only fix/cart)', tone: 'tool' },
      { at: 3, text: '  ⍿ Fast-forward. landed.', tone: 'ok' },
      { at: 4, text: '' },
      { at: 4, text: '  queue: 4 waiting · 0 races · nobody rebased twice', tone: 'ok' },
    ],
  },
]

export const lanes = [
  'feat/checkout',
  'fix/cart',
  'feat/discount',
  'chore/deps',
  'feat/auth',
  'fix/i18n',
]
