<template>
  <div class="tmux-status">
    <div class="seg session">{{ session }}</div>
    <div class="seg winlist">
      <div
        v-for="(w, i) in windows"
        :key="i"
        class="win"
        :class="{ cur: w.active }"
      >{{ i }}:{{ w.name }}</div>
    </div>
    <div class="spacer"></div>
    <div class="seg wcount">{{ count }}</div>
    <div class="seg clock">{{ clock }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  session: { type: String, default: 'worktrees' },
  windows: { type: Array, default: () => [{ name: 'main', active: true }] },
  count: { type: String, default: '1 win' },
})

const clock = ref('--:--')
let timer = null
function tick() {
  const d = new Date()
  clock.value =
    String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}
onMounted(() => { tick(); timer = setInterval(tick, 15000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.tmux-status {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  height: 3.4vh;
  min-height: 24px;
  background: linear-gradient(var(--status), #097a4d);
  color: #02150d;
  font-weight: 700;
  font-family: var(--tmono);
  font-size: clamp(10px, 1.35vh, 15px);
  letter-spacing: 0.5px;
  box-shadow: 0 -2px 14px rgba(0, 255, 156, 0.25);
  white-space: nowrap;
  overflow: hidden;
}
.seg {
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
}
.session {
  background: #02150d;
  color: var(--green);
  font-weight: 800;
}
.winlist { display: flex; gap: 0; padding: 0; }
.win {
  padding: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
  opacity: 0.72;
  transition: all 0.25s ease;
}
.win.cur {
  background: #02150d;
  color: var(--green);
  opacity: 1;
  text-shadow: 0 0 6px rgba(0, 255, 156, 0.6);
}
.spacer { flex: 1; }
.wcount { background: #02150d; color: var(--amber); }
.clock { font-variant-numeric: tabular-nums; }
</style>
