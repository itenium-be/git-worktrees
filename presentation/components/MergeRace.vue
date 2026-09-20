<template>
  <Storm>
    <div class="rig">
      <div class="term">
        <div class="chrome">
          <div class="tab active"><span class="dot" />Ubuntu<span class="x">✕</span></div>
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
  </Storm>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import Storm from './Storm.vue'

const props = defineProps({
  lines: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

const visible = computed(() => props.lines.filter((l) => (l.at ?? 0) <= props.clicks))

const bodyEl = ref(null)

// A real session starts at the top and only scrolls once it has outgrown the window.
watch(
  visible,
  async () => {
    await nextTick()
    bodyEl.value?.scrollTo({ top: bodyEl.value.scrollHeight, behavior: 'smooth' })
  },
  // Jumping straight to a click state has to land at the bottom too.
  { immediate: true },
)
</script>

<style scoped>
.rig {
  display: flex;
  flex: 1;
  align-items: stretch;
  min-width: 0;
  padding: 0 2.5% 2%;
  box-sizing: border-box;
}

.term {
  position: relative;
  z-index: 3;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 2px solid rgba(95, 195, 219, 0.45);
  background: #1a0f1c;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.7);
}

.chrome {
  display: flex;
  align-items: stretch;
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
}

.tab.active { background: #1a0f1c; color: #fff; }

.dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: #E95420;
}

.x { opacity: 0.5; }
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
  color: var(--fm-cyan, #5FC3DB);
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
