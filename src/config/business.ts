import site from '../../site.config.json'

/**
 * Single source of truth for every business detail on the site.
 * Change `site.config.json` and rebuild to update the page, vCard and QR code.
 */
export const business = {
  name: site.name,
  legalName: site.legalName,
  tagline: site.tagline,
  intro: site.intro,
  description: site.description,
  phone: site.phone,
  whatsapp: site.whatsapp,
  email: site.email,
  url: site.url,
  logo: '/assets/logo.png',
  logoMark: '/assets/logo-mark.png',
  qrPng: '/qr/sk-print-house-contact-card.png',
  qrSvg: '/qr/sk-print-house-contact-card.svg',
  vcard: '/SK-PRINT-HOUSE.vcf',
} as const

export const telHref = `tel:${business.phone.raw}`
export const mailHref = `mailto:${business.email}`
export const whatsappHref = `https://wa.me/${business.whatsapp.number}`
export const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  business.email,
)}&su=${encodeURIComponent('Print enquiry for SK Print House')}`
export const vcardFilename = 'SK-PRINT-HOUSE.vcf'
