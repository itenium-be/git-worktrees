<template>
  <div class="slidev-layout fm-cover">
    <img :src="backdrop" class="fm-backdrop" aria-hidden="true" />
    <img :src="logo" class="fm-cover-logo" alt="FrontMania Conference 2026" />
    <div class="fm-cover-slot"><slot /></div>
  </div>
</template>

<script setup>
const backdrop = new URL('../images/frontmania/backdrop.jpg', import.meta.url).href
const logo = new URL('../images/frontmania/logo.png', import.meta.url).href
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
