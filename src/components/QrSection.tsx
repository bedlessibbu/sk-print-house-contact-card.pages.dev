import { Download, FileCode2, Mail, Phone, Printer, QrCode, ScanLine } from 'lucide-react'
import { motion } from 'framer-motion'
import { business } from '../config/business'
import { Reveal } from './Reveal'
import { useToast } from './toast-context'
import type { ToastInput } from './toast-context'
import { WhatsAppIcon } from './WhatsAppIcon'

function buildPrintDocument(): string {
  const qrImage = new URL(business.qrPng, window.location.origin).href
  const logoImage = new URL(business.logoMark, window.location.origin).href

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Print QR code — SK Print House</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      color: #0b0c0e;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet { width: 100%; max-width: 620px; text-align: center; }
    .logo { width: 92px; height: 92px; object-fit: contain; margin: 0 auto 16px; display: block; }
    h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 34px; font-weight: 400; letter-spacing: -1px; margin: 0; }
    .tagline { margin: 8px 0 24px; color: #6e675c; font-size: 11px; text-transform: uppercase; letter-spacing: 2.4px; }
    .qr { width: 100%; max-width: 430px; height: auto; display: block; margin: 0 auto; border: 1px solid #e7dccb; }
    h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 25px; font-weight: 400; margin: 26px 0 8px; }
    p { margin: 0; color: #6e675c; font-size: 13px; line-height: 1.6; }
    .url { margin-top: 14px; font-size: 11px; color: #1c2d4b; word-break: break-all; }
    .contacts { margin-top: 24px; padding-top: 18px; border-top: 1px solid #e7dccb; font-size: 12px; color: #0b0c0e; }
    .rule { width: 44px; height: 3px; background: #de1f26; margin: 18px auto 0; }
  </style>
</head>
<body>
  <div class="sheet">
    <img class="logo" src="${logoImage}" alt="" />
    <h1>SK Print House</h1>
    <p class="tagline">${business.tagline}</p>
    <img class="qr" src="${qrImage}" alt="QR code to ${business.url}" />
    <h2>Scan to Connect With Us</h2>
    <p>Scan this QR code to access our WhatsApp, phone and email.</p>
    <p class="url">${business.url}</p>
    <p class="contacts">${business.phone.display} &nbsp;·&nbsp; ${business.email}</p>
    <div class="rule"></div>
  </div>
</body>
</html>`
}

function printQr(notify: (input: ToastInput) => void) {
  const iframe = document.createElement('iframe')

  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '1px'
  iframe.style.height = '1px'
  iframe.style.opacity = '0'
  iframe.style.pointerEvents = 'none'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const frameWindow = iframe.contentWindow
  const frameDocument = frameWindow?.document

  if (!frameWindow || !frameDocument) {
    iframe.remove()
    notify({
      kind: 'error',
      title: 'Could not prepare the print sheet',
      message: 'Please download the QR code and print it from your device.',
    })
    return
  }

  frameDocument.open()
  frameDocument.write(buildPrintDocument())
  frameDocument.close()

  const cleanup = () => window.setTimeout(() => iframe.remove(), 800)
  frameWindow.addEventListener('afterprint', cleanup, { once: true })

  window.setTimeout(() => {
    try {
      frameWindow.focus()
      frameWindow.print()
    } catch {
      iframe.remove()
      notify({
        kind: 'error',
        title: 'Could not open the print dialog',
        message: 'Please download the QR code and print it from your device.',
      })
      return
    }

    window.setTimeout(() => {
      if (document.body.contains(iframe)) iframe.remove()
    }, 60000)
  }, 400)
}

export function QrSection() {
  const { notify } = useToast()

  return (
    <section id="qr" className="relative overflow-hidden bg-navy text-paper">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-paper/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full border border-paper/10"
        aria-hidden="true"
      />
      <p
        className="pointer-events-none absolute -bottom-8 right-4 select-none font-display text-[24vw] leading-none tracking-tighter text-paper/[0.04]"
        aria-hidden="true"
      >
        QR
      </p>

      <div className="shell relative py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-red" aria-hidden="true" />
                <span className="eyebrow text-paper/50">Share the card</span>
              </div>

              <h2 className="display-lg mt-6 max-w-xl [text-wrap:balance]">
                Scan to <span className="italic text-red">Connect</span> With Us
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/65">
                Scan this QR code to access our WhatsApp, phone and email.
              </p>

              <div className="mt-8 grid max-w-md gap-2.5 sm:grid-cols-3">
                <span className="flex items-center gap-2 rounded-full border border-paper/15 px-3 py-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-paper/70">
                  <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                  WhatsApp
                </span>
                <span className="flex items-center gap-2 rounded-full border border-paper/15 px-3 py-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-paper/70">
                  <Phone size={14} strokeWidth={1.7} className="shrink-0" />
                  Phone
                </span>
                <span className="flex items-center gap-2 rounded-full border border-paper/15 px-3 py-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-paper/70">
                  <Mail size={14} strokeWidth={1.7} className="shrink-0" />
                  Email
                </span>
              </div>

              <div className="mt-8 max-w-md border border-paper/15 bg-paper/[0.04] p-4">
                <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  <ScanLine size={13} strokeWidth={1.7} />
                  Always points to
                </p>
                <p className="mt-2 break-all text-[12px] leading-relaxed text-paper/75">{business.url}</p>
                <p className="mt-2 text-[10px] text-paper/40">Production URL · never localhost</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-paper/15 bg-paper p-5 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow text-muted">Scan to connect</p>
                    <p className="mt-1 font-display text-xl tracking-tight">SK Print House</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/10 text-navy">
                    <QrCode size={18} strokeWidth={1.7} />
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-ink/10 bg-white p-3 sm:p-4">
                  <img
                    src={business.qrPng}
                    alt={`QR code to open the SK Print House digital contact card at ${business.url}`}
                    width={1600}
                    height={1600}
                    className="mx-auto h-auto w-full max-w-[260px]"
                  />
                </div>

                <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
                  Point your phone camera at the code. No app needed.
                </p>

                <div className="mt-5 grid gap-2.5">
                  <a
                    href={business.qrPng}
                    download="SK-PRINT-HOUSE-contact-qr.png"
                    className="group inline-flex items-center justify-between gap-3 rounded-full bg-ink px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-500 ease-smooth hover:bg-navy"
                  >
                    <span className="flex items-center gap-2">
                      <Download size={14} strokeWidth={1.8} />
                      Download QR Code
                    </span>
                    <span className="text-paper/40">PNG</span>
                  </a>

                  <a
                    href={business.qrSvg}
                    download="SK-PRINT-HOUSE-contact-qr.svg"
                    className="group inline-flex items-center justify-between gap-3 rounded-full border border-ink/20 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-all duration-500 ease-smooth hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    <span className="flex items-center gap-2">
                      <FileCode2 size={14} strokeWidth={1.8} />
                      Download SVG
                    </span>
                    <span className="text-muted/60">Vector</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => printQr(notify)}
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-all duration-500 ease-smooth hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    <Printer size={14} strokeWidth={1.8} />
                    Print QR Code
                  </button>
                </div>

                <p className="mt-4 text-center text-[9.5px] uppercase tracking-[0.14em] text-muted/70">
                  High-resolution PNG · vector SVG · error correction H
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <motion.div
        className="h-px w-full origin-left bg-red"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
    </section>
  )
}
