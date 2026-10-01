<template>
  <div class="hub">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line
        v-for="w in placed"
        :key="w.name"
        x1="50"
        y1="50"
        :x2="w.x"
        :y2="w.y"
        :class="{ poke: w.name === poked && clicks >= pokeAt }"
      />
    </svg>

    <div class="pulse" :class="{ go: clicks >= pokeAt }" />
    <div class="core">
      <span class="hand" />
      <span class="name">Bellows</span>
      <span class="tender">tender</span>
    </div>

    <div
      v-for="w in placed"
      :key="w.name"
      class="win"
      :class="{ idle: w.name === poked && clicks >= idleAt && clicks < pokeAt }"
      :style="{ left: `${w.x}%`, top: `${w.y}%`, '--color': w.color }"
    >
      <span class="label">{{ w.name }}</span>
      <span v-if="w.name === poked && clicks >= pokeAt" class="cmd">/work-a-bead</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  windows: { type: Array, required: true },
  poked: { type: String, required: true },
  idleAt: { type: Number, default: 1 },
  pokeAt: { type: Number, default: 2 },
  clicks: { type: Number, default: 0 },
})

// An ellipse rather than a circle: the slide is wide, and the labels need the room sideways.
const placed = computed(() =>
  props.windows.map((w, i) => {
    const a = -Math.PI / 2 + (i / props.windows.length) * 2 * Math.PI
    return { ...w, x: 50 + 36 * Math.cos(a), y: 50 + 38 * Math.sin(a) }
  }),
)
</script>

<style scoped>
/* The poke's pulse grows past the hub; clipping it keeps the card from flashing a scrollbar. */
.hub {
  position: relative;
  height: 100%;
  overflow: hidden;
  font-family: 'Cascadia Code', Consolas, monospace;
  color: #fff;
}

svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

line {
  stroke: rgba(255, 255, 255, 0.18);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  transition: stroke 300ms ease;
}

line.poke {
  stroke: #fff;
  stroke-dasharray: 6 6;
  animation: flow 700ms linear infinite;
}

@keyframes flow {
  to { stroke-dashoffset: 12; }
}

.core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9rem;
  height: 9rem;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #5fc3db;
  border-radius: 50%;
  background: rgba(29, 29, 27, 0.95);
}

.name {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #5fc3db;
}

.tender {
  margin-top: 0.2rem;
  font-size: 0.6rem;
  color: #cfc6d4;
}

/* The tender's sweep: one turn per tick. */
.hand {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50%;
  height: 2px;
  transform-origin: 0 50%;
  background: linear-gradient(to right, transparent, rgba(95, 195, 219, 0.7));
  animation: sweep 6s linear infinite;
}

@keyframes sweep {
  to { transform: rotate(360deg); }
}

.pulse {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9rem;
  height: 9rem;
  transform: translate(-50%, -50%);
  border: 2px solid #5fc3db;
  border-radius: 50%;
  opacity: 0;
}

.pulse.go {
  animation: pulse 1.4s ease-out 1;
}

@keyframes pulse {
  from { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(3.2); }
}

.win {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.label {
  padding: 0.1rem 0.7rem;
  background: var(--color);
  color: #1a0f1c;
  font-size: 1rem;
  box-shadow: 0 0 1.2rem color-mix(in srgb, var(--color) 50%, transparent);
  transition: background 300ms ease, box-shadow 300ms ease;
}

.win.idle .label {
  background: #5a5060;
  box-shadow: none;
}

.cmd {
  font-size: 0.7rem;
  color: #fff;
}
</style>
