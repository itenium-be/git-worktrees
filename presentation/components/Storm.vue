<template>
  <div class="storm" :class="['phase-' + phase]">
    <!-- Fixed, so the weather escapes the layout card and covers the whole slide. The slide
         container is transformed, so `fixed` resolves against it rather than the window. -->
    <div class="fxlayer">
      <div class="weather" :class="{ shake }">
        <div class="rain" />
        <svg class="sky" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <polyline v-if="bolt" class="bolt" :points="bolt" />
        </svg>
        <div class="backlight" :class="{ lit: flash }" />
        <div class="flash" :class="{ lit: flash }" />
      </div>
      <img :src="backdrop" class="silhouette" :style="{ opacity: 1 - dawn }" aria-hidden="true" />
    </div>

    <slot :flash="flash" :shake="shake" />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'

const backdrop = new URL('../images/frontmania/backdrop.jpg', import.meta.url).href

const props = defineProps({
  // 0 full storm · 1 rain only · 2 dry night · 3 sunrise.
  phase: { type: Number, default: 0 },
})

const dawn = computed(() => (props.phase >= 3 ? 1 : 0))

// The sunrise itself belongs to the layout: it owns the backdrop the sky is painted on.
const layoutDawn = inject('fmDawn', null)
watch(dawn, (v) => layoutDawn && (layoutDawn.value = v), { immediate: true })
onUnmounted(() => layoutDawn && (layoutDawn.value = 0))

const flash = ref(false)
const shake = ref(false)
const bolt = ref('')
let timer

function makeBolt() {
  const x = 100 + Math.random() * 800
  const end = 480 + Math.random() * 380
  const pts = [[x, -20]]
  let cx = x
  for (let y = 50; y < end; y += 55 + Math.random() * 50) {
    cx += (Math.random() - 0.5) * 120
    pts.push([cx, y])
  }
  return pts.map((p) => p.join(',')).join(' ')
}

function strike() {
  bolt.value = makeBolt()
  flash.value = true
  setTimeout(() => (flash.value = false), 90)
  setTimeout(() => (flash.value = true), 170)
  setTimeout(() => {
    flash.value = false
    bolt.value = ''
  }, 380)
  // Thunder trails the flash; simultaneous reads as a glitch, not a storm.
  setTimeout(() => {
    shake.value = true
    setTimeout(() => (shake.value = false), 700)
  }, 450)
}

function schedule() {
  timer = setTimeout(() => {
    strike()
    schedule()
  }, 2600 + Math.random() * 5200)
}

onMounted(() => {
  if (props.phase === 0) schedule()
})

watch(
  () => props.phase,
  (p) => {
    clearTimeout(timer)
    if (p === 0) {
      schedule()
      return
    }
    flash.value = false
    shake.value = false
    bolt.value = ''
  },
)

onUnmounted(() => clearTimeout(timer))
</script>

<style scoped>
.storm {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

.fxlayer {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.weather {
  position: absolute;
  inset: 0;
}

.weather.shake {
  animation: shake 700ms ease-out;
}

@keyframes shake {
  0%, 100% { transform: none; }
  15% { transform: translate(3px, -2px); }
  30% { transform: translate(-3px, 2px); }
  45% { transform: translate(2px, 2px); }
  60% { transform: translate(-2px, -1px); }
  80% { transform: translate(1px, 1px); }
}

/* The storm is the problem; the payoff is it letting up, one stone at a time. */
.rain,
.silhouette {
  transition: opacity 1200ms ease, filter 1200ms ease;
}

.storm.phase-2 .rain,
.storm.phase-3 .rain,
.storm.phase-4 .rain {
  opacity: 0;
}

.storm.phase-2 .silhouette,
.storm.phase-3 .silhouette,
.storm.phase-4 .silhouette {
  filter: brightness(1.3);
}

.rain {
  position: absolute;
  /* Overhang keeps the diagonal streaks from leaving bald corners. */
  inset: -20% -15%;
  background-image: repeating-linear-gradient(
    12deg,
    rgba(180, 220, 240, 0) 0 7px,
    rgba(180, 220, 240, 0.22) 7px 8px,
    rgba(180, 220, 240, 0) 8px 16px
  );
  background-size: 100% 180px;
  animation: rain 520ms linear infinite;
  opacity: 0.55;
}

@keyframes rain {
  to { background-position: -40px 180px; }
}

/* The backdrop's own foreground, re-drawn over the weather so it occludes it the way a real
   foreground would. Rain landing on that pure-black silhouette is what traced its outline. */
.silhouette {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Opaque before the silhouette starts (~83%); the fade above it lands in the mist. */
  mask-image: linear-gradient(to bottom, transparent 0 70%, #000 83%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0 70%, #000 83%);
}

.sky {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.bolt {
  fill: none;
  stroke: #eaf6ff;
  stroke-width: 2.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 10px #9fd8ff) drop-shadow(0 0 26px #5FC3DB);
}

.flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(140% 135% at 50% 0%, #eaf6ff 0%, rgba(160, 210, 255, 0.35) 45%, transparent 80%);
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 70ms linear;
}

.flash.lit {
  opacity: 0.9;
}

/* Rim light behind the stones, so a flash reads as backlighting rather than a white wash. */
.backlight {
  position: absolute;
  left: 50%;
  /* Sits on the silhouette's ridge, so the glow reads as light from behind the horizon. */
  bottom: 18%;
  width: 120%;
  height: 60%;
  transform: translateX(-50%);
  background: radial-gradient(60% 100% at 50% 100%, rgba(150, 220, 255, 0.55), transparent 70%);
  opacity: 0;
  transition: opacity 90ms linear;
}

.backlight.lit {
  opacity: 1;
}
</style>
