import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { products, fabrics } from '../data/products'
import { asset } from '../lib/assets'

const ease = [0.22, 1, 0.36, 1]

const pieces = (gender) =>
  products
    .filter((p) => p.gender === gender)
    .slice(0, 3)
    .map((p) => ({ label: p.name, price: `$${p.price}`, to: `/shop/${p.slug}` }))

const panels = [
  {
    id: 'women',
    no: '01',
    title: 'Women',
    text: 'Easy tailoring, flowing dresses and layers that move with you.',
    cta: 'Explore Women',
    to: '/shop?c=women',
    bg: 'bg-sand',
    arch: 'bg-bone',
    image: 'models/w3',
    kind: 'model',
    flip: false,
    items: pieces('women'),
  },
  {
    id: 'men',
    no: '02',
    title: 'Men',
    text: 'Considered shapes in wool, linen and denim, made to be worn on repeat.',
    cta: 'Explore Men',
    to: '/shop?c=men',
    bg: 'bg-sage',
    arch: 'bg-sand',
    image: 'models/m2',
    kind: 'model',
    flip: true,
    items: pieces('men'),
  },
  {
    id: 'fabrics',
    no: '03',
    title: 'Fabrics',
    text: 'The cloth itself, cut by the metre. Touch it first, then make it yours.',
    cta: 'Browse the library',
    to: '/fabrics',
    bg: 'bg-bone',
    arch: 'bg-sand',
    image: 'fabrics/linen',
    kind: 'fabric',
    flip: false,
    items: fabrics.slice(0, 3).map((f) => ({ label: f.name, price: `$${f.price}/m`, to: '/fabrics' })),
  },
]

function Panel({ panel, index, total, progress }) {
  // while the next panel slides over this one, this one shrinks a little
  const scale = useTransform(progress, [index / (total - 1), (index + 1) / (total - 1)], [1, 0.93])

  return (
    <div
      className={`sticky top-0 h-svh overflow-hidden ${panel.bg} ${
        index > 0 ? 'rounded-t-[2rem] sm:rounded-t-[3rem]' : ''
      }`}
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, transformOrigin: '50% 100%' }}
        className="mx-auto grid h-full w-full max-w-7xl content-center gap-6 px-6 pb-8 pt-24 md:grid-cols-2 md:items-center md:gap-16 lg:px-12"
      >
        {/* text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
          className={panel.flip ? 'md:order-2' : ''}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-ink">{panel.no} — Collection</p>
          <h2 className="mt-3 font-serif text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] text-ink">
            {panel.title}
          </h2>
          <p className="mt-4 max-w-sm text-base text-ink">{panel.text}</p>

          <ul className="mt-6 hidden max-w-sm md:block">
            {panel.items.map((it) => (
              <li key={it.label} className="border-t border-ink/30">
                <Link
                  to={it.to}
                  className="flex min-h-11 items-center justify-between gap-6 font-serif text-xl text-ink underline-offset-4 hover:underline"
                >
                  <span>{it.label}</span>
                  <span className="font-sans text-sm">{it.price}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to={panel.to}
            className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-ink text-sm uppercase tracking-[0.18em] text-ink"
          >
            {panel.cta} <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        {/* arch image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className={`relative mx-auto aspect-[3/4] h-[34svh] md:h-[66svh] ${
            panel.flip ? 'md:order-1' : ''
          }`}
        >
          {panel.kind === 'model' ? (
            <>
              <div className={`absolute inset-0 rounded-t-full ${panel.arch}`} />
              <img
                src={asset(panel.image)}
                alt={`${panel.title} collection`}
                draggable={false}
                className="absolute bottom-0 left-1/2 h-[106%] w-auto max-w-none -translate-x-1/2 select-none"
              />
            </>
          ) : (
            <div className={`absolute inset-0 overflow-hidden rounded-t-full ${panel.arch}`}>
              <img
                src={asset(panel.image)}
                alt="Raw linen fabric"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Collections() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section ref={ref} aria-label="Collections" className="relative">
      {panels.map((p, i) => (
        <Panel key={p.id} panel={p} index={i} total={panels.length} progress={scrollYProgress} />
      ))}
    </section>
  )
}