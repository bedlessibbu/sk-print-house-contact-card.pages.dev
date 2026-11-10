import { ArrowUp, Mail, Phone } from 'lucide-react'
import { business, mailHref, telHref, whatsappHref } from '../config/business'
import { WhatsAppIcon } from './WhatsAppIcon'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-paper-light">
      <div className="shell py-10 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a href="#top" className="group flex items-center gap-3" aria-label={`${business.name} — back to top`}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-ink/10 transition-transform duration-500 ease-smooth group-hover:scale-105">
                <img src={business.logoMark} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
              </span>
              <span>
                <span className="block font-display text-lg leading-none tracking-tight text-ink">
                  {business.name}
                </span>
                <span className="mt-1.5 block text-[7.5px] font-semibold uppercase tracking-[0.2em] text-muted">
                  {business.tagline}
                </span>
              </span>
            </a>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">
              Call, WhatsApp or email us. Tell us what you are making, the quantity and when you need it.
            </p>
          </div>

          <div className="grid gap-2.5 text-sm sm:min-w-[16rem]">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-3 text-muted transition-colors hover:text-ink"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-ink transition-colors group-hover:border-[#128C7E] group-hover:bg-[#128C7E] group-hover:text-white">
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </span>
              WhatsApp
            </a>
            <a href={telHref} className="group flex items-center gap-3 text-muted transition-colors hover:text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-ink transition-colors group-hover:border-red group-hover:bg-red group-hover:text-paper">
                <Phone size={14} strokeWidth={1.7} />
              </span>
              {business.phone.display}
            </a>
            <a href={mailHref} className="group flex items-center gap-3 text-muted transition-colors hover:text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-ink transition-colors group-hover:border-navy group-hover:bg-navy group-hover:text-paper">
                <Mail size={14} strokeWidth={1.7} />
              </span>
              {business.email}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-5 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SK Print House. All rights reserved.</p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:text-red"
          >
            <ArrowUp size={12} strokeWidth={1.8} />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
