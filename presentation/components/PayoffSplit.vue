<template>
  <div class="split">
    <svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        v-for="(t, i) in trees"
        :key="i"
        class="wire"
        :class="{ live: clicks >= t.at }"
        :style="{ transitionDelay: i * 180 + 'ms', stroke: COLORS[t.agent] }"
        :d="wire(i)"
      />
    </svg>

    <div class="core">
      <div class="disc">
        <span class="mono">.git</span>
      </div>
      <p class="core-label">one object store<br />one set of refs</p>
    </div>

    <div class="trees">
      <div
        v-for="(t, i) in trees"
        :key="i"
        class="tree"
        :class="{ show: clicks >= t.at }"
        :style="{ transitionDelay: i * 180 + 'ms', '--agent': COLORS[t.agent] }"
      >
        <div class="tree-head">
          <span class="dot" />
          <span class="mono path">{{ t.path }}</span>
        </div>
        <div class="tree-meta">
          <span class="mono branch">{{ t.branch }}</span>
          <span class="agent">{{ t.agent }}</span>
        </div>
        <div class="tree-state">own <code>HEAD</code> · own index · own <code>node_modules</code></div>
      </div>
    </div>

    <div class="facts">
      <p
        v-for="(f, i) in facts"
        :key="i"
        class="fact"
        :class="{ show: clicks >= f.at }"
        v-html="fmt(f.text)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  trees: { type: Array, required: true },
  facts: { type: Array, default: () => [] },
  clicks: { type: Number, default: 0 },
})

const COLORS = { claude: '#D97757', codex: '#2DB88E', gemini: '#8E7CF0' }

// viewBox is 100x100 with preserveAspectRatio none, so x/y are percentages of the box.
const ROWS = [26, 50, 74]
const wire = (i) => `M 22 50 C 40 50, 42 ${ROWS[i]}, 58 ${ROWS[i]}`

const fmt = (t) =>
  t.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
</script>

<style scoped>
.split {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 0;
  padding: 0 2rem 4.5rem;
  box-sizing: border-box;
}

.wires {
  position: absolute;
  inset: 0 2rem 4.5rem;
  width: calc(100% - 4rem);
  height: calc(100% - 4.5rem);
}

.wire {
  fill: none;
  stroke-width: 0.5;
  /* Non-scaling would need vector-effect; the box is near-square so plain width is close enough. */
  stroke-linecap: round;
  opacity: 0;
  transition: opacity 500ms ease;
}

.wire.live {
  opacity: 0.75;
}

.core {
  position: relative;
  z-index: 1;
  flex: 0 0 22%;
  text-align: center;
}

.disc {
  display: grid;
  place-items: center;
  width: 8.5rem;
  height: 8.5rem;
  margin: 0 auto;
  border-radius: 50%;
  border: 2px solid var(--fm-cyan, #5FC3DB);
  background: radial-gradient(circle at 50% 45%, rgba(95, 195, 219, 0.4), rgba(20, 22, 26, 0.92) 70%);
  box-shadow: 0 0 2.5rem rgba(95, 195, 219, 0.45);
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
}

.core-label {
  margin: 0.9rem 0 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #fff;
  opacity: 0.75;
}

.trees {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.85rem;
  margin-left: 14%;
}

.tree {
  padding: 0.7rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid var(--agent);
  border-left-width: 4px;
  background: rgba(20, 22, 26, 0.92);
  color: #fff;
  opacity: 0;
  transform: translateX(1.5rem);
  transition: opacity 500ms ease, transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tree.show {
  opacity: 1;
  transform: none;
}

.tree-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--agent);
}

.path {
  font-size: 1.05rem;
  font-weight: 700;
}

.tree-meta {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-top: 0.15rem;
}

.branch {
  font-size: 0.85rem;
  color: var(--fm-cyan, #5FC3DB);
}

.agent {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--agent);
}

.tree-state {
  margin-top: 0.3rem;
  font-size: 0.78rem;
  opacity: 0.65;
}

.facts {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1rem;
  text-align: center;
}

.fact {
  margin: 0.3rem 0;
  font-size: 1rem;
  color: #fff;
  opacity: 0;
  transform: translateY(0.5rem);
  transition: opacity 420ms ease, transform 420ms ease;
}

.fact.show {
  opacity: 0.92;
  transform: none;
}

.mono,
code {
  font-family: ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
}

.fact :deep(b) { color: var(--fm-cyan, #5FC3DB); }

.fact :deep(code),
.tree-state code {
  padding: 0.05em 0.35em;
  border-radius: 0.25rem;
  background: rgba(95, 195, 219, 0.16);
  font-size: 0.92em;
  color: var(--fm-cyan, #5FC3DB);
}
</style>
