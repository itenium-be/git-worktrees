<template>
  <TmuxScreen>
    <div class="merge-hero">
      <div class="beathead">Merging it all back</div>

      <div class="stagewrap">
        <div class="collapsing">
          <div
            v-for="(mp, i) in mps"
            :key="i"
            class="mp"
            :class="mp.agent"
            :style="{ left: mp.left, width: mp.width, opacity: mp.opacity, transition: mp.transition }"
          >
            <div class="ptitle">● {{ mp.title }}</div>
            <div class="mbody">
              <span v-for="(f, fi) in mp.files" :key="fi">+ {{ f }}<br /></span>
              <span class="hash">{{ mp.hash }}</span>
            </div>
          </div>

          <div class="merged" :class="{ on: mergedOn }">
            <pre class="mergeart">   feat/auth ─┐
   feat/api  ─┼──▶  main   ✓
   feat/ui   ─┘</pre>
            <div class="bigok" :class="{ pop: okPop }">MERGED ✓</div>
            <div class="mergeout">
              <div v-for="(o, oi) in outLines" :key="oi" v-html="o"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="caption">
        Small PRs <span class="mut">→</span> stacked <span class="mut">→</span> stack-aware merge queue
      </div>
    </div>

    <TmuxStatusBar :windows="windows" :count="count" />
  </TmuxScreen>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

const mps = reactive([
  { agent: 'claude', title: 'feat/auth', files: ['auth.ts', 'jwt.ts'], hash: 'a1f9c02', left: '0%', width: '32%', opacity: 1, transition: 'none' },
  { agent: 'codex', title: 'feat/api', files: ['api.ts', 'routes.ts'], hash: '7d31be4', left: '34%', width: '32%', opacity: 1, transition: 'none' },
  { agent: 'gemini', title: 'feat/ui', files: ['App.tsx', 'theme.css'], hash: 'e0b8a55', left: '68%', width: '32%', opacity: 1, transition: 'none' },
])
const mergedOn = ref(false)
const okPop = ref(false)
const outLines = ref([])

const TRIPLE = [
  { name: 'main', active: false },
  { name: 'auth', active: true },
  { name: 'api', active: false },
  { name: 'ui', active: false },
]
const SINGLE = [{ name: 'main', active: true }]
const windows = ref(TRIPLE)
const count = ref('3 wins')

const OUT = [
  '$ git switch main &amp;&amp; git merge --no-ff feat/auth feat/api feat/ui',
  'Merging feat/auth feat/api feat/ui into main',
  'Recursive merge resolved · 3 branches',
  " 6 files changed, <span class='plus'>+412</span> / <span class='minus'>-18</span>",
  "<span class='ok'>✓ merge queue: all green</span>",
]

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
let timers = []
const after = (ms, fn) => { const id = setTimeout(fn, reduced ? Math.min(ms, 20) : ms); timers.push(id); return id }
const every = (ms, fn) => { const id = setInterval(fn, ms); timers.push(id); return id }

const COLLAPSE = 'left 0.8s cubic-bezier(0.6,0,0.2,1), width 0.8s cubic-bezier(0.6,0,0.2,1), opacity 0.6s ease'

function run() {
  const start = [['0%', '32%'], ['34%', '32%'], ['68%', '32%']]
  mps.forEach((mp, i) => { mp.transition = 'none'; mp.left = start[i][0]; mp.width = start[i][1]; mp.opacity = 1 })
  mergedOn.value = false
  okPop.value = false
  outLines.value = []
  windows.value = TRIPLE
  count.value = '3 wins'

  // collapse the three panes into the centre
  after(reduced ? 10 : 520, () => {
    mps.forEach((mp, i) => {
      mp.transition = COLLAPSE
      mp.left = '33%'
      mp.width = '34%'
      if (i !== 1) after(reduced ? 10 : 560, () => (mp.opacity = 0))
    })
    windows.value = SINGLE
    count.value = '1 win'
  })

  // reveal merged art + typewriter git output
  after(reduced ? 30 : 1360, () => {
    mps.forEach((mp) => (mp.opacity = 0))
    mergedOn.value = true
    after(reduced ? 10 : 280, () => (okPop.value = true))
    let li = 0
    const id = every(reduced ? 40 : 360, () => {
      if (li >= OUT.length) { clearInterval(id); return }
      outLines.value.push(OUT[li])
      li++
    })
  })
}

onMounted(() => {
  run()
  if (!reduced) every(9000, run)
})
onUnmounted(() => timers.forEach((t) => { clearTimeout(t); clearInterval(t) }))
</script>

<style scoped>
.merge-hero {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 2.6vh 2.6vw 1.4vh;
}
.beathead { font-size: clamp(16px, 3.4vh, 40px); letter-spacing: 1px; margin-bottom: 0.8vh; color: var(--green); }
.mut { color: var(--green-dim); }

.stagewrap { flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column; margin-top: 0.6vh; }
.collapsing { position: relative; flex: 1; min-height: 0; }

.mp {
  position: absolute;
  top: 0;
  bottom: 0;
  overflow: hidden;
  border: 1px solid var(--green-deep);
  background: linear-gradient(180deg, rgba(3, 20, 14, 0.7), rgba(2, 8, 6, 0.9));
}
.mp .ptitle { font-size: clamp(9px, 1.4vh, 13px); padding: 3px 8px; border-bottom: 1px solid var(--green-deep); }
.mp .mbody { padding: 8px; font-size: clamp(9px, 1.4vh, 13px); color: var(--green-dim); line-height: 1.5; }
.mp .hash { color: var(--green-dim); font-weight: 700; }
.mp.claude { border-color: var(--claude); }
.mp.claude .ptitle { color: var(--claude); border-color: var(--claude); }
.mp.codex { border-color: var(--codex); }
.mp.codex .ptitle { color: var(--codex); border-color: var(--codex); }
.mp.gemini { border-color: var(--gemini); }
.mp.gemini .ptitle { color: var(--gemini); border-color: var(--gemini); }

.merged {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
}
.merged.on { opacity: 1; transition: opacity 0.6s ease 0.1s; }
pre.mergeart {
  font-size: clamp(7px, 1.7vh, 16px);
  line-height: 1.15;
  color: var(--green);
  text-shadow: 0 0 8px rgba(0, 255, 156, 0.5);
  white-space: pre;
  text-align: center;
}
.bigok {
  margin-top: 1.4vh;
  font-size: clamp(22px, 5vh, 60px);
  letter-spacing: 4px;
  color: var(--green);
  text-shadow: 0 0 16px rgba(0, 255, 156, 0.6);
  opacity: 0;
  transform: scale(0.7);
}
.bigok.pop { opacity: 1; transform: scale(1); transition: opacity 0.5s, transform 0.6s cubic-bezier(0.2, 1.5, 0.3, 1); }
.mergeout {
  margin-top: 1.6vh;
  font-size: clamp(11px, 1.75vh, 15px);
  color: var(--green-dim);
  text-align: center;
  min-height: 9vh;
}
:deep(.ok) { color: var(--green); }
:deep(.plus) { color: var(--green); }
:deep(.minus) { color: var(--red); }

.caption { margin-top: 1.2vh; font-size: clamp(12px, 2vh, 20px); color: var(--amber); letter-spacing: 0.5px; }
</style>
