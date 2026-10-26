import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-bone px-6 pb-16 pt-28 text-center text-ink">
      <p className="text-xs uppercase tracking-[0.3em]">Error 404</p>

      <div className="overflow-hidden pb-2">
        <motion.h1
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease, delay: 0.7 }}
          className="mt-3 font-serif text-[clamp(3.5rem,13vw,10rem)] leading-[0.92]"
        >
          Dropped a stitch.
        </motion.h1>
      </div>

      {/* a loose thread that draws itself */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 120"
        fill="none"
        className="mt-6 h-24 w-[min(80vw,420px)]"
      >
        <motion.path
          d="M10 70 C 60 10, 110 120, 160 65 S 250 10, 285 60 c 8 16, -8 34, -26 32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut', delay: 1 }}
        />
      </svg>

      <p className="mt-6 max-w-md text-base">
        We could not find that page. It may have moved, or the link might have a typo.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <Link
          to="/"
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-ink px-10 text-sm uppercase tracking-[0.18em] text-bone transition-opacity hover:opacity-80"
        >
          Back home
        </Link>
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
        >
          Visit the shop →
        </Link>
      </div>
    </main>
  )
}