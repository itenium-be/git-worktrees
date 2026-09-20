<template>
  <div class="approach">
    <Storm :phase="phase" v-slot="{ flash, shake }">
      <div class="scene" :class="{ shake, cleared: clicks >= TOWER_AT }">
        <div
          v-for="(c, i) in craft"
          :key="c.branch"
          class="craft"
          :class="{ down: i < landed, lit: flash }"
          :style="slot(i)"
        >
          <span class="wing">✈</span>
          <span class="tag">
            <b>{{ c.branch }}</b>
            <em>{{ i < landed ? 'landed → main' : c.fl }}</em>
            <i>{{ c.tests }}</i>
          </span>
        </div>

        <div class="tower" :class="{ online: clicks >= TOWER_AT }">
          <div class="cab">
            <span class="beacon" />
            <span class="call">claude --lander</span>
          </div>
          <div class="mast" />
        </div>

        <div class="runway">
          <div class="lights">
            <span
              v-for="(p, i) in priorArt"
              :key="p.name"
              class="light"
              :class="{ on: clicks >= ART_AT }"
              :style="{ transitionDelay: i * 140 + 'ms' }"
              >{{ p.name }}<b v-if="p.note">{{ p.note }}</b></span
            >
          </div>
          <div class="strip">
            <span class="ident">RWY 01 · MAIN</span>
            <span class="count" :class="{ on: landed > 0 }">{{ landed }} landed · {{ craft.length - landed }} holding</span>
          </div>
        </div>
      </div>
    </Storm>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Storm from './Storm.vue'

const props = defineProps({
  craft: { type: Array, required: true },
  priorArt: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

const ART_AT = 1
const TOWER_AT = 2
const LAND_AT = 3

const landed = computed(() => Math.max(0, Math.min(props.craft.length, props.clicks - LAND_AT + 1)))

const phase = computed(() => (props.clicks >= TOWER_AT ? 2 : 0))

// Lowest in the stack lands first, so the slot a plane occupies rises as the queue drains.
function slot(i) {
  if (i < landed.value) return { top: 'auto', bottom: '9.5%', left: 8 + i * 15 + '%' }
  const s = i - landed.value
  return { top: 58 - s * 9.5 + '%', bottom: 'auto', left: 7 + s * 4 + '%' }
}
</script>

<style scoped>
.approach {
  display: flex;
  flex: 1;
  min-height: 0;
}

.scene {
  position: relative;
  z-index: 3;
  flex: 1;
  min-height: 0;
}

.scene.shake {
  animation: jolt 700ms ease-out;
}

@keyframes jolt {
  0%, 100% { transform: none; }
  20% { transform: translate(2px, -2px); }
  55% { transform: translate(-2px, 1px); }
  80% { transform: translate(1px, 1px); }
}

/* --- the holding stack --- */

.craft {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: top 900ms cubic-bezier(0.3, 0.8, 0.3, 1), bottom 900ms cubic-bezier(0.3, 0.8, 0.3, 1),
    left 900ms cubic-bezier(0.3, 0.8, 0.3, 1);
}

.wing {
  font-size: 2.1rem;
  line-height: 1;
  color: #cfe6f2;
  /* The glyph points north-east; the stack flies east, toward the runway. */
  transform: rotate(45deg);
  text-shadow: 0 0 0.6em rgba(95, 195, 219, 0.5);
  animation: bob 5.5s ease-in-out infinite;
}

.craft:nth-child(2n) .wing { animation-duration: 6.9s; }
.craft:nth-child(3n) .wing { animation-duration: 8.1s; }

@keyframes bob {
  50% { transform: rotate(45deg) translate(0.18rem, -0.18rem); }
}

.tag {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  column-gap: 0.7rem;
  padding: 0.3rem 0.7rem;
  border-radius: 0.3rem;
  border: 1px solid rgba(95, 195, 219, 0.4);
  background: rgba(10, 18, 24, 0.72);
  font-family: 'Cascadia Code', Consolas, monospace;
  line-height: 1.25;
  transition: border-color 600ms ease, background 600ms ease;
}

.tag b {
  grid-column: 1;
  font-size: 1.05rem;
  color: #fff;
}

.tag em {
  grid-column: 2;
  font-style: normal;
  font-size: 0.8rem;
  color: var(--fm-cyan, #5fc3db);
}

.tag i {
  grid-column: 1 / -1;
  font-style: normal;
  font-size: 0.78rem;
  color: #6fdc8c;
}

.craft.lit .wing {
  color: #fff;
}

.craft.down .tag {
  border-color: rgba(111, 220, 140, 0.75);
  background: rgba(14, 30, 20, 0.85);
}

.craft.down .wing {
  color: #6fdc8c;
  animation: none;
}

/* --- the tower --- */

.tower {
  position: absolute;
  right: 6%;
  bottom: 22%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.25;
  filter: grayscale(1);
  transition: opacity 700ms ease, filter 700ms ease;
}

.tower.online {
  opacity: 1;
  filter: none;
}

.cab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.8rem;
  border-radius: 0.35rem;
  border: 2px solid var(--fm-cyan, #5fc3db);
  background: rgba(10, 18, 24, 0.9);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 1rem;
  color: #fff;
  white-space: nowrap;
}

.tower.online .cab {
  box-shadow: 0 0 1.6rem rgba(95, 195, 219, 0.55);
}

.beacon {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #4a4a4a;
}

.tower.online .beacon {
  background: #6fdc8c;
  animation: sweep 1.8s ease-in-out infinite;
}

@keyframes sweep {
  50% { box-shadow: 0 0 0 0.45rem rgba(111, 220, 140, 0); background: #d6ffe4; }
}

.mast {
  width: 0.7rem;
  height: 5.5rem;
  background: linear-gradient(180deg, rgba(95, 195, 219, 0.7), rgba(95, 195, 219, 0.15));
}

/* --- the runway --- */

.runway {
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 3%;
}

.lights {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.light {
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(10, 18, 24, 0.7);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.85rem;
  color: #6b6472;
  opacity: 0;
  transform: translateY(0.4rem);
  transition: opacity 500ms ease, transform 500ms ease, color 500ms ease, border-color 500ms ease,
    box-shadow 500ms ease;
}

.light.on {
  opacity: 1;
  transform: none;
  color: #ffd98a;
  border-color: rgba(255, 217, 138, 0.55);
  box-shadow: 0 0 0.8rem rgba(255, 217, 138, 0.3);
}

.light b {
  margin-left: 0.4rem;
  font-weight: 400;
  opacity: 0.7;
}

.strip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding: 0 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.5);
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  background: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.55) 0 4.5rem,
      transparent 4.5rem 9rem
    )
    50% / 100% 3px no-repeat;
  background-color: rgba(8, 10, 14, 0.8);
}

.ident,
.count {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  color: #cfc6d4;
}

.count {
  opacity: 0;
  transition: opacity 500ms ease;
}

.count.on {
  opacity: 1;
  color: #6fdc8c;
}
</style>
