// Asserts the `dawn: true` slides render as intended, and that nothing dawn leaks onto the rest.
// Usage: node tools/check-dawn-slides.mjs [port]   (against a running `bun run dev:frontmania`)
import { chromium } from 'playwright-chromium'

const BASE = `http://127.0.0.1:${process.argv[2] ?? 3030}`
const DAWN = [[5, 'life was good'], [7, 'life was still good']]
const PLAIN = 4
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
    const night = root.querySelector('.fm-backdrop:not(.fm-backdrop-dawn)')
    const dawnImg = root.querySelector('.fm-backdrop-dawn')
    const card = root.querySelector('.fm-card')
    const h1 = card.querySelector('h1')
    const h2 = card.querySelector('h2')
    const bird = root.querySelector('.fm-bird')
    const rainbow = root.querySelector('.fm-rainbow')
    const cs = el => el && getComputedStyle(el)
    return {
      dawn: root.classList.contains('dawn'),
      src: dawnImg.getAttribute('src'),
      imgOk: dawnImg.complete && dawnImg.naturalWidth > 0,
      natural: `${dawnImg.naturalWidth}x${dawnImg.naturalHeight}`,
      // The night backdrop stays mounted; the dawn one fades in over it.
      dawnOpacity: Number(cs(dawnImg).opacity),
      nightOk: night.complete && night.naturalWidth > 0,
      deco: {
        wash: root.querySelectorAll('.fm-dawn-wash').length,
        lift: root.querySelectorAll('.fm-dawn-lift').length,
        rainbow: root.querySelectorAll('.fm-rainbow').length,
        clouds: root.querySelectorAll('.fm-cloud').length,
        birds: root.querySelectorAll('.fm-bird').length,
        birdPaths: root.querySelectorAll('.fm-bird svg path').length,
      },
      // the decoration must paint under the card, or the sunrise washes out the text
      layerZ: [...root.querySelectorAll('.fm-dawn-wash, .fm-dawn-lift, .fm-rainbow, .fm-cloud, .fm-bird')]
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
      rainbowMask: rainbow ? (cs(rainbow).maskImage || cs(rainbow).webkitMaskImage) : null,
    }
  }, slide)
  await page.close()
  return { r, errs }
}

const DECO = { wash: 1, lift: 1, rainbow: 1, clouds: 3, birds: 5, birdPaths: 5 }

for (const [slide, wantH1] of DAWN) {
  const { r, errs } = await probe(slide)
  const bad = [...errs]
  if (!r.dawn) bad.push('missing the dawn class')
  if (!r.imgOk) bad.push('dawn backdrop did not load: ' + r.src)
  if (!r.nightOk) bad.push('night backdrop did not load')
  if (!r.src.includes('backdrop-dawn')) bad.push('wrong backdrop: ' + r.src)
  if (r.natural !== '1920x1076') bad.push('backdrop size=' + r.natural)
  if (r.dawnOpacity !== 1) bad.push('dawn backdrop opacity=' + r.dawnOpacity)
  for (const [k, want] of Object.entries(DECO)) {
    if (r.deco[k] !== want) bad.push(`${k}=${r.deco[k]} want ${want}`)
  }
  if (r.layerZ.some(z => z >= r.cardZ)) bad.push(`decoration z=${r.layerZ} not below card z=${r.cardZ}`)
  // Vue scopes keyframe names, so the hash suffix is expected
  if (!r.birdAnim?.startsWith('bird-drift')) bad.push('bird animation=' + r.birdAnim)
  if (rgb(r.birdStroke) !== 'rgb(74,53,39)') bad.push('bird stroke=' + r.birdStroke)
  if (!r.rainbowMask || r.rainbowMask === 'none') bad.push('rainbow not masked: ' + r.rainbowMask)
  // Translucent on purpose: the sunrise has to read through the card.
  if (rgb(r.cardBg) !== 'rgba(255,249,238,0.72)') bad.push('card bg=' + r.cardBg)
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
  if (r.dawnOpacity !== 0) bad.push('dawn backdrop visible on a plain slide: opacity=' + r.dawnOpacity)
  if (Object.values(r.deco).some(Boolean)) bad.push('dawn decoration leaked: ' + JSON.stringify(r.deco))
  if (rgb(r.cardBg) !== 'rgba(29,29,27,0.88)') bad.push('card bg=' + r.cardBg)
  if (rgb(r.speakerColor) !== 'rgb(255,255,255)') bad.push('speaker colour=' + r.speakerColor)
  console.log(`slide ${PLAIN} (plain)  ${bad.length ? 'FAIL: ' + bad.join(' | ') : 'ok'}`)
  if (bad.length) fails.push(PLAIN)
}

await browser.close()
console.log(fails.length ? '\nFAILED: ' + fails.join(', ') : '\nall green')
process.exit(fails.length ? 1 : 0)
