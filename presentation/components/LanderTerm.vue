<template>
  <div class="rig">
    <div class="term">
      <div class="chrome">
        <div
          v-for="(tab, i) in tabs"
          :key="tab.title"
          class="tab"
          :class="{ active: i === activeIndex, born: clicks >= (tab.at ?? 0) }"
        >
          <span class="dot" :class="tab.icon" />{{ tab.title }}<span class="x">✕</span>
        </div>
        <span class="newtab">＋</span>
        <span class="spacer" />
        <span class="btn">—</span><span class="btn">▢</span><span class="btn">✕</span>
      </div>
      <div ref="bodyEl" class="body">
        <div class="feed">
          <p v-for="(l, i) in visible" :key="i" class="ln" :class="l.tone">{{ l.text || ' ' }}</p>
          <p class="ln caret">▋</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  tabs: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

// The last tab whose click has landed is the one in front.
const activeIndex = computed(() => {
  let idx = 0
  props.tabs.forEach((tab, i) => {
    if (props.clicks >= (tab.at ?? 0)) idx = i
  })
  return idx
})

const visible = computed(() =>
  props.tabs[activeIndex.value].lines.filter((l) => (l.at ?? 0) <= props.clicks),
)

const bodyEl = ref(null)

watch(
  visible,
  async () => {
    await nextTick()
    bodyEl.value?.scrollTo({ top: bodyEl.value.scrollHeight, behavior: 'smooth' })
  },
  { immediate: true },
)
</script>

<style scoped>
.rig {
  display: flex;
  flex: 1;
  align-items: stretch;
  min-width: 0;
}

.term {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #1a0f1c;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.55);
}

.chrome {
  display: flex;
  align-items: stretch;
  gap: 0.25rem;
  flex: 0 0 auto;
  padding: 0.3rem 0.4rem 0;
  background: #2b1a2e;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 0.9rem;
  color: #cfc6d4;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  border-radius: 0.35rem 0.35rem 0 0;
  /* A tab that has not been opened yet must not be on screen to be read ahead of. */
  opacity: 0;
  transform: translateY(-0.3rem);
  transition: opacity 320ms ease, transform 320ms ease, background 200ms ease;
}

.tab.born {
  opacity: 1;
  transform: none;
}

.tab.active {
  background: #1a0f1c;
  color: #fff;
}

.dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: #2e74c0;
}

.dot.ubuntu { background: #e95420; }
.dot.lander { background: var(--fm-cyan, #5fc3db); }

.x { opacity: 0.5; }
.newtab { display: flex; align-items: center; padding: 0 0.55rem; opacity: 0.75; }
.spacer { flex: 1; }
.btn { display: flex; align-items: center; padding: 0 0.6rem; opacity: 0.75; }

.body {
  flex: 1;
  min-height: 0;
  /* Scrolled from the script; the bar itself would break the illusion. */
  overflow: hidden;
  padding: 0.8rem 1.2rem;
}

.feed {
  width: 100%;
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
  font-size: 1.05rem;
  line-height: 1.5;
}

.ln {
  margin: 0;
  white-space: pre-wrap;
  color: #d9d2e0;
  animation: land 260ms ease both;
}

@keyframes land {
  from { opacity: 0; transform: translateY(0.35rem); }
}

.ln.cmd { color: #7fd1a0; }
.ln.you { color: #fff; font-weight: 700; }
.ln.tool { color: #9fb6d8; }
.ln.ok { color: #6fdc8c; font-weight: 700; }
.ln.bad { color: #ff7a6b; font-weight: 700; }
.ln.dim { color: #9a8fa4; }

.caret {
  color: var(--fm-cyan, #5fc3db);
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
