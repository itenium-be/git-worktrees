// Bake-off data for the slide-9 payoff variants. Throwaway: two of the three
// variants get deleted once a direction is picked.

// --- Variant A: the four stones from slide 8, flipped to their cure. ---
export const cures = [
  {
    sigil: '🎃',
    title: 'Working Tree',
    lines: ['Two agents, one file. Last write wins.'],
    cureSigil: '🕯️',
    cureTitle: 'Working Tree',
    cureLines: ['Separate directories', '`.worktreeinclude` for `.env`'],
    at: 0,
    cureAt: 1,
  },
  {
    sigil: '💀',
    title: 'Git State',
    lines: ['Checkout moves.', 'Commit steals.', 'Stash vanishes.'],
    cureSigil: '🕯️',
    cureTitle: 'Git State',
    cureLines: ['Shared `.git` folder', 'Since v2.5,<br>over a decade ago'],
    at: 0,
    cureAt: 2,
  },
  {
    sigil: '👻',
    title: 'Unstable\nDev Server',
    lines: ['It rebuilds & reloads all the time'],
    cureSigil: '🕯️',
    cureTitle: 'Dev Server',
    cureLines: ['Different ports', 'Hardlinked `node_modules` with pnpm or bun'],
    at: 0,
    cureAt: 3,
  },
  {
    sigil: '🦇',
    title: 'Unstable\nTest Run',
    lines: ['Red.', "From the other agent's in-progress work"],
    cureSigil: '🕯️',
    cureTitle: 'Test Run',
    cureLines: ['Own code only', 'Separate testcontainer'],
    at: 0,
    cureAt: 4,
  },
]

// --- Variant B: one shared core, N working trees. ---
// All three arrive on one click; the stagger is a CSS delay, not a third beat.
export const trees = [
  { path: '../discount-code', branch: 'feat/discount', agent: 'claude', at: 1 },
  { path: '../cart-zustand', branch: 'feat/cart', agent: 'codex', at: 1 },
  { path: '../perf-checkout', branch: 'perf/checkout', agent: 'gemini', at: 1 },
]

export const splitFacts = [
  { text: 'In git since **2.5** — July 2015', at: 2 },
  { text: 'Your harness already knows: `claude -w`, `isolation: worktree`', at: 3 },
  { text: 'Already baked into **Superpowers**', at: 4 },
]

// --- Variant C: the facts become the pane labels of a terminal session. ---
const worktreeAdd = [
  'wouter@dev:~/AwesomeApp26$ git worktree add -b feat/discount ../discount-code',
  "Preparing worktree (new branch 'feat/discount')",
  'HEAD is now at 9c2f1ab checkout: totals rounding',
  '',
  'wouter@dev:~/AwesomeApp26$ git worktree add -b feat/cart ../cart-zustand',
  'wouter@dev:~/AwesomeApp26$ git worktree add -b perf/checkout ../perf-checkout',
  '',
  'wouter@dev:~/AwesomeApp26$ git worktree list',
  '/home/wouter/AwesomeApp26   9c2f1ab [main]',
  '/home/wouter/discount-code  9c2f1ab [feat/discount]',
  '/home/wouter/cart-zustand   9c2f1ab [feat/cart]',
  '/home/wouter/perf-checkout  9c2f1ab [perf/checkout]',
  '',
  'wouter@dev:~/AwesomeApp26$ du -sh .git ../discount-code/.git',
  '412M    .git',
  '4.0K    ../discount-code/.git',
]

const claudeW = [
  'wouter@dev:~/AwesomeApp26$ claude -w feature-auth',
  '',
  '  ▐▛███▜▌   Claude Code v2.1.0',
  '  ▝▜█████▛▘ ~/.claude/worktrees/feature-auth',
  '',
  '  worktree  feature-auth',
  '  branch    worktree-feature-auth',
  '',
  '> add a discount code field to the checkout form',
  '',
  '● Write(src/checkout/DiscountField.tsx)',
  '  ⍿ Wrote 52 lines',
]

const subagent = [
  'wouter@dev:~/AwesomeApp26$ cat .claude/agents/implementor.md',
  '---',
  'name: implementor',
  'description: Implements one plan step, in its own tree',
  'isolation: worktree',
  '---',
  '',
  'wouter@dev:~/AwesomeApp26$ git log --oneline -1 -- .claude/skills',
  'a71e0c4 superpowers: using-git-worktrees',
]

export const payoffTerminal = [
  {
    title: 'AwesomeApp26 - bash',
    icon: 'ubuntu',
    at: 0,
    panes: {
      split: 'vertical',
      children: [
        { id: 'wt-add', label: 'in git since 2.5 — July 2015', at: 1, lines: worktreeAdd },
        {
          split: 'horizontal',
          children: [
            { id: 'claude-w', label: 'your harness already knows', at: 2, lines: claudeW },
            { id: 'subagent', label: 'baked into Superpowers', at: 3, lines: subagent },
          ],
        },
      ],
    },
  },
]
