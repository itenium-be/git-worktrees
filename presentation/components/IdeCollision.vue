<template>
  <div class="ide-collision">
    <div class="ide-headline">The collision</div>

    <IdeEditor title="~/project — 3 editing" width="min(980px, 90vw)" :tabs="tabs" :files="files">
      <div class="ide-code">
        <div class="ide-savepulse" :class="{ go: pulse }"></div>

        <div class="cl">
          <span class="g">1</span><span class="kw">export function</span> <span class="fn">login</span><span class="pu">(</span><span class="va">u</span><span class="pu">,</span> <span class="va">p</span><span class="pu">) {</span>
        </div>
        <div class="cl">
          <span class="g">2</span><span class="com">&nbsp;&nbsp;// three agents, one working dir</span>
        </div>
        <div class="cl lost" :class="{ go: struck, gone }">
          <span class="g">3</span><span class="pu">&nbsp;&nbsp;</span><span class="ln">{{ textA }}</span>
        </div>
        <div class="cl lost" :class="{ go: struck, gone }">
          <span class="g">4</span><span class="pu">&nbsp;&nbsp;</span><span class="ln">{{ textB }}</span>
        </div>
        <div class="cl">
          <span class="g">5</span><span class="pu">&nbsp;&nbsp;</span><span class="ln">{{ textS }}</span>
        </div>
        <div class="cl"><span class="g">6</span><span class="pu">}</span></div>

        <div class="ide-savetag" :class="{ go: save }">● saved · Codex</div>

        <IdeCursor
          v-for="c in cursors"
          :key="c.name"
          :color="c.color"
          :name="c.name"
          :x="c.x"
          :y="c.y"
        />
      </div>
    </IdeEditor>

    <div class="ide-caption">
      <span class="cbad">No error. No conflict. Just missing code.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const tabs = [
  { label: 'auth.ts', color: '#D97757', active: true },
  { label: 'index.ts', color: '#334' },
]
const files = [
  { label: 'src', ico: '▾' },
  { label: 'auth.ts', ico: '◆', indent: 12, cls: 'sel' },
  { label: 'api.ts', ico: '◇', indent: 12, cls: 'f' },
  { label: 'ui.tsx', ico: '◇', indent: 12, cls: 'f' },
  { label: 'index.ts', ico: '◇', indent: 12 },
]

const textA = ref('')
const textB = ref('')
const textS = ref('')
const struck = ref(false)
const gone = ref(false)
const save = ref(false)
const pulse = ref(false)

// cursor lane: line index -> y; typing advances x
const BASE_X = 58
const lineY = i => 10 + i * 22
const cursors = reactive([
  { name: 'Claude', color: '#D97757', x: BASE_X, y: lineY(2) },
  { name: 'Gemini', color: '#8E7CF0', x: BASE_X, y: lineY(3) },
  { name: 'Codex', color: '#2DB88E', x: BASE_X, y: lineY(4) },
])

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches
let timers = []
const at = (fn, ms) => timers.push(setTimeout(fn, reduce ? Math.min(ms, 40) : ms))
const clearAll = () => { timers.forEach(clearTimeout); timers = [] }

function typeInto(textRef, str, cursor, speed = 34) {
  let j = 0
  const step = () => {
    if (j > str.length) return
    textRef.value = str.slice(0, j)
    if (cursor) cursor.x = BASE_X + j * 7.4
    j++
    at(step, speed)
  }
  step()
}

function play() {
  clearAll()
  textA.value = ''; textB.value = ''; textS.value = ''
  struck.value = false; gone.value = false; save.value = false; pulse.value = false
  cursors[0].x = BASE_X; cursors[0].y = lineY(2)
  cursors[1].x = BASE_X; cursors[1].y = lineY(3)
  cursors[2].x = BASE_X; cursors[2].y = lineY(4)

  at(() => typeInto(textA, 'const token = signJWT(u); // Claude', cursors[0]), 500)
  at(() => typeInto(textB, 'audit.log(u, Date.now()); // Gemini', cursors[1]), 950)
  at(() => typeInto(textS, 'return session(u); // Codex', cursors[2]), 1400)
  // Codex saves last -> last write wins
  at(() => { save.value = true; pulse.value = true }, 2700)
  // the other two agents' just-typed lines strike through...
  at(() => { struck.value = true }, 3200)
  // ...and silently vanish
  at(() => { gone.value = true }, 3550)
  // loop
  at(play, 5800)
}

onMounted(() => { at(play, 250) })
onBeforeUnmount(clearAll)
</script>

<style scoped>
.ide-collision {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(1200px 700px at 78% -10%, rgba(76, 159, 251, 0.1), transparent 60%),
    radial-gradient(1000px 600px at 15% 110%, rgba(255, 95, 87, 0.08), transparent 60%),
    #0b0e14;
  font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
}
.ide-headline {
  position: absolute;
  top: 34px;
  left: 0; right: 0;
  text-align: center;
  z-index: 6;
  font-weight: 700;
  font-size: clamp(20px, 3vw, 32px);
  letter-spacing: -0.5px;
  color: #fff;
}
.ide-headline .k { color: #5a6678; }

.ide-code {
  position: relative;
  padding: 12px 0;
  min-height: 176px;
  font-size: 13px;
  line-height: 22px;
}
.cl { display: flex; padding: 0 16px; white-space: pre; height: 22px; }
.g {
  width: 30px;
  flex: 0 0 30px;
  color: #3b4657;
  text-align: right;
  padding-right: 14px;
  user-select: none;
}
.kw { color: #c792ea; }
.fn { color: #82aaff; }
.va { color: #e0e6f0; }
.pu { color: #7f8ba3; }
.com { color: #5a6678; }
.ln { color: #c9d4e3; }

.lost { position: relative; }
.lost::after {
  content: '';
  position: absolute;
  left: 46px; right: 16px;
  top: 50%;
  height: 2px;
  background: #ff5f57;
  transform: scaleX(0);
  transform-origin: left;
  box-shadow: 0 0 10px #ff5f57;
}
.lost.go::after { animation: ide-strike 0.35s cubic-bezier(0.16, 0.84, 0.32, 1) forwards; }
@keyframes ide-strike { to { transform: scaleX(1); } }
.lost.gone { animation: ide-lossfade 0.5s 0.05s cubic-bezier(0.16, 0.84, 0.32, 1) forwards; }
@keyframes ide-lossfade { to { opacity: 0; filter: blur(2px); } }
.lost.gone .ln { color: #ff5f57; }

.ide-savepulse {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 60% 60%, rgba(45, 184, 142, 0.22), transparent 55%);
  opacity: 0;
  pointer-events: none;
}
.ide-savepulse.go { animation: ide-spulse 0.7s cubic-bezier(0.16, 0.84, 0.32, 1); }
@keyframes ide-spulse { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }

.ide-savetag {
  position: absolute;
  right: 16px;
  bottom: 12px;
  z-index: 30;
  font-weight: 700;
  font-size: 12px;
  color: #0b0e14;
  background: #2DB88E;
  padding: 4px 10px;
  border-radius: 6px;
  opacity: 0;
  transform: translateY(6px) scale(0.9);
}
.ide-savetag.go { animation: ide-savepop 1.6s cubic-bezier(0.16, 0.84, 0.32, 1); }
@keyframes ide-savepop {
  12% { opacity: 1; transform: none; }
  78% { opacity: 1; transform: none; }
  100% { opacity: 0; }
}

.ide-caption {
  position: absolute;
  bottom: 26px;
  left: 0; right: 0;
  text-align: center;
  z-index: 6;
}
.ide-caption .cbad {
  display: inline-block;
  background: rgba(217, 119, 87, 0.12);
  border: 1px solid rgba(217, 119, 87, 0.4);
  color: #f0b49c;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: clamp(12px, 1.6vw, 16px);
}
</style>
