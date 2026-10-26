import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { fabrics, products } from '../data/products'
import { asset } from '../lib/assets'
import { useCart } from '../context/CartContext'

const ease = [0.22, 1, 0.36, 1]

export default function Fabrics() {
  const [params] = useSearchParams()
  const [selected, setSelected] = useState(
    () => fabrics.find((f) => f.id === params.get('f'))?.id || fabrics[0].id,
  )
  const [metres, setMetres] = useState(2)
  const { add } = useCart()

  const index = fabrics.findIndex((f) => f.id === selected)
  const fabric = fabrics[index]

  const choose = (id) => {
    if (id === selected) return
    setSelected(id)
    setMetres(2)
  }

  const addMetres = (f) =>
    add({
      key: `fabric-${f.id}`,
      name: f.name,
      sub: `Fabric · $${f.price} per metre`,
      price: f.price,
      image: f.image,
      to: `/fabrics?f=${f.id}`,
      kind: 'fabric',
      unit: 'm',
      qty: metres,
    })

  const addSwatch = (f) =>
    add({
      key: `swatch-${f.id}`,
      name: `${f.name} swatch`,
      sub: 'Free swatch · 10 × 10 cm',
      price: 0,
      image: f.image,
      to: `/fabrics?f=${f.id}`,
      kind: 'fabric',
      qty: 1,
    })

  return (
    <main className="bg-bone pb-24 pt-32 sm:pt-40">
      <header className="mx-auto max-w-7xl px-6 lg:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink">The Fabric Library</p>
        <h1 className="mt-2 font-serif text-[clamp(4rem,13vw,11rem)] leading-[0.88] text-ink">Fabrics</h1>
        <p className="mt-6 max-w-lg text-base text-ink">
          Cut to order, by the metre. Choose a cloth, pick your length, or ask for a free swatch first.
        </p>
      </header>

      <div className="mx-auto mt-16 grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
        {/* pinned preview (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative mx-auto aspect-square w-[min(100%,68svh)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fabric.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.5, ease }}
                  className="absolute inset-0 overflow-hidden rounded-full bg-sand"
                >
                  <img
                    src={asset(fabric.image)}
                    alt={fabric.name}
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-6 text-center text-sm uppercase tracking-[0.18em] text-ink">
              {String(index + 1).padStart(2, '0')} / {String(fabrics.length).padStart(2, '0')} ·{' '}
              {fabric.weight}
            </p>
          </div>
        </div>

        {/* list */}
        <div>
          <ul className="border-b border-ink/30">
            {fabrics.map((f, i) => {
              const isOpen = selected === f.id
              const usedIn = products.filter((p) => p.fabric === f.id)

              return (
                <li key={f.id} className="border-t border-ink/30">
                  <button
                    type="button"
                    onClick={() => choose(f.id)}
                    aria-expanded={isOpen}
                    aria-controls={`fabric-panel-${f.id}`}
                    className="flex min-h-11 w-full items-baseline gap-4 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    <span className="w-8 shrink-0 text-xs tabular-nums tracking-[0.18em] text-ink/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-serif text-4xl transition-colors sm:text-6xl ${
                        isOpen ? 'text-ink' : 'text-ink/60'
                      }`}
                    >
                      {f.name}
                    </span>
                    <span className="ml-auto shrink-0 font-serif text-2xl text-ink">
                      ${f.price}
                      <span className="font-sans text-sm">/m</span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`fabric-panel-${f.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pl-12 pr-2 text-ink">
                          {/* mobile swatch */}
                          <div className="mb-5 size-52 overflow-hidden rounded-full bg-sand lg:hidden">
                            <img
                              src={asset(f.image)}
                              alt={f.name}
                              draggable={false}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <p className="max-w-md text-base">{f.feel}.</p>

                          <dl className="mt-4 flex gap-10">
                            <div>
                              <dt className="text-xs uppercase tracking-[0.2em]">Weight</dt>
                              <dd className="font-serif text-2xl">{f.weight}</dd>
                            </div>
                            <div>
                              <dt className="text-xs uppercase tracking-[0.2em]">Per metre</dt>
                              <dd className="font-serif text-2xl">${f.price}</dd>
                            </div>
                          </dl>

                          {usedIn.length > 0 && (
                            <p className="mt-4 text-sm">
                              Made into:{' '}
                              {usedIn.map((p, k) => (
                                <span key={p.id}>
                                  <Link to={`/shop/${p.slug}`} className="underline underline-offset-4">
                                    {p.name}
                                  </Link>
                                  {k < usedIn.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </p>
                          )}

                          <div className="mt-6">
                            <p className="text-xs uppercase tracking-[0.2em]">Length</p>
                            <div className="mt-2 flex flex-wrap items-center gap-4">
                              <button
                                type="button"
                                onClick={() => setMetres((m) => Math.max(1, m - 1))}
                                aria-label="Fewer metres"
                                className="flex size-11 items-center justify-center rounded-full ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-bone"
                              >
                                –
                              </button>
                              <span className="min-w-16 text-center font-serif text-3xl tabular-nums">
                                {metres} m
                              </span>
                              <button
                                type="button"
                                onClick={() => setMetres((m) => Math.min(50, m + 1))}
                                aria-label="More metres"
                                className="flex size-11 items-center justify-center rounded-full ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-bone"
                              >
                                +
                              </button>
                              <span className="font-serif text-3xl">${metres * f.price}</span>
                            </div>
                          </div>

                          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                            <button
                              type="button"
                              onClick={() => addMetres(f)}
                              className="inline-flex min-h-14 items-center justify-center rounded-full bg-ink px-10 text-sm uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-80"
                            >
                              Add {metres} m to bag
                            </button>
                            <button
                              type="button"
                              onClick={() => addSwatch(f)}
                              className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
                            >
                              Free swatch
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>

          <p className="mt-6 text-sm text-ink">
            Fabric is cut to order and ships in 3–5 days. Swatches are free and arrive in 2–3.
          </p>
        </div>
      </div>
    </main>
  )
}