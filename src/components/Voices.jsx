import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const INTERVAL = 7000

const voices = [
  {
    name: 'Areeba K.',
    place: 'Lahore',
    piece: 'Sage Linen Set',
    to: '/shop/sage-linen-set',
    quote: 'The linen set arrived softer than I expected, and it still looks sharp after a dozen washes.',
  },
  {
    name: 'Hassan R.',
    place: 'Karachi',
    piece: 'Merino Wool',
    to: '/fabrics',
    quote: 'I ordered two metres of merino for a coat. The weight and drape are exactly what the swatch promised.',
  },
  {
    name: 'Daniyal A.',
    place: 'Islamabad',
    piece: 'Charcoal Overcoat',
    to: '/shop/charcoal-overcoat',
    quote: 'It is the first coat I have owned that I do not want to replace by February.',
  },
  {
    name: 'Mariam S.',
    place: 'Dubai',
    piece: 'Rust Wrap Midi Dress',
    to: '/shop/rust-wrap-dress',
    quote: 'Everything feels considered, from the fit to the way the fabric moves when I walk.',
  },
]

export default function Voices() {
  const [i, setI] = useState(0)

  // auto-advance; clicking a name changes i, which restarts this timer
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % voices.length), INTERVAL)
    return () => clearTimeout(t)
  }, [i])

  const v = voices[i]

  return (
    <section aria-label="Customer voices" className="bg-sand py-20 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1fr_260px] lg:px-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink">Voices</p>

          <div className="relative mt-8 min-h-[20rem] sm:min-h-[18rem]" aria-live="polite">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-1 -top-12 select-none font-serif text-[9rem] leading-none text-ink/15 sm:text-[12rem]"
            >
              “
            </span>

            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease }}
                className="relative"
              >
                <blockquote className="font-serif text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.1] text-ink">
                  {v.quote}
                </blockquote>
                <figcaption className="mt-8 text-sm uppercase tracking-[0.18em] text-ink">
                  {v.name} · {v.place} —{' '}
                  <Link to={v.to} className="underline underline-offset-4">
                    {v.piece}
                  </Link>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 self-end md:grid-cols-1">
          {voices.map((item, idx) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => setI(idx)}
                aria-current={i === idx}
                className={`relative min-h-11 w-full py-3 text-left font-serif text-2xl transition-colors ${
                  i === idx ? 'text-ink' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-px bg-ink/25" />
                {i === idx && (
                  <motion.span
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                    style={{ originX: 0 }}
                    className="absolute inset-x-0 bottom-0 h-px bg-ink"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}