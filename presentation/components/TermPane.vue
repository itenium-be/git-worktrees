<template>
  <div v-if="node.children" class="term-split" :class="node.split">
    <template v-for="(child, i) in node.children" :key="child.id ?? i">
      <TermPane :node="child" :clicks="clicks" />
      <div v-if="i < node.children.length - 1" class="term-gutter" />
    </template>
  </div>

  <div v-else class="term-pane">
    <pre
      class="term-text"
      :class="{ focused: node.focusAt != null && clicks >= node.focusAt, alert: node.alert, tail: node.tail }"
      :style="{ fontSize: node.fontSize }"
    ><span class="term-lines"><span v-for="(l, i) in shown" :key="i" :class="{ muted: l.muted }">{{ l.text }}<span v-if="l.aside" class="muted">{{ l.aside }}</span>{{ i < shown.length - 1 ? '\n' : '' }}</span></span></pre>
    <div
      v-if="node.prompt"
      class="term-prompt"
      :style="{ fontSize: node.fontSize, '--session': node.prompt.color ?? '#d9ad0b' }"
    >
      <span class="term-session">{{ node.prompt.session }}</span>
      <span class="term-caret">&gt;</span>
      <pre class="term-text focused"><span v-for="(l, i) in prompt" :key="i">{{ l.text }}<span v-if="l.aside" class="muted">{{ l.aside }}</span>{{ i < prompt.length - 1 ? '\n' : '' }}</span></pre>
    </div>
    <div v-if="node.label" class="term-label" :class="{ show: clicks >= node.at }">{{ node.label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  clicks: { type: Number, default: 0 },
})

// A line is a plain string, or `{ at, until, text, muted, aside }`: shown from click `at`, gone from
// click `until`. `aside` trails the text, always muted.
const visible = (lines = []) =>
  lines
    .map((l) => (typeof l === 'string' ? { text: l } : l))
    .filter((l) => props.clicks >= (l.at ?? 0) && props.clicks < (l.until ?? Infinity))

const shown = computed(() => visible(props.node.lines))
// Claude Code's input box, pinned to the bottom of the pane.
const prompt = computed(() => visible(props.node.prompt?.lines))
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
  display: flex;
  flex-direction: column;
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

.term-prompt {
  position: relative;
  margin-top: auto;
  padding: 0.5em 0;
  border-top: 2px solid var(--session);
  border-bottom: 2px solid var(--session);
  display: flex;
  gap: 1ch;
}

.term-prompt .term-text {
  flex: 1;
  min-width: 0;
  font-size: inherit;
  white-space: pre-wrap;
}

.term-caret {
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
  line-height: 1.45;
  color: #d9d2e0;
}

.term-session {
  position: absolute;
  top: 0;
  right: 1.5em;
  transform: translateY(-50%);
  padding: 0 0.6em;
  background: var(--session);
  color: #1a0f1c;
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
  line-height: 1.45;
}

/* `tail` scrolls like a real terminal: top-anchored while it fits, then the newest lines stay in
   view. column-reverse pins the bottom edge; the growing child keeps short output at the top. */
.term-text.tail {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
}

.term-text.tail > .term-lines {
  flex: 1 0 auto;
}

.term-text.focused {
  filter: none;
}

.muted {
  opacity: 0.35;
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
