import assert from 'node:assert/strict'
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright-core'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import sharp from 'sharp'

const baseUrl = process.env.TEST_URL || 'http://127.0.0.1:5173/'
const artifacts = join(process.env.TEMP || process.cwd(), 'sk-print-house-tests')
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const productionUrl = 'https://sk-print-house-contact-card.pages.dev'

mkdirSync(artifacts, { recursive: true })

const browser = await chromium.launch({ executablePath: chrome, headless: true })
const results = {}

function collectErrors(page) {
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  return errors
}

async function waitForPage(page) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('h1')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(500)
}

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  })
  const page = await context.newPage()
  const errors = collectErrors(page)
  await waitForPage(page)

  assert.equal(await page.title(), 'SK Print House — Digital Contact Card')

  const h1 = (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim()
  assert.equal(h1, 'SK Print House')

  const bodyText = await page.locator('body').innerText()
  const bodyTextLower = bodyText.toLowerCase()
  assert.ok(bodyTextLower.includes('your complete printing solution'))
  assert.ok(bodyTextLower.includes("we're just one click away. connect with us."))
  assert.ok(bodyTextLower.includes('scan to connect with us'))
  assert.ok(bodyTextLower.includes('scan this qr code to access our whatsapp, phone and email.'))

  const links = await page.$$eval('a', (anchors) =>
    anchors.map((anchor) => ({
      text: (anchor.textContent || '').replace(/\s+/g, ' ').trim(),
      href: anchor.getAttribute('href'),
      download: anchor.getAttribute('download'),
      target: anchor.getAttribute('target'),
    })),
  )

  const findLink = (needle) => links.find((link) => link.text.toLowerCase().includes(needle.toLowerCase()))

  const whatsapp = findLink('Chat on WhatsApp')
  assert.equal(whatsapp.href, 'https://wa.me/919643662299')
  assert.equal(whatsapp.target, '_blank')

  const phone = findLink('Call Us')
  assert.equal(phone.href, 'tel:+919643662299')

  const gmail = findLink('Send Us an Email')
  assert.ok(gmail.href.startsWith('https://mail.google.com/mail/?view=cm&fs=1&to=sk.printhouse%40gmail.com'))
  assert.equal(gmail.target, '_blank')

  const mailto = findLink('Use your mail app')
  assert.equal(mailto.href, 'mailto:sk.printhouse@gmail.com')

  const vcardFallback = findLink('Trouble saving')
  assert.equal(vcardFallback.href, '/SK-PRINT-HOUSE.vcf')
  assert.equal(vcardFallback.download, 'SK-PRINT-HOUSE.vcf')

  const qrPng = findLink('Download QR Code')
  assert.equal(qrPng.href, '/qr/sk-print-house-contact-card.png')
  assert.equal(qrPng.download, 'SK-PRINT-HOUSE-contact-qr.png')

  const qrSvg = findLink('Download SVG')
  assert.equal(qrSvg.href, '/qr/sk-print-house-contact-card.svg')
  assert.equal(qrSvg.download, 'SK-PRINT-HOUSE-contact-qr.svg')

  const qrNaturalWidth = await page.locator('#qr img').evaluate((img) => img.naturalWidth)
  assert.ok(qrNaturalWidth >= 1600, `QR preview natural width is ${qrNaturalWidth}`)

  const vcardDownloadPromise = page.waitForEvent('download')
  await page.locator('button').filter({ hasText: 'Save Our Contact' }).click()
  const vcardDownload = await vcardDownloadPromise
  const vcardPath = join(artifacts, 'downloaded-contact.vcf')
  await vcardDownload.saveAs(vcardPath)
  const vcard = readFileSync(vcardPath, 'utf8')
  assert.ok(vcard.startsWith('BEGIN:VCARD\r\n'))
  assert.ok(vcard.includes('\r\nFN:SK PRINT HOUSE\r\n'))
  assert.ok(vcard.includes('\r\nORG:SK PRINT HOUSE\r\n'))
  assert.ok(vcard.includes('\r\nTEL;TYPE=WORK,VOICE:+919643662299\r\n'))
  assert.ok(vcard.includes('\r\nEMAIL;TYPE=WORK,INTERNET:sk.printhouse@gmail.com\r\n'))
  assert.ok(vcard.includes(`\r\nURL:${productionUrl}\r\n`))
  assert.ok(vcard.endsWith('END:VCARD\r\n'))

  const fallbackDownloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: /Trouble saving/i }).click()
  const fallbackDownload = await fallbackDownloadPromise
  assert.equal(fallbackDownload.suggestedFilename(), 'SK-PRINT-HOUSE.vcf')

  const qrDownloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: /Download QR Code/i }).click()
  const qrDownload = await qrDownloadPromise
  const qrPath = join(artifacts, 'downloaded-qr.png')
  await qrDownload.saveAs(qrPath)
  const qrMeta = await sharp(qrPath).metadata()
  assert.equal(qrMeta.width, 1600)
  assert.equal(qrMeta.height, 1600)
  assert.equal(qrMeta.format, 'png')

  const png = PNG.sync.read(readFileSync(qrPath))
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
  assert.ok(decoded, 'The downloaded PNG did not decode as a QR code')
  assert.equal(decoded.data, productionUrl)

  const svgDownloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: /Download SVG/i }).click()
  const svgDownload = await svgDownloadPromise
  const svgPath = join(artifacts, 'downloaded-qr.svg')
  await svgDownload.saveAs(svgPath)
  const svg = readFileSync(svgPath, 'utf8')
  assert.ok(svg.startsWith('<svg'))
  assert.ok(svg.includes('width="1600"'))
  assert.ok(svg.includes('height="1600"'))
  assert.ok(svg.includes('#FFFFFF'))

  const printSheet = await (async () => {
    await page.getByRole('button', { name: /Print QR Code/i }).click()
    return page.evaluate(() => {
      const iframe = document.querySelector('iframe[aria-hidden="true"]')
      const html = iframe?.contentDocument?.documentElement?.outerHTML ?? null
      iframe?.remove()
      return html
    })
  })()
  assert.ok(printSheet, 'The print sheet iframe was not created')
  assert.ok(printSheet.includes('Scan to Connect With Us'))
  assert.ok(printSheet.includes(productionUrl))
  assert.ok(printSheet.includes('+91 96436 62299'))
  assert.ok(printSheet.includes('sk.printhouse@gmail.com'))

  await page.screenshot({ path: join(artifacts, 'desktop.png'), fullPage: true })

  assert.deepEqual(errors, [])

  results.desktop = {
    title: await page.title(),
    linksVerified: links.length,
    vcard: 'valid vCard 3.0 with all required fields',
    qrPng: `${qrMeta.width}x${qrMeta.height}, decoded to ${decoded.data}`,
    qrSvg: 'valid vector SVG, 1600x1600, white background',
    printSheet: 'created with heading, URL and contact details',
    consoleErrors: errors.length,
  }

  const viewports = [
    { name: 'mobile-390', width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
    { name: 'mobile-320', width: 320, height: 568, isMobile: true, deviceScaleFactor: 2 },
    { name: 'tablet-768', width: 768, height: 1024, isMobile: false, deviceScaleFactor: 1 },
  ]

  results.viewports = {}

  for (const viewport of viewports) {
    const mobileContext = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      deviceScaleFactor: viewport.deviceScaleFactor,
      hasTouch: viewport.isMobile,
      acceptDownloads: true,
    })
    const mobilePage = await mobileContext.newPage()
    const mobileErrors = collectErrors(mobilePage)
    await waitForPage(mobilePage)

    const layout = await mobilePage.evaluate(() => {
      const doc = document.documentElement
      const heroAction = document.querySelector('a[href="https://wa.me/919643662299"]')
      const heroRect = heroAction?.getBoundingClientRect()
      const save = [...document.querySelectorAll('button')].find((button) =>
        button.textContent?.includes('Save Our Contact'),
      )
      const saveRect = save?.getBoundingClientRect()
      const images = [...document.images].map((image) => ({
        src: image.getAttribute('src'),
        loaded: image.complete && image.naturalWidth > 0,
      }))
      return {
        innerWidth: window.innerWidth,
        scrollWidth: doc.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        heroRect: heroRect ? { left: heroRect.left, right: heroRect.right, width: heroRect.width } : null,
        saveRect: saveRect ? { left: saveRect.left, right: saveRect.right, width: saveRect.width } : null,
        images,
      }
    })

    assert.ok(
      layout.scrollWidth <= layout.innerWidth + 1,
      `${viewport.name} has horizontal overflow: ${layout.scrollWidth} > ${layout.innerWidth}`,
    )
    assert.ok(layout.heroRect, `${viewport.name}: WhatsApp action missing`)
    assert.ok(layout.heroRect.left >= 0 && layout.heroRect.right <= layout.innerWidth + 1, `${viewport.name}: WhatsApp action clipped`)
    assert.ok(layout.saveRect, `${viewport.name}: Save Our Contact button missing`)
    assert.ok(layout.saveRect.left >= 0 && layout.saveRect.right <= layout.innerWidth + 1, `${viewport.name}: Save button clipped`)
    assert.ok(layout.images.every((image) => image.loaded), `${viewport.name}: a broken image was found`)

    await mobilePage.screenshot({ path: join(artifacts, `${viewport.name}.png`), fullPage: true })
    assert.deepEqual(mobileErrors, [])

    results.viewports[viewport.name] = {
      size: `${viewport.width}x${viewport.height}`,
      horizontalOverflow: false,
      contactButtonWithinViewport: true,
      saveButtonWithinViewport: true,
      imagesLoaded: layout.images.length,
      consoleErrors: mobileErrors.length,
    }

    await mobileContext.close()
  }

  await context.close()

  console.log(JSON.stringify({ ok: true, artifacts, results }, null, 2))
} finally {
  await browser.close()
}
