<template>
  <div class="wall" :class="'stage-' + stage">
    <div class="screen screen-a">
      <div class="bezel">
        <div class="term">
          <div class="chrome">
            <div class="tab"><span class="dot pwsh" />AwesomeApp26 - PowerShell<span class="x">✕</span></div>
            <div class="tab active"><span class="dot" />Ubuntu<span class="x">✕</span></div>
            <span class="spacer" />
            <span class="btn">—</span><span class="btn">▢</span><span class="btn">✕</span>
          </div>
          <div class="body">
          <div class="grid grid-a">
            <div v-for="(s, i) in sessions.slice(0, 4)" :key="i" class="cell">
              <pre>{{ s.join('\n') }}</pre>
              <div class="label">claude code</div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div class="stand" />
    </div>

    <div class="screen screen-b">
      <div class="bezel">
        <div class="term">
          <div class="chrome">
            <div class="tab"><span class="dot pwsh" />AwesomeApp26 - PowerShell<span class="x">✕</span></div>
            <div class="tab active"><span class="dot" />Ubuntu<span class="x">✕</span></div>
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
      </div>
      <div class="stand" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sessions: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

// 0: two agents · 1: four · 2: four plus a second screen
const stage = computed(() => Math.min(props.clicks, 2))
</script>

<style scoped>
.wall {
  display: flex;
  flex: 1;
  gap: 0;
  min-height: 0;
  transition: gap 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.stage-2 .wall,
.wall.stage-2 { gap: 1.2rem; }

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

.wall.stage-2 .screen-a { flex: 1 1 50%; }
.wall.stage-2 .screen-b {
  flex: 1 1 50%;
  opacity: 1;
  transform: none;
}

.bezel {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 0;
  padding: 0;
  border-radius: 0.5rem;
  background: #0d0d11;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.55);
  transition: padding 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.wall.stage-2 .bezel { padding: 0.5rem 0.5rem 1.1rem; }

.stand {
  width: 0;
  height: 0;
  opacity: 0;
  background: #0d0d11;
  clip-path: polygon(22% 0, 78% 0, 100% 100%, 0 100%);
  transition: all 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.wall.stage-2 .stand {
  width: 26%;
  height: 1.1rem;
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
  padding: 0.35rem 0.6rem;
  border-radius: 0.35rem 0.35rem 0 0;
}
.tab.active { background: #1a0f1c; color: #fff; }

.dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: #E95420;
}

.dot.pwsh { background: #2E74C0; }

.x { opacity: 0.5; }
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
.wall.stage-2 .grid-a { height: 100%; }

.grid-b {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  height: 100%;
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
  inset: 0.5rem 0.75rem auto;
  margin: 0;
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  line-height: 1.45;
  color: #d9d2e0;
  white-space: pre;
  filter: blur(2.2px);
  user-select: none;
}
</style>
