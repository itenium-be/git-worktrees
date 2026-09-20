<template>
  <div class="lanes">
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
      <g class="branches">
        <g v-for="(name, i) in lanes" :key="name" :transform="`translate(0 ${row(i)})`">
          <rect class="pill" x="8" y="-17" width="200" height="34" rx="17" />
          <text class="pill-label" x="108" y="6">{{ name }}</text>
        </g>
      </g>

      <g class="chaos" :class="{ gone: clicks >= 2 }">
        <path v-for="(d, i) in chaosPaths" :key="i" class="lane" :d="d" />
        <g class="bangs">
          <text v-for="(p, i) in BANGS" :key="i" class="bang" :x="p[0]" :y="p[1]">✕</text>
        </g>
      </g>

      <g class="queued" :class="{ on: clicks >= 2 }">
        <path v-for="(d, i) in queuedPaths" :key="i" class="lane" :d="d" />
        <path class="lane out" d="M720 280 L928 280" />
      </g>

      <g class="gate" :class="{ on: clicks >= 1 }">
        <rect class="box" x="560" y="220" width="160" height="120" rx="12" />
        <text class="gate-title" x="640" y="268">queue</text>
        <text class="gate-sub" x="640" y="300">1 lane</text>
      </g>

      <circle class="token" :class="{ on: clicks >= 3 }" cx="0" cy="280" r="9" />

      <g class="trunk">
        <line class="spine" x1="940" y1="30" x2="940" y2="500" />
        <text class="trunk-label" x="940" y="522">main</text>
        <text class="trunk-state" :class="{ ok: clicks >= 3 }" x="940" y="18">
          {{ clicks >= 3 ? '✓ always green' : '✗ red, sometimes' }}
        </text>
      </g>

      <text class="art" :class="{ on: clicks >= 1 }" x="640" y="392">
        Bors ’14 · Zuul · Mergify · Graphite · GitHub Merge Queue 💰
      </text>

      <text class="punch" :class="{ on: clicks >= 4 }" x="640" y="436">
        …or one session that may touch main
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  lanes: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

const row = (i) => 60 + i * 80

// Scrambled so no lane reaches the trunk without crossing another: the point of the slide.
const SWERVE = [430, 120, 500, 40, 380, 190]

const chaosPaths = computed(() =>
  props.lanes.map((_, i) => {
    const y = row(i)
    return `M212 ${y} C430 ${SWERVE[i]} 620 ${SWERVE[(i + 3) % SWERVE.length]} 928 280`
  }),
)

const queuedPaths = computed(() =>
  props.lanes.map((_, i) => `M212 ${row(i)} C380 ${row(i)} 430 280 556 280`),
)

const BANGS = [
  [782, 196],
  [854, 318],
  [700, 244],
]
</script>

<style scoped>
.lanes {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

svg {
  width: 100%;
  height: 100%;
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
}

.pill {
  fill: rgba(10, 18, 24, 0.8);
  stroke: rgba(95, 195, 219, 0.5);
  stroke-width: 1.5;
}

.pill-label {
  fill: #fff;
  font-size: 17px;
  text-anchor: middle;
}

.lane {
  fill: none;
  stroke: #9a8fa4;
  stroke-width: 2.5;
}

.chaos,
.queued {
  transition: opacity 600ms ease;
}

.chaos .lane {
  stroke: #ff7a6b;
  opacity: 0.85;
}

.chaos.gone {
  opacity: 0;
}

.queued {
  opacity: 0;
}

.queued.on {
  opacity: 1;
}

.queued .lane {
  stroke: var(--fm-cyan, #5fc3db);
}

.queued .out {
  stroke: #6fdc8c;
  stroke-width: 4;
}

.bang {
  fill: #ff7a6b;
  font-size: 30px;
  font-weight: 700;
  text-anchor: middle;
  animation: spark 1.4s ease-in-out infinite;
}

.bang:nth-child(2) { animation-delay: -0.5s; }
.bang:nth-child(3) { animation-delay: -0.9s; }

@keyframes spark {
  50% { opacity: 0.25; }
}

.gate {
  opacity: 0;
  transition: opacity 600ms ease;
}

.gate.on {
  opacity: 1;
}

.box {
  fill: rgba(10, 18, 24, 0.92);
  stroke: var(--fm-cyan, #5fc3db);
  stroke-width: 3;
}

.gate-title {
  fill: #fff;
  font-size: 26px;
  text-anchor: middle;
}

.gate-sub {
  fill: var(--fm-cyan, #5fc3db);
  font-size: 18px;
  text-anchor: middle;
}

.token {
  fill: #6fdc8c;
  opacity: 0;
  filter: drop-shadow(0 0 6px #6fdc8c);
}

.token.on {
  opacity: 1;
  animation: ferry 2.2s linear infinite;
}

@keyframes ferry {
  from { transform: translateX(720px); }
  to { transform: translateX(928px); }
}

.spine {
  stroke: #cfc6d4;
  stroke-width: 6;
  stroke-linecap: round;
}

.trunk-label {
  fill: #cfc6d4;
  font-size: 20px;
  text-anchor: middle;
}

.trunk-state {
  fill: #ff7a6b;
  font-size: 17px;
  text-anchor: middle;
  transition: fill 400ms ease;
}

.trunk-state.ok {
  fill: #6fdc8c;
}

.art,
.punch {
  font-size: 19px;
  text-anchor: middle;
  opacity: 0;
  transition: opacity 600ms ease;
}

.art {
  fill: #ffd98a;
}

.punch {
  fill: #fff;
  font-size: 22px;
}

.art.on,
.punch.on {
  opacity: 1;
}
</style>
