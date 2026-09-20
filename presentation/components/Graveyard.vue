<template>
  <div class="graveyard" :class="{ calm, crowned: phase >= 4 }">
    <Storm :phase="phase" v-slot="{ flash, shake }">
      <div class="row" :class="{ shake }">
        <div
          v-for="(s, i) in stones"
          :key="i"
          class="stone"
          :class="{ risen: clicks >= s.at, cured: isCured(s), lit: flash }"
          :style="{ '--tilt': (isCured(s) ? 0 : TILTS[i % TILTS.length]) + 'deg' }"
        >
          <svg v-if="isCured(s)" class="spire" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,42 0,42" />
            <path d="M0,42 L50,0 L100,42" />
            <line class="ridge" x1="0" y1="41" x2="100" y2="41" />
          </svg>
          <Transition name="morph">
            <div class="engraving" :key="isCured(s) ? 'cure' : 'death'">
              <div class="sigil">{{ face(s).sigil }}</div>
              <div class="title">{{ face(s).title }}</div>
              <div class="rule" />
              <p v-for="(line, j) in face(s).lines" :key="j" class="line" v-html="fmt(line)" />
            </div>
          </Transition>
        </div>
      </div>
    </Storm>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Storm from './Storm.vue'

const props = defineProps({
  stones: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
  // Null keeps the graveyard behaviour: the storm never lets up.
  calmAt: { type: Number, default: null },
  // Overrides calmAt with a weather stage of its own — see Storm's `phase`.
  weather: { type: Number, default: null },
})

const calm = computed(() => props.calmAt != null && props.clicks >= props.calmAt)

// calmAt has one step: night, minus the weather.
const phase = computed(() => props.weather ?? (calm.value ? 2 : 0))

const isCured = (s) => s.cureAt != null && props.clicks >= s.cureAt

// Backticks in an engraving become <code>; the data is ours, so v-html is safe here.
const fmt = (t) => t.replace(/`([^`]+)`/g, '<code>$1</code>')

const face = (s) =>
  isCured(s)
    ? { sigil: s.cureSigil ?? s.sigil, title: s.cureTitle ?? s.title, lines: s.cureLines ?? s.lines }
    : s

// Fixed lean per position: re-rolling on render makes the stones twitch whenever Vue re-draws.
const TILTS = [-4, 3, -2.5, 4.5]
</script>

<style scoped>
.graveyard {
  /* Lets the stone transition its content-sized height to the cured one. Ignored
     where unsupported, which only costs the height a smooth ride. */
  interpolate-size: allow-keywords;
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  /* The thunder shake translates .row; without this the layout card grows scrollbars mid-strike. */
  overflow: hidden;
}

.row.shake {
  animation: shake 700ms ease-out;
}

@keyframes shake {
  0%, 100% { transform: none; }
  15% { transform: translate(3px, -2px); }
  30% { transform: translate(-3px, 2px); }
  45% { transform: translate(2px, 2px); }
  60% { transform: translate(-2px, -1px); }
  80% { transform: translate(1px, 1px); }
}

.row {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.75rem;
  width: 100%;
  height: 100%;
  /* Side padding keeps the outer stones' tilted corners off the slide edge. */
  padding: 0 2.75rem 4%;
  box-sizing: border-box;
}

.stone {
  position: relative;
  display: flex;
  flex: 1 1 0;
  align-items: flex-start;
  justify-content: center;
  max-width: 19rem;
  /* Each stone is as tall as its own engraving, so the row silhouette is uneven. */
  min-height: 9.5rem;
  max-height: 80%;
  padding: 3.25rem 1.25rem 1.5rem;
  box-sizing: border-box;
  /* The deck's standard card, bent into an arch at the top. */
  border-radius: 48% 48% 1.25rem 1.25rem / 28% 28% 1rem 1rem;
  background: rgba(20, 22, 26, 0.92);
  border: 2px solid var(--fm-cyan, #5FC3DB);
  box-shadow: 0 1rem 2.25rem rgba(0, 0, 0, 0.6);
  transform-origin: 50% 100%;
  opacity: 0;
  transform: translateY(3.5rem);
  transition:
    opacity 400ms ease,
    transform 620ms cubic-bezier(0.34, 1.56, 0.64, 1),
    height 620ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 620ms ease,
    border-color 620ms ease,
    box-shadow 620ms ease,
    filter 90ms linear;
}

.stone.risen {
  opacity: 1;
  transform: rotate(var(--tilt));
}

/* Righting itself is the whole payoff, so it travels straight up, not back down. */
.stone.risen.cured {
  transform: translateY(-1.2rem) rotate(0deg);
  background: rgba(20, 30, 34, 0.94);
  box-shadow: 0 0 2.25rem rgba(95, 195, 219, 0.4), 0 1rem 2.25rem rgba(0, 0, 0, 0.6);
}

.morph-enter-active,
.morph-leave-active {
  transition: opacity 520ms ease;
}

/* Taking the outgoing engraving out of flow lets the two overlap, so the stone
   dissolves from one face to the other instead of emptying and refilling. */
.morph-leave-active {
  position: absolute;
  top: 3.25rem;
  left: 1.25rem;
  right: 1.25rem;
}

.morph-enter-from,
.morph-leave-to {
  opacity: 0;
}

/* --- Cured silhouette: the arch squares off and a spire grows out of the stone. --- */
/* The ragged graveyard becomes an ordered row: one height for every stone, so the
   spires, the candles and the titles all line up. Whichever of the two wins, the
   result is uniform. */
.stone.cured {
  height: 66%;
  min-height: 14rem;
  /* Square on top, and no line across it: the roof and the box are one shape, so the
     spire's own edges carry on into the box's sides. */
  border-radius: 0 0 0.4rem 0.4rem;
  border-top-color: transparent;
}

.spire,
.stone.cured::after {
  position: absolute;
  transform-origin: 50% 100%;
  animation: raise 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.stone.cured::after {
  content: '';
}

@keyframes raise {
  from { transform: scaleY(0); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

.spire {
  /* Offsets resolve against the padding box, so the stone's 2px border has to be added
     back for the base to land on the outer corners. An <svg> is also a replaced element:
     left+right would leave it at its intrinsic size, so the width is stated. */
  left: -2px;
  bottom: 100%;
  width: calc(100% + 4px);
  /* The extra 2px is the stone's transparent top border, which the roof covers. */
  height: calc(2.6rem + 2px);
  overflow: visible;
  /* No glow of its own: a drop-shadow here paints the roof's shadow down over the
     building, which tints the wall under it a different shade. The stone's box-shadow
     already haloes this area. */
}

/* Stroked rather than clip-pathed: a clip eats the border, and the spire has to carry the
   same 2px edge as the stone under it. The base is left open to meet that edge. */
.spire polygon {
  fill: rgba(20, 30, 34, 0.94);
  transition: fill 620ms ease;
}

/* The last stone turns the row from graveyard to cathedral: pale stone in the morning
   light, in the palette the layout's own dawn cards use. */
.graveyard.crowned .stone.cured,
.graveyard.crowned .spire polygon {
  fill: #FFF9EE;
  background: #FFF9EE;
}

.graveyard.crowned .stone.cured {
  border-color: #E8A33D;
  border-top-color: transparent;
  box-shadow: 0 0 2.25rem rgba(232, 163, 61, 0.45), 0 1rem 2.25rem rgba(90, 50, 20, 0.35);
}

.graveyard.crowned .spire path {
  stroke: #E8A33D;
}

/* Where the roof meets the wall. It rides in the svg because the stone's own top border
   sits under the roof's fill. */
.spire .ridge {
  stroke: transparent;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  transition: stroke 620ms ease;
}

.graveyard.crowned .spire .ridge {
  stroke: #E8A33D;
}

.graveyard.crowned .stone.cured::after {
  background:
    linear-gradient(#E8A33D, #E8A33D) center / 2px 100% no-repeat,
    linear-gradient(#E8A33D, #E8A33D) center / 100% 2px no-repeat;
}

.graveyard.crowned .engraving {
  color: var(--fm-ink, #1D1D1B);
}

.graveyard.crowned .title {
  color: #2A1D12;
}

.graveyard.crowned .rule {
  background: rgba(200, 130, 50, 0.45);
}

.graveyard.crowned .line :deep(code) {
  background: rgba(232, 163, 61, 0.18);
  color: #9A5B16;
}

.spire path {
  fill: none;
  stroke: var(--fm-cyan, #5FC3DB);
  stroke-width: 2;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.stone.cured::after {
  left: 50%;
  bottom: calc(100% + 2.75rem);
  width: 0.9rem;
  height: 0.9rem;
  margin-left: -0.45rem;
  background:
    linear-gradient(var(--fm-cyan, #5FC3DB), var(--fm-cyan, #5FC3DB)) center / 2px 100% no-repeat,
    linear-gradient(var(--fm-cyan, #5FC3DB), var(--fm-cyan, #5FC3DB)) center / 100% 2px no-repeat;
  filter: drop-shadow(0 0 0.15rem rgba(10, 18, 22, 0.95));
}

/* Lit from behind: the stone drops to near-black and only its edge burns. */
.stone.risen.lit {
  filter: brightness(0.3) contrast(1.4);
  box-shadow: 0 0 2.5rem rgba(180, 230, 255, 0.85), 0 1rem 2.25rem rgba(0, 0, 0, 0.6);
}

.engraving {
  text-align: center;
  color: #fff;
  transition: color 620ms ease;
}

.sigil {
  margin-bottom: 0.6rem;
  font-size: 2.4rem;
  line-height: 1;
}

.stone.cured .sigil {
  transform-origin: 50% 88%;
  animation: flame 4.1s ease-in-out infinite;
}

/* Uneven stops on purpose: an even pulse reads as a loading spinner, not a flame. */
@keyframes flame {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 -0.12em 0.3em rgba(255, 176, 74, 0.7));
  }
  17% {
    transform: scale(1.05) rotate(-1.6deg);
    filter: drop-shadow(0 -0.2em 0.55em rgba(255, 201, 102, 0.95));
  }
  34% {
    transform: scale(0.98) rotate(1.1deg);
    filter: drop-shadow(0 -0.08em 0.22em rgba(255, 158, 58, 0.55));
  }
  58% {
    transform: scale(1.03) rotate(-0.6deg);
    filter: drop-shadow(0 -0.16em 0.45em rgba(255, 190, 90, 0.85));
  }
  76% {
    transform: scale(0.99) rotate(0.8deg);
    filter: drop-shadow(0 -0.1em 0.26em rgba(255, 168, 66, 0.6));
  }
}

.title {
  white-space: pre-line;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--fm-cyan, #5FC3DB);
  transition: color 620ms ease;
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

.line :deep(code) {
  padding: 0.05em 0.35em;
  border-radius: 0.25rem;
  background: rgba(95, 195, 219, 0.16);
  font-family: ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
  font-style: normal;
  font-size: 0.95em;
  color: var(--fm-cyan, #5FC3DB);
}
</style>
