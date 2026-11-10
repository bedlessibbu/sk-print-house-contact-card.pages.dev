import { business, vcardFilename } from '../config/business'

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/** A valid vCard 3.0 file, readable by Android Contacts and iOS Contacts. */
export function buildVCard(): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:SK PRINT HOUSE;;;;',
    'FN:SK PRINT HOUSE',
    'ORG:SK PRINT HOUSE',
    `TEL;TYPE=WORK,VOICE:${business.phone.raw}`,
    `EMAIL;TYPE=WORK,INTERNET:${business.email}`,
    `URL:${business.url}`,
    `NOTE:${escapeVCardValue(business.tagline)}`,
    'END:VCARD',
  ]

  return `${lines.join('\r\n')}\r\n`
}

export function downloadVCard(): void {
  const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = vcardFilename
  anchor.rel = 'noopener'
  anchor.style.display = 'none'

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5000)
}
