import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { asset } from '../lib/assets'

const clamp = (v) => Math.min(100, Math.max(0, v))

export default function RawToReady() {
  const boxRef = useRef(null)
  const intro = useRef(null)
  const inView = useInView(boxRef, { once: true, amount: 0.4 })

  const pos = useMotionValue(100) // % of the width that shows the "raw" image
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useTransform(pos, (v) => `${v}%`)

  useEffect(() => {
    if (!inView) return
    intro.current = animate(pos, 50, { duration: 1.4, ease: [0.22, 1, 0.36, 1] })
  }, [inView, pos])

  const setFromEvent = (e) => {
    const r = boxRef.current.getBoundingClientRect()
    pos.set(clamp(((e.clientX - r.left) / r.width) * 100))
  }

  return (
    <section className="bg-ink py-20 text-bone sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 lg:px-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]">From cloth to garment</p>
          <h2 className="mt-3 font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.92]">Raw to ready.</h2>
          <p className="mt-5 max-w-sm text-base">
            Every ZARVA piece starts as a bolt of cloth. Drag the line to watch rust linen become a
            jacket.
          </p>
          <Link
            to="/fabrics"
            className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-bone text-sm uppercase tracking-[0.18em]"
          >
            Browse the library <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div
          ref={boxRef}
          tabIndex={0}
          aria-label="Before and after slider. Use the left and right arrow keys to move it."
          onPointerDown={(e) => {
            intro.current?.stop()
            e.currentTarget.setPointerCapture(e.pointerId)
            setFromEvent(e)
          }}
          onPointerMove={(e) => {
            if (e.buttons) setFromEvent(e)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') pos.set(clamp(pos.get() - 5))
            if (e.key === 'ArrowRight') pos.set(clamp(pos.get() + 5))
          }}
          style={{ touchAction: 'pan-y' }}
          className="relative mx-auto aspect-[3/4] w-[min(100%,26rem)] max-h-[78svh] select-none overflow-hidden rounded-t-full outline-none focus-visible:ring-2 focus-visible:ring-bone"
        >
          {/* ready (base) */}
          <img
            src={asset('story/after')}
            alt="A tailored rust linen jacket"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* raw (on top, clipped from the right) */}
          <motion.img
            src={asset('story/before')}
            alt="A rolled bolt of rust linen fabric"
            draggable={false}
            style={{ clipPath: clip }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* labels on solid pills so they are always readable */}
          <span className="absolute bottom-5 left-5 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-bone">
            Raw
          </span>
          <span className="absolute bottom-5 right-5 rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-bone">
            Ready
          </span>

          {/* handle */}
          <motion.div
            style={{ left }}
            className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-bone"
          >
            <div className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-ink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}