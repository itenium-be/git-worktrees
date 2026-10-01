<template>
  <div class="stage">
    <div class="rail" :style="{ width: `${tip - MAIN[0].x}%` }" />
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path class="fork" :style="{ d: `path('${fork}')` }" />
    </svg>

    <div v-for="c in MAIN" :key="c.sha" class="commit" :class="{ off: clicks < c.at }" :style="{ left: `${c.x}%`, top: `${MAIN_Y}%` }">
      <i class="dot" />
      <span class="sha">{{ c.sha }}</span>
    </div>

    <div class="ref local" :style="{ left: `${tip}%` }">main</div>
    <div class="ref origin">origin/main</div>

    <div class="commit bead" :style="{ left: `${bead.x}%`, top: `${bead.y}%` }">
      <i class="dot" />
      <span class="sha">{{ clicks >= 4 ? '3e1c9b2' : 'projects-7kq4' }}</span>
      <span v-if="!landed" class="check" :class="check.kind">{{ check.text }}</span>
    </div>

    <div class="queue-title">land queue</div>
    <div
      v-for="(q, i) in QUEUE"
      :key="q.id"
      class="chip"
      :class="{ weld: i === 0 && clicks >= 1, gone: i === 0 && clicks >= 5 }"
      :style="{ left: `${chipX(i)}%` }"
    >
      <span v-if="i === 0 && clicks >= 1" class="owner">weld</span>
      {{ q.id }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  clicks: { type: Number, default: 0 },
})

const MAIN_Y = 28
const BRANCH_Y = 58
const MAIN = [
  { sha: '8f2a1c0', x: 9, at: 0 },
  { sha: 'b71e9d4', x: 23, at: 0 },
  { sha: '40c3f7a', x: 37, at: 0 },
  { sha: 'd95b2e1', x: 53, at: 2 },
  { sha: '1a6f08c', x: 67, at: 2 },
]
const LANDED_X = 83

const QUEUE = [{ id: 'projects-a91d' }, { id: 'projects-q5tz' }, { id: 'projects-h8ne' }]

// Click by click with the weld terminal: 2 rebases onto a main that moved, 3 gates the rebased
// tree, 4 fast-forwards main onto it, 5 hands the queue to the next land bead.
const rebased = computed(() => props.clicks >= 2)
const landed = computed(() => props.clicks >= 4)

const tip = computed(() => (landed.value ? LANDED_X : rebased.value ? MAIN[4].x : MAIN[2].x))
const parent = computed(() => (rebased.value ? MAIN[4] : MAIN[1]))
const bead = computed(() => ({
  x: rebased.value ? LANDED_X : MAIN[2].x,
  y: landed.value ? MAIN_Y : BRANCH_Y,
}))

const fork = computed(() => {
  const { x: px } = parent.value
  const { x: bx, y: by } = bead.value
  const mid = (px + bx) / 2
  return `M ${px} ${MAIN_Y} C ${mid} ${MAIN_Y}, ${mid} ${by}, ${bx} ${by}`
})

const check = computed(() => {
  if (props.clicks < 2) return { kind: 'green', text: '✓ green' }
  if (props.clicks < 3) return { kind: 'stale', text: '? green on an old main' }
  return { kind: 'green', text: '✓ gate on the rebased tree' }
})

// Once weld has landed the head, the rest move up one place.
const chipX = (i) => 6 + (props.clicks >= 5 ? Math.max(i - 1, 0) : i) * 31
</script>

<style scoped>
.stage {
  --weld: #b98be0;
  --green: #5fd38d;
  --line: rgba(255, 255, 255, 0.45);
  position: relative;
  height: 100%;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.6rem;
  color: #fff;
}

.rail {
  position: absolute;
  left: 9%;
  top: 28%;
  height: 2px;
  background: var(--line);
  transition: width 600ms ease 300ms;
}

svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.fork {
  fill: none;
  stroke: var(--weld);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  transition: d 700ms ease 400ms;
}

.commit {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -0.45rem);
  transition: left 700ms ease 400ms, top 700ms ease 400ms, opacity 400ms ease;
}

.dot {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: #1a0f1c;
}

.sha {
  margin-top: 0.3rem;
  color: #cfc6d4;
  white-space: nowrap;
}

.bead .dot {
  border-color: var(--weld);
  background: var(--weld);
}

.bead .sha { color: var(--weld); }

.check {
  margin-top: 0.15rem;
  white-space: nowrap;
  transition: color 300ms ease;
}

.check.green { color: var(--green); }
.check.stale { color: #9a8fa3; }

.off { opacity: 0; }

.ref {
  position: absolute;
  top: 17%;
  transform: translate(-50%, -50%);
  padding: 0 0.4rem;
  border-radius: 0.2rem;
  white-space: nowrap;
}

.local {
  background: #fff;
  color: #1a0f1c;
  transition: left 600ms ease 300ms;
}

.origin {
  left: 9%;
  border: 1px solid #fff;
  color: #fff;
}

.queue-title {
  position: absolute;
  left: 0;
  top: 73%;
  font-size: 0.75rem;
  color: #cfc6d4;
}

.chip {
  position: absolute;
  top: 82%;
  padding: 0.3rem 0.6rem;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.4rem;
  background: rgba(29, 29, 27, 0.92);
  color: #9a8fa3;
  white-space: nowrap;
  transition: left 600ms ease, top 600ms ease, opacity 500ms ease, border-color 300ms ease;
}

.chip.weld {
  border-color: var(--weld);
  color: #fff;
  box-shadow: 0 0 1.2rem color-mix(in srgb, var(--weld) 55%, transparent);
}

/* The landed bead leaves the queue upwards, towards main. */
.chip.gone {
  top: 64%;
  opacity: 0;
}

.owner {
  position: absolute;
  top: 0;
  left: 0.6rem;
  transform: translateY(-60%);
  padding: 0 0.4rem;
  background: var(--weld);
  color: #1a0f1c;
  font-size: 0.5rem;
}
</style>
