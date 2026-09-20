// Asserts the closing "Final Thoughts" slide reveals both columns and fits the card at 16:9.
// Usage: node tools/check-next-steps.mjs [port]   (against a running `bun run dev`)
import { chromium } from 'playwright-chromium'

const BASE = `http://127.0.0.1:${process.argv[2] ?? 3030}`
const SLIDE = 15
const CLICKS = 7
const IGNORE = [/Wake Lock permission/, /@server-reactive\/nav/]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
const errs = []
const note = s => { if (!IGNORE.some(re => re.test(s))) errs.push(s) }
page.on('pageerror', e => note('pageerror: ' + e.message))
page.on('console', m => { if (m.type() === 'error') note('console: ' + m.text()) })
page.on('requestfailed', r => note('request failed: ' + r.url()))

await page.goto(`${BASE}/${SLIDE}`, { waitUntil: 'networkidle' })
await page.waitForSelector(`.slidev-page-${SLIDE} .fm-content`, { timeout: 20000 })
await page.waitForTimeout(400)

const read = () => page.evaluate((n) => {
  const root = document.querySelector(`.slidev-page-${n} .fm-content`)
  const card = root.querySelector('.fm-card')
  const shown = el => !!el && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).opacity !== '0'
  const cols = [...root.querySelectorAll('.col')]
  const lines = [...root.querySelectorAll('.col .line')]
  const cb = card.getBoundingClientRect()
  return {
    bar: root.querySelector('.fm-speaker')?.textContent.trim() ?? null,
    hasCard: getComputedStyle(card).borderTopWidth !== '0px',
    heads: cols.map(c => c.querySelector('h2')?.textContent.trim()),
    colWidths: cols.map(c => Math.round(c.getBoundingClientRect().width)),
    colTops: cols.map(c => Math.round(c.getBoundingClientRect().top)),
    colHeights: cols.map(c => Math.round(c.getBoundingClientRect().height)),
    visible: lines.filter(shown).length,
    total: lines.length,
    tags: [...root.querySelectorAll('.tags span')].length,
    tagsShown: shown(root.querySelector('.tags')),
    overflow: card.scrollHeight - card.clientHeight,
    spills: [...root.querySelectorAll('.col *')].some(el => {
      const b = el.getBoundingClientRect()
      return b.height > 0 && (b.bottom > cb.bottom + 1 || b.right > cb.right + 1)
    }),
    markers: [...root.querySelectorAll('.col .line')].map(p => getComputedStyle(p, '::before').content),
  }
}, SLIDE)

const before = await read()
for (let i = 0; i < CLICKS; i++) {
  await page.keyboard.press('Space')
  await page.waitForTimeout(200)
}
const after = await read()
const url = page.url()

const bad = [...errs]
if (before.bar !== 'Final Thoughts') bad.push('speaker bar=' + before.bar)
if (before.heads.join('|') !== 'Merge queue as next bottleneck?|But.. What about code review?') bad.push('columns=' + before.heads.join('|'))
if (before.colWidths[1] <= before.colWidths[0]) bad.push('the review box is not the wider one: ' + before.colWidths.join(' vs '))
if (Math.abs(before.colTops[0] - before.colTops[1]) > 1) bad.push('boxes not top-aligned: ' + before.colTops.join(' vs '))
if (Math.abs(after.colHeights[0] - after.colHeights[1]) > 1) bad.push('boxes not equal height: ' + after.colHeights.join(' vs '))
if (before.visible !== 0) bad.push(`${before.visible} lines visible before the first click`)
if (after.visible !== after.total) bad.push(`${after.visible}/${after.total} lines visible after ${CLICKS} clicks`)
if (after.total !== 6) bad.push(`expected 6 lines, found ${after.total}`)
if (!after.tagsShown) bad.push('the non-functional tags never appear')
if (after.tags !== 5) bad.push(`expected 5 tags, found ${after.tags}`)
if (after.markers.some(m => !m || m === 'none')) bad.push('a line is missing its ✗ / ! / → marker')
if (before.hasCard) bad.push('the big card is still drawn')
if (after.overflow > 1) bad.push(`card scrolls: ${after.overflow}px of overflow`)
if (after.spills) bad.push('content runs past the card')
if (new URL(url).pathname !== `/${SLIDE}`) bad.push(`ran out of clicks on slide ${SLIDE}: now at ${url}`)

console.log(`slide ${SLIDE} (final thoughts)  ${bad.length ? 'FAIL: ' + bad.join(' | ') : 'ok'}`)
await browser.close()
process.exit(bad.length ? 1 : 0)
