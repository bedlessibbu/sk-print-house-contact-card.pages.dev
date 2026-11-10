import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { business } from '../config/business'
import { cn } from '../lib/utils'

export function SiteHeader({ onSave }: { onSave: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-ink/10 bg-paper/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-3"
          aria-label={`${business.name} — back to top`}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-ink/10 transition-transform duration-500 ease-smooth group-hover:scale-105">
            <img
              src={business.logoMark}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[17px] leading-none tracking-tight text-ink sm:text-[19px]">
              {business.name}
            </span>
            <span className="mt-1.5 hidden text-[7.5px] font-semibold uppercase tracking-[0.2em] text-muted sm:block">
              {business.tagline}
            </span>
          </span>
        </a>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <span className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-muted md:block">
            Digital contact card
          </span>

          <button
            type="button"
            onClick={onSave}
            className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-all duration-500 ease-smooth hover:border-ink hover:bg-ink hover:text-paper sm:px-4"
            aria-label="Save our contact as a vCard"
          >
            <Download
              size={14}
              strokeWidth={1.8}
              className="transition-transform duration-500 group-hover:translate-y-0.5"
            />
            <span className="hidden sm:inline">Save contact</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </div>
    </header>
  )
}
