import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { ToastContext } from './toast-context'
import type { ToastInput, ToastKind } from './toast-context'

interface ToastItem extends ToastInput {
  id: number
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const accents: Record<ToastKind, string> = {
  success: 'text-emerald-700',
  error: 'text-red-deep',
  info: 'text-navy',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)
  const timers = useRef<number[]>([])

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (input: ToastInput) => {
      counter.current += 1
      const id = counter.current

      setToasts((current) => [...current.slice(-2), { ...input, id }])

      const timer = window.setTimeout(() => remove(id), 6500)
      timers.current.push(timer)
    },
    [remove],
  )

  useEffect(() => {
    const timerList = timers.current

    return () => {
      timerList.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-4 bottom-5 z-[120] flex flex-col items-center gap-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = icons[toast.kind]

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-ink/10 bg-paper-light p-4 shadow-lift"
              >
                <Icon size={18} strokeWidth={1.7} className={cn('mt-0.5 shrink-0', accents[toast.kind])} />

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-snug text-ink">{toast.title}</p>
                  {toast.message && <p className="mt-1 text-xs leading-relaxed text-muted">{toast.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => remove(toast.id)}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                  aria-label="Dismiss notification"
                >
                  <X size={13} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
