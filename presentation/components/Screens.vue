<template>
  <div class="wall" :class="'stage-' + stage">
    <div class="screen screen-a">
      <div class="bezel">
        <div class="term">
          <div class="chrome">
            <div class="tab"><span class="dot pwsh" /><span class="tab-title">AwesomeApp26 - PowerShell</span><span class="x">✕</span></div>
            <div class="tab active"><span class="dot" /><span class="tab-title">Ubuntu</span><span class="x">✕</span></div>
            <span class="spacer" />
            <span class="btn">—</span><span class="btn">▢</span><span class="btn">✕</span>
          </div>
          <div class="body">
          <div class="grid grid-a">
            <div v-for="(s, i) in sessions.slice(0, 4)" :key="i" class="cell" :class="{ top: i < 2 }">
              <pre>{{ s.join('\n') }}</pre>
              <div class="label">claude code</div>
            </div>
          </div>
          </div>
        </div>
        <span class="led" />
      </div>
      <div class="neck" />
      <div class="base" />
    </div>

    <div class="screen screen-b">
      <div class="bezel">
        <div class="term">
          <div class="chrome">
            <div class="tab active"><span class="dot" /><span class="tab-title">Ubuntu</span><span class="x">✕</span></div>
            <span class="spacer" />
            <span class="btn">—</span><span class="btn">▢</span><span class="btn">✕</span>
          </div>
          <div class="body">
          <div class="grid grid-b">
            <div v-for="(s, i) in sessions.slice(4, 6)" :key="i" class="cell">
              <pre>{{ s.join('\n') }}</pre>
              <div class="label">claude code</div>
            </div>
          </div>
          </div>
        </div>
        <span class="led" />
      </div>
      <div class="neck" />
      <div class="base" />
    </div>

    <div class="screen screen-c">
      <div class="bezel">
        <div class="term">
          <div class="chrome">
            <div class="tab active"><span class="dot" /><span class="tab-title">Ubuntu</span><span class="x">✕</span></div>
            <span class="spacer" />
            <span class="btn">—</span><span class="btn">▢</span><span class="btn">✕</span>
          </div>
          <div class="body">
          <div class="grid grid-c">
            <div v-for="(s, i) in sessions.slice(6, 9)" :key="i" class="cell">
              <pre>{{ s.join('\n') }}</pre>
              <div class="label">claude code</div>
            </div>
          </div>
          </div>
        </div>
        <span class="led" />
      </div>
      <div class="neck" />
      <div class="base" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sessions: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

// 0: two agents · 1: four · 2: a second screen · 3: a third, three more agents
const stage = computed(() => Math.min(props.clicks, 3))
</script>

<style scoped>
.wall {
  display: flex;
  flex: 1;
  gap: 0;
  min-height: 0;
  /* the parked second screen sits translated to the right of the fold */
  overflow: hidden;
  transition: gap 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.wall.stage-2,
.wall.stage-3 { gap: 1.2rem; }

.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  transition: flex 650ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 500ms ease,
              transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.screen-a { flex: 1 1 100%; }
.screen-b {
  flex: 0 1 0%;
  opacity: 0;
  transform: translateX(2rem);
}

/* Three monitors are the whole slide; the card behind them is just a frame. */
:global(.fm-card:has(.wall.stage-3)) {
  background: transparent;
  border-color: transparent;
  transition: background-color 600ms ease, border-color 600ms ease;
}

.screen-c {
  flex: 0 1 0%;
  opacity: 0;
  transform: translateX(2rem);
}

.wall.stage-2 .screen-a,
.wall.stage-2 .screen-b { flex: 1 1 50%; }

/* The card sits 3.45% of the slide short of each edge; that is 3.71% of the wall's
   own width, so growing by twice that and sliding left puts the first monitor flush
   against the left edge and cuts the third against the right one.
   Needs `spill: true` on the slide, or the card clips it back. */
.wall.stage-3 {
  width: 107.42%;
  margin-left: -3.71%;
}

/* The third monitor does not make room for itself: the wall runs past its own
   width and the overflow clips it against the right edge of the slide. */
.wall.stage-3 .screen-a,
.wall.stage-3 .screen-b,
.wall.stage-3 .screen-c { flex: 0 0 37%; }

.wall:is(.stage-2, .stage-3) .screen-b,
.wall.stage-3 .screen-c {
  opacity: 1;
  transform: none;
}

.bezel {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 0;
  padding: 0;
  border-radius: 0.5rem;
  background: #0d0d11;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.55);
  transition: padding 650ms cubic-bezier(0.22, 1, 0.36, 1),
              border-radius 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.wall:is(.stage-2, .stage-3) .bezel {
  padding: 0.55rem 0.55rem 1.6rem;
  border-radius: 0.75rem;
  background: linear-gradient(#2a2a31, #131317);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              0 1.5rem 3rem rgba(0, 0, 0, 0.6);
}

.led {
  position: absolute;
  left: 50%;
  bottom: 0.6rem;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  background: #5FC3DB;
  box-shadow: 0 0 0.45rem #5FC3DB;
  opacity: 0;
  transform: translateX(-50%);
  transition: opacity 400ms ease 250ms;
}

.wall:is(.stage-2, .stage-3) .led { opacity: 1; }

.neck,
.base {
  width: 0;
  height: 0;
  opacity: 0;
  transition: all 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.neck {
  background: linear-gradient(90deg, #101014 0%, #3a3a44 38%, #4a4a56 52%, #17171d 100%);
  border-radius: 0 0 0.2rem 0.2rem;
}

.base {
  background: linear-gradient(#4a4a56 0%, #2a2a31 45%, #0e0e12 100%);
  border-radius: 0.15rem;
  clip-path: polygon(9% 0, 91% 0, 100% 78%, 96% 100%, 4% 100%, 0 78%);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
}

.wall:is(.stage-2, .stage-3) .neck {
  width: 11%;
  height: 2.4rem;
  opacity: 1;
}

.wall:is(.stage-2, .stage-3) .base {
  width: 36%;
  height: 1rem;
  opacity: 1;
}

.term {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: 0.35rem;
  background: #1a0f1c;
}

.chrome {
  display: flex;
  align-items: stretch;
  flex: 0 0 auto;
  padding: 0.3rem 0.4rem 0;
  background: #2b1a2e;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 0.72rem;
  color: #cfc6d4;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  padding: 0.35rem 0.6rem;
  border-radius: 0.35rem 0.35rem 0 0;
}

.tab-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tab.active { background: #1a0f1c; color: #fff; }

.dot {
  flex: 0 0 auto;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: #E95420;
}

.dot.pwsh { background: #2E74C0; }

.x { flex: 0 0 auto; opacity: 0.5; }
.spacer { flex: 1; }
.btn { display: flex; align-items: center; padding: 0 0.55rem; opacity: 0.75; }

.body {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.grid {
  position: absolute;
  inset: 0 0 auto 0;
  display: grid;
  gap: 1px;
  background: rgba(255, 255, 255, 0.18);
  transition: height 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* At 200% the second row sits below the fold; shrinking to 100% lifts it into view
   while the first row rises into the top half. */
.grid-a {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 200%;
}

.wall.stage-1 .grid-a,
.wall:is(.stage-2, .stage-3) .grid-a { height: 100%; }

.grid-b {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  height: 100%;
}

.grid-c {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 100%;
}

.grid-c .cell:first-child {
  grid-row: 1 / span 2;
}

.cell {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #1a0f1c;
}

/* Matches TermPane's overlay, so slide 7 cuts into this one without a jump. */
.label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  text-align: center;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 1.35rem;
  font-weight: 700;
  color: #5FC3DB;
  background: rgba(26, 15, 28, 0.72);
}

.cell pre {
  /* out of flow, so a collapsed row really is zero high */
  position: absolute;
  inset: 0 0 auto;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0.8rem 0.75rem;
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  line-height: 1.45;
  color: #d9d2e0;
  white-space: pre;
  filter: blur(2.2px);
  user-select: none;
  transition: height 650ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* The top row halves in height but its text keeps its pixel size, so the pane
   scrolls to its second half instead of cropping the first. */
.wall.stage-1 .cell.top pre,
.wall:is(.stage-2, .stage-3) .cell.top pre {
  height: 200%;
  transform: translateY(-50%);
}
</style>
