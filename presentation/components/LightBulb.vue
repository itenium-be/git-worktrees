<template>
  <div class="lamp" :class="{ off }">
    <span class="flex" />
    <div class="glow" />
    <svg class="bulb" viewBox="0 0 40 60" aria-hidden="true">
      <rect x="14" y="0" width="12" height="10" rx="1.5" class="cap" />
      <rect x="25" y="2" width="16" height="5" rx="1.5" class="cap" />
      <line x1="39" y1="7" x2="39" y2="76" class="string" />
      <rect x="37" y="76" width="4" height="6" rx="2" class="knob" />
      <path class="glass" d="M14 10 C14 18, 4 22, 4 34 A16 16 0 0 0 36 34 C36 22, 26 18, 26 10 Z" />
      <path class="filament" d="M16 14 L18 30 L20 26 L22 30 L24 14" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  off: { type: Boolean, default: false },
})
</script>

<style scoped>
.lamp {
  --warm: #ffd77a;
  position: absolute;
  left: 50%;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
  pointer-events: none;
}

/* Hangs from above the card, so the flex reaches up into the speaker bar. */
.flex {
  width: 2px;
  height: 6rem;
  margin-top: -5rem;
  background: #2a2a2a;
}

.bulb {
  position: relative;
  width: 2.6rem;
  overflow: visible;
}

.cap {
  fill: #6b6b6b;
}

.glass {
  fill: var(--warm);
  stroke: rgba(255, 255, 255, 0.6);
  stroke-width: 1;
  transition: fill 250ms ease;
}

.filament {
  fill: none;
  stroke: #b8741a;
  stroke-width: 1.2;
}

.glow {
  position: absolute;
  top: 1rem;
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 122, 0.55), transparent 65%);
  transform: translateY(-3.5rem);
  transition: opacity 250ms ease;
}

.off .glass {
  fill: rgba(200, 200, 210, 0.25);
}

.off .glow {
  opacity: 0;
}

/* The pull cord hangs from the switch on the socket, past the glass, and is tugged once on the
   click that turns the light off: the string stretches from its anchor, the knob follows. */
.string {
  stroke: #d8d2c4;
  stroke-width: 0.6;
  transform-box: fill-box;
  transform-origin: top;
}

.knob {
  fill: #d8d2c4;
}

.off .string {
  animation: stretch 700ms ease-in-out 1;
}

.off .knob {
  animation: tug 700ms ease-in-out 1;
}

@keyframes stretch {
  40% { transform: scaleY(1.2); }
}

@keyframes tug {
  40% { transform: translateY(14px); }
}
</style>
