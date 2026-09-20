// Asserts the closing slide carries a scannable QR to the talk's repo, clear of the other marks.
// Usage: node tools/check-end-slide.mjs [port]   (against a running `bun run dev`)
import { chromium } from 'playwright-chromium'
import { encode } from 'uqr'

const BASE = `http://127.0.0.1:${process.argv[2] ?? 3030}`
const SLIDE = 16
const SOURCE = 'itenium-be/git-worktrees'
const URL_ = `https://github.com/${SOURCE}`
const IGNORE = [/Wake Lock permission/, /@server-reactive\/nav/]

const qr = encode(URL_, { ecc: 'H' })
const modules = qr.data.flatMap((row, y) => row.map((on, x) => on ? `${x},${y}` : null)).filter(Boolean)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
const errs = []
const note = s => { if (!IGNORE.some(re => re.test(s))) errs.push(s) }
page.on('pageerror', e => note('pageerror: ' + e.message))
page.on('console', m => { if (m.type() === 'error') note('console: ' + m.text()) })
page.on('requestfailed', r => note('request failed: ' + r.url()))
await page.goto(`${BASE}/${SLIDE}`, { waitUntil: 'networkidle' })
await page.waitForSelector(`.slidev-page-${SLIDE} .fm-end`, { timeout: 20000 })
await page.waitForTimeout(500)

const r = await page.evaluate((n) => {
  const root = document.querySelector(`.slidev-page-${n} .fm-end`)
  const qrBox = root.querySelector('.fm-end-qr')
  const svg = qrBox?.querySelector('svg')
  const link = root.querySelector('.fm-end-qr-link')
  const box = el => { const b = el?.getBoundingClientRect(); return b && { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height } }
  const overlaps = (a, b) => a && b && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b
  const slide = box(root)
  const boxes = { qr: box(qrBox), link: box(link), title: box(root.querySelector('.fm-end-title')), logo: box(root.querySelector('.fm-end-logo')) }
  return {
    hasSvg: !!svg,
    rects: svg ? [...svg.querySelectorAll('rect')].map(el => `${el.getAttribute('x')},${el.getAttribute('y')}`) : [],
    viewBox: svg?.getAttribute('viewBox') ?? null,
    logoImg: svg?.querySelector('image')?.getAttribute('href') ?? null,
    fill: svg?.querySelector('rect')?.getAttribute('fill') ?? null,
    linkText: link?.textContent.trim() ?? null,
    linkHref: link?.getAttribute('href') ?? null,
    square: boxes.qr ? Math.abs(boxes.qr.w - boxes.qr.h) : null,
    inBounds: boxes.qr && boxes.qr.l >= slide.l && boxes.qr.r <= slide.r && boxes.qr.t >= slide.t && boxes.qr.b <= slide.b,
    collides: Object.entries(boxes).filter(([k, v]) => !['qr', 'link'].includes(k) && (overlaps(boxes.qr, v) || overlaps(boxes.link, v))).map(([k]) => k),
    qrW: boxes.qr?.w,
    logoW: boxes.logo?.w,
    qrLeftOfLogo: boxes.qr && boxes.logo && boxes.qr.r <= boxes.logo.l,
    social: !!root.querySelector('.fm-social'),
    // the text itself, not its box: the link is wider than the QR and would overflow one-sided
    linkOffset: (() => {
      const rng = document.createRange(); rng.selectNodeContents(link)
      const t = rng.getBoundingClientRect()
      return (t.left + t.right) / 2 - (boxes.qr.l + boxes.qr.r) / 2
    })(),
  }
}, SLIDE)

const bad = [...errs]
if (!r.hasSvg) bad.push('no QR svg on the end slide')
// every dark module of the encoded URL, plus the white plate behind the centred logo
const drawn = new Set(r.rects)
const missing = modules.filter(m => !drawn.has(m))
if (missing.length) bad.push(`${missing.length} QR modules not drawn (e.g. ${missing.slice(0, 3)})`)
if (r.rects.length !== modules.length + 1) bad.push(`QR rects=${r.rects.length} want ${modules.length + 1}`)
if (r.viewBox !== `0 0 ${qr.size} ${qr.size}`) bad.push('QR viewBox=' + r.viewBox)
if (!r.logoImg) bad.push('QR has no logo overlay')
if (r.square !== null && r.square > 1) bad.push(`QR not square: off by ${r.square}px`)
if (!r.inBounds) bad.push('QR runs off the slide')
if (r.collides.length) bad.push('QR overlaps: ' + r.collides.join(', '))
if (r.qrW < 300) bad.push(`QR only ${Math.round(r.qrW)}px wide at 1600x900`)
if (r.logoW < 400) bad.push(`logo only ${Math.round(r.logoW)}px wide at 1600x900`)
if (!r.qrLeftOfLogo) bad.push('QR is not left of the logo')
if (r.social) bad.push('the X / #FrontMania line is still there')
if (Math.abs(r.linkOffset) > 2) bad.push(`link text off the QR centre by ${Math.round(r.linkOffset)}px`)
if (r.linkText !== `github.com/${SOURCE}`) bad.push('link text=' + r.linkText)
if (r.linkHref !== URL_) bad.push('link href=' + r.linkHref)

console.log(`slide ${SLIDE} (end)  ${bad.length ? 'FAIL: ' + bad.join(' | ') : 'ok'}`)
await browser.close()
process.exit(bad.length ? 1 : 0)
