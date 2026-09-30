<template>
  <div class="hm">
    <div class="grid">
      <div />
      <div
        v-for="(s, i) in stages"
        :key="s.title"
        class="head"
        :class="{ on: clicks >= i + 1 }"
        :style="{ '--speed': s.color }"
      >
        <div class="title">{{ s.title }}</div>
        <div class="speed">{{ s.speed }}</div>
      </div>

      <template v-for="(c, r) in checks" :key="c.name">
        <div class="name" :class="{ on: clicks >= rowAt(r) }">{{ c.name }}</div>
        <div
          v-for="(s, i) in stages"
          :key="s.title"
          class="cell"
          :class="{ on: clicks >= rowAt(r) }"
          :style="{ '--speed': s.color }"
        >
          <span v-if="c.runs.includes(i)" class="dot" />
        </div>
      </template>
    </div>

    <p class="moral" :class="{ on: clicks >= rowAt(checks.length) }">{{ moral }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  stages: { type: Array, required: true },
  checks: { type: Array, required: true },
  moral: { type: String, required: true },
  clicks: { type: Number, default: 0 },
})

// Stages land one per click, then the checks one row per click.
const rowAt = (r) => props.stages.length + 1 + r
</script>

<style scoped>
.hm {
  --cyan: #5fc3db;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 2%;
  box-sizing: border-box;
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: 9rem repeat(4, 1fr);
  gap: 0.5rem;
  padding: 1.4rem 1.6rem;
  border: 2px solid var(--cyan);
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
}

.head,
.name,
.cell {
  opacity: 0;
  transform: translateY(0.4rem);
  transition: opacity 400ms ease, transform 400ms ease;
}

.head.on,
.name.on,
.cell.on {
  opacity: 1;
  transform: none;
}

.head {
  padding: 0.6rem 0.4rem 0.7rem;
  text-align: center;
  border-bottom: 0.3rem solid var(--speed);
}

.title {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--cyan);
}

.speed {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.05rem 0.6rem;
  border-radius: 999px;
  background: var(--speed);
  color: #1d1d1b;
  font-size: 0.8rem;
  font-weight: 700;
}

.name {
  align-self: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.2rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
}

.dot {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: var(--speed);
  box-shadow: 0 0 0.8rem var(--speed);
}

/* `fixed` resolves against the slide's scaled container, which lets it escape the card's overflow clip. */
.moral {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 17px;
  margin: 0;
  text-align: center;
  font-size: 1.8rem;
  line-height: 1.1;
  font-style: italic;
  color: var(--cyan);
  opacity: 0;
  transition: opacity 400ms ease;
}

.moral.on {
  opacity: 1;
}
</style>
