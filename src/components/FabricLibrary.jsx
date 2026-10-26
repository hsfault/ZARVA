import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { fabrics, products } from '../data/products'
import { asset } from '../lib/assets'
import { useCart } from '../context/CartContext'

const ease = [0.22, 1, 0.36, 1]
const sizes = [220, 280, 240, 300, 230, 270, 250, 290]
const drops = [0, 48, 12, 64, 0, 36, 18, 56]

export default function FabricLibrary() {
  const [selected, setSelected] = useState(fabrics[0].id)
  const [limit, setLimit] = useState(0)
  const boxRef = useRef(null)
  const trackRef = useRef(null)
  const dragging = useRef(false)
  const { add } = useCart()

  useEffect(() => {
    const measure = () => {
      if (!boxRef.current || !trackRef.current) return
      setLimit(Math.max(0, trackRef.current.scrollWidth - boxRef.current.clientWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const fabric = fabrics.find((f) => f.id === selected)
  const usedIn = products.filter((p) => p.fabric === selected)

  const requestSwatch = () =>
    add({
      key: `swatch-${fabric.id}`,
      name: `${fabric.name} swatch`,
      sub: 'Free swatch · 10 × 10 cm',
      price: 0,
      image: fabric.image,
      to: `/fabrics?f=${fabric.id}`,
      kind: 'fabric',
      qty: 1,
    })

  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink">The Fabric Library</p>
        <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-ink">
          Touch the cloth before it becomes anything.
        </h2>
        <p className="mt-5 text-sm uppercase tracking-[0.18em] text-ink">
          Drag to explore → · {String(fabrics.length).padStart(2, '0')} fabrics
        </p>
      </div>

      <div ref={boxRef} className="mt-12 overflow-hidden">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => {
            dragging.current = true
          }}
          onDragEnd={() => {
            setTimeout(() => {
              dragging.current = false
            }, 60)
          }}
          style={{ touchAction: 'pan-y' }}
          className="flex w-max items-start gap-8 px-6 pb-6 sm:gap-14 lg:px-12"
        >
          {fabrics.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                if (!dragging.current) setSelected(f.id)
              }}
              aria-pressed={selected === f.id}
              style={{ marginTop: drops[i] }}
              className="group shrink-0 outline-none"
            >
              <motion.div
                animate={{ scale: selected === f.id ? 1 : 0.92 }}
                transition={{ duration: 0.5, ease }}
                style={{ width: sizes[i], height: sizes[i] }}
                className={`overflow-hidden rounded-full ring-ink group-focus-visible:ring-2 ${
                  selected === f.id ? 'ring-2' : 'ring-0'
                }`}
              >
                <img
                  src={asset(f.image)}
                  alt={f.name}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full select-none object-cover"
                />
              </motion.div>
              <p className="mt-4 text-center font-serif text-2xl text-ink">{f.name}</p>
            </button>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-6 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={fabric.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
            className="grid gap-6 border-t border-ink/30 pt-8 md:grid-cols-[1.2fr_1fr] md:items-end"
          >
            <div>
              <h3 className="font-serif text-5xl text-ink sm:text-6xl">{fabric.name}</h3>
              <p className="mt-3 max-w-md text-base text-ink">{fabric.feel}.</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-ink">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">Weight</p>
                <p className="font-serif text-2xl">{fabric.weight}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">Per metre</p>
                <p className="font-serif text-2xl">${fabric.price}</p>
              </div>
              <button
                type="button"
                onClick={requestSwatch}
                className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
              >
                Request a swatch
              </button>
            </div>

            {usedIn.length > 0 && (
              <p className="text-sm text-ink md:col-span-2">
                Used in:{' '}
                {usedIn.map((p, i) => (
                  <span key={p.id}>
                    <Link to={`/shop/${p.slug}`} className="underline underline-offset-4">
                      {p.name}
                    </Link>
                    {i < usedIn.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}