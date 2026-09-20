<template>
  <div ref="rigEl" class="rig">
    <section class="panel queue">
      <h3>Merge Queue<em>{{ queue.length }}</em></h3>
      <div ref="chipsEl" class="chipwrap">
        <TransitionGroup tag="ul" name="q" class="chips" :style="{ '--chip': chipH + 'px' }">
          <li v-for="(b, i) in queue" :key="b.id" :ref="(el) => setHead(el, i)" class="chip">
            <span class="glyph">⎇</span>{{ b.name }}
          </li>
        </TransitionGroup>
      </div>
    </section>

    <div class="arrow" :class="{ hot: flyingTo === 'lander' }">➜</div>

    <section class="panel lander">
      <h3>The Lander</h3>
      <div ref="slotEl" class="slot" :class="{ busy: !!inLander }">
        <span v-if="inLander" class="chip live"><span class="glyph">⎇</span>{{ inLander.name }}</span>
        <span v-else class="chip idle">waiting for a branch</span>
      </div>
      <div class="status">
        <span class="spin" :class="{ on: !!step }" />
        <span class="status-text">{{ statusText }}</span>
      </div>
      <ol class="steps">
        <li v-for="s in STEPS" :key="s.key" :class="{ done: done.includes(s.key), now: step === s.key }">
          {{ s.label }}
        </li>
      </ol>
    </section>

    <div class="arrow" :class="{ hot: flyingTo === 'main' }">➜</div>

    <section class="panel main">
      <h3>Main Branch<em>{{ commits.length }}</em></h3>
      <div ref="histEl" class="history">
        <span class="spine" />
        <div ref="padEl" class="pad" />
        <TransitionGroup name="c">
          <div
            v-for="(c, i) in commits"
            :key="c.id"
            class="commit"
            :class="{ tight: i >= KEEP || tall < 14 }"
            :style="{ '--row': (i < KEEP ? tall : thin) + 'px' }"
          >
            <i class="dot" />
            <b>{{ c.sha }}</b>
            <span>{{ c.name }}</span>
          </div>
        </TransitionGroup>
      </div>
    </section>

    <div v-if="flyer" class="flyer" :style="flyStyle"><span class="glyph">⎇</span>{{ flyer.name }}</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const props = defineProps({
  branches: { type: Array, required: true },
})

const STEPS = [
  { key: 'rebase', label: 'rebase onto main', verb: 'Rebasing', ms: 1100 },
  { key: 'build', label: 'build', verb: 'Building', ms: 1500 },
  { key: 'test', label: 'test', verb: 'Testing', ms: 1400 },
  { key: 'merge', label: 'merge --ff-only', verb: 'Merging', ms: 800 },
]

const FLIGHT = 720
// The newest KEEP commits stay readable; everything older packs down the line as bare dots.
const KEEP = 10
const ROW_MAX = 34
const ROW_MIN = 6
const QUEUE_START = 6
const QUEUE_MAX = 9
const CHIP_MAX = 40
const CHIP_MIN = 24
const CHIP_GAP = 7

const rigEl = ref(null)
const slotEl = ref(null)
const padEl = ref(null)
const histEl = ref(null)
const chipsEl = ref(null)
const headEl = ref(null)
const setHead = (el, i) => {
  if (i === 0) headEl.value = el
}

let seq = 0
let landings = 0
const pull = () => ({ id: ++seq, name: props.branches[seq % props.branches.length] })

const queue = ref(Array.from({ length: QUEUE_START }, pull))
const inLander = ref(null)
const commits = ref([])
const step = ref(null)
const done = ref([])
const flyer = ref(null)
const flyStyle = ref({})
const flyingTo = ref(null)
const tall = ref(ROW_MAX)
const thin = ref(ROW_MAX)
const chipH = ref(CHIP_MAX)

const dots = ref('')
const statusText = computed(() => {
  if (step.value) return STEPS.find((s) => s.key === step.value).verb + dots.value
  if (flyingTo.value === 'main') return 'Landed'
  return 'standing by'
})

// Nothing ever leaves main, so the rows give up height to each other instead.
function relayout() {
  if (chipsEl.value) {
    const per = chipsEl.value.clientHeight / Math.max(queue.value.length, 1)
    chipH.value = Math.max(CHIP_MIN, Math.min(CHIP_MAX, per - CHIP_GAP))
  }
  if (!histEl.value) return
  const avail = histEl.value.clientHeight
  const n = commits.value.length
  if (n <= KEEP) {
    tall.value = Math.min(ROW_MAX, avail / Math.max(n, 1))
    thin.value = tall.value
    return
  }
  const older = n - KEEP
  let t = Math.min(ROW_MAX, (avail * 0.85) / KEEP)
  let th = (avail - t * KEEP) / older
  if (th < ROW_MIN) {
    th = ROW_MIN
    t = (avail - th * older) / KEEP
  }
  // Long enough and even ROW_MIN will not fit; from there everything scales together.
  const total = t * KEEP + th * older
  const k = total > avail ? avail / total : 1
  tall.value = t * k
  thin.value = th * k
}

// Slidev scales the whole slide with a CSS transform, so measured pixels have to be
// divided back out before they can be written into a style as layout pixels.
function rel(el) {
  const rig = rigEl.value.getBoundingClientRect()
  const scale = rig.width / rigEl.value.offsetWidth
  const r = el.getBoundingClientRect()
  return {
    left: (r.left - rig.left) / scale,
    top: (r.top - rig.top) / scale,
    w: r.width / scale,
  }
}

const place = (p) => ({ left: p.left + 'px', top: p.top + 'px', width: p.w + 'px' })

let alive = true
const timers = new Set()
const sleep = (ms) =>
  new Promise((resolve) => {
    const t = setTimeout(() => {
      timers.delete(t)
      resolve()
    }, ms)
    timers.add(t)
  })

async function fly(item, fromEl, toEl, where) {
  const from = rel(fromEl)
  const to = rel(toEl)
  flyer.value = item
  flyStyle.value = place(from)
  flyingTo.value = where
  await nextTick()
  await new Promise((r) => requestAnimationFrame(r))
  flyStyle.value = place(to)
  await sleep(FLIGHT)
  flyingTo.value = null
}

function shaOf(name) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h.toString(16).padStart(7, '0').slice(0, 7)
}

async function cycle() {
  const head = queue.value[0]
  const headRect = headEl.value
  queue.value = queue.value.slice(1)
  await fly(head, headRect, slotEl.value, 'lander')
  if (!alive) return

  inLander.value = head
  flyer.value = null

  for (const s of STEPS) {
    step.value = s.key
    await sleep(s.ms)
    if (!alive) return
    done.value = [...done.value, s.key]
  }
  step.value = null

  await fly(head, slotEl.value, padEl.value, 'main')
  if (!alive) return

  inLander.value = null
  flyer.value = null
  done.value = []
  commits.value = [{ id: head.id, sha: shaOf(head.name + head.id), name: head.name }, ...commits.value]

  // One back for the one that landed, and every third round one extra, so the queue grows.
  landings += 1
  const pushes = landings % 3 === 0 ? 2 : 1
  for (let n = 0; n < pushes && queue.value.length < QUEUE_MAX; n += 1) {
    queue.value = [...queue.value, pull()]
  }

  await nextTick()
  relayout()
}

// Slidev mounts the neighbouring slides ahead of time, so the queue would be halfway
// drained by the time the deck reaches it. The slide context is not injected through this
// theme's layouts, so the slide number comes off the rendered page element instead.
const { currentSlideNo } = useNav()
const myPage = ref(null)
const isActive = computed(() => myPage.value != null && myPage.value === currentSlideNo.value)
const onScreen = () =>
  isActive.value
    ? Promise.resolve()
    : new Promise((resolve) => {
        const stop = watch(isActive, (on) => {
          if (!on) return
          stop()
          resolve()
        })
      })

onMounted(async () => {
  myPage.value = Number(rigEl.value?.closest('[class*="slidev-page-"]')?.className.match(/slidev-page-(\d+)/)?.[1]) || null
  await onScreen()
  if (!alive) return
  relayout()

  const blink = async () => {
    while (alive) {
      dots.value = dots.value.length >= 3 ? '' : dots.value + '.'
      await sleep(340)
    }
  }
  blink()

  await sleep(900)
  while (alive) {
    if (!queue.value.length || !headEl.value) {
      await sleep(400)
      continue
    }
    await cycle()
    if (!alive) return
    await sleep(800)
  }
})

onUnmounted(() => {
  alive = false
  timers.forEach(clearTimeout)
  timers.clear()
})
</script>

<style scoped>
.rig {
  --ink: #2a1d12;
  --amber: #c9722a;
  --green: #1f8a5b;
  --edge: rgba(42, 29, 18, 0.16);
  position: relative;
  display: flex;
  flex: 1;
  align-items: stretch;
  gap: 0.9rem;
  min-width: 0;
  min-height: 0;
  padding: 1.2rem 1.4rem;
  color: var(--ink);
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
}

.panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0.8rem 0.9rem;
  border-radius: 0.8rem;
  border: 2px solid var(--edge);
  background: rgba(255, 255, 255, 0.55);
}

/* The queue has to hold the longest branch name on one line. */
.queue { flex: 1 1 31%; }
.lander { flex: 1 1 35%; }
.main { flex: 1 1 34%; }

h3 {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 0.7rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--amber);
}

h3 em {
  padding: 0.05rem 0.5rem;
  border-radius: 999px;
  background: rgba(201, 114, 42, 0.16);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-style: normal;
  font-size: 0.8rem;
}

.arrow {
  align-self: center;
  font-size: 1.6rem;
  color: var(--edge);
  transition: color 250ms ease, transform 250ms ease;
}

.arrow.hot {
  color: var(--amber);
  transform: scale(1.25);
}

/* --- queue --- */

.chipwrap {
  flex: 1;
  min-height: 0;
}

.chips {
  /* Positioned, so a leaving chip can drop out of flow without leaving the panel. */
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: 0.45rem;
  height: var(--chip, auto);
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  border: 1px solid rgba(201, 114, 42, 0.35);
  background: rgba(255, 240, 214, 0.9);
  font-size: min(0.95rem, calc(var(--chip, 40px) * 0.45));
  white-space: nowrap;
}

.glyph {
  color: var(--amber);
}

.q-move,
.q-enter-active,
.q-leave-active {
  transition: transform 420ms cubic-bezier(0.3, 0.8, 0.3, 1), opacity 420ms ease;
}

.q-enter-from {
  opacity: 0;
  transform: translateY(0.8rem);
}

/* Taken out of flow on leave, so the chips above close the gap in one move. */
.q-leave-active {
  position: absolute;
}

.q-leave-to {
  opacity: 0;
}

/* --- lander --- */

.slot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3.1rem;
  padding: 0.4rem;
  border-radius: 0.5rem;
  border: 2px dashed var(--edge);
  transition: border-color 300ms ease, background 300ms ease;
}

.slot.busy {
  border-style: solid;
  border-color: rgba(201, 114, 42, 0.6);
  background: rgba(255, 240, 214, 0.5);
}

.chip.idle {
  border-color: transparent;
  background: none;
  color: rgba(42, 29, 18, 0.4);
  font-style: italic;
}

.chip.live {
  border-color: var(--amber);
  background: #fff;
  font-weight: 700;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.7rem 0 0.5rem;
  font-size: 0.95rem;
  min-height: 1.4rem;
}

.spin {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid rgba(42, 29, 18, 0.15);
  opacity: 0;
  transition: opacity 250ms ease;
}

.spin.on {
  opacity: 1;
  border-top-color: var(--amber);
  animation: turn 700ms linear infinite;
}

@keyframes turn {
  to { transform: rotate(360deg); }
}

.status-text {
  color: var(--amber);
  font-weight: 700;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.88rem;
}

.steps li {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(42, 29, 18, 0.4);
  transition: color 250ms ease;
}

.steps li::before {
  content: '○';
  color: rgba(42, 29, 18, 0.25);
}

.steps li.now {
  color: var(--ink);
  font-weight: 700;
}

.steps li.now::before {
  content: '◉';
  color: var(--amber);
}

.steps li.done {
  color: var(--green);
}

.steps li.done::before {
  content: '●';
  color: var(--green);
}

/* --- main --- */

.history {
  position: relative;
  flex: 1;
  min-height: 0;
  padding-left: 1.1rem;
}

.spine {
  position: absolute;
  left: 0.32rem;
  top: 0.2rem;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--green), rgba(31, 138, 91, 0.15));
}

/* Where a landing branch flies to; the commit it becomes renders under it. */
.pad {
  height: 0;
}

.commit {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  height: var(--row);
  overflow: hidden;
  font-size: min(0.88rem, calc(var(--row) * 0.52));
  white-space: nowrap;
}

.dot {
  position: absolute;
  left: -1.02rem;
  width: min(0.65rem, calc(var(--row) * 0.4));
  height: min(0.65rem, calc(var(--row) * 0.4));
  border-radius: 50%;
  border: 2px solid var(--green);
  background: #fff;
}

/* Past this density only the line itself still reads, so the text stands down. */
.commit.tight b,
.commit.tight span {
  display: none;
}

.commit.tight .dot {
  border-width: 1px;
}

.commit b {
  color: var(--green);
}

.commit span {
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(42, 29, 18, 0.75);
}

.c-enter-active,
.c-move {
  transition: transform 420ms cubic-bezier(0.3, 0.8, 0.3, 1), opacity 420ms ease;
}

.c-enter-from {
  opacity: 0;
  transform: translateY(-0.8rem);
}

/* --- the branch in transit --- */

.flyer {
  position: absolute;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  border: 2px solid var(--amber);
  background: #fff;
  box-shadow: 0 0.5rem 1.2rem rgba(90, 50, 20, 0.28);
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  transition: left 720ms cubic-bezier(0.4, 0, 0.2, 1), top 720ms cubic-bezier(0.4, 0, 0.2, 1),
    width 720ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
