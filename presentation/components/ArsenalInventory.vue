<template>
  <div class="inv">
    <div v-for="(w, i) in weapons" :key="w.name" class="slot" :class="{ on: clicks > Math.floor(i / COLS) }">
      <div class="item">
        <div class="icon">{{ w.icon }}</div>
        <div class="name" :class="{ small: w.small }">{{ w.name }}</div>
      </div>
      <div class="body">
        <div class="tool">{{ w.tool }}</div>
        <!-- Always rendered, so a slot without one keeps its title level with its neighbours. -->
        <div class="kills">{{ w.kills ?? '\u00a0' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  weapons: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

// One row of the inventory lands per click.
const COLS = 3
</script>

<style scoped>
.inv {
  --cyan: #5fc3db;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: center;
  gap: 0.8rem;
  padding: 0 1.5%;
  box-sizing: border-box;
  color: #fff;
}

/* An RPG inventory slot: sunken, bevelled, the item icon in a square well. */
.slot {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid rgba(95, 195, 219, 0.55);
  border-radius: 0.6rem;
  background: linear-gradient(180deg, rgba(20, 20, 18, 0.94), rgba(29, 40, 44, 0.94));
  box-shadow: inset 0 0.15rem 0.5rem rgba(0, 0, 0, 0.6), 0 0.6rem 1.4rem rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateY(0.6rem);
  transition: opacity 450ms ease, transform 450ms ease;
}

.slot.on {
  opacity: 1;
  transform: none;
}

.item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.icon {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.45rem;
  background: rgba(0, 0, 0, 0.55);
  box-shadow: inset 0 0 0 1px rgba(245, 182, 66, 0.45);
  font-size: 1.45rem;
}

.body {
  min-width: 0;
}

.name {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0.45;
}

.name.small {
  font-size: 0.5rem;
}

.tool {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  color: #f5b642;
}

.kills {
  margin-top: 0.1rem;
  font-size: 0.8rem;
  font-style: italic;
  opacity: 0.7;
}
</style>
