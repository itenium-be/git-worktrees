<template>
  <div class="sweep" :style="{ gridTemplateRows: `repeat(${rows}, 1fr)` }">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path v-for="(s, i) in sources" :key="s.name" :class="{ on: clicks >= s.at }" :d="wireIn(i)" />
      <path v-for="(b, i) in beads" :key="b.title" :class="{ on: clicks >= b.at }" :d="wireOut(i)" />
      <path v-if="architect" class="to-architect" :class="{ on: clicks >= architect.at }" :d="wireOut(beads.length)" />
    </svg>

    <div class="sources">
      <section v-for="s in sources" :key="s.name" class="source" :class="{ on: clicks >= s.at }">
        <h3>{{ s.name }}</h3>
        <div class="tool">{{ s.tool }}</div>
        <div class="line">{{ s.line }}</div>
      </section>
    </div>

    <div class="spark">
      <span class="name">spark</span>
      <span class="does">reads · groups · files</span>
    </div>

    <section
      v-for="(b, i) in beads"
      :key="b.title"
      class="bead"
      :class="{ on: clicks >= b.at }"
      :style="{ gridRow: i + 1 }"
    >
      <span class="prio">{{ b.prio }}</span>
      <span class="id">{{ b.id }}</span>
      <span class="title">{{ b.title }}</span>
      <span class="labels">{{ b.labels.join(' · ') }}</span>
    </section>

    <section
      v-if="architect"
      class="architect"
      :class="{ on: clicks >= architect.at }"
      :style="{ gridRow: beads.length + 1 }"
    >
      <span class="name">{{ architect.name }}</span>
      <span class="who">{{ architect.who }}</span>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // `{ at, name, tool, line }`, one row each.
  sources: { type: Array, required: true },
  // `{ at, id, title, prio, labels }`, one row each, beside the sources.
  beads: { type: Array, required: true },
  // `{ at, name, who }`: one more row under the beads, for what spark cannot decide alone.
  architect: { type: Object, default: null },
  clicks: { type: Number, default: 0 },
})

// Wires run in the SVG's 0..100 space, so they have to agree with the grid's column split below.
const SOURCE_RIGHT = 38
const SPARK_LEFT = 44
const SPARK_RIGHT = 56
const BEAD_LEFT = 62

const rows = computed(() => props.beads.length + (props.architect ? 1 : 0))
const rowY = (i, n) => ((i + 0.5) / n) * 100

const wire = (x1, y1, x2, y2) => {
  const mid = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
}

const wireIn = (i) => wire(SOURCE_RIGHT, rowY(i, props.sources.length), SPARK_LEFT, 50)
const wireOut = (i) => wire(SPARK_RIGHT, 50, BEAD_LEFT, rowY(i, rows.value))
</script>

<style scoped>
.sweep {
  --spark: #6a9bcc;
  --p0: #e85d5d;
  --architect: #d9ad0b;
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 38fr 6fr 12fr 6fr 38fr;
  color: #fff;
}

svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

path {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  transition: stroke 400ms ease;
}

path.on {
  stroke: var(--spark);
  stroke-dasharray: 6 6;
  animation: flow 900ms linear infinite;
}

path.to-architect.on {
  stroke: var(--architect);
}

@keyframes flow {
  to { stroke-dashoffset: -12; }
}

.source,
.bead {
  position: relative;
  align-self: center;
  box-sizing: border-box;
  padding: 0.55rem 0.8rem;
  border-radius: 0.5rem;
  background: rgba(29, 29, 27, 0.92);
  opacity: 0;
  transition: opacity 400ms ease, border-color 400ms ease, transform 400ms ease;
}

.sources {
  grid-column: 1;
  grid-row: 1 / -1;
  display: grid;
  grid-auto-rows: 1fr;
}

.source {
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.source.on {
  opacity: 1;
  border-color: var(--spark);
}

h3 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--spark);
}

.tool,
.line,
.id,
.labels {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.55rem;
}

.tool {
  margin-top: 0.15rem;
  color: #9a8fa3;
}

.line {
  margin-top: 0.3rem;
  color: #ff9a9a;
}

.spark {
  grid-column: 3;
  grid-row: 1 / -1;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.9rem 0.4rem;
  border: 2px solid var(--spark);
  border-radius: 0.8rem;
  background: rgba(29, 29, 27, 0.92);
  box-shadow: 0 0 1.6rem color-mix(in srgb, var(--spark) 45%, transparent);
  text-align: center;
}

.spark .name {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 1rem;
  font-weight: 700;
  color: var(--spark);
}

.spark .does {
  font-size: 0.55rem;
  color: #cfc6d4;
}

.bead {
  grid-column: 5;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--p0);
  opacity: 0;
  transform: translateX(-1rem);
}

.bead.on {
  opacity: 1;
  transform: none;
}

.prio {
  position: absolute;
  top: 0;
  left: 0.6rem;
  transform: translateY(-60%);
  padding: 0 0.4rem;
  background: var(--p0);
  color: #1a0f1c;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.5rem;
}

.id {
  color: var(--p0);
}

.title {
  font-size: 0.65rem;
  line-height: 1.3;
}

.labels {
  margin-top: 0.2rem;
  color: #9a8fa3;
}

.architect {
  grid-column: 5;
  align-self: center;
  display: flex;
  flex-direction: column;
  padding: 0.55rem 0.8rem;
  border: 2px solid var(--architect);
  border-radius: 0.5rem;
  background: rgba(29, 29, 27, 0.92);
  opacity: 0;
  transform: translateX(-1rem);
  transition: opacity 400ms ease, transform 400ms ease;
}

.architect.on {
  opacity: 1;
  transform: none;
}

.architect .name {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--architect);
}

.architect .who {
  font-size: 0.55rem;
  color: #9a8fa3;
}
</style>
