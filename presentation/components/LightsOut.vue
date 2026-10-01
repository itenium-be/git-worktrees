<template>
  <Screens
    :sessions="dark ? sessions.slice(0, darkLabels.length) : sessions.slice(0, labels.length)"
    :labels="dark ? darkLabels : labels"
    :left="dark ? darkLabels.length - 3 : labels.length - 3"
    :clicks="3"
  />
  <LightBulb :off="dark" />
  <div v-if="clicks >= 1" class="going-dark">Going Dark</div>
</template>

<script setup>
import { inject, onUnmounted, ref, watch } from 'vue'
import LightBulb from './LightBulb.vue'
import Screens from './Screens.vue'

const props = defineProps({
  sessions: { type: Array, required: true },
  // Pane names before and after the lights go out; the middle and right monitors take the last three.
  labels: { type: Array, required: true },
  darkLabels: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

// The words come first, the light goes after: long enough to read "Going Dark" in a lit room.
const LIGHTS_OUT_MS = 1500

const dark = ref(false)
let timer
watch(
  () => props.clicks,
  (c) => {
    clearTimeout(timer)
    if (c < 1) dark.value = false
    else timer = setTimeout(() => (dark.value = true), LIGHTS_OUT_MS)
  },
  { immediate: true },
)

// The sky belongs to the layout; it follows the bulb rather than the click.
const sky = inject('fmDawn', null)
watch(dark, (d) => sky && (sky.value = d ? 0 : 1), { immediate: true })

onUnmounted(() => {
  clearTimeout(timer)
  if (sky) sky.value = 0
})
</script>

<style scoped>
/* Fades in on the click, holds until the light is gone, then dissolves into the dark it names. */
.going-dark {
  position: absolute;
  left: 50%;
  top: 55%;
  z-index: 3;
  transform: translate(-50%, -50%);
  font-size: 4.5rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  white-space: nowrap;
  color: #fff;
  text-shadow: 0 0 2rem rgba(0, 0, 0, 0.9);
  opacity: 0;
  pointer-events: none;
  animation: going-dark 4.5s ease-out 1 forwards;
}

@keyframes going-dark {
  10% { opacity: 1; letter-spacing: 0.06em; }
  45% { opacity: 1; letter-spacing: 0.1em; filter: blur(0); }
  100% { opacity: 0; letter-spacing: 0.4em; filter: blur(6px); }
}
</style>
