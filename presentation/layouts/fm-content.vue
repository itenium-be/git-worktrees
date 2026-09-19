<template>
  <div class="slidev-layout fm-content">
    <img :src="backdrop" class="fm-backdrop" aria-hidden="true" />
    <!-- Speaker details live in headmatter, which never reaches a later slide's $frontmatter. -->
    <div class="fm-speaker">
      {{ $frontmatter.speaker ?? $slidev.configs.speaker }}
      <span class="fm-dot">∙</span>
      {{ $frontmatter.speakerTitle ?? $slidev.configs.speakerTitle }}
    </div>
    <img :src="logo" class="fm-badge" alt="FrontMania" />
    <div class="fm-card"><slot /></div>
  </div>
</template>

<script setup>
const backdrop = new URL('../images/frontmania/backdrop.jpg', import.meta.url).href
const logo = new URL('../images/frontmania/logo.png', import.meta.url).href
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
</style>
