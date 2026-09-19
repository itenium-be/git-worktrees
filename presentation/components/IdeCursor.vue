<template>
  <div class="ide-pcursor" :style="{ transform: `translate(${x}px, ${y}px)`, color }">
    <div class="ide-caret" :class="{ blink }" :style="{ background: color }"></div>
    <div class="ide-flag" :style="{ background: color }">{{ name }}</div>
  </div>
</template>

<script setup>
// Figma-style multiplayer presence cursor: a coloured caret + rounded name flag.
// Position is driven by the parent (x/y in px, relative to the nearest positioned ancestor).
defineProps({
  color: { type: String, default: '#4c9ffb' },
  name: { type: String, default: '' },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  blink: { type: Boolean, default: true },
})
</script>

<style scoped>
.ide-pcursor {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  pointer-events: none;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.ide-caret {
  width: 2px;
  height: 18px;
  border-radius: 2px;
  box-shadow: 0 0 8px currentColor;
}
.ide-caret.blink {
  animation: ide-blink 1s steps(1) infinite;
}
.ide-flag {
  position: absolute;
  top: -4px;
  left: 6px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #0b0e14;
  padding: 2px 8px;
  border-radius: 0 8px 8px 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
@keyframes ide-blink {
  50% { opacity: 0.15; }
}
@media (prefers-reduced-motion: reduce) {
  .ide-caret.blink { animation: none; }
  .ide-pcursor { transition-duration: 0.001s; }
}
</style>
