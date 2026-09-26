<template>
  <div class="slidev-layout fm-end">
    <img :src="backdrop" class="fm-backdrop" aria-hidden="true" />
    <h1 class="fm-end-title"><slot>Thanks for your attention</slot></h1>
    <img v-if="itenium" :src="iteniumLogo" class="fm-end-logo itenium" alt="itenium" />
    <img v-else :src="logo" class="fm-end-logo" alt="FrontMania Conference 2026" />
    <div class="fm-end-qr"><QRCode :url="repo" /></div>
    <a :href="repo" class="fm-end-qr-link">github.com/{{ source }}</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter, $slidev } = useSlideContext()
const itenium = computed(() => $slidev.configs.brand === 'itenium')
const source = computed(() => $frontmatter.source ?? 'itenium-be/git-worktrees')
const repo = computed(() => `https://github.com/${source.value}`)

const backdrop = new URL('../images/frontmania/backdrop.jpg', import.meta.url).href
const logo = new URL('../images/frontmania/logo.png', import.meta.url).href
const iteniumLogo = new URL('../theme/assets/logo-full-white.svg', import.meta.url).href
</script>

<style scoped>
.fm-end {
  --fm-cyan: #5FC3DB;
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

.fm-end-title {
  position: absolute;
  left: 0;
  top: 20.5%;
  width: 100%;
  z-index: 1;
  margin: 0;
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
}

/* White plate: the QR is dark-on-transparent, and the backdrop is a night scene. */
.fm-end-qr {
  position: absolute;
  left: 11%;
  top: 40%;
  width: 26%;
  aspect-ratio: 1;
  z-index: 1;
  box-sizing: border-box;
  padding: 0.9rem;
  border-radius: 0.8rem;
  background: #fff;
}

/* Shrink-wrapped and pulled back by half: the link is wider than the QR, so a box
   of the QR's width would overflow to one side and read as off-centre. */
.fm-end-qr-link {
  position: absolute;
  left: 24%;
  top: 88%;
  z-index: 1;
  transform: translateX(-50%);
  font-size: 1.05rem;
  white-space: nowrap;
  color: var(--fm-cyan);
  text-decoration: none;
}

.fm-end-logo {
  position: absolute;
  left: 60%;
  top: 40%;
  width: 32%;
  height: 46%;
  z-index: 1;
  object-fit: contain;
}

.fm-end-logo.itenium {
  left: 56%;
  top: 52%;
  width: 36%;
  height: 18%;
  filter: drop-shadow(0 0.3rem 1rem rgba(0, 0, 0, 0.8));
}
</style>
