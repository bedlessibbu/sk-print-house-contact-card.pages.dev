import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const site = JSON.parse(readFileSync(resolve(root, 'site.config.json'), 'utf8'))
const publicDir = resolve(root, 'public')

mkdirSync(resolve(publicDir, 'qr'), { recursive: true })
mkdirSync(resolve(publicDir, 'assets'), { recursive: true })

const qrOptions = {
  errorCorrectionLevel: 'H',
  margin: 4,
  width: 1600,
  color: {
    dark: '#0B0C0E',
    light: '#FFFFFF',
  },
}

const qrPngPath = resolve(publicDir, 'qr/sk-print-house-contact-card.png')
const qrSvgPath = resolve(publicDir, 'qr/sk-print-house-contact-card.svg')

await QRCode.toFile(qrPngPath, site.url, qrOptions)

const svg = await QRCode.toString(site.url, { ...qrOptions, type: 'svg' })
const svgWithBackground = svg.includes('<rect') && svg.includes('#FFFFFF')
  ? svg
  : svg.replace('<svg', '<svg style="background:#FFFFFF"')
writeFileSync(qrSvgPath, svgWithBackground, 'utf8')

const vcard = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:;SK PRINT HOUSE;;;',
  'FN:SK PRINT HOUSE',
  'ORG:SK PRINT HOUSE',
  `TEL;TYPE=WORK,VOICE:${site.phone.raw}`,
  `EMAIL;TYPE=WORK,INTERNET:${site.email}`,
  `URL:${site.url}`,
  `NOTE:${site.tagline}`,
  'END:VCARD',
].join('\r\n')

writeFileSync(resolve(publicDir, 'SK-PRINT-HOUSE.vcf'), `${vcard}\r\n`, 'utf8')

const markPath = resolve(publicDir, 'assets/logo-mark.png')
const iconSizes = [
  [32, 'favicon-32.png'],
  [64, 'favicon-64.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]

for (const [size, filename] of iconSizes) {
  await sharp(markPath)
    .resize(size, size, { fit: 'contain', background: '#FFFFFF' })
    .png()
    .toFile(resolve(publicDir, `assets/${filename}`))
}

const logoBase64 = readFileSync(markPath).toString('base64')
const displayUrl = site.url.replace(/^https?:\/\//, '')
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#1C2D4B"/>
  <circle cx="1080" cy="80" r="270" fill="none" stroke="#F4EEE4" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="1080" cy="80" r="190" fill="none" stroke="#F4EEE4" stroke-opacity="0.08" stroke-width="2"/>
  <rect x="80" y="76" width="188" height="188" fill="#FFFFFF"/>
  <image href="data:image/png;base64,${logoBase64}" x="98" y="94" width="152" height="152" preserveAspectRatio="xMidYMid meet"/>
  <text x="80" y="368" fill="#F4EEE4" font-family="Georgia, 'Times New Roman', serif" font-size="82" letter-spacing="-3">SK Print House</text>
  <text x="82" y="424" fill="#DE1F26" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" letter-spacing="5">DIGITAL CONTACT CARD</text>
  <text x="82" y="490" fill="#F4EEE4" fill-opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="28">${site.tagline}</text>
  <text x="82" y="550" fill="#F4EEE4" fill-opacity="0.5" font-family="Arial, Helvetica, sans-serif" font-size="20">${displayUrl}</text>
  <rect x="0" y="620" width="1200" height="10" fill="#DE1F26"/>
</svg>`

await sharp(Buffer.from(ogSvg)).png().toFile(resolve(publicDir, 'assets/og-cover.png'))

writeFileSync(
  resolve(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
  'utf8',
)

writeFileSync(
  resolve(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  'utf8',
)

console.log(`Generated QR, vCard, icons, OG cover and sitemap for ${site.url}`)
