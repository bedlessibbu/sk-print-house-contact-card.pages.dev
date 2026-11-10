import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true })
const context = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, deviceScaleFactor: 2, hasTouch: true })
const page = await context.newPage()
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1')
await page.waitForTimeout(500)
const data = await page.evaluate(() => {
  const email = [...document.querySelectorAll('a')].find((a) => a.getAttribute('href')?.startsWith('https://mail.google.com'))
  const arrow = email?.lastElementChild
  const textWrap = email?.querySelector('span.min-w-0')
  const style = arrow ? getComputedStyle(arrow) : null
  return {
    arrowClass: arrow?.className,
    arrowDisplay: style?.display,
    arrowWidth: arrow?.getBoundingClientRect().width,
    textWrapWidth: textWrap?.getBoundingClientRect().width,
    emailRect: (() => { const r = email?.getBoundingClientRect(); return r ? { left: r.left, right: r.right, width: r.width } : null })(),
    innerWidth: window.innerWidth,
    mediaMatch: window.matchMedia('(min-width: 640px)').matches,
  }
})
console.log(JSON.stringify(data, null, 2))
await browser.close()
