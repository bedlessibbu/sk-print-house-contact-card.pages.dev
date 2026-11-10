import { chromium } from 'playwright-core'
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'

const artifacts = join(process.env.TEMP || process.cwd(), 'sk-print-house-tests')
mkdirSync(artifacts, { recursive: true })
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const context = await browser.newContext({
  viewport: { width: 320, height: 568 },
  isMobile: true,
  deviceScaleFactor: 2,
  hasTouch: true,
})
const page = await context.newPage()
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1200)
const data = await page.evaluate(() => {
  const q = (selector) => {
    const el = document.querySelector(selector)
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      selector,
      rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height },
      padding: cs.padding,
      margin: cs.margin,
      overflow: cs.overflow,
      minWidth: cs.minWidth,
      width: cs.width,
      transform: cs.transform,
    }
  }
  const hero = document.querySelector('a[href="https://wa.me/919643662299"]')
  const heroRect = hero?.getBoundingClientRect()
  const card = document.querySelector('article')
  const cardRect = card?.getBoundingClientRect()
  const grid = hero?.parentElement
  const gridRect = grid?.getBoundingClientRect()
  return {
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    heroRect: heroRect ? { left: heroRect.left, right: heroRect.right, width: heroRect.width } : null,
    cardRect: cardRect ? { left: cardRect.left, right: cardRect.right, width: cardRect.width } : null,
    gridRect: gridRect ? { left: gridRect.left, right: gridRect.right, width: gridRect.width } : null,
    hero: q('a[href="https://wa.me/919643662299"]'),
    article: q('article'),
    h1: q('h1'),
    save: q('button'),
  }
})
console.log(JSON.stringify(data, null, 2))
await page.screenshot({ path: join(artifacts, 'debug-mobile-320.png'), fullPage: true })
await browser.close()
