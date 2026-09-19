<template>
  <TmuxScreen>
    <div class="collision-hero">
      <div class="beathead"><span class="n">N</span> agents, one directory</div>

      <div class="wrap">
        <TmuxPane
          class="collide"
          title="~/repo/src/auth.ts"
          leader="0"
          note="— 1 window · 3 writers"
          :class="{ glitch }"
        >
          <div class="file-body">
            <div
              v-for="(l, i) in lines"
              :key="i"
              class="ln"
              :class="[l.agent, { vanish: l.vanish, survive: l.survive }]"
            >{{ l.text }}</div>
            <div class="overlay-flash" :class="{ fire: flash }">⚠ SILENT OVERWRITE ⚠</div>
          </div>
        </TmuxPane>

        <div class="side">
          <div class="who">
            <span class="claude glow">● claude</span> <span class="dim">writing auth.ts</span>
            <div class="bar"><i class="claude-bar" :style="barStyle"></i></div>
          </div>
          <div class="who">
            <span class="codex glow">● codex</span> <span class="dim">writing auth.ts</span>
            <div class="bar"><i class="codex-bar" :style="barStyle"></i></div>
          </div>
          <div class="who">
            <span class="gemini glow">● gemini</span> <span class="dim">writing auth.ts</span>
            <div class="bar"><i class="gemini-bar" :style="barStyle"></i></div>
          </div>
          <div class="who last">
            <span class="red glow">last write wins →</span>
            <div class="won" v-html="whoWon"></div>
          </div>
        </div>
      </div>

      <div class="caption"><span class="mut">No error. No conflict.</span> Just missing code.</div>
    </div>

    <TmuxStatusBar :windows="[{ name: 'main', active: true }]" count="1 win · 3 writers" />
  </TmuxScreen>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const CONTRIB = {
  claude: ['export function login(u, p){', '  const t = signJWT(u);      // claude', '  return { token: t };', '}'],
  codex: ['export function refresh(tok){', '  return rotate(tok);        // codex', '}'],
  gemini: ['export const guard = (req) => {', '  return verify(req.token);  // gemini', '}'],
}

const lines = ref([])
const flash = ref(false)
const glitch = ref(false)
const whoWon = ref('…')
const barStyle = ref({ width: '0%', transition: 'none' })

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
let timers = []
const after = (ms, fn) => { const id = setTimeout(fn, reduced ? Math.min(ms, 20) : ms); timers.push(id); return id }
const every = (ms, fn) => { const id = setInterval(fn, ms); timers.push(id); return id }

function run() {
  lines.value = []
  flash.value = false
  glitch.value = false
  whoWon.value = '…'
  barStyle.value = { width: '0%', transition: 'none' }

  let queue = []
  Object.entries(CONTRIB).forEach(([agent, arr]) => arr.forEach((text) => queue.push({ agent, text })))
  queue = queue.sort(() => Math.random() - 0.5)

  after(60, () => { barStyle.value = { width: '100%', transition: 'width 2.4s linear' } })

  let i = 0
  const step = reduced ? 12 : 230
  const wid = every(step, () => {
    if (i >= queue.length) {
      clearInterval(wid)
      after(reduced ? 20 : 440, collide)
      return
    }
    lines.value.push({ ...queue[i], vanish: false, survive: false })
    i++
  })

  function collide() {
    glitch.value = false
    after(10, () => (glitch.value = true))
    flash.value = false
    after(10, () => (flash.value = true))
    whoWon.value = "<span class='claude glow'>claude</span> wrote last — <span class='red'>codex + gemini gone</span>"
    after(reduced ? 20 : 520, () => {
      lines.value.forEach((l) => {
        if (l.agent !== 'claude') l.vanish = true
        else l.survive = true
      })
    })
  }
}

onMounted(() => {
  run()
  if (!reduced) every(8200, run) // replay while the slide sits on screen
})
onUnmounted(() => timers.forEach((t) => { clearTimeout(t); clearInterval(t) }))
</script>

<style scoped>
.collision-hero {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 2.6vh 2.6vw 1.4vh;
}
.glow { text-shadow: 0 0 4px currentColor, 0 0 10px currentColor; }
.dim { color: var(--green-dim); }
.red { color: var(--red); }
.claude { color: var(--claude); }
.codex { color: var(--codex); }
.gemini { color: var(--gemini); }

.beathead {
  font-size: clamp(16px, 3.4vh, 40px);
  letter-spacing: 1px;
  margin-bottom: 1.4vh;
  color: var(--green);
}
.beathead .n { color: var(--red); text-shadow: 0 0 10px var(--red); }

.wrap { flex: 1; display: flex; gap: 2vw; min-height: 0; }
.collide { flex: 1.6; min-height: 0; }
.collide.glitch { animation: tmux-glitch 0.18s steps(2) 3; }
@keyframes tmux-glitch {
  0% { transform: translate(0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(2px, -1px); }
  75% { transform: translate(-1px, -1px); }
  100% { transform: translate(0); }
}

.file-body { position: relative; font-size: clamp(11px, 1.85vh, 16px); line-height: 1.5; }
.ln {
  display: block;
  white-space: pre;
  transition: opacity 0.35s, transform 0.35s, filter 0.35s;
}
.ln.claude { color: var(--claude); }
.ln.codex { color: var(--codex); }
.ln.gemini { color: var(--gemini); }
.ln.vanish { opacity: 0; transform: translateX(-14px); filter: blur(2px); }
.ln.survive { color: var(--green); text-shadow: 0 0 8px rgba(0, 255, 156, 0.7); }

.overlay-flash {
  position: absolute;
  inset: -8px -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 59, 71, 0.14);
  color: var(--red);
  font-weight: 800;
  font-size: clamp(16px, 3.6vh, 42px);
  letter-spacing: 3px;
  opacity: 0;
  pointer-events: none;
  text-shadow: 0 0 14px rgba(255, 59, 71, 0.7);
}
.overlay-flash.fire { animation: tmux-owflash 1.1s ease; }
@keyframes tmux-owflash {
  0% { opacity: 0; }
  12% { opacity: 1; }
  20% { opacity: 0.2; }
  30% { opacity: 1; }
  44% { opacity: 0.3; }
  60% { opacity: 0.95; }
  100% { opacity: 0; }
}

.side { flex: 1; display: flex; flex-direction: column; gap: 1.4vh; min-height: 0; }
.who {
  padding: 6px 10px;
  border: 1px solid var(--green-deep);
  background: rgba(3, 20, 14, 0.5);
  font-size: clamp(11px, 1.7vh, 15px);
}
.who.last { border-color: var(--red); }
.who .bar { height: 6px; margin-top: 6px; background: var(--green-deep); position: relative; overflow: hidden; }
.who .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 0; display: block; }
.claude-bar { background: var(--claude); }
.codex-bar { background: var(--codex); }
.gemini-bar { background: var(--gemini); }
.won { margin-top: 4px; color: var(--green-dim); }

.caption { margin-top: 1.4vh; font-size: clamp(12px, 2vh, 20px); color: var(--amber); letter-spacing: 1px; }
.caption .mut { color: var(--green-dim); }
</style>
