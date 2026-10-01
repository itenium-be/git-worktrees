<template>
  <div class="future">
    <ol class="questions">
      <li v-for="(q, i) in questions" :key="q.text" :class="{ on: clicks >= i + 1, now: clicks === i + 1 }">
        {{ q.text }}
      </li>
    </ol>

    <div class="right">
      <div class="dials" :class="{ gone: clicks >= cockpitAt }">
        <figure v-for="(q, i) in questions" :key="q.page" class="dial" :class="{ on: clicks >= i + 1 }">
          <svg viewBox="0 0 100 60" aria-hidden="true">
            <path class="arc" d="M10 55 A40 40 0 0 1 90 55" />
            <line class="needle" x1="50" y1="55" x2="50" y2="20" :style="{ '--to': `${q.needle}deg` }" />
            <circle cx="50" cy="55" r="4" class="hub" />
          </svg>
          <figcaption>{{ q.page }}</figcaption>
        </figure>
      </div>

      <div class="cockpit" :class="{ on: clicks >= cockpitAt }">
        <div class="win web">
          <div class="chrome"><i /><i /><i /><span>WebUI · localhost:5170</span></div>
          <div class="drawn">
            <aside>
              <b>Bellows</b>
              <span v-for="p in PAGES" :key="p.name">{{ p.name }}<em v-if="p.count">{{ p.count }}</em></span>
            </aside>
            <main>
              <p class="alert">54 waiting on a human</p>
              <section v-for="r in ROSTER" :key="r.role">
                <h4>{{ r.role }}</h4>
                <div v-for="w in r.windows" :key="w[0]" class="row">
                  <span>{{ w[0] }}</span><span>{{ w[1] }}</span>
                </div>
              </section>
            </main>
          </div>
        </div>

        <div class="win tui">
          <div class="chrome"><i /><i /><i /><span>TUI · bellows</span></div>
          <pre><span v-for="(line, i) in tui" :key="i"><span
            v-for="(s, j) in line"
            :key="j"
            :style="{ color: s.c, fontWeight: s.b ? 700 : 400 }"
          >{{ s.t }}</span>{{ '\n' }}</span></pre>
        </div>

        <p class="caption">a cockpit: the thousand mile view</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // `{ text, page, needle }`: one per click, and the Bellows page that half-answers it today.
  questions: { type: Array, required: true },
  // Lines of `{ t, c, b }` spans, as captured from the TUI prototype.
  tui: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

const cockpitAt = props.questions.length + 1

const PAGES = [
  { name: 'Dashboard' },
  { name: 'Observed', count: 3 },
  { name: 'Beads' },
  { name: 'Verify', count: 153 },
  { name: 'Unblocks' },
  { name: 'Repos' },
  { name: 'Plan' },
  { name: 'Cost' },
]

const ROSTER = [
  { role: 'Architects', windows: [['parnas', 'idle']] },
  { role: 'Implementers', windows: [['hammer', 'projects-x8fj'], ['tongs', 'projects-4mzt'], ['chisel', 'projects-2hd9']] },
  { role: 'Landers', windows: [['weld', 'projects-a91d']] },
  { role: 'Observers', windows: [['spark', 'sweeping']] },
]
</script>

<style scoped>
.future {
  --cyan: #5fc3db;
  height: 100%;
  display: grid;
  grid-template-columns: 36% 1fr;
  gap: 3%;
  color: #fff;
}

.questions {
  align-self: center;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: q;
}

.questions li {
  margin: 0.7rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  opacity: 0;
  transform: translateX(-0.6rem);
  transition: opacity 400ms ease, transform 400ms ease, color 400ms ease;
}

.questions li.on {
  opacity: 0.55;
  transform: none;
}

.questions li.now {
  opacity: 1;
  color: var(--cyan);
}

.right {
  position: relative;
  min-width: 0;
}

.dials {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: center;
  gap: 1.4rem 1rem;
  transition: opacity 500ms ease;
}

.dials.gone {
  opacity: 0;
}

.dial {
  margin: 0;
  text-align: center;
  opacity: 0.18;
  transition: opacity 400ms ease;
}

.dial.on {
  opacity: 1;
}

.dial svg {
  width: 70%;
}

.arc {
  fill: none;
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 3;
}

.dial.on .arc {
  stroke: var(--cyan);
}

.needle {
  stroke: #fff;
  stroke-width: 2.5;
  transform-box: view-box;
  transform-origin: 50px 55px;
  transform: rotate(-80deg);
  transition: transform 900ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dial.on .needle {
  transform: rotate(var(--to));
}

.hub {
  fill: #fff;
}

figcaption {
  margin-top: 0.2rem;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.65rem;
  color: #cfc6d4;
}

.cockpit {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 600ms ease, transform 600ms ease;
}

.cockpit.on {
  opacity: 1;
  transform: none;
}

.win {
  position: absolute;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #141016;
  box-shadow: 0 1.2rem 2.4rem rgba(0, 0, 0, 0.6);
}

/* The web UI sits behind, the TUI in front: two takes on the same cockpit. */
.web {
  left: 0;
  top: 2%;
  width: 72%;
  height: 62%;
}

.tui {
  right: 0;
  bottom: 9%;
  width: 66%;
}

.chrome {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background: #2b1a2e;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.55rem;
  color: #cfc6d4;
}

.chrome i {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}

.chrome span {
  margin-left: 0.5rem;
}

.drawn {
  display: flex;
  height: 100%;
  font-size: 0.5rem;
  color: #cfc6d4;
}

.drawn aside {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 0 0 22%;
  padding: 0.6rem;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.drawn aside b {
  margin-bottom: 0.3rem;
  font-size: 0.65rem;
  color: #fff;
}

.drawn aside em {
  float: right;
  font-style: normal;
  color: #9a8fa3;
}

.drawn main {
  flex: 1;
  padding: 0.6rem 0.9rem;
}

.alert {
  margin: 0 0 0.5rem;
  color: #ff6b6b;
}

.drawn h4 {
  margin: 0.45rem 0 0.2rem;
  font-size: 0.6rem;
  color: #fff;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 0.12rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-family: 'Cascadia Code', Consolas, monospace;
}

.tui pre {
  margin: 0;
  padding: 0.5rem 0.6rem;
  font-family: 'Cascadia Code', Consolas, 'JetBrains Mono', monospace;
  font-size: 0.36rem;
  line-height: 1.35;
  color: #d9d2e0;
  white-space: pre;
}

.caption {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0;
  font-size: 0.9rem;
  font-style: italic;
  color: var(--cyan);
}
</style>
