import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { asset } from '../lib/assets'

const ease = [0.22, 1, 0.36, 1]

const beliefs = [
  {
    n: '01',
    title: 'Cloth first',
    text: 'Every piece is designed around its fabric, never the other way round.',
  },
  {
    n: '02',
    title: 'Fewer, better',
    text: 'A short collection each season. Pieces you will wear on repeat, not once.',
  },
  {
    n: '03',
    title: 'Made to last',
    text: 'Dense weaves, careful seams and care instructions that actually help.',
  },
  {
    n: '04',
    title: 'Open about it',
    text: 'You can see, touch and order the exact cloth that goes into every garment.',
  },
]

const stats = [
  { to: 8, label: 'Fabrics in the library' },
  { to: 10, label: 'Pieces this season' },
  { to: 2, label: 'Collections' },
  { to: 30, label: 'Days to return' },
]

function CountUp({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease,
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{String(n).padStart(2, '0')}</span>
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.9, ease },
}

export default function About() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yBig = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const ySmall = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  const storyRef = useRef(null)
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  })
  const yStory = useTransform(storyProgress, [0, 1], ['6%', '-6%'])

  return (
    <main>
      {/* hero */}
      <section ref={heroRef} className="bg-bone px-6 pb-20 pt-32 sm:pt-40 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
          <div className="text-ink">
            <p className="text-xs uppercase tracking-[0.3em]">About ZARVA</p>
            <div className="overflow-hidden pb-2">
              <motion.h1
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.7 }}
                className="mt-3 font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.9]"
              >
                Cloth first.
                <br />
                Clothes second.
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 1 }}
              className="mt-8 max-w-lg text-lg"
            >
              ZARVA is a fashion and fabric house for men and women. We start with the cloth, because
              everything you wear is only as good as the thread it began with.
            </motion.p>
          </div>

          <div className="relative mx-auto h-[52svh] min-h-[340px] w-full max-w-md md:max-w-none">
            <motion.div
              style={{ y: yBig }}
              className="absolute right-0 top-0 aspect-square w-[74%] overflow-hidden rounded-full bg-sand"
            >
              <img
                src={asset('fabrics/linen')}
                alt="Raw linen"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              style={{ y: ySmall }}
              className="absolute bottom-0 left-0 aspect-square w-[46%] overflow-hidden rounded-full bg-sand"
            >
              <img
                src={asset('fabrics/silk')}
                alt="Silk satin"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* story */}
      <section ref={storyRef} className="bg-ink px-6 py-20 text-bone sm:py-32 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2 md:gap-20">
          <motion.div {...fadeUp} className="relative mx-auto aspect-[3/4] w-[min(100%,26rem)]">
            <motion.div style={{ y: yStory }} className="absolute inset-0 overflow-hidden rounded-t-full">
              <img
                src={asset('story/after')}
                alt="A tailored rust linen jacket"
                draggable={false}
                className="h-[112%] w-full object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div {...fadeUp}>
            <p className="text-xs uppercase tracking-[0.3em]">Our story</p>
            <h2 className="mt-3 font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.98]">
              A small house with a long thread.
            </h2>
            <div className="mt-8 max-w-lg space-y-5 text-base">
              <p>
                ZARVA began as a table of fabric swatches and one simple question: why do so many
                clothes feel less good than they look? The answer was almost always the cloth.
              </p>
              <p>
                So we reversed the order. We choose the fibre first, flax, wool, cotton and silk from
                small mills, then design the garment around what the cloth wants to do.
              </p>
              <p>
                Today we make a short collection each season for women and men, and we sell the same
                cloth by the metre, so you can make something of your own.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* numbers */}
      <section className="bg-sand px-6 py-20 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              className="border-l border-ink/40 pl-5 text-ink sm:pl-6"
            >
              <p className="font-serif text-[clamp(4rem,10vw,8rem)] leading-none tabular-nums">
                <CountUp to={s.to} />
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.18em]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* beliefs */}
      <section className="bg-bone px-6 pb-24 pt-20 text-ink sm:pb-32 sm:pt-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.3em]">What we believe</p>

          <ul className="mt-8 border-b border-ink/30">
            {beliefs.map((b) => (
              <motion.li
                key={b.n}
                {...fadeUp}
                className="grid gap-3 border-t border-ink/30 py-8 md:grid-cols-[120px_1fr_1fr] md:items-baseline md:gap-8"
              >
                <span className="text-sm tabular-nums tracking-[0.18em]">{b.n}</span>
                <h3 className="font-serif text-4xl sm:text-6xl">{b.title}</h3>
                <p className="max-w-sm text-base">{b.text}</p>
              </motion.li>
            ))}
          </ul>

          <motion.div {...fadeUp} className="mt-20 sm:mt-28">
            <h2 className="font-serif text-[clamp(2.75rem,8vw,7rem)] leading-[0.95]">
              Come and see the cloth.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
              <Link
                to="/shop"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-ink px-10 text-sm uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-80"
              >
                Shop the collection
              </Link>
              <Link
                to="/fabrics"
                className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
              >
                Visit the fabric library →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}