<template>
  <div class="term-window">
    <div class="term-chrome">
      <div v-for="(tab, i) in tabs" :key="tab.title" class="term-tab" :class="{ active: i === activeIndex }">
        <span class="term-tab-icon" :class="tab.icon" />
        <span class="term-tab-title">{{ tab.title }}</span>
        <span class="term-tab-x">✕</span>
      </div>
      <span class="term-newtab">＋</span>
      <span class="term-chevron">⌄</span>
      <div class="term-spacer" />
      <span class="term-btn">—</span>
      <span class="term-btn">▢</span>
      <span class="term-btn close">✕</span>
    </div>

    <div class="term-body">
      <TermPane :key="activeIndex" :node="tabs[activeIndex].panes" :clicks="clicks" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tabs: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

// The last tab whose click has landed wins, so tabs switch as the talk advances.
const activeIndex = computed(() => {
  let idx = 0
  props.tabs.forEach((tab, i) => { if (props.clicks >= (tab.at ?? 0)) idx = i })
  return idx
})
</script>

<style scoped>
.term-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #1a0f1c;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.55);
}

.term-chrome {
  display: flex;
  align-items: stretch;
  gap: 0.25rem;
  flex: 0 0 auto;
  padding: 0.3rem 0.4rem 0;
  background: #2b1a2e;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 0.72rem;
  color: #cfc6d4;
}

.term-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 16rem;
  padding: 0.35rem 0.6rem;
  border-radius: 0.35rem 0.35rem 0 0;
  background: transparent;
  transition: background 200ms ease, color 200ms ease;
}

.term-tab.active {
  background: #1a0f1c;
  color: #fff;
}

.term-tab-icon {
  width: 0.7rem;
  height: 0.7rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #2E74C0;
}

.term-tab-icon.ubuntu { background: #E95420; }

.term-tab-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.term-tab-x { opacity: 0.5; }

.term-newtab,
.term-chevron,
.term-btn {
  display: flex;
  align-items: center;
  padding: 0 0.55rem;
  opacity: 0.75;
}

.term-spacer { flex: 1; }

.term-body {
  display: flex;
  flex: 1;
  min-height: 0;
}
</style>
