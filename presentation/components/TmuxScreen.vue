<template>
  <div class="tmux-screen">
    <div class="crt-body"><slot /></div>
    <div class="crt-scanlines" aria-hidden="true"></div>
    <div class="crt-flicker" aria-hidden="true"></div>
    <div class="crt-vignette" aria-hidden="true"></div>
  </div>
</template>

<script setup>
// CRT frame + tmux command-center chrome. Full-bleeds out of the itenium
// `default` layout's padded content box by countering its padding vars, so
// hero components can dominate the whole slide.
</script>

<style scoped>
.tmux-screen {
  /* palette — inherits to every descendant via CSS custom-property cascade */
  --bg: #04070a;
  --green: #00ff9c;
  --green-dim: #0aa06a;
  --green-deep: #063a28;
  --amber: #ffcf5c;
  --red: #ff3b47;
  --claude: #d97757;
  --codex: #2db88e;
  --gemini: #8e7cf0;
  --status: #0b8f5a;
  --tmono: "DejaVu Sans Mono", "Cascadia Code", Menlo, Consolas, "Liberation Mono", monospace;

  /* .content (the positioned ancestor) has box-sizing:border-box, so its
     padding box == the full slide; inset:0 fills the whole slide edge-to-edge. */
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 40;
  font-family: var(--tmono);
  color: var(--green);
  background:
    radial-gradient(120% 90% at 50% 42%, rgba(6, 32, 22, 0.55), rgba(2, 4, 6, 0.98) 78%),
    var(--bg);
  -webkit-font-smoothing: none;
}

.crt-body {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.crt-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 55;
  opacity: 0.5;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 2px,
    rgba(0, 0, 0, 0.28) 3px,
    rgba(0, 0, 0, 0) 4px
  );
  animation: tmux-scanroll 8s linear infinite;
}
@keyframes tmux-scanroll {
  from { background-position: 0 0; }
  to { background-position: 0 100px; }
}

.crt-flicker {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 56;
  background: rgba(0, 255, 156, 0.015);
  animation: tmux-flick 5s steps(20) infinite;
}
@keyframes tmux-flick {
  0%, 100% { opacity: 0.10; }
  8% { opacity: 0.03; }
  12% { opacity: 0.14; }
  20% { opacity: 0.05; }
  42% { opacity: 0.12; }
  58% { opacity: 0.02; }
  70% { opacity: 0.13; }
  84% { opacity: 0.05; }
}

.crt-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  mix-blend-mode: multiply;
  background: radial-gradient(130% 120% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .crt-scanlines, .crt-flicker { animation: none; }
}
</style>
