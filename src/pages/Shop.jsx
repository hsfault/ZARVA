import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { products, fabrics } from '../data/products'
import { asset } from '../lib/assets'

const ease = [0.22, 1, 0.36, 1]

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
]

const discs = ['bg-sand', 'bg-sage/35', 'bg-sand/70']

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const c = params.get('c')
  const filter = tabs.some((t) => t.id === c) ? c : 'all'

  const list = filter === 'all' ? products : products.filter((p) => p.gender === filter)

  const pick = (id) => setParams(id === 'all' ? {} : { c: id })

  return (
    <main className="bg-bone pb-24 pt-32 sm:pt-40">
      <header className="mx-auto max-w-7xl px-6 lg:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink">Autumn · Winter ’26</p>
        <h1 className="mt-2 font-serif text-[clamp(4.5rem,15vw,12rem)] leading-[0.88] text-ink">Shop</h1>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <div role="group" aria-label="Filter pieces" className="flex items-center gap-8">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pick(t.id)}
                aria-pressed={filter === t.id}
                className={`relative min-h-11 font-serif text-3xl transition-colors ${
                  filter === t.id ? 'text-ink' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {t.label}
                {filter === t.id && (
                  <motion.span
                    layoutId="shop-underline"
                    className="absolute inset-x-0 bottom-1 h-0.5 bg-ink"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <p className="text-sm uppercase tracking-[0.18em] text-ink">{list.length} pieces</p>
            <Link
              to="/fabrics"
              className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-60"
            >
              Fabrics by the metre →
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.ul
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-x-10 gap-y-16 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-12"
        >
          {list.map((p, i) => {
            const fabricName = fabrics.find((f) => f.id === p.fabric)?.name
            return (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
                className="sm:max-lg:[&:nth-child(2n)]:mt-16 lg:[&:nth-child(3n+2)]:mt-20 lg:[&:nth-child(3n)]:mt-8"
              >
                <Link
                  to={`/shop/${p.slug}`}
                  className="group block outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
                    <div
                      className={`absolute bottom-[4%] left-1/2 aspect-square w-[88%] -translate-x-1/2 rounded-full transition-transform duration-700 group-hover:scale-105 ${
                        discs[i % discs.length]
                      }`}
                    />
                    <img
                      src={asset(p.image)}
                      alt={p.name}
                      draggable={false}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full select-none object-contain object-bottom transition-transform duration-700 group-hover:-translate-y-2"
                    />
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h2 className="font-serif text-3xl text-ink sm:text-4xl">{p.name}</h2>
                    <span className="font-serif text-2xl text-ink">${p.price}</span>
                  </div>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-ink/70">
                    {fabricName} · {p.gender}
                  </p>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </AnimatePresence>
    </main>
  )
}