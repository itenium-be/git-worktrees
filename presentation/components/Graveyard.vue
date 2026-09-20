<template>
  <div class="graveyard">
    <div class="row">
      <div v-for="(s, i) in stones" :key="i" class="stone" :class="{ risen: clicks >= s.at }">
        <div class="engraving">
          <div class="sigil">{{ s.sigil }}</div>
          <div class="title">{{ s.title }}</div>
          <div class="rule" />
          <p v-for="(line, j) in s.lines" :key="j" class="line">{{ line }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stones: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})
</script>

<style scoped>
.graveyard {
  position: relative;
  display: flex;
  flex: 1;
  align-items: flex-end;
  min-height: 0;
  overflow: hidden;
}

.row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.75rem;
  width: 100%;
  height: 100%;
  padding-bottom: 4%;
}

.stone {
  display: flex;
  flex: 1 1 0;
  align-items: flex-start;
  justify-content: center;
  max-width: 19rem;
  height: 78%;
  padding: 3.25rem 1.25rem 1.5rem;
  /* The deck's standard card, bent into an arch at the top. */
  border-radius: 48% 48% 1.25rem 1.25rem / 28% 28% 1rem 1rem;
  background: rgba(29, 29, 27, 0.88);
  border: 2px solid var(--fm-cyan, #5FC3DB);
  box-shadow: 0 1rem 2.25rem rgba(0, 0, 0, 0.55);
  opacity: 0;
  transform: translateY(3.5rem);
  transition: opacity 560ms ease, transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.stone.risen {
  opacity: 1;
  transform: none;
}

.engraving {
  text-align: center;
  color: #fff;
}

.sigil {
  margin-bottom: 0.6rem;
  font-size: 2.4rem;
  line-height: 1;
}

.title {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--fm-cyan, #5FC3DB);
}

.rule {
  width: 42%;
  height: 1px;
  margin: 0.7rem auto;
  background: rgba(95, 195, 219, 0.35);
}

.line {
  margin: 0.4rem 0 0;
  font-size: 0.82rem;
  font-style: italic;
  line-height: 1.35;
  opacity: 0.78;
}

</style>
