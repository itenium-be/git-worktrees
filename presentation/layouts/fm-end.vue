<template>
  <div class="slidev-layout fm-end">
    <img :src="backdrop" class="fm-backdrop" aria-hidden="true" />
    <h1 class="fm-end-title"><slot>Thanks for your attention</slot></h1>
    <div class="fm-social">
      <img :src="xIcon" class="fm-x" alt="X" />
      <span class="fm-hash">#FrontMania</span>
    </div>
    <img :src="logo" class="fm-end-logo" alt="FrontMania Conference 2026" />
  </div>
</template>

<script setup>
const backdrop = new URL('../images/frontmania/backdrop.jpg', import.meta.url).href
const logo = new URL('../images/frontmania/logo.png', import.meta.url).href
const xIcon = new URL('../images/frontmania/x.png', import.meta.url).href
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

.fm-social {
  position: absolute;
  left: 0;
  top: 39%;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: var(--fm-cyan);
}

.fm-x {
  height: 1.4rem;
  width: auto;
}

.fm-end-logo {
  position: absolute;
  left: 39.1%;
  top: 56.9%;
  width: 21.7%;
  height: 36%;
  z-index: 1;
  object-fit: contain;
}
</style>
