import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { products, fabrics } from '../data/products'
import { asset } from '../lib/assets'
import { useCart } from '../context/CartContext'

const ease = [0.22, 1, 0.36, 1]
const sizes = ['XS', 'S', 'M', 'L', 'XL']

const care = {
  linen: 'Machine wash cold. Line dry. Iron while damp.',
  twill: 'Machine wash at 30°. Tumble dry low.',
  merino: 'Hand wash or wool cycle. Dry flat.',
  silk: 'Dry clean or gentle hand wash. Do not wring.',
  denim: 'Wash inside out in cold water. Wash rarely.',
  velvet: 'Dry clean only. Steam to lift the pile.',
  knit: 'Hand wash cold. Dry flat, never hang.',
  tweed: 'Dry clean. Brush gently after wearing.',
}

export default function Product() {
  const { slug } = useParams()
  const [size, setSize] = useState('M')
  const { add } = useCart()

  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 pt-24 text-center">
        <h1 className="font-serif text-6xl text-ink sm:text-8xl">Piece not found</h1>
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] text-ink"
        >
          Back to shop →
        </Link>
      </main>
    )
  }

  const fabric = fabrics.find((f) => f.id === product.fabric)
  const label = product.gender === 'women' ? 'Women' : 'Men'
  const more = products.filter((p) => p.gender === product.gender && p.id !== product.id).slice(0, 3)

  const addToBag = () =>
    add({
      key: `${product.slug}-${size}`,
      name: product.name,
      sub: `Size ${size}`,
      price: product.price,
      image: product.image,
      to: `/shop/${product.slug}`,
      kind: 'piece',
    })

  return (
    <main className="bg-bone pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.18em] text-ink">
          <Link to="/shop" className="underline-offset-4 hover:underline">
            Shop
          </Link>{' '}
          /{' '}
          <Link to={`/shop?c=${product.gender}`} className="underline-offset-4 hover:underline">
            {label}
          </Link>{' '}
          / <span>{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* model on a soft disc */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.7 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="relative mx-auto aspect-[3/4] w-full max-w-lg">
              <div className="absolute bottom-[3%] left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full bg-sand" />
              <div className="absolute bottom-0 left-1/2 h-5 w-[55%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(20,17,15,0.28),transparent_70%)]" />
              <img
                src={asset(product.image)}
                alt={product.name}
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
              />
            </div>
          </motion.div>

          {/* details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.8 }}
            className="text-ink"
          >
            <p className="text-xs uppercase tracking-[0.3em]">
              {fabric?.name} · {label}
            </p>
            <h1 className="mt-3 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.95]">{product.name}</h1>
            <p className="mt-4 max-w-md text-base">{product.line}.</p>
            <p className="mt-6 font-serif text-5xl">${product.price}</p>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em]">Size</p>
              <div role="group" aria-label="Choose size" className="mt-3 flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`flex size-12 items-center justify-center rounded-full text-sm ring-1 transition-colors ${
                      size === s ? 'bg-ink text-bone ring-ink' : 'ring-ink/40 hover:bg-ink/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={addToBag}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-ink text-sm uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-80 sm:w-auto sm:px-16"
            >
              Add to bag
            </button>

            <dl className="mt-12 border-b border-ink/30">
              <div className="flex items-center gap-4 border-t border-ink/30 py-5">
                <div className="size-14 shrink-0 overflow-hidden rounded-full bg-sand">
                  <img
                    src={asset(fabric.image)}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em]">Fabric</dt>
                  <dd className="mt-1 text-base">
                    {fabric.name}, {fabric.weight}.{' '}
                    <Link to={`/fabrics?f=${fabric.id}`} className="underline underline-offset-4">
                      See the swatch
                    </Link>
                  </dd>
                </div>
              </div>

              <div className="border-t border-ink/30 py-5">
                <dt className="text-xs uppercase tracking-[0.2em]">Care</dt>
                <dd className="mt-1 text-base">{care[product.fabric]}</dd>
              </div>

              <div className="border-t border-ink/30 py-5">
                <dt className="text-xs uppercase tracking-[0.2em]">Delivery and returns</dt>
                <dd className="mt-1 text-base">
                  Free delivery over $150. Returns within 30 days, unworn and with tags.
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* more from the same collection */}
        <section aria-label={`More from ${label}`} className="mt-24 sm:mt-32">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-4xl text-ink sm:text-6xl">More from {label}</h2>
            <Link
              to={`/shop?c=${product.gender}`}
              className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] text-ink"
            >
              View all →
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-3 sm:gap-10">
            {more.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                className={i === 1 ? 'mt-8 sm:mt-14' : ''}
              >
                <Link
                  to={`/shop/${p.slug}`}
                  className="group block outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <div className="relative aspect-[3/4] w-full">
                    <div className="absolute bottom-[4%] left-1/2 aspect-square w-[90%] -translate-x-1/2 rounded-full bg-sand transition-transform duration-700 group-hover:scale-105" />
                    <img
                      src={asset(p.image)}
                      alt={p.name}
                      draggable={false}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full select-none object-contain object-bottom transition-transform duration-700 group-hover:-translate-y-2"
                    />
                  </div>
                  <p className="mt-3 font-serif text-lg leading-tight text-ink sm:text-3xl">{p.name}</p>
                  <p className="font-serif text-base text-ink sm:text-xl">${p.price}</p>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}