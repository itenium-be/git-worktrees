<template>
  <div class="slidev-layout fm-content" :class="{ dawn: level >= 1 }">
    <img :src="backdrop" class="fm-backdrop" aria-hidden="true" />
    <img :src="dawnBackdrop" class="fm-backdrop fm-backdrop-dawn" :style="{ opacity: level }" aria-hidden="true" />
    <div v-if="level > 0" class="fm-dawn" :style="{ opacity: level }">
      <div class="fm-dawn-wash" />
      <div class="fm-dawn-lift" />
      <div class="fm-rainbow" />
      <div v-for="cloud in clouds" :key="cloud.top" class="fm-cloud" :style="cloud" />
      <div v-for="bird in birds" :key="bird.top" class="fm-bird" :style="bird">
        <i><svg viewBox="0 0 100 40"><path d="M5 28 Q25 6 48 26 Q70 6 95 28" /></svg></i>
      </div>
    </div>
    <!-- Speaker details live in headmatter, which never reaches a later slide's $frontmatter. -->
    <div class="fm-speaker" :class="{ flicker: $frontmatter.flicker }">
      <template v-if="$frontmatter.showSpeaker"
        >{{ $frontmatter.speaker ?? $slidev.configs.speaker
        }}<span v-if="barTitle" class="fm-dot"> ∙ </span></template
      >{{ barTitle }}
    </div>
    <img :src="logo" class="fm-badge" alt="FrontMania" />
    <div class="fm-card" :class="{ bleed: $frontmatter.bleed, center: $frontmatter.center, naked: $frontmatter.naked, spill: $frontmatter.spill }"><slot /></div>
  </div>
</template>

<script setup>
import { computed, provide, ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const backdrop = new URL('../images/frontmania/backdrop.jpg', import.meta.url).href
// The same valley at sunrise. Swap in backdrop-dawn-balloon.webp for the other take.
const dawnBackdrop = new URL('../images/frontmania/backdrop-dawn.webp', import.meta.url).href
const logo = new URL('../images/frontmania/logo.png', import.meta.url).href

const birds = [
  { top: '14%', width: '1.4%', animationDuration: '41s', animationDelay: '-6s' },
  { top: '21%', width: '1%', animationDuration: '53s', animationDelay: '-25s' },
  { top: '9%', width: '0.8%', animationDuration: '64s', animationDelay: '-40s' },
  { top: '27%', width: '0.7%', animationDuration: '78s', animationDelay: '-11s' },
  { top: '17%', width: '1.1%', animationDuration: '47s', animationDelay: '-33s' },
]

// Drift right to left, against the birds, so the sky never reads as one moving sheet.
const clouds = [
  { top: '8%', width: '26%', height: '9%', animationDuration: '140s', animationDelay: '-20s', opacity: 0.5 },
  { top: '19%', width: '18%', height: '6%', animationDuration: '190s', animationDelay: '-90s', opacity: 0.38 },
  { top: '30%', width: '32%', height: '7%', animationDuration: '240s', animationDelay: '-150s', opacity: 0.28 },
]

// 0 night · 1 sunrise, and anything between. A slide sets it in headmatter; a component on
// the slide can instead raise it over the clicks by writing to the injected ref.
const raised = ref(0)
provide('fmDawn', raised)

// Calling this ourselves opts out of Slidev's auto-injected context, so the template's
// $slidev and $frontmatter have to come from here.
const { $slidev, $frontmatter } = useSlideContext()
const level = computed(() => ($frontmatter.dawn ? 1 : raised.value))
const barTitle = computed(() => $frontmatter.speakerTitle ?? $slidev.configs.speakerTitle)
</script>

<style scoped>
.fm-content {
  --fm-cyan: #5FC3DB;
  --fm-ink: #1D1D1B;
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 0;
}

.fm-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fm-speaker {
  position: absolute;
  left: 2.6%;
  top: 3.8%;
  z-index: 2;
  max-width: 78.9%;
  font-weight: 700;
  font-size: 1.5rem;
  color: #fff;
}

.fm-dot {
  color: var(--fm-cyan);
}

/* Uneven stops on purpose: an even pulse reads as a loading spinner, not a candle. */
.fm-speaker.flicker {
  animation: candle 4.3s infinite;
}

@keyframes candle {
  0%, 12%, 14%, 47%, 51%, 79%, 100% { opacity: 1; }
  13% { opacity: 0.55; }
  48% { opacity: 0.82; }
  50% { opacity: 0.4; }
  80% { opacity: 0.7; }
}

.fm-badge {
  position: absolute;
  left: 85.2%;
  top: 6.4%;
  width: 10.5%;
  height: 17.4%;
  z-index: 2;
  object-fit: contain;
}

.fm-card {
  position: absolute;
  left: 2.6%;
  top: 16.2%;
  width: 94.8%;
  height: 78.7%;
  z-index: 1;
  overflow: auto;
  box-sizing: border-box;
  padding: 2.3% 3.2%;
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
  border: 2px solid var(--fm-cyan);
  color: #fff;
}

.fm-card.bleed {
  display: flex;
  flex-direction: column;
  padding: 0.7% 0.9%;
}

/* Lets a slide run its content past the card's right border, out to the slide edge. */
.fm-card.spill {
  overflow: visible;
}

.fm-card.naked {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}

.fm-card.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.fm-card.center :deep(h1) {
  margin: 0;
  font-size: 3rem;
  color: #fff;
}

.fm-card.center :deep(h2) {
  margin: 1.5rem 0 0;
  font-size: 2rem;
  color: var(--fm-cyan);
}

.fm-card :deep(.accent) {
  color: var(--fm-cyan);
}

.fm-card :deep(h1) {
  margin: 0 0 1rem;
  font-size: 2.25rem;
  color: var(--fm-cyan);
}

.fm-card :deep(h2) {
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  color: #fff;
}

.fm-card :deep(a) {
  color: var(--fm-cyan);
}

.fm-card :deep(li::marker) {
  color: var(--fm-cyan);
}

/* --- dawn: the same night scene talked into a sunrise, for the "life was good" beats --- */

.fm-backdrop-dawn {
  transition: opacity 1200ms ease;
}

.fm-dawn {
  position: absolute;
  inset: 0;
  z-index: 0;
  transition: opacity 1200ms ease;
}

/* Every dawn layer stays under .fm-card (z-index 1) and stacks on the backdrop by DOM order. */
.fm-dawn-wash {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.5;
  mix-blend-mode: soft-light;
  background: linear-gradient(180deg, #7FD2FF 0%, #FFD98A 42%, #FF9E5E 68%, #6B4A2E 100%);
}

/* Sits on the painted sun, so the glow grows out of the light the scene already has. */
.fm-dawn-lift {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(45% 40% at 66% 54%, rgba(255, 238, 190, 0.5), transparent 70%);
}

.fm-rainbow {
  position: absolute;
  left: 50%;
  bottom: 22%;
  z-index: 0;
  width: 64%;
  aspect-ratio: 2 / 1;
  transform: translateX(-50%);
  /* Ring rather than arc: the bottom half is masked away, which is also where it fades. */
  background: radial-gradient(
    closest-side circle at 50% 100%,
    transparent 76%,
    rgba(255, 130, 130, 0.3) 78%,
    rgba(255, 190, 120, 0.3) 81%,
    rgba(255, 245, 150, 0.28) 84%,
    rgba(150, 230, 160, 0.26) 87%,
    rgba(140, 195, 255, 0.26) 90%,
    rgba(200, 155, 240, 0.22) 93%,
    transparent 95%
  );
  mask-image: linear-gradient(180deg, #000 55%, transparent 92%);
  -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 92%);
  filter: blur(1px);
}

.fm-cloud {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  background: radial-gradient(60% 80% at 40% 60%, rgba(255, 252, 245, 0.95), rgba(255, 240, 220, 0.5) 55%, transparent 75%);
  filter: blur(6px);
  animation-name: cloud-drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes cloud-drift {
  from { left: 108%; }
  to { left: -36%; }
}

/* Birds where the night scene has bats. */
.fm-bird {
  position: absolute;
  z-index: 0;
  opacity: 0.5;
  animation-name: bird-drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.fm-bird :deep(path) {
  fill: none;
  stroke: #4A3527;
  stroke-width: 8;
  stroke-linecap: round;
}

.fm-bird i {
  display: block;
  transform-origin: 50% 60%;
  animation: bird-flap 1.1s ease-in-out infinite;
}

/* `left` rather than a transform: the slide is scaled, so any pixel distance would drift with it. */
@keyframes bird-drift {
  from { left: -15%; }
  to { left: 115%; }
}

@keyframes bird-flap {
  50% { transform: scaleY(0.45); }
}

.fm-content.dawn .fm-speaker {
  transition: color 1200ms ease;
  color: #2A1D12;
  text-shadow: 0 0 0.7em rgba(255, 246, 220, 0.95), 0 0.05em 0.1em rgba(255, 255, 255, 0.7);
}

.fm-content.dawn .fm-dot {
  color: #C9722A;
}

.fm-content.dawn .fm-card:not(.naked) {
  background: rgba(255, 249, 238, 0.72);
  border-color: #E8A33D;
  color: var(--fm-ink);
  box-shadow: 0 1.5em 4em rgba(90, 50, 20, 0.35);
}

.fm-content.dawn .fm-card :deep(h1) {
  color: #2A1D12;
}

.fm-content.dawn .fm-card :deep(h2) {
  color: #1F8A5B;
}
</style>
