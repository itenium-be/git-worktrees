// LIVING GIT GRAPH — shared SVG primitives ported from prototypes/variant-b.html.
// Not a component: named with the Graph* family's lowercase sibling to stay unique
// in the shared components/ dir. All visual styling is set inline (scoped CSS can't
// reach SVG nodes created via the DOM API).

export const SVGNS = 'http://www.w3.org/2000/svg'

export const COL = {
  claude: '#D97757',
  codex: '#2DB88E',
  gemini: '#8E7CF0',
  trunk: '#5b6b80',
  red: '#e8534e',
  core: '#7f8bff',
  muted: '#8792a3',
  bg: '#0a0d12',
}

export const reduce =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function el(tag, attrs) {
  const e = document.createElementNS(SVGNS, tag)
  for (const k in attrs) e.setAttribute(k, attrs[k])
  return e
}

export function clear(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild)
}

export function node(svg, x, y, color, r = 11) {
  const g = el('g', {})
  const halo = el('circle', { cx: x, cy: y, r: r + 8, fill: color, opacity: 0 })
  halo.style.mixBlendMode = 'screen'
  const c = el('circle', { cx: x, cy: y, r, fill: COL.bg, stroke: color, 'stroke-width': 3 })
  c.style.filter = `drop-shadow(0 0 6px ${color})`
  g.appendChild(halo)
  g.appendChild(c)
  svg.appendChild(g)
  return { g, c, halo, x, y, color }
}

export function popNode(n, delay = 0) {
  if (reduce) {
    n.c.style.opacity = 1
    return
  }
  n.c.style.transformOrigin = `${n.x}px ${n.y}px`
  n.c.style.transform = 'scale(0)'
  n.c.style.opacity = '0'
  n.c.animate(
    [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1.35)', opacity: 1, offset: 0.65 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    { duration: 520, delay, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'both' }
  )
  n.halo.animate([{ opacity: 0 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0 }], {
    duration: 900,
    delay,
    fill: 'both',
  })
}

export function drawPath(svg, d, color, w = 3.5, delay = 0, dur = 900) {
  const p = el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' })
  p.style.filter = `drop-shadow(0 0 5px ${color}66)`
  svg.appendChild(p)
  if (reduce) return p
  const len = p.getTotalLength()
  p.style.strokeDasharray = len
  p.style.strokeDashoffset = len
  p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
    duration: dur,
    delay,
    easing: 'cubic-bezier(.65,0,.35,1)',
    fill: 'both',
  })
  return p
}

export function drawLabel(svg, x, y, text, color, delay = 0, anchor = 'start', size = 22, weight = 600) {
  const t = el('text', {
    x,
    y,
    fill: color,
    'font-family': '"SF Mono","JetBrains Mono",ui-monospace,Menlo,monospace',
    'font-size': size,
    'font-weight': weight,
    'text-anchor': anchor,
  })
  t.textContent = text
  svg.appendChild(t)
  if (!reduce) {
    t.style.opacity = 0
    t.animate([{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], {
      duration: 600,
      delay,
      easing: 'ease-out',
      fill: 'both',
    })
  }
  return t
}

// Re-run the build each time the slide scrolls back into view so the animation
// plays on arrival, not silently at initial mount while off-screen.
export function watchVisible(rootEl, cb) {
  if (typeof IntersectionObserver === 'undefined') {
    cb()
    return null
  }
  let visible = false
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > 0.35) {
          if (!visible) {
            visible = true
            cb()
          }
        } else {
          visible = false
        }
      }
    },
    { threshold: [0, 0.35, 0.6] }
  )
  io.observe(rootEl)
  return io
}
