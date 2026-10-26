import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import { getLenis } from '../lib/smoothScroll'
import { useCart } from '../context/CartContext'

const left = [
  { to: '/shop', label: 'Shop' },
  { to: '/fabrics', label: 'Fabrics' },
]
const right = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]
const menu = [{ to: '/', label: 'Home' }, ...left, ...right]

const linkClass =
  'inline-flex min-h-11 items-center text-sm uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-60'

const renderLink = (l) => (
  <li key={l.to}>
    <NavLink to={l.to} className={linkClass}>
      {({ isActive }) => (
        <span className={`border-b pb-0.5 ${isActive ? 'border-ink' : 'border-transparent'}`}>
          {l.label}
        </span>
      )}
    </NavLink>
  </li>
)

const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6.5a3 3 0 016 0V8" />
  </svg>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count, setOpen: setBagOpen } = useCart()

  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        aria-label="Main"
        className="relative z-[60] mx-auto flex w-full max-w-5xl items-center justify-between rounded-full bg-bone/95 px-4 py-1 ring-1 ring-ink/10 sm:px-7 md:grid md:grid-cols-[1fr_auto_1fr]"
      >
        <ul className="hidden items-center gap-8 md:flex">{left.map(renderLink)}</ul>

        <Link
          to="/"
          aria-label="ZARVA home"
          onClick={() => setOpen(false)}
          className="flex min-h-11 items-center"
        >
          <Logo className="h-7 w-auto sm:h-9" />
        </Link>

        <ul className="hidden items-center justify-end gap-8 md:flex">
          {right.map(renderLink)}
          <li>
            <button type="button" onClick={() => setBagOpen(true)} className={linkClass}>
              Bag
              {count > 0 && (
                <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-ink text-[11px] tracking-normal text-bone">
                  {count}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* mobile: bag + menu buttons */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setBagOpen(true)
            }}
            aria-label={`Open bag, ${count} items`}
            className="relative flex min-h-11 min-w-11 items-center justify-center text-ink"
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute right-0.5 top-1 flex size-5 items-center justify-center rounded-full bg-ink text-[11px] text-bone">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex min-h-11 min-w-11 items-center justify-center"
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-ink transition-all duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-ink transition-all duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 text-bone md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
            >
              {menu.map((l) => (
                <li key={l.to} className="overflow-hidden">
                  <motion.div
                    variants={{
                      hidden: { y: '110%' },
                      show: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="block min-h-11 font-serif text-5xl leading-tight text-bone"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </motion.ul>

            <p className="text-sm uppercase tracking-[0.18em] text-bone">Autumn · Winter ’26</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}