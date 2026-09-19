<template>
  <div class="ide-wiring">
    <div class="ide-headline">Claude Code speaks worktree</div>

    <IdeEditor title="3 worktrees — parallel" width="min(1040px, 92vw)" :tabs="tabs">
      <div class="ide-bodyrow">
        <div class="ide-side">
          <div class="ide-side-row"><span class="ico" style="color:#D97757">●</span> ../auth</div>
          <div class="ide-side-row"><span class="ico" style="color:#2DB88E">●</span> ../api</div>
          <div class="ide-side-row"><span class="ico" style="color:#8E7CF0">●</span> ../ui</div>
          <div class="ide-side-h">— commits —</div>
          <div class="ide-commits">
            <span
              v-for="(d, i) in commits"
              :key="i"
              class="cdot"
              :class="{ show: d.show }"
              :style="{ left: d.x + 'px', top: d.y + 'px', background: d.color, boxShadow: '0 0 8px ' + d.color }"
            ></span>
          </div>
        </div>

        <div class="ide-code">
          <div class="cl"><span class="g">1</span><span class="com"># one command per agent — private tree</span></div>
          <div class="cl"><span class="g">2</span></div>
          <div class="cl"><span class="g">3</span><span class="va">{{ ln3 }}</span></div>
          <div class="cl"><span class="g">4</span><span class="va">{{ ln4 }}</span></div>
        </div>
      </div>

      <template #footer>
        <div class="ide-term" :class="{ up }">
          <div class="ide-termhead"><span class="t">TERMINAL</span> · zsh · ~/project</div>
          <div class="ide-termbody">
            <div><span class="p1">➜ auth</span> <span>{{ t1 }}</span></div>
            <div><span class="p2">➜ launch</span> <span>{{ t2 }}</span><span class="tcur" :class="{ blink: true }"></span></div>
          </div>
        </div>
      </template>
    </IdeEditor>

    <div class="ide-caption">
      <span><b>Private index</b> — no .git/index.lock fights</span>
      <span>Silent overwrites <b>→ real merge conflicts</b></span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const tabs = [
  { label: 'feat/auth', color: '#D97757', active: true },
  { label: 'feat/api', color: '#2DB88E' },
  { label: 'feat/ui', color: '#8E7CF0' },
]

const up = ref(false)
const t1 = ref('')
const t2 = ref('')
const ln3 = ref('')
const ln4 = ref('')
const commits = reactive([])

const laneX = [14, 40, 66]
const laneColor = ['#D97757', '#2DB88E', '#8E7CF0']

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches
let timers = []
const at = (fn, ms) => timers.push(setTimeout(fn, reduce ? Math.min(ms, 40) : ms))
const clearAll = () => { timers.forEach(clearTimeout); timers = [] }

function typeInto(textRef, str, speed, done) {
  let j = 0
  const step = () => {
    if (j > str.length) { done && done(); return }
    textRef.value = str.slice(0, j)
    j++
    at(step, speed)
  }
  step()
}

function streamCommits() {
  const perLane = [0, 0, 0]
  for (let lane = 0; lane < 3; lane++) {
    for (let k = 0; k < 4; k++) {
      at(() => {
        const y = 6 + perLane[lane] * 22
        perLane[lane]++
        commits.push({ x: laneX[lane], y, color: laneColor[lane], show: false })
        const idx = commits.length - 1
        at(() => { commits[idx].show = true }, 20)
      }, 300 + lane * 120 + k * 360)
    }
  }
}

function play() {
  clearAll()
  up.value = false
  t1.value = ''; t2.value = ''; ln3.value = ''; ln4.value = ''
  commits.splice(0)
  at(() => { up.value = true }, 250)
  at(() => {
    typeInto(t1, 'git worktree add -b feat/auth ../auth main', 34, () => {
      ln3.value = 'git worktree add -b feat/auth ../auth main'
      at(() => {
        typeInto(t2, 'claude -w feature-auth', 44, () => {
          ln4.value = 'claude -w feature-auth'
          streamCommits()
        })
      }, 300)
    })
  }, 800)
  at(play, 7200)
}

onMounted(() => { at(play, 200) })
onBeforeUnmount(clearAll)
</script>

<style scoped>
.ide-wiring {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(1100px 700px at 80% -10%, rgba(76, 159, 251, 0.1), transparent 60%),
    radial-gradient(1000px 600px at 12% 110%, rgba(45, 184, 142, 0.08), transparent 60%),
    #0b0e14;
  font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
}
.ide-headline {
  position: absolute;
  top: 30px;
  left: 0; right: 0;
  text-align: center;
  font-weight: 700;
  font-size: clamp(20px, 3vw, 32px);
  color: #fff;
}

.ide-bodyrow { display: flex; }
.ide-side {
  width: 168px;
  flex: 0 0 168px;
  background: #0f1420;
  border-right: 1px solid #1c2431;
  padding: 10px 6px;
  font-size: 11.5px;
}
.ide-side-row { display: flex; align-items: center; gap: 6px; padding: 3px 8px; color: #8592a6; }
.ide-side-h { margin-top: 10px; padding: 0 8px; color: #3b4657; }
.ide-commits { position: relative; height: 130px; margin-top: 6px; }
.cdot {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s cubic-bezier(0.16, 0.84, 0.32, 1), transform 0.4s cubic-bezier(0.16, 0.84, 0.32, 1);
}
.cdot.show { opacity: 1; transform: none; }

.ide-code {
  flex: 1;
  position: relative;
  padding: 12px 0 158px;
  min-height: 220px;
  font-size: 13px;
  line-height: 22px;
}
.cl { display: flex; padding: 0 16px; white-space: pre; min-height: 22px; }
.g {
  width: 30px;
  flex: 0 0 30px;
  color: #3b4657;
  text-align: right;
  padding-right: 14px;
  user-select: none;
}
.com { color: #5a6678; }
.va { color: #c9d4e3; }

.ide-term {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  background: #070a10;
  border-top: 1px solid #1c2431;
  height: 0;
  overflow: hidden;
  transition: height 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.ide-term.up { height: 150px; }
.ide-termhead {
  height: 26px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 12px;
  font-size: 10.5px;
  color: #5a6678;
  border-bottom: 1px solid #1c2431;
}
.ide-termhead .t { color: #c9d4e3; }
.ide-termbody { padding: 10px 14px; font-size: 12.5px; line-height: 1.9; }
.ide-termbody .p1 { color: #2DB88E; }
.ide-termbody .p2 { color: #4c9ffb; }
.tcur {
  display: inline-block;
  width: 9px;
  height: 15px;
  background: #c9d4e3;
  vertical-align: -2px;
  margin-left: 2px;
}
.tcur.blink { animation: ide-blink 1s steps(1) infinite; }
@keyframes ide-blink { 50% { opacity: 0.15; } }

.ide-caption {
  position: absolute;
  bottom: 24px;
  left: 0; right: 0;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 20px;
}
.ide-caption span {
  background: #131924;
  border: 1px solid #1c2431;
  padding: 6px 14px;
  border-radius: 18px;
  color: #8592a6;
  font-size: clamp(11px, 1.5vw, 15px);
}
.ide-caption b { color: #c9d4e3; font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  .ide-term { transition-duration: 0.001s; }
  .tcur.blink { animation: none; }
  .cdot { transition-duration: 0.001s; }
}
</style>
