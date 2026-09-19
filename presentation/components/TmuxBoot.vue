<template>
  <TmuxScreen>
    <div class="boot-hero">
      <div class="boot-log">
        <div v-for="(l, i) in bootLines" :key="i" class="boot-line">
          <span class="pre">[boot] </span>{{ l.txt }}
          <span v-if="l.ok" class="ok glow">[{{ l.ok }}]</span>
        </div>
      </div>

      <div class="banner-wrap">
        <pre v-show="showBanner" class="ascii" :class="{ show: showBanner }">{{ banner }}</pre>
        <div class="sub" :class="{ show: showBanner }">// ONE REPO, N CODING AGENTS</div>
        <div class="agents3" :class="{ show: showBanner }">
          <span><span class="c claude">●</span> <b class="claude">CLAUDE</b> <span class="dim">feat/auth</span></span>
          <span><span class="c codex">●</span> <b class="codex">CODEX</b> <span class="dim">feat/api</span></span>
          <span><span class="c gemini">●</span> <b class="gemini">GEMINI</b> <span class="dim">feat/ui</span></span>
        </div>
      </div>
    </div>

    <TmuxStatusBar :windows="[{ name: 'main', active: true }]" count="1 win" />
  </TmuxScreen>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const banner =
' ██████╗ ██╗████████╗    ██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗████████╗██████╗ ███████╗███████╗███████╗\n' +
'██╔════╝ ██║╚══██╔══╝    ██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝╚══██╔══╝██╔══██╗██╔════╝██╔════╝██╔════╝\n' +
'██║  ███╗██║   ██║       ██║ █╗ ██║██║   ██║██████╔╝█████╔╝    ██║   ██████╔╝█████╗  █████╗  ███████╗\n' +
'██║   ██║██║   ██║       ██║███╗██║██║   ██║██╔══██╗██╔═██╗    ██║   ██╔══██╗██╔══╝  ██╔══╝  ╚════██║\n' +
'╚██████╔╝██║   ██║       ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗   ██║   ██║  ██║███████╗███████╗███████║\n' +
' ╚═════╝ ╚═╝   ╚═╝        ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝'

const BOOT = [
  ['mounting object database ........', 'OK'],
  ['scanning refs/heads .............', 'OK'],
  ["spawning tmux session 'worktrees'", 'OK'],
  ['attaching coding agents x3 ......', 'OK'],
]

const bootLines = ref([])
const showBanner = ref(false)
const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
let timers = []
const after = (ms, fn) => { const id = setTimeout(fn, reduced ? Math.min(ms, 20) : ms); timers.push(id); return id }

onMounted(() => {
  let step = 0
  const next = () => {
    if (step >= BOOT.length) { after(200, () => (showBanner.value = true)); return }
    const [txt] = BOOT[step]
    bootLines.value.push({ txt, ok: '' })
    after(reduced ? 10 : 230, () => {
      bootLines.value[step].ok = BOOT[step][1]
      step++
      next()
    })
  }
  next()
})
onUnmounted(() => timers.forEach(clearTimeout))
</script>

<style scoped>
.boot-hero {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 3vh 3vw 1.5vh;
}
.glow { text-shadow: 0 0 4px rgba(0, 255, 156, 0.55), 0 0 12px rgba(0, 255, 156, 0.28); }
.dim { color: var(--green-dim); }

.boot-log {
  font-size: clamp(11px, 1.7vh, 15px);
  line-height: 1.55;
  color: var(--green-dim);
  min-height: 12vh;
}
.boot-line .pre { color: var(--green-dim); }
.boot-line .ok { color: var(--green); }

.banner-wrap { margin: auto 0; }
pre.ascii {
  font-size: clamp(5px, 1.5vh, 14px);
  line-height: 1.02;
  color: var(--green);
  white-space: pre;
  display: inline-block;
  text-shadow: 0 0 6px rgba(0, 255, 156, 0.5), 0 0 18px rgba(0, 255, 156, 0.25);
  opacity: 0;
  transform: translateY(8px);
}
pre.ascii.show { opacity: 1; transform: none; transition: opacity 0.6s ease, transform 0.6s ease; }

.sub {
  margin-top: 2.2vh;
  font-size: clamp(13px, 2.6vh, 30px);
  letter-spacing: 3px;
  color: var(--amber);
  text-shadow: 0 0 8px rgba(255, 207, 92, 0.4);
  opacity: 0;
  transform: translateY(8px);
}
.sub.show { opacity: 1; transform: none; transition: opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s; }

.agents3 {
  margin-top: 2.4vh;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: clamp(11px, 1.9vh, 17px);
  opacity: 0;
  transform: translateY(8px);
}
.agents3.show { opacity: 1; transform: none; transition: opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s; }
.agents3 b { font-weight: 700; }
.c.claude, b.claude { color: var(--claude); }
.c.codex, b.codex { color: var(--codex); }
.c.gemini, b.gemini { color: var(--gemini); }
.c { text-shadow: 0 0 6px currentColor; }
</style>
