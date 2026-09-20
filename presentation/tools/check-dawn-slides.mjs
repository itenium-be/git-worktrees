// Asserts the `dawn: true` slides render as intended, and that nothing dawn leaks onto the rest.
// Usage: node tools/check-dawn-slides.mjs [port]   (against a running `bun run dev:frontmania`)
import { chromium } from 'playwright-chromium'

const BASE = `http://127.0.0.1:${process.argv[2] ?? 3030}`
const DAWN = [[4, 'life was good'], [6, 'life was still good']]
const PLAIN = 9
// Slidev's own headless noise, not the deck's.
const IGNORE = [/Wake Lock permission/, /@server-reactive\/nav/]

const rgb = s => (s ?? '').replace(/\s/g, '')
const browser = await chromium.launch()
const fails = []

async function probe(slide) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  const errs = []
  const note = s => { if (!IGNORE.some(re => re.test(s))) errs.push(s) }
  page.on('pageerror', e => note('pageerror: ' + e.message))
  page.on('console', m => { if (m.type() === 'error') note('console: ' + m.text()) })
  page.on('requestfailed', r => note('request failed: ' + r.url()))
  await page.goto(`${BASE}/${slide}`, { waitUntil: 'networkidle' })
  await page.waitForSelector(`.slidev-page-${slide} .fm-content`, { timeout: 20000 })
  await page.waitForTimeout(500)
  const r = await page.evaluate((n) => {
    const root = document.querySelector(`.slidev-page-${n} .fm-content`)
    const img = root.querySelector('.fm-backdrop')
    const card = root.querySelector('.fm-card')
    const h1 = card.querySelector('h1')
    const h2 = card.querySelector('h2')
    const sun = root.querySelector('.fm-sun')
    const rays = root.querySelector('.fm-rays')
    const bird = root.querySelector('.fm-bird')
    const cs = el => el && getComputedStyle(el)
    return {
      dawn: root.classList.contains('dawn'),
      src: img.getAttribute('src'),
      imgOk: img.complete && img.naturalWidth > 0,
      natural: `${img.naturalWidth}x${img.naturalHeight}`,
      filter: cs(img).filter,
      deco: {
        wash: root.querySelectorAll('.fm-dawn-wash').length,
        lift: root.querySelectorAll('.fm-dawn-lift').length,
        sun: root.querySelectorAll('.fm-sun').length,
        rays: root.querySelectorAll('.fm-rays').length,
        birds: root.querySelectorAll('.fm-bird').length,
        birdPaths: root.querySelectorAll('.fm-bird svg path').length,
      },
      // the decoration must paint under the card, or the sun washes out the text
      layerZ: [...root.querySelectorAll('.fm-dawn-wash, .fm-dawn-lift, .fm-sun, .fm-rays, .fm-bird')]
        .map(el => Number(cs(el).zIndex)),
      cardZ: Number(cs(card).zIndex),
      cardBg: cs(card).backgroundColor,
      cardBorder: cs(card).borderTopColor,
      h1: h1?.textContent.trim(),
      h1Color: h1 && cs(h1).color,
      h2: h2?.textContent.trim(),
      h2Color: h2 && cs(h2).color,
      speakerColor: cs(root.querySelector('.fm-speaker')).color,
      birdAnim: bird && cs(bird).animationName,
      birdStroke: bird && cs(bird.querySelector('path')).stroke,
      sunGlow: sun ? cs(sun).boxShadow.includes('rgba') : null,
      raysMask: rays ? (cs(rays).maskImage || cs(rays).webkitMaskImage) : null,
    }
  }, slide)
  await page.close()
  return { r, errs }
}

for (const [slide, wantH1] of DAWN) {
  const { r, errs } = await probe(slide)
  const bad = [...errs]
  if (!r.dawn) bad.push('missing the dawn class')
  if (!r.imgOk) bad.push('backdrop did not load: ' + r.src)
  if (!r.src.includes('backdrop-dawn')) bad.push('wrong backdrop: ' + r.src)
  if (r.natural !== '1920x1086') bad.push('backdrop size=' + r.natural)
  if (!r.filter.includes('hue-rotate')) bad.push('no dawn filter: ' + r.filter)
  for (const [k, v] of Object.entries(r.deco)) {
    const want = k === 'birds' || k === 'birdPaths' ? 3 : 1
    if (v !== want) bad.push(`${k}=${v} want ${want}`)
  }
  if (r.layerZ.some(z => z >= r.cardZ)) bad.push(`decoration z=${r.layerZ} not below card z=${r.cardZ}`)
  // Vue scopes keyframe names, so the hash suffix is expected
  if (!r.birdAnim?.startsWith('bird-drift')) bad.push('bird animation=' + r.birdAnim)
  if (rgb(r.birdStroke) !== 'rgb(74,53,39)') bad.push('bird stroke=' + r.birdStroke)
  if (!r.sunGlow) bad.push('sun has no glow')
  if (!r.raysMask || r.raysMask === 'none') bad.push('rays not masked: ' + r.raysMask)
  if (rgb(r.cardBg) !== 'rgba(255,249,238,0.93)') bad.push('card bg=' + r.cardBg)
  if (rgb(r.cardBorder) !== 'rgb(232,163,61)') bad.push('card border=' + r.cardBorder)
  if (r.h1 !== wantH1) bad.push('h1=' + r.h1)
  if (rgb(r.h1Color) !== 'rgb(42,29,18)') bad.push('h1 colour=' + r.h1Color)
  if (rgb(r.speakerColor) !== 'rgb(42,29,18)') bad.push('speaker colour=' + r.speakerColor)
  if (r.h2 && rgb(r.h2Color) !== 'rgb(31,138,91)') bad.push('h2 colour=' + r.h2Color)
  console.log(`slide ${slide}  ${JSON.stringify(r.h1)}  ${bad.length ? 'FAIL: ' + bad.join(' | ') : 'ok'}`)
  if (bad.length) fails.push(slide)
}

{
  const { r, errs } = await probe(PLAIN)
  const bad = [...errs]
  if (r.dawn) bad.push('dawn class on a plain slide')
  if (r.src.includes('dawn')) bad.push('plain slide got the dawn backdrop')
  if (r.filter !== 'none') bad.push('plain slide filtered: ' + r.filter)
  if (Object.values(r.deco).some(Boolean)) bad.push('dawn decoration leaked: ' + JSON.stringify(r.deco))
  if (rgb(r.cardBg) !== 'rgba(29,29,27,0.88)') bad.push('card bg=' + r.cardBg)
  if (rgb(r.speakerColor) !== 'rgb(255,255,255)') bad.push('speaker colour=' + r.speakerColor)
  console.log(`slide ${PLAIN} (plain)  ${bad.length ? 'FAIL: ' + bad.join(' | ') : 'ok'}`)
  if (bad.length) fails.push(PLAIN)
}

await browser.close()
console.log(fails.length ? '\nFAILED: ' + fails.join(', ') : '\nall green')
process.exit(fails.length ? 1 : 0)
