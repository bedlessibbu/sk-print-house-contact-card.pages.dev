import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/utils'

type Accent = 'whatsapp' | 'call' | 'email'

interface ContactActionProps {
  href: string
  label: string
  value: string
  detail: string
  icon: ReactNode
  accent: Accent
  external?: boolean
  delay?: number
}

const accentClasses: Record<Accent, { tile: string; arrow: string; hover: string }> = {
  whatsapp: {
    tile: 'bg-[#E8F5EC] text-[#128C7E] ring-1 ring-[#128C7E]/15',
    arrow: 'group-hover:border-[#128C7E] group-hover:bg-[#128C7E] group-hover:text-white',
    hover: 'hover:border-[#128C7E]/30',
  },
  call: {
    tile: 'bg-red/10 text-red ring-1 ring-red/15',
    arrow: 'group-hover:border-red group-hover:bg-red group-hover:text-paper',
    hover: 'hover:border-red/30',
  },
  email: {
    tile: 'bg-navy/10 text-navy ring-1 ring-navy/15',
    arrow: 'group-hover:border-navy group-hover:bg-navy group-hover:text-paper',
    hover: 'hover:border-navy/30',
  },
}

export function ContactAction({
  href,
  label,
  value,
  detail,
  icon,
  accent,
  external = false,
  delay = 0,
}: ContactActionProps) {
  const reduce = useReducedMotion()

  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      aria-label={`${value} — ${detail}${external ? ' (opens in a new tab)' : ''}`}
      className={cn(
        'group relative flex w-full min-w-0 items-center gap-3 rounded-2xl border border-ink/10 bg-white/75 p-4 text-left transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:bg-white hover:shadow-lift sm:gap-4 sm:p-5',
        accentClasses[accent].hover,
      )}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className={cn(
          'grid h-11 w-11 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14',
          accentClasses[accent].tile,
        )}
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[9.5px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>
        <span className="mt-1 block font-display text-[1.05rem] leading-tight tracking-tight text-ink sm:text-[1.45rem]">
          {value}
        </span>
        <span className="mt-1 block break-words text-[11.5px] text-muted sm:text-[13px]">{detail}</span>
      </span>

      <span
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-500 ease-smooth max-[359px]:hidden sm:h-9 sm:w-9',
          accentClasses[accent].arrow,
        )}
        aria-hidden="true"
      >
        <ArrowUpRight
          size={15}
          strokeWidth={1.8}
          className="transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </motion.a>
  )
}
