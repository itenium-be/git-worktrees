<template>
  <TmuxScreen>
    <div class="wire-hero">
      <div class="beathead">Wiring up the agents</div>

      <div class="grid">
        <TmuxPane
          v-for="(p, i) in panes"
          :key="i"
          :agent="p.agent"
          :title="p.title"
          note="· running"
          dot
          class="wp"
        >
          <div class="term">
            <div v-for="(b, bi) in p.blocks" :key="bi" :class="b.cls" v-html="b.html"></div>
            <div v-if="p.typing" class="cmd">
              <span v-html="p.typing.prompt"></span>{{ p.typing.text }}<span class="cur" :class="p.agent"></span>
            </div>
          </div>
        </TmuxPane>
      </div>

      <div class="caption">
        <span class="mut">Private index →</span> no <b>.git/index.lock</b> fights
        <span class="mut">·</span> silent overwrites become real <b>merge conflicts</b>
      </div>
    </div>

    <TmuxStatusBar :windows="windows" count="3 wins" />
  </TmuxScreen>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

const windows = [
  { name: 'main', active: false },
  { name: 'auth', active: true },
  { name: 'api', active: false },
  { name: 'ui', active: false },
]

const CFG = [
  { agent: 'claude', title: 'feat/auth', user: 'claude@auth', dir: '~/auth',
    cmds: ['git worktree add -b feat/auth ../auth main', 'claude -w feature-auth'],
    out: ["Preparing worktree (new branch 'feat/auth')", 'HEAD is now at 3e91a0c main'] },
  { agent: 'codex', title: 'feat/api', user: 'codex@api', dir: '~/api',
    cmds: ['git worktree add -b feat/api ../api main', 'codex -w feature-api'],
    out: ["Preparing worktree (new branch 'feat/api')", 'HEAD is now at 3e91a0c main'] },
  { agent: 'gemini', title: 'feat/ui', user: 'gemini@ui', dir: '~/ui',
    cmds: ['git worktree add -b feat/ui ../ui main', 'gemini -w feature-ui'],
    out: ["Preparing worktree (new branch 'feat/ui')", 'HEAD is now at 3e91a0c main'] },
]

const ACTS = ['feat: routes', 'refactor: guard', 'test: token', 'fix: expiry', 'chore: lint', 'feat: schema']
const rndHash = () => Array.from({ length: 7 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')

const panes = reactive(
  CFG.map((c) => ({ agent: c.agent, title: c.title, blocks: [], typing: null }))
)

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
let timers = []
const after = (ms, fn) => { const id = setTimeout(fn, reduced ? Math.min(ms, 20) : ms); timers.push(id); return id }
const every = (ms, fn) => { const id = setInterval(fn, ms); timers.push(id); return id }
const sleep = (ms) => new Promise((r) => after(ms, r))

function push(p, cls, html) {
  p.blocks.push({ cls, html })
  if (p.blocks.length > 9) p.blocks.shift() // keep the pane "scrolled"
}

function typewriter(p, prompt, text) {
  return new Promise((res) => {
    p.typing = { prompt, text: '', cursor: true }
    if (reduced) { p.typing.text = text; after(1, () => { push(p, 'cmd', prompt + esc(text)); p.typing = null; res() }); return }
    let i = 0
    const id = every(34, () => {
      if (i >= text.length) {
        clearInterval(id)
        push(p, 'cmd', prompt + esc(text))
        p.typing = null
        res()
        return
      }
      p.typing.text += text[i]
      i++
    })
  })
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function runPane(idx) {
  const c = CFG[idx]
  const p = panes[idx]
  const prompt = `<span class="prm ${c.agent}">${c.user}</span>:<span class="dim">${c.dir}</span>$ `
  for (let ci = 0; ci < c.cmds.length; ci++) {
    await typewriter(p, prompt, c.cmds[ci])
    push(p, 'out', esc(c.out[ci] || ''))
    await sleep(reduced ? 10 : 200)
  }
  push(p, 'out amber', '● working…')
  let n = 0
  every(reduced ? 60 : 560, () => {
    if (n >= 6) return
    push(p, 'out hashline', `<span class="hash">${rndHash()}</span> ${ACTS[n % ACTS.length]}`)
    n++
  })
}

onMounted(() => {
  CFG.forEach((_, idx) => after(reduced ? 10 : idx * 320, () => runPane(idx)))
})
onUnmounted(() => timers.forEach((t) => { clearTimeout(t); clearInterval(t) }))
</script>

<style scoped>
.wire-hero {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 2.6vh 2.6vw 1.4vh;
}
.beathead { font-size: clamp(16px, 3.4vh, 40px); letter-spacing: 1px; margin-bottom: 0.8vh; color: var(--green); }

.grid {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 1.1vh 1vw;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 0.6vh;
}
.wp { min-height: 0; }

.term { font-size: clamp(10px, 1.55vh, 14px); line-height: 1.5; }
:deep(.cmd) { color: var(--green); }
:deep(.out) { color: var(--green-dim); }
:deep(.amber) { color: var(--amber); }
:deep(.dim) { color: var(--green-dim); }
:deep(.hash) { color: var(--green-dim); font-weight: 700; }
:deep(.prm.claude) { color: var(--claude); }
:deep(.prm.codex) { color: var(--codex); }
:deep(.prm.gemini) { color: var(--gemini); }
:deep(.hashline) { animation: tmux-fadein 0.28s ease; }
@keyframes tmux-fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

.cur {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  vertical-align: -0.15em;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: tmux-blink 1.05s steps(1) infinite;
}
.cur.claude { background: var(--claude); box-shadow: 0 0 8px var(--claude); }
.cur.codex { background: var(--codex); box-shadow: 0 0 8px var(--codex); }
.cur.gemini { background: var(--gemini); box-shadow: 0 0 8px var(--gemini); }
@keyframes tmux-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

.caption { margin-top: 1.2vh; font-size: clamp(12px, 2vh, 20px); color: var(--amber); letter-spacing: 0.5px; }
.caption .mut { color: var(--green-dim); }
.caption b { color: var(--green); }

@media (prefers-reduced-motion: reduce) { .cur { animation: none; } }
</style>
