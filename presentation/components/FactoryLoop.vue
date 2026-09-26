<template>
  <div class="loop">
    <div class="row">
      <template v-for="(n, i) in nodes" :key="n.name">
        <div v-if="i" class="arrow" :class="{ on: clicks >= n.at }">→</div>
        <div class="node" :class="{ on: clicks >= n.at, many: n.many }">
          <div class="name">{{ n.name }}</div>
          <div class="who">{{ n.who }}</div>
          <div class="does">{{ n.does }}</div>
          <div class="scar" :class="{ on: clicks >= scarAt }">{{ n.scar }}</div>
        </div>
      </template>
    </div>
    <div class="back" :class="{ on: clicks >= feedback.at }">
      <span class="hook">↑</span>
      <div class="node on">
        <div class="name">{{ feedback.name }}</div>
        <div class="who">{{ feedback.who }}</div>
        <div class="does">{{ feedback.does }}</div>
      </div>
      <span class="line">← evidence from the running systems</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nodes: { type: Array, required: true },
  feedback: { type: Object, required: true },
  scarAt: { type: Number, default: 99 },
  clicks: { type: Number, default: 0 },
})
</script>

<style scoped>
.loop {
  --cyan: #5fc3db;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
  padding: 0 1%;
  box-sizing: border-box;
  color: #fff;
}

.row {
  display: flex;
  align-items: stretch;
  gap: 0.3rem;
}

.node {
  flex: 1;
  min-width: 0;
  padding: 0.7rem 0.75rem;
  border: 2px solid var(--cyan);
  border-radius: 1rem;
  background: rgba(29, 29, 27, 0.88);
  opacity: 0;
  visibility: hidden;
  transition: opacity 320ms ease;
}

.node.on,
.arrow.on,
.back.on {
  opacity: 1;
  visibility: visible;
}

.node.many {
  box-shadow: 0.35rem 0.35rem 0 -2px rgba(29, 29, 27, 0.88), 0.35rem 0.35rem 0 0 var(--cyan),
    0.7rem 0.7rem 0 -2px rgba(29, 29, 27, 0.88), 0.7rem 0.7rem 0 0 var(--cyan);
}

.name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--cyan);
}

.who {
  margin-top: 0.2rem;
  font-size: 0.65rem;
  font-style: italic;
  opacity: 0.6;
}

.does {
  margin-top: 0.45rem;
  font-size: 0.72rem;
  line-height: 1.3;
}

.scar {
  margin-top: 0.45rem;
  font-size: 0.68rem;
  line-height: 1.3;
  color: #f5b642;
  opacity: 0;
  transition: opacity 320ms ease;
}

.scar.on {
  opacity: 1;
}

.arrow {
  align-self: center;
  font-size: 1.1rem;
  color: var(--cyan);
  opacity: 0;
  visibility: hidden;
  transition: opacity 320ms ease;
}

.back {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 60%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 320ms ease;
}

.back .node {
  flex: 0 0 34%;
}

.back .hook {
  font-size: 1.6rem;
  color: var(--cyan);
}

.back .line {
  flex: 1;
  font-size: 0.8rem;
  font-style: italic;
  opacity: 0.7;
  white-space: nowrap;
}
</style>
