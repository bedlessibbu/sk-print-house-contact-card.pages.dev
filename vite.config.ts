import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

interface SiteConfig {
  name: string
  legalName: string
  tagline: string
  intro: string
  description: string
  phone: { display: string; raw: string }
  whatsapp: { display: string; number: string }
  email: string
  url: string
  projectName: string
}

const site = JSON.parse(
  readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'),
) as SiteConfig

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.legalName,
  url: site.url,
  logo: `${site.url}/assets/logo.png`,
  slogan: site.tagline,
  description: site.description,
  telephone: site.phone.raw,
  email: site.email,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: site.phone.raw,
      contactType: 'customer service',
    },
  ],
}

function injectSiteMeta(html: string) {
  return html
    .replaceAll('%SITE_URL%', site.url)
    .replaceAll('%SITE_NAME%', site.name)
    .replaceAll('%SITE_LEGAL_NAME%', site.legalName)
    .replaceAll('%SITE_TAGLINE%', site.tagline)
    .replaceAll('%SITE_DESCRIPTION%', site.description)
    .replaceAll('%SITE_EMAIL%', site.email)
    .replaceAll('%SITE_PHONE%', site.phone.display)
    .replaceAll('%STRUCTURED_DATA%', JSON.stringify(structuredData))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sk-print-house-site-meta',
      transformIndexHtml: injectSiteMeta,
    },
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
})
