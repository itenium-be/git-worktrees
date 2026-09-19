<template>
  <TmuxScreen>
    <div class="split-hero">
      <div class="beathead">One repo <span class="dim">→</span> <span class="glow">N working trees</span></div>

      <div class="grid">
        <!-- single pane before the split -->
        <div class="gp single" :class="{ in: singleIn }">
          <div class="ptitle"><span class="dim">0:</span> main <span class="dim">— 1 window</span></div>
          <div class="pbody"><span class="dim">$</span> git worktree add …<span class="cur"></span></div>
        </div>

        <!-- three panes after the split -->
        <div class="gp p1" :class="{ in: panesIn[0] }">
          <div class="ptitle"><span class="d">●</span> feat/auth <span class="dim">· claude</span></div>
          <div class="pbody">../auth · HEAD@feat/auth<br /><span class="dim">private index ✓</span></div>
        </div>
        <div class="gp p2" :class="{ in: panesIn[1] }">
          <div class="ptitle"><span class="d">●</span> feat/api <span class="dim">· codex</span></div>
          <div class="pbody">../api · HEAD@feat/api<br /><span class="dim">private index ✓</span></div>
        </div>
        <div class="gp p3" :class="{ in: panesIn[2] }">
          <div class="ptitle"><span class="d">●</span> feat/ui <span class="dim">· gemini</span></div>
          <div class="pbody">../ui · HEAD@feat/ui<br /><span class="dim">private index ✓</span></div>
        </div>

        <svg class="spokes" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line :class="{ on: gitOn }" x1="50" y1="50" x2="25" y2="28" />
          <line :class="{ on: gitOn }" x1="50" y1="50" x2="75" y2="28" />
          <line :class="{ on: gitOn }" x1="50" y1="50" x2="50" y2="76" />
        </svg>

        <div class="divV" :style="{ height: divV }"></div>
        <div class="divH" :style="{ width: divH }"></div>

        <div class="gitnode" :class="{ on: gitOn }">.git<small>object DB<br />+ refs</small></div>
      </div>

      <div class="caps">
        <span>◆ <b>Shared object DB + refs</b> — no re-clone</span>
        <span>◆ <b>Per-worktree HEAD + index</b></span>
        <span>◆ <b>Same branch</b> — can't check out twice</span>
      </div>
    </div>

    <TmuxStatusBar :windows="windows" :count="count" />
  </TmuxScreen>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const singleIn = ref(true)
const panesIn = ref([false, false, false])
const divV = ref('0%')
const divH = ref('0%')
const gitOn = ref(false)

const SINGLE = [{ name: 'main', active: true }]
const TRIPLE = [
  { name: 'main', active: false },
  { name: 'auth', active: true },
  { name: 'api', active: false },
  { name: 'ui', active: false },
]
const windows = ref(SINGLE)
const count = ref('1 win')

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
let timers = []
const after = (ms, fn) => { const id = setTimeout(fn, reduced ? Math.min(ms, 20) : ms); timers.push(id); return id }
const every = (ms, fn) => { const id = setInterval(fn, ms); timers.push(id); return id }

function run() {
  singleIn.value = true
  panesIn.value = [false, false, false]
  divV.value = '0%'
  divH.value = '0%'
  gitOn.value = false
  windows.value = SINGLE
  count.value = '1 win'

  // 1) vertical split  (Ctrl-b %)
  after(reduced ? 10 : 620, () => (divV.value = '100%'))
  // 2) hide single pane, horizontal split (Ctrl-b ")
  after(reduced ? 20 : 1000, () => {
    singleIn.value = false
    divH.value = '100%'
  })
  // 3) panes slide in, window count climbs
  ;[0, 1, 2].forEach((idx) => {
    after(reduced ? 20 : 1250 + idx * 240, () => {
      panesIn.value[idx] = true
      windows.value = TRIPLE
      count.value = idx + 1 + (idx === 0 ? ' win' : ' wins')
    })
  })
  // 4) shared .git node + spokes glow
  after(reduced ? 30 : 2250, () => (gitOn.value = true))
}

onMounted(() => {
  run()
  if (!reduced) every(9000, run)
})
onUnmounted(() => timers.forEach((t) => { clearTimeout(t); clearInterval(t) }))
</script>

<style scoped>
.split-hero {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 2.6vh 2.6vw 1.4vh;
}
.glow { text-shadow: 0 0 4px rgba(0, 255, 156, 0.55), 0 0 12px rgba(0, 255, 156, 0.28); }
.dim { color: var(--green-dim); }

.beathead { font-size: clamp(16px, 3.4vh, 40px); letter-spacing: 1px; margin-bottom: 0.8vh; color: var(--green); }

.grid {
  position: relative;
  flex: 1;
  min-height: 0;
  margin-top: 0.6vh;
  display: grid;
  gap: 0;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.gp {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--green-deep);
  background: linear-gradient(180deg, rgba(3, 20, 14, 0.7), rgba(2, 8, 6, 0.9));
  opacity: 0;
  transform: scale(0.94);
  transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.2, 0.9, 0.25, 1);
}
.gp.in { opacity: 1; transform: none; }
.gp.single { grid-column: 1 / span 2; grid-row: 1 / span 2; }
.gp .ptitle {
  font-size: clamp(10px, 1.55vh, 14px);
  padding: 4px 10px;
  border-bottom: 1px solid var(--green-deep);
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--green);
}
.gp .pbody { padding: 9px 12px; font-size: clamp(11px, 1.7vh, 15px); line-height: 1.5; color: var(--green-dim); }
.gp.p1 { border-color: var(--claude); }
.gp.p1 .ptitle { border-color: var(--claude); color: var(--claude); background: rgba(217, 119, 87, 0.12); }
.gp.p2 { border-color: var(--codex); }
.gp.p2 .ptitle { border-color: var(--codex); color: var(--codex); background: rgba(45, 184, 142, 0.12); }
.gp.p3 { border-color: var(--gemini); }
.gp.p3 .ptitle { border-color: var(--gemini); color: var(--gemini); background: rgba(142, 124, 240, 0.12); }

.cur {
  display: inline-block;
  width: 0.62em;
  height: 1.05em;
  vertical-align: -0.18em;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: tmux-blink 1.05s steps(1) infinite;
}
@keyframes tmux-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

.divV, .divH { position: absolute; background: var(--green); box-shadow: 0 0 12px var(--green); z-index: 6; opacity: 0.9; }
.divV { top: 0; left: 50%; width: 2px; height: 0; transform: translateX(-1px); transition: height 0.5s ease; }
.divH { left: 0; top: 50%; height: 2px; width: 0; transform: translateY(-1px); transition: width 0.5s ease; }

.gitnode {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.4);
  z-index: 8;
  width: clamp(74px, 10vw, 120px);
  height: clamp(74px, 10vw, 120px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  background: radial-gradient(circle, rgba(0, 255, 156, 0.35), rgba(0, 60, 40, 0.15) 60%, transparent 72%);
  border: 1px solid var(--green);
  color: var(--green);
  font-weight: 800;
  font-size: clamp(11px, 1.7vh, 16px);
  letter-spacing: 1px;
  opacity: 0;
  text-shadow: 0 0 10px var(--green);
}
.gitnode small { font-weight: 400; font-size: 0.62em; color: var(--green-dim); }
.gitnode.on {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  transition: opacity 0.5s, transform 0.6s cubic-bezier(0.2, 1.4, 0.3, 1);
  animation: tmux-gitpulse 2.2s ease-in-out infinite 1s;
}
@keyframes tmux-gitpulse {
  0%, 100% { box-shadow: 0 0 18px rgba(0, 255, 156, 0.45); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 156, 0.85); }
}

.spokes { position: absolute; inset: 0; z-index: 7; pointer-events: none; }
.spokes line {
  stroke: var(--green);
  stroke-width: 0.5;
  stroke-dasharray: 3 3;
  opacity: 0;
  filter: drop-shadow(0 0 3px var(--green));
  transition: opacity 0.5s ease;
}
.spokes line.on { opacity: 0.7; animation: tmux-dash 1s linear infinite; }
@keyframes tmux-dash { to { stroke-dashoffset: -12; } }

.caps { margin-top: 1vh; display: flex; gap: 26px; flex-wrap: wrap; font-size: clamp(12px, 1.9vh, 18px); }
.caps span { color: var(--amber); }
.caps b { color: var(--green); }

@media (prefers-reduced-motion: reduce) {
  .cur, .gitnode.on { animation: none; }
}
</style>
