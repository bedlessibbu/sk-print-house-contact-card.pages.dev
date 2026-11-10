import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true })
const context = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, deviceScaleFactor: 2, hasTouch: true })
const page = await context.newPage()
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(800)
const data = await page.evaluate(() => {
  const email = [...document.querySelectorAll('a')].find((a) => a.getAttribute('href')?.startsWith('https://mail.google.com'))
  const detail = email?.querySelector('span.min-w-0 > span:last-child')
  const textNode = [...(email?.querySelectorAll('span') ?? [])].find((s) => s.textContent === 'sk.printhouse@gmail.com' && s.children.length === 0)
  const range = document.createRange()
  if (textNode) range.selectNodeContents(textNode)
  return {
    actionWidth: email?.getBoundingClientRect().width,
    detailWidth: detail?.getBoundingClientRect().width,
    detailFontSize: detail ? getComputedStyle(detail).fontSize : null,
    textWidth: textNode ? range.getBoundingClientRect().width : null,
    textRect: textNode ? (() => { const r = textNode.getBoundingClientRect(); return { left: r.left, right: r.right, width: r.width } })() : null,
    html: email?.outerHTML.slice(0, 1200),
  }
})
console.log(JSON.stringify(data, null, 2))
await browser.close()
