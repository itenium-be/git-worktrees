<template>
  <div class="graph">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path v-for="e in edges" :key="e.key" :d="e.d" :class="{ hidden: e.hidden }" />
    </svg>
    <div
      v-for="b in nodes"
      :key="b.id"
      class="bead"
      :class="[b.lane, b.now.state, { dim: b.now.dim }]"
      :style="{ left: `${b.x}%`, top: `${b.y}%`, width: `${width}%` }"
    >
      <span v-if="b.now.owner" class="owner">{{ b.now.owner }}</span>
      <span class="id">{{ b.id }}</span>
      <span class="name">{{ b.title }}</span>
      <span v-if="b.now.note" class="note">{{ b.now.note }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // `{ id, title, lane, x, y, after: [ids] }`, x/y being the node's centre in % of the graph.
  beads: { type: Array, required: true },
  width: { type: Number, default: 20 },
  // Optional `{ [id]: [{ at, state, owner, note, dim }] }`: the last entry whose click has landed
  // wins. With it, a bead that has no state yet is shown as blocked; `hidden` keeps it off the graph.
  live: { type: Object, default: null },
  clicks: { type: Number, default: 0 },
})

const nodes = computed(() =>
  props.beads.map((b) => {
    if (!props.live) return { ...b, now: {} }
    const reached = (props.live[b.id] ?? []).filter((s) => props.clicks >= s.at)
    return { ...b, now: reached.at(-1) ?? { state: 'blocked' } }
  }),
)

const edges = computed(() => {
  const byId = Object.fromEntries(nodes.value.map((b) => [b.id, b]))
  const half = props.width / 2
  return nodes.value.flatMap((to) =>
    (to.after ?? []).map((fromId) => {
      const from = byId[fromId]
      const x1 = from.x + half
      const x2 = to.x - half
      const mid = (x1 + x2) / 2
      return {
        key: `${fromId}-${to.id}`,
        d: `M ${x1} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${x2} ${to.y}`,
        hidden: from.now.state === 'hidden' || to.now.state === 'hidden',
      }
    }),
  )
})
</script>

<style scoped>
.graph {
  --implementer: #d98a8a;
  position: relative;
  height: 100%;
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
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
  transition: opacity 320ms ease;
}

path.hidden { opacity: 0; }

.bead {
  position: absolute;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0.5rem;
  border: 2px solid var(--lane);
  border-radius: 0.4rem;
  background: rgba(29, 29, 27, 0.92);
  font-size: 0.6rem;
  line-height: 1.3;
  color: #fff;
  transition: opacity 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
}

.bead.contract { --lane: #5fc3db; }
.bead.backend { --lane: #d9ad0b; }
.bead.frontend { --lane: #6ebca5; }
.bead.e2e { --lane: #e85d5d; }
.bead.land { --lane: #b98be0; }

.bead.blocked,
.bead.dim { opacity: 0.3; }
.bead.done { opacity: 0.45; }
.bead.hidden { opacity: 0; }

/* An implementer's claim recolours the bead; weld's `landing` keeps the land lane's own colour. */
.bead.claimed { --lane: var(--implementer); }

.bead.claimed,
.bead.landing {
  box-shadow: 0 0 1.2rem color-mix(in srgb, var(--lane) 55%, transparent);
}

.owner {
  position: absolute;
  top: 0;
  left: 0.6rem;
  transform: translateY(-60%);
  padding: 0 0.4rem;
  background: var(--lane);
  color: #1a0f1c;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.5rem;
}

.note {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.25rem;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.5rem;
  white-space: nowrap;
  color: var(--lane);
}

.id {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.5rem;
  color: var(--lane);
}
</style>
