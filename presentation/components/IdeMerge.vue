<template>
  <div class="ide-merge">
    <div class="ide-headline">Merging it all back</div>

    <div class="ide-mstage" :class="{ conv }">
      <svg class="branches" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <path d="M120,90 C300,90 400,250 500,250" stroke="#D97757" />
        <path d="M500,90 L500,250" stroke="#2DB88E" />
        <path d="M880,90 C700,90 600,250 500,250" stroke="#8E7CF0" />
        <path d="M500,250 L500,470" stroke="#2DB88E" />
      </svg>
      <div class="trunk"></div>

      <div class="mpane m0">
        <div class="panettl"><span class="bdot" style="background:#D97757"></span>feat/auth</div>
        <div class="minicode"><span class="com">+ session guard</span><br /><span class="ins">+ jwt verify</span></div>
        <IdeCursor color="#D97757" name="Claude" :x="cursors[0].x" :y="cursors[0].y" />
      </div>
      <div class="mpane m1">
        <div class="panettl"><span class="bdot" style="background:#2DB88E"></span>feat/api</div>
        <div class="minicode"><span class="com">+ /v2 routes</span><br /><span class="ins">+ rate limit</span></div>
        <IdeCursor color="#2DB88E" name="Codex" :x="cursors[1].x" :y="cursors[1].y" />
      </div>
      <div class="mpane m2">
        <div class="panettl"><span class="bdot" style="background:#8E7CF0"></span>feat/ui</div>
        <div class="minicode"><span class="com">+ dashboard</span><br /><span class="ins">+ dark mode</span></div>
        <IdeCursor color="#8E7CF0" name="Gemini" :x="cursors[2].x" :y="cursors[2].y" />
      </div>

      <div class="cnode c0" style="left:12%;top:18%;background:#D97757;color:#D97757"></div>
      <div class="cnode c1" style="left:50%;top:18%;background:#2DB88E;color:#2DB88E"></div>
      <div class="cnode c2" style="left:88%;top:18%;background:#8E7CF0;color:#8E7CF0"></div>
      <div class="cnode cm" style="left:50%;top:50%;background:#fff;color:#fff"></div>

      <div class="mergebadge">merged ✓</div>
    </div>

    <div class="ide-caption">
      <span>Keep PRs <b>small</b> — 200–400 lines</span>
      <span>Stacked PRs <b>→</b> merge queue</span>
      <span><b>No proven ceiling</b> — measure your own</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const conv = ref(false)
const cursors = reactive([
  { x: 24, y: 62 },
  { x: 24, y: 62 },
  { x: 24, y: 62 },
])

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches
let timers = []
const at = (fn, ms) => timers.push(setTimeout(fn, reduce ? Math.min(ms, 40) : ms))
const clearAll = () => { timers.forEach(clearTimeout); timers = [] }

function converge() {
  // cursors drift toward the shared merge point
  cursors[0].x = 60; cursors[0].y = 48
  cursors[1].x = 40; cursors[1].y = 60
  cursors[2].x = 20; cursors[2].y = 48
}

function play() {
  clearAll()
  conv.value = false
  cursors.forEach(c => { c.x = 24; c.y = 62 })
  at(() => { conv.value = true }, 300)
  at(converge, 900)
  at(play, 6500)
}

onMounted(() => { at(play, 200) })
onBeforeUnmount(clearAll)
</script>

<style scoped>
.ide-merge {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(1100px 700px at 80% -10%, rgba(45, 184, 142, 0.1), transparent 60%),
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

.ide-mstage {
  position: relative;
  width: min(1160px, 92vw);
  height: min(380px, 56vh);
}
.branches { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.branches path {
  fill: none;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
}
.conv .branches path { animation: ide-draw 1.1s 0.2s cubic-bezier(0.16, 0.84, 0.32, 1) forwards; }
@keyframes ide-draw { to { stroke-dashoffset: 0; } }

.trunk {
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 3px;
  transform: translateX(-50%);
  background: linear-gradient(#D97757, #2DB88E, #8E7CF0);
  opacity: 0;
}
.conv .trunk { animation: ide-fadein 0.8s 0.4s cubic-bezier(0.16, 0.84, 0.32, 1) forwards; }
@keyframes ide-fadein { to { opacity: 0.5; } }

.mpane {
  position: absolute;
  top: 8%;
  width: 30%;
  height: 62%;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, #0f1521, #0b0f18);
  border: 1px solid #1c2431;
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s cubic-bezier(0.16, 0.84, 0.32, 1), left 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}
.m0 { left: 2%; }
.m1 { left: 35%; }
.m2 { left: 68%; }
.conv .mpane { left: 35%; opacity: 0; }
.conv .mpane.m1 { opacity: 1; }

.panettl {
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
.minicode { padding: 12px 14px; font-size: 12px; line-height: 1.9; }
.com { color: #5a6678; }
.ins { color: #89ca78; }

.cnode {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  box-shadow: 0 0 14px currentColor;
}
.conv .cnode { animation: ide-pop 0.5s cubic-bezier(0.16, 0.84, 0.32, 1) forwards; }
.conv .c0 { animation-delay: 0.2s; }
.conv .c1 { animation-delay: 0.4s; }
.conv .c2 { animation-delay: 0.6s; }
.conv .cm { animation-delay: 1s; }
@keyframes ide-pop { to { transform: translate(-50%, -50%) scale(1); } }

.mergebadge {
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%) scale(0.4);
  opacity: 0;
  z-index: 10;
  font-weight: 800;
  font-size: clamp(18px, 3vw, 30px);
  color: #0b0e14;
  background: #2DB88E;
  padding: 12px 24px;
  border-radius: 16px;
  box-shadow: 0 0 50px rgba(45, 184, 142, 0.6);
  white-space: nowrap;
}
.conv .mergebadge { animation: ide-mergepop 0.7s 1s cubic-bezier(0.16, 0.84, 0.32, 1) forwards; }
@keyframes ide-mergepop { to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

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
  .mpane { transition-duration: 0.001s; }
  .conv .branches path,
  .conv .trunk,
  .conv .cnode,
  .conv .mergebadge { animation-duration: 0.001s; }
}
</style>
