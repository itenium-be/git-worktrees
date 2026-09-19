<template>
  <div class="pane" :class="agent">
    <div class="ptitle">
      <span v-if="leader" class="leader">{{ leader }}</span>
      <span v-if="dot" class="dot">●</span>
      <span class="name">{{ title }}</span>
      <span v-if="note" class="note">{{ note }}</span>
    </div>
    <div class="pbody"><slot /></div>
  </div>
</template>

<script setup>
// Generic tmux pane chrome. `agent` tints the border + title bar with that
// coding agent's accent colour.
defineProps({
  title: { type: String, default: '' },
  note: { type: String, default: '' },
  leader: { type: String, default: '' },
  agent: { type: String, default: '' }, // '' | claude | codex | gemini
  dot: { type: Boolean, default: false },
})
</script>

<style scoped>
.pane {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--green-deep);
  background: linear-gradient(180deg, rgba(3, 20, 14, 0.75), rgba(2, 8, 6, 0.85));
  box-shadow: inset 0 0 40px rgba(0, 60, 40, 0.25);
  font-family: var(--tmono);
}
.ptitle {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 10px;
  font-size: clamp(10px, 1.5vh, 14px);
  letter-spacing: 0.5px;
  color: var(--green);
  background: rgba(0, 40, 26, 0.6);
  border-bottom: 1px solid var(--green-deep);
}
.leader, .note { color: var(--green-dim); }
.pbody {
  flex: 1 1 auto;
  min-height: 0;
  padding: 8px 12px;
  overflow: hidden;
  font-size: clamp(11px, 1.7vh, 15px);
  line-height: 1.45;
  color: var(--green-dim);
}

.pane.claude { border-color: var(--claude); }
.pane.claude .ptitle { border-color: var(--claude); color: var(--claude); background: rgba(217, 119, 87, 0.12); }
.pane.codex { border-color: var(--codex); }
.pane.codex .ptitle { border-color: var(--codex); color: var(--codex); background: rgba(45, 184, 142, 0.12); }
.pane.gemini { border-color: var(--gemini); }
.pane.gemini .ptitle { border-color: var(--gemini); color: var(--gemini); background: rgba(142, 124, 240, 0.12); }
</style>
