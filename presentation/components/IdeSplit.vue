<template>
  <div class="ide-split">
    <div class="ide-headline">What is a worktree <span class="k">·</span> one repo → N trees</div>

    <div class="ide-stack">
      <div class="ide-panes" :class="{ split }">
        <div v-for="(p, i) in panes" :key="p.branch" class="ide-pane" :class="'p' + i">
          <div class="ide-panettl">
            <span class="bdot" :style="{ background: p.color }"></span>{{ p.branch }}
          </div>
          <div class="ide-panetabs">
            <span class="ide-dot" :style="{ background: p.color }"></span>{{ p.file }}
          </div>
          <div class="ide-minicode">
            <span class="com">// worktree · {{ p.branch }}</span><br />
            <span class="kw">export</span> <span class="fn">{{ p.sym }}</span><br />
            <span class="ins">+ isolated HEAD</span><br />
            <span class="ins">+ own index</span>
          </div>
          <IdeCursor :color="p.color" :name="p.name" :x="p.cx" :y="p.cy" />
        </div>
      </div>

      <div class="ide-gitbar" :class="{ show: split }">
        <span class="link" style="left:16.6%;--c:#D97757"></span>
        <span class="link" style="left:50%;--c:#2DB88E"></span>
        <span class="link" style="left:83.3%;--c:#8E7CF0"></span>
        <span class="core">.git</span> — shared object DB + refs
      </div>
    </div>

    <div class="ide-caption">
      <span><b>Shared object DB + refs</b> — no re-clone</span>
      <span><b>Per-worktree HEAD</b> + index</span>
      <span>Same branch <b>can't</b> be checked out twice</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const panes = reactive([
  { branch: 'feat/auth', file: 'auth.ts', sym: 'signJWT(u)', name: 'Claude', color: '#D97757', cx: 30, cy: 70 },
  { branch: 'feat/api', file: 'api.ts', sym: 'router.get()', name: 'Codex', color: '#2DB88E', cx: 30, cy: 70 },
  { branch: 'feat/ui', file: 'ui.tsx', sym: '<Dashboard/>', name: 'Gemini', color: '#8E7CF0', cx: 30, cy: 70 },
])

const split = ref(false)
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches
let timers = []
const at = (fn, ms) => timers.push(setTimeout(fn, reduce ? Math.min(ms, 40) : ms))
const clearAll = () => { timers.forEach(clearTimeout); timers = [] }

function drift() {
  panes.forEach(p => {
    p.cx = 24 + Math.random() * 60
    p.cy = 60 + Math.random() * 40
  })
}

function play() {
  clearAll()
  split.value = false
  at(() => { split.value = true }, 300)
  at(drift, 1300)
  at(drift, 2600)
  at(drift, 3900)
  at(play, 6000)
}

onMounted(() => { at(play, 200) })
onBeforeUnmount(clearAll)
</script>

<style scoped>
.ide-split {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(1100px 700px at 80% -10%, rgba(76, 159, 251, 0.1), transparent 60%),
    radial-gradient(1000px 600px at 12% 110%, rgba(142, 124, 240, 0.1), transparent 60%),
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
.ide-headline .k { color: #5a6678; }

.ide-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.ide-panes {
  display: flex;
  gap: 14px;
  width: min(1160px, 92vw);
  height: min(360px, 52vh);
}
.ide-pane {
  flex: 1;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, #0f1521, #0b0f18);
  border: 1px solid #1c2431;
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s cubic-bezier(0.16, 0.84, 0.32, 1);
}
/* collapsed: the two clones are folded onto the origin pane */
.ide-panes:not(.split) .p1 { opacity: 0; transform: translateX(-58%) scale(0.94); }
.ide-panes:not(.split) .p2 { opacity: 0; transform: translateX(-118%) scale(0.94); }
.ide-panes.split .ide-pane { opacity: 1; transform: none; }

.ide-panettl {
  height: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  font-size: 11.5px;
  color: #c9d4e3;
  border-bottom: 1px solid #1c2431;
  background: #0a0e15;
}
.bdot { width: 8px; height: 8px; border-radius: 50%; }
.ide-panetabs {
  height: 26px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  font-size: 10.5px;
  color: #8592a6;
  border-bottom: 1px solid #1c2431;
  background: #0d1117;
}
.ide-dot { width: 8px; height: 8px; border-radius: 50%; }
.ide-minicode { padding: 12px 14px; font-size: 12px; line-height: 1.8; color: #8592a6; }
.com { color: #5a6678; }
.kw { color: #c792ea; }
.fn { color: #82aaff; }
.ins { color: #89ca78; }

.ide-gitbar {
  width: min(1160px, 92vw);
  margin-top: 16px;
  height: 56px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(217, 119, 87, 0.1), rgba(45, 184, 142, 0.1), rgba(142, 124, 240, 0.1));
  border: 1px solid #1c2431;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  color: #8592a6;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.16, 0.84, 0.32, 1) 0.4s;
}
.ide-gitbar.show { opacity: 1; transform: none; }
.ide-gitbar .core { font-weight: 700; color: #fff; position: relative; }
.ide-gitbar .core::before {
  content: '';
  position: absolute;
  inset: -8px -14px;
  border-radius: 14px;
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.16), transparent);
  animation: ide-coreglow 2.4s ease-in-out infinite;
}
@keyframes ide-coreglow { 50% { opacity: 0.4; } }
.link {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 16px;
  background: linear-gradient(var(--c), transparent);
  opacity: 0.7;
}

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
  .ide-pane, .ide-gitbar { transition-duration: 0.001s; }
  .ide-gitbar .core::before { animation: none; }
}
</style>
