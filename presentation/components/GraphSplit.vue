<template>
  <GraphStage>
    <svg ref="svg" class="graph" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" />
    <div class="overlay">
      <div>
        <div class="headline rise">What is a <b>worktree</b></div>
        <div class="sub rise" style="animation-delay: 0.15s">One repo → N working trees, one shared core</div>
      </div>
      <div class="foot">
        <ul class="bullets fade" style="animation-delay: 2.6s">
          <li>Shared object DB + refs — <span class="mono">no re-clone</span></li>
          <li>Per-worktree <span class="mono">HEAD</span> + <span class="mono">index</span></li>
          <li>Same branch can't be checked out twice</li>
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

  const junc = 560,
    cy = 500,
    coreX = 520,
    endX = 1300

  // glowing .git core underneath the junction
  const defs = el('defs', {})
  defs.innerHTML =
    '<radialGradient id="gg-core"><stop offset="0%" stop-color="#3a4be0" stop-opacity=".5"/>' +
    '<stop offset="70%" stop-color="#2a2f6a" stop-opacity=".12"/>' +
    '<stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>'
  s.appendChild(defs)
  const core = el('ellipse', { cx: coreX, cy, rx: 150, ry: 150, fill: 'url(#gg-core)', opacity: 0 })
  s.appendChild(core)
  if (!reduce) core.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, delay: 600, fill: 'both' })
  else core.setAttribute('opacity', 1)

  // trunk in + junction node
  drawPath(s, `M 120 ${cy} L ${junc} ${cy}`, COL.trunk, 4.5, 100, 700)
  const trunkNode = node(s, junc, cy, COL.trunk, 13)
  T(() => popNode(trunkNode, 0), 700)

  T(() => {
    const t = drawLabel(s, coreX, cy + 205, '.git', COL.core, 0, 'middle', 26, 700)
    void t
    drawLabel(s, coreX, cy + 235, 'shared object DB + refs', '#5a6cc0', 120, 'middle', 15, 500)
  }, 900)

  // three branches fan out into parallel lanes
  const lanes = [
    { y: 250, c: COL.claude, name: 'feat/auth' },
    { y: 500, c: COL.codex, name: 'feat/api' },
    { y: 750, c: COL.gemini, name: 'feat/ui' },
  ]
  lanes.forEach((ln, i) => {
    const d = `M ${junc} ${cy} C ${junc + 180} ${cy}, ${junc + 180} ${ln.y}, ${junc + 360} ${ln.y} L ${endX} ${ln.y}`
    drawPath(s, d, ln.c, 4, 900 + i * 160, 1000)
    T(() => {
      popNode(node(s, endX, ln.y, ln.c, 11), 0)
      drawLabel(s, endX + 28, ln.y + 7, ln.name, ln.c, 120, 'start', 22)
    }, 1900 + i * 160)
  })
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
