<template>
  <div class="slidev-layout fm-cover">
    <img :src="backdrop" class="fm-backdrop" aria-hidden="true" />
    <img v-if="itenium" :src="iteniumLogo" class="fm-cover-logo itenium" alt="itenium" />
    <img v-else :src="logo" class="fm-cover-logo" alt="FrontMania Conference 2026" />
    <div class="fm-cover-slot"><slot /></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const backdrop = new URL('../images/frontmania/backdrop.jpg', import.meta.url).href
const logo = new URL('../images/frontmania/logo.png', import.meta.url).href
const iteniumLogo = new URL('../theme/assets/logo-full-white.svg', import.meta.url).href

const { $slidev } = useSlideContext()
const itenium = computed(() => $slidev.configs.brand === 'itenium')
</script>

<style scoped>
.fm-cover {
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

.fm-cover-logo {
  position: absolute;
  left: 26.6%;
  top: 11.3%;
  width: 46.8%;
  height: 77.4%;
  object-fit: contain;
}

.fm-cover-logo.itenium {
  left: 22%;
  top: 30%;
  width: 56%;
  height: 26%;
  filter: drop-shadow(0 0.4rem 1.2rem rgba(0, 0, 0, 0.8));
}

.fm-cover-slot {
  position: absolute;
  inset: auto 0 1.8% 0;
  z-index: 1;
  text-align: center;
  color: #fff;
}

/* The backdrop is a photograph, so the talk title carries its own contrast. */
.fm-cover-slot :deep(p) {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 0.15rem 1rem rgba(0, 0, 0, 0.75);
}
</style>
