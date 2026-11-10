import { useCallback } from 'react'
import { ArrowUpRight, Download, Mail, Phone } from 'lucide-react'
import { business, gmailComposeHref, mailHref, telHref, vcardFilename, whatsappHref } from '../config/business'
import { downloadVCard } from '../lib/vcard'
import { ContactAction } from '../components/ContactAction'
import { QrSection } from '../components/QrSection'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { useToast } from '../components/toast-context'

function RegistrationMarks() {
  return (
    <div className="pointer-events-none absolute inset-3 sm:inset-4" aria-hidden="true">
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-ink/15" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-ink/15" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-ink/15" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-ink/15" />
    </div>
  )
}

export function ContactCard() {
  const { notify } = useToast()

  const handleSaveContact = useCallback(() => {
    try {
      downloadVCard()
      notify({
        kind: 'success',
        title: 'Contact card downloaded',
        message: 'Open the .vcf file to add SK Print House to your contacts.',
      })
    } catch {
      notify({
        kind: 'error',
        title: 'Could not download the contact',
        message: 'Please use the direct .vcf link below the save button.',
      })
    }
  }, [notify])

  return (
    <div id="top" className="grain relative min-h-screen overflow-hidden bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.16em] focus:text-paper"
      >
        Skip to content
      </a>

      <SiteHeader onSave={handleSaveContact} />

      <main id="main" className="relative">
        <section className="relative overflow-hidden pb-14 pt-24 sm:pb-24 sm:pt-36">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="paper-grid absolute inset-0 opacity-70" />
            <div className="absolute -right-32 top-20 h-[420px] w-[420px] rounded-full border border-ink/[0.06] sm:h-[620px] sm:w-[620px]" />
            <div className="absolute -left-24 bottom-10 h-[260px] w-[260px] rounded-full border border-ink/[0.05]" />
            <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display text-[32vw] leading-none tracking-tighter text-ink/[0.025]">
              SK
            </p>
          </div>

          <p
            className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-180 text-[9px] font-semibold uppercase tracking-[0.3em] text-muted/50 [writing-mode:vertical-rl] xl:block"
            aria-hidden="true"
          >
            Digital contact card
          </p>
          <p
            className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 text-[9px] font-semibold uppercase tracking-[0.3em] text-muted/50 [writing-mode:vertical-rl] xl:block"
            aria-hidden="true"
          >
            Scan · Tap · Connect
          </p>

          <div className="shell relative">
            <div className="relative mx-auto max-w-3xl">
              <Reveal>
                <article className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper-light px-5 py-6 shadow-card sm:rounded-[2rem] sm:px-10 sm:py-10">
                  <RegistrationMarks />

                  <div className="flex items-start justify-between gap-5">
                    <div className="inline-flex bg-white p-2 ring-1 ring-ink/10 sm:p-3">
                      <img
                        src={business.logo}
                        alt="SK Print House official logo"
                        width={96}
                        height={96}
                        className="h-16 w-16 object-contain sm:h-24 sm:w-24"
                      />
                    </div>

                    <div className="text-right">
                      <p className="eyebrow text-muted">Digital contact card</p>
                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                        Tap · Scan · Connect
                      </p>
                      <span
                        className="ml-auto mt-3 block h-2 w-2 animate-pulse-soft rounded-full bg-red"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-7">
                    <div className="flex items-center gap-3">
                      <span className="h-px w-8 bg-red" aria-hidden="true" />
                      <span className="eyebrow text-muted">Print studio</span>
                    </div>

                    <h1 className="mt-4 font-display text-[clamp(2.45rem,11vw,5.4rem)] leading-[0.88] tracking-tightest text-ink">
                      SK <span className="text-red">Print</span> House
                    </h1>

                    <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-navy sm:mt-4 sm:text-[11px] sm:tracking-[0.24em]">
                      {business.tagline}
                    </p>

                    <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-muted sm:mt-5 sm:text-base">
                      {business.intro}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-3 sm:mt-7" aria-hidden="true">
                    <span className="h-px flex-1 bg-ink/10" />
                    <span className="h-1.5 w-1.5 rounded-full bg-red" />
                    <span className="h-px w-12 bg-red" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:mt-6">
                    <ContactAction
                      href={whatsappHref}
                      external
                      label="WhatsApp"
                      value="Chat on WhatsApp"
                      detail={business.whatsapp.display}
                      icon={<WhatsAppIcon className="h-6 w-6" />}
                      accent="whatsapp"
                      delay={0.02}
                    />
                    <ContactAction
                      href={telHref}
                      label="Call us"
                      value="Call Us"
                      detail={business.phone.display}
                      icon={<Phone size={22} strokeWidth={1.7} />}
                      accent="call"
                      delay={0.08}
                    />
                    <ContactAction
                      href={gmailComposeHref}
                      external
                      label="Email"
                      value="Send Us an Email"
                      detail={business.email}
                      icon={<Mail size={22} strokeWidth={1.7} />}
                      accent="email"
                      delay={0.14}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveContact}
                    className="group mt-4 flex w-full items-center justify-between gap-4 rounded-2xl bg-ink px-4 py-3.5 text-left text-paper transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:bg-navy hover:shadow-lift sm:mt-5 sm:px-6 sm:py-4"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper/10 text-paper transition-colors duration-500 group-hover:bg-red sm:h-10 sm:w-10">
                        <Download size={18} strokeWidth={1.8} />
                      </span>
                      <span>
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-paper/55 sm:text-[10px]">
                          One tap to save
                        </span>
                        <span className="mt-0.5 block font-display text-lg leading-tight tracking-tight sm:text-xl">
                          Save Our Contact
                        </span>
                      </span>
                    </span>

                    <span className="hidden items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-paper/50 sm:flex">
                      .vcf
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.7}
                        className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </button>

                  <div className="mt-4 flex flex-col items-center gap-2 text-center">
                    <p className="text-[11px] leading-relaxed text-muted">
                      Adds SK Print House to your phone&apos;s contacts. Works on Android and iPhone.
                    </p>
                    <a
                      href={business.vcard}
                      download={vcardFilename}
                      className="link-line text-[11px] font-medium text-ink"
                    >
                      Trouble saving? Download the .vcf directly
                    </a>
                  </div>

                  <div className="mt-5 flex flex-col items-center gap-2 border-t border-ink/10 pt-5 text-center">
                    <p className="text-[11px] leading-relaxed text-muted">
                      Gmail not opening?{' '}
                      <a href={mailHref} className="link-line font-medium text-ink">
                        Use your mail app
                      </a>
                      .
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted/70">
                      Or call {business.phone.display}
                    </p>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                  <span>One tap. No forms.</span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red" aria-hidden="true" />
                    WhatsApp · Phone · Email
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <QrSection />
      </main>

      <SiteFooter />
    </div>
  )
}
