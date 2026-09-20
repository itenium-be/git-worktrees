<template>
  <div class="ft" :style="{ gridTemplateColumns: track }">
    <section
      v-for="col in columns"
      :key="col.title"
      class="col"
      :class="{ wide: col.wide, on: clicks >= (col.showAt ?? 0) }"
    >
      <h2>{{ col.title }}</h2>
      <p v-for="line in col.lines" :key="line.text" class="line" :class="[line.kind, { on: clicks >= line.at }]">
        {{ line.text }}
      </p>
      <p v-if="col.tags" class="tags" :class="{ on: clicks >= col.tagsAt }">
        <span v-for="t in col.tags" :key="t">{{ t }}</span>
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

const track = computed(() => props.columns.map((c) => (c.wide ? '1.45fr' : '1fr')).join(' '))
</script>

<style scoped>
.ft {
  --cyan: #5fc3db;
  height: 100%;
  display: grid;
  /* auto row + centred content: both boxes take the taller one's height, neither stretches to the slide */
  align-content: center;
  gap: 2.5%;
  padding: 0 1.5%;
  box-sizing: border-box;
}

/* Hidden rather than absent: the grid keeps both boxes aligned and equally tall. */
.col {
  opacity: 0;
  visibility: hidden;
  transition: opacity 320ms ease;
  padding: 1.6rem 2rem;
  box-sizing: border-box;
  border: 2px solid var(--cyan);
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
  color: #fff;
}

.col.on {
  opacity: 1;
  visibility: visible;
}

.col h2 {
  margin: 0 0 1.1rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--cyan);
}

.line,
.tags {
  opacity: 0;
  visibility: hidden;
  transform: translateY(0.4rem);
  transition: opacity 320ms ease, transform 320ms ease;
}

.line.on,
.tags.on {
  opacity: 1;
  visibility: visible;
  transform: none;
}

.line {
  margin: 0 0 0.9rem;
  padding-left: 2rem;
  font-size: 1.2rem;
  line-height: 1.35;
  text-indent: -2rem;
}

.line::before {
  display: inline-block;
  width: 2rem;
  text-indent: 0;
  font-weight: 700;
}

.drop {
  text-decoration: line-through;
  text-decoration-color: rgba(255, 120, 110, 0.7);
}

.drop.on {
  opacity: 0.55;
}

.drop::before {
  content: '\2717';
  color: #ff786e;
}

.cost::before {
  content: '!';
  color: #f5b642;
}

.keep::before {
  content: '\2192';
  color: var(--cyan);
}

.tags {
  margin: 0.6rem 0 0;
  padding-left: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tags span {
  padding: 0.2rem 0.65rem;
  border: 1px solid rgba(95, 195, 219, 0.45);
  border-radius: 999px;
  font-size: 1rem;
  color: var(--cyan);
}
</style>
