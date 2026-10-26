import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { asset } from '../lib/assets'
import { getLenis } from '../lib/smoothScroll'

const ease = [0.76, 0, 0.24, 1]

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, count, subtotal } = useCart()
  const [note, setNote] = useState(false)

  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    document.body.style.overflow = open ? 'hidden' : ''

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  const close = () => {
    setOpen(false)
    setNote(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          aria-hidden="true"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[69] bg-ink/60"
        />
      )}

      {open && (
        <motion.aside
          key="drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping bag"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6, ease }}
          className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-bone text-ink"
        >
          <div className="flex items-center justify-between px-6 pb-4 pt-6">
            <h2 className="font-serif text-4xl">Your bag{count > 0 ? ` (${count})` : ''}</h2>
            <button
              type="button"
              onClick={close}
              autoFocus
              aria-label="Close bag"
              className="flex size-11 items-center justify-center rounded-full ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-bone"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
              <p className="font-serif text-3xl">Your bag is empty.</p>
              <Link
                to="/shop"
                onClick={close}
                className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em]"
              >
                Start shopping →
              </Link>
            </div>
          ) : (
            <>
              <ul data-lenis-prevent className="flex-1 overflow-y-auto px-6">
                {items.map((it) => (
                  <li key={it.key} className="flex gap-4 border-t border-ink/20 py-5">
                    <Link
                      to={it.to}
                      onClick={close}
                      className="size-20 shrink-0 overflow-hidden rounded-full bg-sand"
                      aria-label={it.name}
                    >
                      <img
                        src={asset(it.image)}
                        alt=""
                        draggable={false}
                        className={`h-full w-full object-cover ${
                          it.kind === 'piece' ? 'origin-[50%_38%] scale-[1.7] object-[50%_35%]' : ''
                        }`}
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-2xl leading-tight">{it.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/70">{it.sub}</p>
                        </div>
                        <p className="font-serif text-2xl">
                          {it.price === 0 ? 'Free' : `$${it.price * it.qty}`}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQty(it.key, it.qty - 1)}
                            aria-label={`Decrease quantity of ${it.name}`}
                            className="flex size-11 items-center justify-center rounded-full ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-bone"
                          >
                            –
                          </button>
                          <span className="min-w-10 text-center tabular-nums">
                            {it.qty}
                            {it.unit ? ` ${it.unit}` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(it.key, it.qty + 1)}
                            aria-label={`Increase quantity of ${it.name}`}
                            className="flex size-11 items-center justify-center rounded-full ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-bone"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(it.key)}
                          className="min-h-11 text-xs uppercase tracking-[0.18em] underline underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-ink/20 px-6 pb-8 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-[0.18em]">Subtotal</span>
                  <span className="font-serif text-4xl">${subtotal}</span>
                </div>
                <p className="mt-2 text-sm text-ink/80">Shipping and taxes are calculated at checkout.</p>

                <button
                  type="button"
                  onClick={() => setNote(true)}
                  className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-ink text-sm uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-80"
                >
                  Checkout
                </button>
                {note && (
                  <p role="status" className="mt-3 text-sm">
                    This is a concept website, so checkout is switched off.
                  </p>
                )}
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}