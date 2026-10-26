import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import LogoDraw from './LogoDraw'
import { getLenis } from '../lib/smoothScroll'
import { session } from '../lib/session'

const ease = [0.76, 0, 0.24, 1]
const COUNT = 7
const strips = Array.from({ length: COUNT }, (_, i) => i)
const mid = (COUNT - 1) / 2

const labels = {
  '/': 'Home',
  '/shop': 'Shop',
  '/fabrics': 'Fabrics',
  '/about': 'About',
  '/contact': 'Contact',
}
const labelFor = (path) => (path.startsWith('/shop/') ? 'Shop' : labels[path] || '')

export default function PageTransition({ children }) {
  const { pathname } = useLocation()
  const [isFirst] = useState(() => !session.loaded)

  useEffect(() => {
    session.loaded = true
    window.scrollTo(0, 0)
    getLenis()?.scrollTo(0, { immediate: true })
  }, [])

  // on the very first load the curtain waits for the logo to finish drawing
  const liftDelay = isFirst ? 2.6 : 0.4

  return (
    <>
      {children}

      {/* the runway curtain: seven panels with stitched seams */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] flex">
        {strips.map((i) => {
          const d = Math.abs(i - mid) // 0 at the centre, 3 at the edges
          return (
            <motion.div
              key={i}
              className={`h-full flex-1 bg-ink ${
                i > 0 ? 'border-l-2 border-dashed border-bone/50' : ''
              }`}
              style={{ originY: 0 }}
              initial={{ scaleY: 1 }}
              animate={{
                scaleY: 0,
                transition: { duration: 0.75, ease, delay: liftDelay + d * 0.06 },
              }}
              exit={{
                scaleY: 1,
                transition: { duration: 0.55, ease, delay: (mid - d) * 0.06 },
              }}
            />
          )
        })}
      </div>

      {/* name of the page you are going to, only shown while the curtain is closed */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[81] flex flex-col items-center justify-center px-6 text-center text-bone"
        initial={{ opacity: isFirst ? 0 : 1 }}
        animate={{ opacity: 0, transition: { duration: 0.25, delay: 0.1 } }}
        exit={{ opacity: 1, transition: { duration: 0.3, delay: 0.7 } }}
      >
        <span className="mb-4 text-xs uppercase tracking-[0.3em]">ZARVA</span>
        <span className="font-serif text-6xl leading-none sm:text-8xl">{labelFor(pathname)}</span>
      </motion.div>

      {/* splash: the logo draws itself (first load only) */}
      {isFirst && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[82] flex flex-col items-center justify-center px-6 text-bone"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { duration: 0.35, delay: 2.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <LogoDraw className="w-[min(78vw,620px)]" />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 1.2 } }}
            className="mt-8 text-xs uppercase tracking-[0.3em] text-bone"
          >
            Woven for the way you move
          </motion.p>
        </motion.div>
      )}
    </>
  )
}