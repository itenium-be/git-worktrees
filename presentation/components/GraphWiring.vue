<template>
  <GraphStage>
    <svg ref="svg" class="graph" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" />
    <div class="overlay">
      <div>
        <div class="headline rise">Claude Code speaks <b>worktree</b></div>
      </div>
      <div class="foot" style="max-width: 60%">
        <div class="cmd rise" style="animation-delay: 0.5s">
          <div><span class="g">$</span> <span class="c">claude</span> -w feature-auth</div>
          <div><span class="g">&nbsp;&nbsp;→</span> .claude/worktrees/feature-auth/</div>
          <div><span class="g">&nbsp;&nbsp;&nbsp;&nbsp;on branch</span> <span class="f">worktree-feature-auth</span></div>
          <div class="g" style="margin-top: 0.4em"># ...or pin a subagent, in its frontmatter:</div>
          <div><span class="p">isolation</span>: <span class="f">worktree</span></div>
        </div>
        <div class="caption fade mono" style="animation-delay: 1.3s; margin-top: 1em; color: #2db88e">
          Private index → no lock fights · silent overwrites become real merge conflicts
        </div>
      </div>
    </div>
  </GraphStage>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { COL, node, popNode, drawPath, drawLabel, clear, watchVisible } from './graphKit.mjs'

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

  const junc = 380,
    cy = 300
  drawPath(s, `M 120 ${cy} L ${junc} ${cy}`, COL.trunk, 4.5, 100, 600)
  T(() => popNode(node(s, junc, cy, COL.trunk, 12), 0), 600)

  const lanes = [
    { y: 200, c: COL.claude, name: 'feat/auth' },
    { y: 400, c: COL.codex, name: 'feat/api' },
    { y: 600, c: COL.gemini, name: 'feat/ui' },
  ]
  const startX = 780,
    endX = 1380
  lanes.forEach((ln, i) => {
    const d = `M ${junc} ${cy} C ${junc + 150} ${cy}, ${junc + 150} ${ln.y}, ${junc + 300} ${ln.y} L ${startX} ${ln.y}`
    drawPath(s, d, ln.c, 4, 500 + i * 140, 900)
    drawLabel(s, junc + 300, ln.y - 22, ln.name, ln.c, 900 + i * 140, 'start', 18)
    drawPath(s, `M ${startX} ${ln.y} L ${endX} ${ln.y}`, ln.c, 4, 1200 + i * 140, 700)
    // commit dots spring-pop sequentially along each branch
    const n = 5
    for (let k = 0; k < n; k++) {
      const x = startX + (k + 0.5) * ((endX - startX) / n)
      T(() => popNode(node(s, x, ln.y, ln.c, 9), 0), 1600 + i * 120 + k * 180)
    }
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
