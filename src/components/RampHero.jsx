import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { products, fabrics } from '../data/products'
import { asset } from '../lib/assets'
import { session } from '../lib/session'

const ease = [0.22, 1, 0.36, 1]
const SCALES = [1, 0.9, 0.72, 0.56] // size by distance from the focused model (this makes the arc)
const SPACING = 54 // gap between models, in % of one model's width

// model height: relative to the full hero section on desktop, to the ramp on mobile
const MODEL_H = 'h-[96%] lg:h-[60%] xl:h-[66%] 2xl:h-[84%]'
const DISC_H = 'h-[80%] lg:h-[50%] xl:h-[55%] 2xl:h-[70%]'

const tabs = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
]

const Arrow = ({ dir }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
)

export default function RampHero() {
  const [gender, setGender] = useState('women')
  const [active, setActive] = useState(2)
  // wait for the splash curtain on the first load, start sooner afterwards
  const [base] = useState(() => (session.loaded ? 1 : 3.1))
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), (base + 1.5) * 1000)
    return () => clearTimeout(t)
  }, [base])

  const list = products.filter((p) => p.gender === gender)
  const count = list.length
  const current = list[active]
  const fabricName = fabrics.find((f) => f.id === current.fabric)?.name
  const wait = (extra = 0) => (introDone ? 0 : base + extra)

  const next = () => setActive((a) => (a + 1) % count)
  const prev = () => setActive((a) => (a - 1 + count) % count)

  const pick = (id) => {
    if (id === gender) return
    setGender(id)
    setActive(2)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }

  return (
    <section
      onKeyDown={onKeyDown}
      className="relative isolate flex min-h-svh flex-col overflow-hidden pb-6 pt-24 lg:pt-28"
    >
      {/* title + toggle (sits above the models) */}
      <div className="relative z-10 px-6 lg:pointer-events-none lg:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: wait() }}
          className="text-xs uppercase tracking-[0.3em] text-ink/70"
        >
          The new season
        </motion.p>

        <div className="overflow-hidden pb-2">
          <motion.h1
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease, delay: wait(0.1) }}
            className="font-serif text-[clamp(3rem,9vw,7rem)] leading-[0.95]"
          >
            Autumn ’26
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: wait(0.35) }}
          role="group"
          aria-label="Choose collection"
          className="flex items-center gap-8 lg:pointer-events-auto lg:w-fit"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => pick(t.id)}
              aria-pressed={gender === t.id}
              className={`relative min-h-11 font-serif text-3xl transition-colors sm:text-4xl ${
                gender === t.id ? 'text-ink' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {t.label}
              {gender === t.id && (
                <motion.span
                  layoutId="ramp-underline"
                  className="absolute inset-x-0 bottom-1 h-0.5 bg-ink"
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* the ramp: in the flow on mobile, fills the whole hero on desktop */}
      <div className="relative z-0 mt-2 h-[58svh] min-h-[380px] sm:h-[60svh] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto lg:min-h-0">
        <div className="absolute inset-x-6 bottom-0 h-px bg-ink/15 lg:inset-x-12 lg:bottom-5 lg:right-[320px]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={gender}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease, delay: wait(0.5) }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -400) next()
              else if (info.offset.x > 50 || info.velocity.x > 400) prev()
            }}
            style={{ touchAction: 'pan-y' }}
            className="absolute inset-0 lg:bottom-5 lg:right-[320px]"
          >
            {/* soft disc and ground shadow behind the focused model */}
            <div
              className={`absolute bottom-[3%] left-1/2 aspect-square -translate-x-1/2 rounded-full bg-sand/50 ${DISC_H}`}
            />
            <div className="absolute bottom-0 left-1/2 h-6 w-[min(60vw,380px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(20,17,15,0.28),transparent_70%)]" />

            {list.map((p, i) => {
              const offset = i - active
              const abs = Math.abs(offset)
              const visible = abs <= 2

              return (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${p.name}`}
                  aria-current={i === active}
                  tabIndex={visible ? 0 : -1}
                  initial={false}
                  animate={{
                    x: `${-50 + offset * SPACING}%`,
                    scale: SCALES[Math.min(abs, 3)],
                    opacity: visible ? 1 - abs * 0.3 : 0,
                  }}
                  transition={{ duration: 0.9, ease }}
                  style={{
                    zIndex: 10 - abs,
                    originY: 1,
                    pointerEvents: visible ? 'auto' : 'none',
                  }}
                  className={`absolute bottom-0 left-1/2 outline-none focus-visible:ring-2 focus-visible:ring-ink ${MODEL_H}`}
                >
                  <img
                    src={asset(p.image)}
                    alt={p.name}
                    draggable={false}
                    className="pointer-events-none h-full w-auto max-w-none select-none"
                  />
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* index + arrows */}
      <div className="relative z-10 mt-5 flex items-center justify-between px-6 lg:absolute lg:bottom-8 lg:right-12 lg:mt-0 lg:w-[290px] lg:px-0">
        <p className="font-serif text-2xl tabular-nums">
          {String(active + 1).padStart(2, '0')}
          <span className="text-ink/60"> / {String(count).padStart(2, '0')}</span>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous piece"
            className="flex size-11 items-center justify-center rounded-full ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-bone"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next piece"
            className="flex size-11 items-center justify-center rounded-full ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-bone"
          >
            <Arrow dir="right" />
          </button>
        </div>
      </div>

      {/* floating preview (no card, just type and a round crop) */}
      <div
        aria-live="polite"
        className="relative z-10 mt-6 px-6 lg:absolute lg:bottom-28 lg:right-12 lg:mt-0 lg:w-[290px] lg:px-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease, delay: wait(0.8) }}
            className="flex items-center gap-5 lg:flex-col lg:items-start"
          >
            <div className="size-24 shrink-0 overflow-hidden rounded-full bg-sand sm:size-28 lg:size-36">
              <img
                src={asset(current.image)}
                alt=""
                draggable={false}
                className="h-full w-full origin-[50%_38%] scale-[1.7] object-cover object-[50%_35%]"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/70">
                {fabricName} · {current.gender}
              </p>
              <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">{current.name}</h2>
              <p className="mt-2 max-w-xs text-sm text-ink/80">{current.line}</p>
              <div className="mt-3 flex items-center gap-6">
                <span className="font-serif text-2xl">${current.price}</span>
                <Link
                  to={`/shop/${current.slug}`}
                  className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
                >
                  View piece
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}