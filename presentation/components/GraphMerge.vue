<template>
  <GraphStage>
    <svg ref="svg" class="graph" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" />
    <div class="overlay">
      <div>
        <div class="headline rise">Merging it all <b>back</b></div>
      </div>
      <div class="foot">
        <ul class="bullets fade" style="animation-delay: 2.8s">
          <li>Keep PRs small — <span class="mono">200–400 lines</span></li>
          <li>Stacked PRs → stack-aware merge queue</li>
          <li>No proven ceiling on parallel agents — measure your own</li>
        </ul>
      </div>
    </div>
  </GraphStage>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { COL, el, node, popNode, drawPath, drawLabel, clear, reduce, watchVisible } from './graphKit.mjs'

const svg = ref(null)
let io = null
let timers = []
const T = (fn, ms) => timers.push(setTimeout(fn, ms))

function build() {
  const s = svg.value
  if (!s) return
  timers.forEach(clearTimeout)
  timers = []
  clear(s)

  const cy = 430,
    startX = 200,
    junc = 760,
    mergeX = 1120
  drawPath(s, `M ${startX} ${cy} L ${junc - 360} ${cy}`, COL.trunk, 4.5, 100, 600)

  const lanes = [
    { y: 210, c: COL.claude, name: 'feat/auth' },
    { y: 430, c: COL.codex, name: 'feat/api' },
    { y: 650, c: COL.gemini, name: 'feat/ui' },
  ]
  lanes.forEach((ln, i) => {
    drawPath(s, `M ${junc - 360} ${ln.y} L ${junc - 120} ${ln.y}`, ln.c, 4, 300 + i * 120, 600)
    T(() => popNode(node(s, junc - 240, ln.y, ln.c, 9), 0), 700 + i * 120)
    const d = `M ${junc - 120} ${ln.y} C ${junc + 40} ${ln.y}, ${junc + 40} ${cy}, ${mergeX} ${cy}`
    drawPath(s, d, ln.c, 4, 1200 + i * 160, 900)
  })

  // merge node snap + pulse ring + outgoing trunk + green check
  T(() => {
    const mn = node(s, mergeX, cy, COL.codex, 16)
    popNode(mn, 0)
    if (!reduce) {
      const ring = el('circle', { cx: mergeX, cy, r: 16, fill: 'none', stroke: COL.codex, 'stroke-width': 3, opacity: 0.9 })
      s.appendChild(ring)
      ring.animate([{ r: 16, opacity: 0.9 }, { r: 60, opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'both' })
    }
    drawPath(s, `M ${mergeX} ${cy} L 1440 ${cy}`, COL.codex, 4.5, 300, 700)
    T(() => {
      const chk = el('path', {
        d: `M ${mergeX - 7} ${cy} l 5 6 l 10 -13`,
        fill: 'none',
        stroke: '#eafff5',
        'stroke-width': 3.5,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      })
      s.appendChild(chk)
      if (!reduce) {
        const L = chk.getTotalLength()
        chk.style.strokeDasharray = L
        chk.style.strokeDashoffset = L
        chk.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 400, easing: 'ease-out', fill: 'both' })
      }
      drawLabel(s, mergeX, cy + 66, 'merged', COL.codex, 120, 'middle', 20, 700)
    }, 400)
  }, 2000)
}

onMounted(() => {
  build()
  io = watchVisible(svg.value?.parentElement, build)
})
onBeforeUnmount(() => {
  io && io.disconnect()
  timers.forEach(clearTimeout)
})
</script>
