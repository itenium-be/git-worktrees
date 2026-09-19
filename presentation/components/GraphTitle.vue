<template>
  <div class="graph-title" aria-hidden="true">
    <svg ref="svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { COL, el, drawPath, clear, reduce, watchVisible } from './graphKit.mjs'

const svg = ref(null)
let io = null
let timers = []
const T = (fn, ms) => timers.push(setTimeout(fn, ms))

function endDot(s, x, y, color) {
  const c = el('circle', { cx: x, cy: y, r: 8, fill: color, stroke: '#fff', 'stroke-width': 2, opacity: 0 })
  c.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,.6))'
  s.appendChild(c)
  if (!reduce)
    c.animate([{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1)' }], {
      duration: 500,
      easing: 'cubic-bezier(.34,1.56,.64,1)',
      fill: 'both',
    })
  else c.setAttribute('opacity', 1)
}

function build() {
  const s = svg.value
  if (!s) return
  timers.forEach(clearTimeout)
  timers = []
  clear(s)

  const cols = [COL.claude, COL.codex, COL.gemini]
  // drifting commit nodes across the backdrop
  for (let i = 0; i < 24; i++) {
    const x = Math.random() * 1600,
      y = Math.random() * 1000
    const c = el('circle', { cx: x, cy: y, r: 2 + Math.random() * 3, fill: cols[i % 3], opacity: 0 })
    c.style.filter = `drop-shadow(0 0 4px ${cols[i % 3]})`
    s.appendChild(c)
    if (!reduce)
      c.animate([{ opacity: 0 }, { opacity: 0.35 + Math.random() * 0.3 }, { opacity: 0.12 }], {
        duration: 2600 + Math.random() * 2000,
        delay: Math.random() * 1200,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out',
      })
    else c.setAttribute('opacity', 0.3)
  }

  // a gentle central three-way split motif behind the title
  const cx = 800,
    cy = 780,
    white = 'rgba(255,255,255,.65)'
  drawPath(s, `M ${cx} 1000 L ${cx} ${cy}`, white, 3, 200, 700)
  const ends = [
    [380, COL.codex],
    [800, COL.gemini],
    [1220, COL.claude],
  ]
  ends.forEach((e, i) => {
    const [ex, color] = e
    drawPath(s, `M ${cx} ${cy} C ${cx} ${cy - 90}, ${ex} ${cy - 40}, ${ex} ${cy - 150}`, color, 3, 500 + i * 140, 800)
    T(() => endDot(s, ex, cy - 150, color), 1300 + i * 140)
  })
  const junc = el('circle', { cx, cy, r: 9, fill: '#fff', opacity: 0 })
  junc.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,.8))'
  s.appendChild(junc)
  if (!reduce) junc.animate([{ opacity: 0 }, { opacity: 0.9 }], { duration: 500, delay: 1000, fill: 'both' })
  else junc.setAttribute('opacity', 0.9)
}

onMounted(() => {
  build()
  io = watchVisible(svg.value, build)
})
onBeforeUnmount(() => {
  io && io.disconnect()
  timers.forEach(clearTimeout)
})
</script>

<style scoped>
.graph-title {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.55;
}
.graph-title svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
