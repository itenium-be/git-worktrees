<template>
  <div class="graph-stage">
    <slot />
  </div>
</template>

<script setup>
// Full-bleed dark "git log --graph" stage. Purely presentational: the parent
// hero drops an <svg> + a .overlay inside. All shared dark-aesthetic text styles
// live here (via :deep) so the four heroes stay lean and visually identical.
</script>

<style scoped>
.graph-stage {
  position: absolute;
  inset: 0;
  z-index: 30;
  overflow: hidden;
  background: radial-gradient(ellipse 120% 90% at 50% 40%, #121824 0%, #0a0d12 60%, #05070a 100%);
  color: #e8ecf2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.graph-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(120, 150, 200, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 150, 200, 0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 45%, #000 30%, transparent 85%);
  mask-image: radial-gradient(ellipse 80% 80% at 50% 45%, #000 30%, transparent 85%);
}
.graph-stage::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 260px 40px rgba(0, 0, 0, 0.65);
}

/* ----- graph canvas ----- */
.graph-stage :deep(svg.graph) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* ----- text overlay system ----- */
.graph-stage :deep(.overlay) {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  padding: 6vh 6vw;
  pointer-events: none;
}
.graph-stage :deep(.foot) {
  margin-top: auto;
}
.graph-stage :deep(.headline) {
  font-size: clamp(26px, 3.6vw, 52px);
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.04;
}
.graph-stage :deep(.headline b) {
  background: linear-gradient(120deg, #d97757, #8e7cf0 55%, #2db88e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.graph-stage :deep(.sub) {
  color: #8792a3;
  font-size: clamp(14px, 1.6vw, 22px);
  margin-top: 0.5em;
}
.graph-stage :deep(.caption) {
  color: #8792a3;
  font-size: clamp(13px, 1.5vw, 20px);
}
.graph-stage :deep(.mono) {
  font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, Consolas, monospace;
}
.graph-stage :deep(.bullets) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
}
.graph-stage :deep(.bullets li) {
  display: flex;
  align-items: center;
  gap: 0.65em;
  color: #c3cbd8;
  font-size: clamp(14px, 1.55vw, 21px);
}
.graph-stage :deep(.bullets li::before) {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d97757;
  flex: none;
  box-shadow: 0 0 9px #d97757;
}
.graph-stage :deep(.cmd) {
  font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, Consolas, monospace;
  font-size: clamp(13px, 1.4vw, 18px);
  background: rgba(10, 14, 20, 0.72);
  border: 1px solid #26303d;
  border-radius: 12px;
  padding: 16px 20px;
  line-height: 1.85;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
}
.graph-stage :deep(.cmd .p) { color: #2db88e; }
.graph-stage :deep(.cmd .f) { color: #8e7cf0; }
.graph-stage :deep(.cmd .c) { color: #d97757; }
.graph-stage :deep(.cmd .g) { color: #8792a3; }

/* ----- entrance helpers (global keyframes, gg- prefixed to avoid deck collisions) ----- */
.graph-stage :deep(.rise) {
  opacity: 0;
  transform: translateY(16px);
  animation: gg-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.graph-stage :deep(.fade) {
  opacity: 0;
  animation: gg-fade 0.8s ease forwards;
}
</style>

<style>
@keyframes gg-rise {
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes gg-fade {
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  [class*='graph-stage'] * {
    animation-duration: 0.001s !important;
  }
}
</style>
