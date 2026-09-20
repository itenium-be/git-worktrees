<template>
  <div ref="rigEl" class="strip">
    <div class="row">
      <div
        v-for="(t, i) in talks"
        :key="i"
        class="frame"
        :class="{ pending: !isShown(t), dim: isDim(t), gone: isGone(t), expanded: isExpanded(t) }"
      >
        <div class="head">
          <div class="sigil">{{ t.sigil }}</div>
          <div class="title">{{ t.title }}</div>
          <p class="sub" v-html="t.subTitle" />
        </div>

        <div v-if="t.expandAt != null" class="stages" :class="{ open: isExpanded(t) }">
          <template v-for="(s, j) in stages" :key="j">
            <div v-if="j" class="joiner" :class="{ on: clicks >= s.at }">+</div>
            <div class="stage" :class="{ on: clicks >= s.at, here: s.note }">
              <div class="stage-title">{{ s.title }}</div>
              <p v-for="(line, k) in s.lines" :key="k" class="stage-line">{{ line }}</p>
              <div v-for="(g, k) in s.groups ?? []" :key="'g' + k" class="stage-group">
                <div class="group-label">{{ g.label }}</div>
                <p v-for="(line, m) in g.lines" :key="m" class="stage-line">{{ line }}</p>
              </div>
              <div v-if="s.note" class="stage-note">{{ s.note }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  talks: { type: Array, required: true },
  stages: { type: Array, required: true },
  clicks: { type: Number, default: 0 },
})

// The subtitles carry their own line breaks, and the copy is ours.
const isShown = (t) => props.clicks >= (t.at ?? 0)
const isDim = (t) => t.dimAt != null && props.clicks >= t.dimAt
const isGone = (t) => t.hideAt != null && props.clicks >= t.hideAt
const isExpanded = (t) => t.expandAt != null && props.clicks >= t.expandAt

const rigEl = ref(null)
const MORPH = 600

// The header jumps from a centred column to a row at the top, and a layout jump cannot be
// transitioned: measure where the sigil and title were, invert the move, then play it back.
// Deltas are divided by the slide's scale, since rects are post-transform and translate is not.
watch(
  () => props.clicks,
  async () => {
    const els = [...(rigEl.value?.querySelectorAll('.sigil, .title') ?? [])]
    const first = els.map((el) => el.getBoundingClientRect())
    await nextTick()
    els.forEach((el, i) => {
      const last = el.getBoundingClientRect()
      if (!last.width || !first[i].width) return
      const scale = last.width / el.offsetWidth
      const dx = (first[i].left - last.left) / scale
      const dy = (first[i].top - last.top) / scale
      const ds = first[i].height / last.height
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(ds - 1) < 0.01) return
      el.style.transition = 'none'
      el.style.transformOrigin = 'top left'
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${ds})`
      requestAnimationFrame(() => {
        el.style.transition = `transform ${MORPH}ms ease`
        el.style.transform = ''
      })
    })
  },
)
</script>

<style scoped>
.strip {
  --cyan: #5fc3db;
  --lit: #9fe4f5;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.row {
  display: flex;
  align-items: stretch;
  height: 76%;
  padding: 0 2.5%;
  box-sizing: border-box;
}

.frame {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2.5% 2%;
  box-sizing: border-box;
  border: 2px solid var(--cyan);
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
  color: #fff;
  transition: opacity 600ms ease, filter 600ms ease, transform 600ms ease, box-shadow 600ms ease,
    border-color 600ms ease, flex-grow 600ms ease, margin 600ms ease, padding 600ms ease,
    border-width 600ms ease;
}

/* A margin rather than the row's `gap`, so a collapsing frame takes its spacing with it. */
.frame + .frame {
  margin-left: 2.5%;
}

/* Held in place rather than removed, so the row never reflows as posters land. */
.frame.pending {
  opacity: 0;
  transform: translateY(1.5rem);
}

.frame.dim {
  opacity: 0.18;
  filter: grayscale(1);
}

.frame.gone {
  flex-grow: 0;
  opacity: 0;
  margin-left: 0;
  padding-left: 0;
  padding-right: 0;
  border-left-width: 0;
  border-right-width: 0;
}

.frame.expanded {
  justify-content: flex-start;
  margin-left: 0;
  border-color: var(--lit);
  box-shadow: 0 0 3em rgba(95, 195, 219, 0.45);
}

.head {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: flex-direction 0ms;
}

.sigil {
  font-size: 3rem;
  line-height: 1;
}

.title {
  margin-top: 0.6rem;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--cyan);
}

.sub {
  margin: 0.4rem 0 0;
  font-size: 1rem;
  font-style: italic;
  opacity: 0.75;
  max-height: 6rem;
  max-width: 100%;
  overflow: hidden;
  transition: opacity 400ms ease, max-height 600ms ease, max-width 600ms ease, margin 600ms ease;
}

/* Spacing as a margin, not a gap: a collapsed subtitle would still be given a gap. */
.frame.expanded .head {
  flex-direction: row;
  align-items: baseline;
}

.frame.expanded .title {
  margin-top: 0;
  margin-left: 0.8rem;
  color: var(--lit);
}

.frame.expanded .sigil {
  font-size: 1.8rem;
}

.frame.expanded .sub {
  display: none;
}

/* Collapsed to zero until the frame opens, so the poster keeps its centred layout. */
.stages {
  width: 100%;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  gap: 1rem;
  transition: max-height 600ms ease, opacity 600ms ease, margin-top 600ms ease;
}

.stages.open {
  flex: 1;
  max-height: 100%;
  margin-top: 1.2rem;
  opacity: 1;
}

.stage {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.8rem;
  box-sizing: border-box;
  border: 1px solid rgba(95, 195, 219, 0.55);
  border-radius: 0.75rem;
  background: rgba(95, 195, 219, 0.07);
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity 500ms ease, transform 500ms ease, border-color 500ms ease,
    background 500ms ease;
}

.stage.on {
  opacity: 1;
  transform: none;
}

.stage.here.on {
  border-color: var(--lit);
  background: rgba(95, 195, 219, 0.18);
}

.stage-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cyan);
}

.stage.here .stage-title {
  color: var(--lit);
}

.stage-line {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  opacity: 0.8;
}

.stage-group {
  margin-top: 0.7rem;
}

.group-label {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cyan);
  opacity: 0.85;
}

.stage-note {
  margin-top: 0.7rem;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  background: var(--lit);
  color: #1d1d1b;
  font-size: 0.8rem;
  font-weight: 700;
  font-style: italic;
}

.joiner {
  align-self: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--cyan);
  opacity: 0;
  transition: opacity 500ms ease;
}

.joiner.on {
  opacity: 0.7;
}
</style>
