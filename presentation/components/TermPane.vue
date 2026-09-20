<template>
  <div v-if="node.children" class="term-split" :class="node.split">
    <template v-for="(child, i) in node.children" :key="child.id ?? i">
      <TermPane :node="child" :clicks="clicks" />
      <div v-if="i < node.children.length - 1" class="term-gutter" />
    </template>
  </div>

  <div v-else class="term-pane">
    <pre class="term-text" :class="{ focused: node.focusAt != null && clicks >= node.focusAt, alert: node.alert }">{{ node.lines.join('\n') }}</pre>
    <div v-if="node.label" class="term-label" :class="{ show: clicks >= node.at }">{{ node.label }}</div>
  </div>
</template>

<script setup>
defineProps({
  node: { type: Object, required: true },
  clicks: { type: Number, default: 0 },
})
</script>

<style scoped>
.term-split {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
}
.term-split.vertical { flex-direction: row; }
.term-split.horizontal { flex-direction: column; }

.term-gutter {
  flex: 0 0 1px;
  background: rgba(255, 255, 255, 0.18);
}

.term-pane {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 0.5rem 0.75rem;
  background: #1a0f1c;
}

/* Content is deliberately unreadable: a pane has to be recognised, not read. */
.term-text {
  margin: 0;
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  line-height: 1.45;
  color: #d9d2e0;
  white-space: pre;
  filter: blur(2.6px);
  user-select: none;
  transition: filter 420ms ease, color 420ms ease;
}

.term-text.focused {
  filter: none;
}

.term-text.alert {
  color: #ff6b6b;
}

.term-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  text-align: center;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 1.35rem;
  font-weight: 700;
  color: #5FC3DB;
  background: rgba(26, 15, 28, 0.72);
  opacity: 0;
  transition: opacity 260ms ease;
}

.term-label.show { opacity: 1; }
</style>
