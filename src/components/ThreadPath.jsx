import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { steps } from '../data/products'

const ease = [0.22, 1, 0.36, 1]
const Y = [0.12, 0.37, 0.62, 0.87] // where each step sits, as a fraction of the section height

// builds one smooth S-curve thread, in real pixels so nothing stretches
function buildPath(w, h) {
  if (!w || !h) return { d: '', pts: [] }
  const narrow = w < 640
  const xl = w * (narrow ? 0.12 : 0.2)
  const xr = w * (narrow ? 0.88 : 0.8)
  const pts = Y.map((y, i) => ({ x: i % 2 === 0 ? xl : xr, y: h * y }))

  let d = `M ${w / 2} 0 C ${w / 2} ${pts[0].y * 0.5}, ${pts[0].x} ${pts[0].y * 0.5}, ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const m = (a.y + b.y) / 2
    d += ` C ${a.x} ${m}, ${b.x} ${m}, ${b.x} ${b.y}`
  }
  const last = pts[pts.length - 1]
  const m = (last.y + h) / 2
  d += ` C ${last.x} ${m}, ${w / 2} ${m}, ${w / 2} ${h}`

  return { d, pts }
}

export default function ThreadPath() {
  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const dotRef = useRef(null)
  const lenRef = useRef(0)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { d, pts } = useMemo(() => buildPath(size.w, size.h), [size])

  useEffect(() => {
    if (pathRef.current && d) lenRef.current = pathRef.current.getTotalLength()
  }, [d])

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 70%', 'end 55%'],
  })

  // the needle dot rides the tip of the thread
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const p = pathRef.current
    const dot = dotRef.current
    if (!p || !dot || !lenRef.current) return
    const pt = p.getPointAtLength(lenRef.current * Math.min(1, Math.max(0, v)))
    dot.setAttribute('cx', pt.x)
    dot.setAttribute('cy', pt.y)
  })

  return (
    <section className="bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 pb-12 lg:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink">The thread path</p>
        <h2 className="mt-3 font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-ink">
          From fibre to wardrobe.
        </h2>
      </div>

      <div ref={wrapRef} className="relative mx-auto h-[300svh] max-w-6xl text-ink">
        <svg
          aria-hidden="true"
          width={size.w}
          height={size.h}
          fill="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {d && (
            <>
              {/* dotted guide */}
              <path
                d={d}
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                strokeDasharray="2 9"
                strokeLinecap="round"
              />
              {/* the thread, drawn as you scroll */}
              <motion.path
                ref={pathRef}
                d={d}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
              />
            </>
          )}

          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="9" fill="#F3EFE8" stroke="currentColor" strokeWidth="2" />
          ))}

          <circle ref={dotRef} cx={size.w / 2} cy={0} r="6" fill="currentColor" />
        </svg>

        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease }}
            style={{ top: `${Y[i] * 100}%` }}
            className={`absolute -translate-y-1/2 ${
              i % 2 === 0
                ? 'left-[26%] right-6 sm:left-[30%] sm:right-12'
                : 'left-6 right-[26%] text-right sm:left-12 sm:right-[30%]'
            }`}
          >
            <p className="font-serif text-6xl leading-none sm:text-8xl">{s.n}</p>
            <h3 className="mt-2 font-serif text-4xl sm:text-5xl">{s.title}</h3>
            <p className={`mt-3 max-w-sm text-base ${i % 2 === 1 ? 'ml-auto' : ''}`}>{s.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center px-6 pt-4">
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-8 text-sm uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-80"
        >
          Shop the collection
        </Link>
      </div>
    </section>
  )
}