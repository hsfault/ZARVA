import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const text =
  'Every garment begins as a single thread. We source it carefully, weave it slowly and cut it with intent, so what you wear feels as good as it looks. For women, for men, and for every moment in between.'
const words = text.split(' ')

// each word goes from muted grey to bone as you scroll, always readable on the dark background
function Word({ children, progress, range }) {
  const color = useTransform(progress, range, ['#8A8278', '#F3EFE8'])
  return (
    <motion.span style={{ color }} className="inline-block pr-[0.25em]">
      {children}
    </motion.span>
  )
}

export default function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section ref={ref} className="relative h-[230svh] bg-ink">
      <div className="sticky top-0 flex h-svh items-center px-6 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-bone">Our belief</p>
          <p className="font-serif text-[clamp(2rem,5.4vw,4.75rem)] leading-[1.08]">
            {words.map((w, i) => {
              const start = 0.08 + (i / words.length) * 0.7
              return (
                <Word key={i} progress={scrollYProgress} range={[start, start + 0.1]}>
                  {w}
                </Word>
              )
            })}
          </p>
        </div>
      </div>
    </section>
  )
}