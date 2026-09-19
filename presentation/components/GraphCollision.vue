<template>
  <GraphStage>
    <svg ref="svg" class="graph" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" />
    <div class="overlay">
      <div>
        <div class="headline rise">The <b>collision</b></div>
        <div class="sub rise" style="animation-delay: 0.15s">
          Three agents · one working tree · last write wins
        </div>
      </div>
      <div class="foot" style="text-align: center">
        <div
          class="caption rise"
          style="animation-delay: 2.4s; color: #e8534e; font-weight: 600; font-size: clamp(15px, 1.9vw, 24px)"
        >
          No error. No conflict. Just missing code.
        </div>
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

  const y = 470,
    x0 = 300,
    tip = 1120
  drawPath(s, `M ${x0} ${y} L ${tip} ${y}`, COL.trunk, 4, 100, 900)
  ;[0, 1, 2].forEach((i) => T(() => popNode(node(s, x0 + 130 + i * 190, y, COL.trunk, 9), 0), 400 + i * 140))
  drawLabel(s, x0 - 20, y - 40, 'main', COL.trunk, 600, 'start', 22)

  // dashed "working directory" bracket at the tip
  const dir = el('rect', {
    x: tip - 46,
    y: y - 150,
    width: 320,
    height: 300,
    rx: 16,
    fill: 'none',
    stroke: '#33404f',
    'stroke-width': 2,
    'stroke-dasharray': '6 8',
  })
  s.appendChild(dir)
  if (!reduce) {
    dir.style.opacity = 0
    dir.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 900, fill: 'both' })
  }
  drawLabel(s, tip - 46, y - 165, 'working directory', '#8792a3', 1000, 'start', 18)

  const tx = tip + 70,
    ty = y
  const agents = [
    { c: COL.codex, from: [tx - 60, y - 270] },
    { c: COL.gemini, from: [tx + 250, y] },
    { c: COL.claude, from: [tx - 60, y + 270] },
  ]
  const winner = 2 // Claude writes last → wins
  const nodes = []
  agents.forEach((a, i) => {
    T(() => {
      drawPath(s, `M ${a.from[0]} ${a.from[1]} L ${tx} ${ty}`, a.c, 3, 0, 500)
      const n = node(s, tx + (i - 1) * 4, ty + (i - 1) * 4, a.c, 13)
      popNode(n, 220)
      nodes.push({ n, c: a.c, i })
    }, 1400 + i * 100)
  })

  T(() => {
    if (reduce) return
    nodes.forEach(({ n, i }) => {
      if (i === winner) {
        n.c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], {
          duration: 600,
          easing: 'cubic-bezier(.34,1.56,.64,1)',
          fill: 'both',
        })
      } else {
        n.c.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0.15 }, { opacity: 0.5 }], {
          duration: 600,
          fill: 'both',
        })
        T(() => {
          n.c.setAttribute('stroke', COL.red)
          n.c.style.filter = `drop-shadow(0 0 6px ${COL.red})`
          n.c.animate([{ opacity: 0.6 }, { opacity: 0.18 }], { duration: 700, fill: 'both' })
          const xx = n.x,
            yy = n.y,
            sz = 9
          ;[[-1, -1, 1, 1], [-1, 1, 1, -1]].forEach((seg) => {
            const l = el('line', {
              x1: xx + seg[0] * sz,
              y1: yy + seg[1] * sz,
              x2: xx + seg[2] * sz,
              y2: yy + seg[3] * sz,
              stroke: COL.red,
              'stroke-width': 3,
              'stroke-linecap': 'round',
              opacity: 0,
            })
            s.appendChild(l)
            l.animate([{ opacity: 0 }, { opacity: 0.9 }], { duration: 400, fill: 'both' })
          })
          n.g.animate(
            [{ transform: 'translate(0,0)' }, { transform: `translate(${(i - 1) * 30}px,-24px)` }],
            { duration: 900, easing: 'ease-out', fill: 'both' }
          )
        }, 650)
      }
    })
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
