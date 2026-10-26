import { useEffect, useRef, useState } from 'react'
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const HANDLE = 56

const topics = ['Order', 'Fabrics', 'Wholesale', 'Other']

const details = [
  { label: 'Email', value: 'hello@zarva.example', href: 'mailto:hello@zarva.example' },
  { label: 'Phone', value: '+92 300 000 0000', href: 'tel:+923000000000' },
  { label: 'Atelier', value: 'Weavers’ Lane, Lahore, Pakistan' },
  { label: 'Hours', value: 'Mon to Sat, 10 am – 7 pm' },
]

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Pieces ship in 2–4 days. Fabric by the metre is cut to order and ships in 3–5 days. Delivery is free over $150.',
  },
  {
    q: 'What is your returns policy?',
    a: 'Return any piece within 30 days, unworn and with its tags. Fabric cut to your length can only be returned if faulty.',
  },
  {
    q: 'Are the swatches really free?',
    a: 'Yes. A 10 × 10 cm swatch of any fabric in the library is free and arrives in 2–3 days.',
  },
  {
    q: 'Can I get a piece made from my own fabric?',
    a: 'For a small number of pieces each season, yes. Choose Other in the sentence above and tell us what you have in mind.',
  },
  {
    q: 'Do you offer wholesale?',
    a: 'We work with a few independent shops and makers. Choose Wholesale above and we will send our trade terms.',
  },
]

const sentence = 'font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1.35] text-ink'

// an underlined blank that sits inside the sentence
function Blank({ value, onChange, placeholder, label, type = 'text', autoComplete }) {
  const chars = Math.max(value.length, placeholder.length) + 1
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={label}
      autoComplete={autoComplete}
      style={{ width: `${chars}ch`, maxWidth: '100%' }}
      className="inline-block min-h-11 border-0 border-b-2 border-ink/40 bg-transparent px-1 align-baseline font-serif text-[1em] leading-none text-ink outline-none transition-colors placeholder:text-ink/55 focus:border-ink"
    />
  )
}

// drag the needle across the stitched line to send
function PullThread({ ready, onSend }) {
  const trackRef = useRef(null)
  const x = useMotionValue(0)
  const [max, setMax] = useState(0)
  const threadWidth = useTransform(x, (v) => v + HANDLE / 2)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setMax(Math.max(0, el.clientWidth - HANDLE))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div>
      <div ref={trackRef} className="relative h-14 w-full max-w-xl">
        {/* stitched guide */}
        <div className="absolute inset-x-7 top-1/2 border-t-2 border-dashed border-ink/30" />
        {/* the thread, drawn as you pull */}
        <motion.div
          style={{ width: threadWidth }}
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink"
        />
        {/* target */}
        <span className="absolute right-0 top-1/2 flex size-14 -translate-y-1/2 items-center justify-center rounded-full text-xs uppercase tracking-[0.18em] text-ink ring-2 ring-ink/40">
          Send
        </span>

        {/* needle */}
        <motion.button
          type="button"
          drag={ready ? 'x' : false}
          dragConstraints={{ left: 0, right: max }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x, touchAction: 'none' }}
          onDragEnd={() => {
            if (max > 0 && x.get() > max * 0.85) onSend()
            else animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
          }}
          onKeyDown={(e) => {
            if (ready && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onSend()
            }
          }}
          aria-label="Pull the thread to send your message, or press Enter"
          aria-disabled={!ready}
          className={`absolute left-0 top-1/2 z-10 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-bone transition-opacity ${
            ready ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </motion.button>
      </div>

      <p className="mt-4 text-sm uppercase tracking-[0.18em] text-ink">
        {ready ? 'Pull the thread to send →' : 'Finish the sentence, then pull the thread.'}
      </p>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'Order', message: '' })
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState(0)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const ready =
    form.name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(form.email.trim()) &&
    form.message.trim().length > 4

  const first = form.name.trim().split(' ')[0]

  const reset = () => {
    setForm({ name: '', email: '', topic: 'Order', message: '' })
    setSent(false)
  }

  return (
    <main>
      <section className="bg-bone px-6 pb-24 pt-32 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-ink">Contact</p>
          <h1 className="sr-only">Contact ZARVA</h1>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                role="status"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease }}
                className="mt-6 min-h-[40svh] text-ink"
              >
                <p className="font-serif text-[clamp(2.75rem,8vw,7rem)] leading-[1.02]">
                  Stitched. Thank you{first ? `, ${first}` : ''}.
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease, delay: 0.3 }}
                  style={{ originX: 0 }}
                  className="mt-8 border-t-2 border-dashed border-ink"
                />
                <p className="mt-6 max-w-md text-base">
                  Your message about {form.topic.toLowerCase()} is on its way. We usually reply within
                  one working day.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 inline-flex min-h-11 items-center border-b border-ink text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
                >
                  Write another
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease, delay: 0.7 }}
                className="mt-6"
              >
                <p className={sentence}>
                  Hello ZARVA, my name is{' '}
                  <Blank
                    value={form.name}
                    onChange={update('name')}
                    placeholder="your name"
                    label="Your name"
                    autoComplete="name"
                  />{' '}
                  and I’m writing about{' '}
                  <span role="group" aria-label="Topic">
                    {topics.map((t, i) => (
                      <span key={t}>
                        {i > 0 && <span className="text-ink/40"> / </span>}
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, topic: t }))}
                          aria-pressed={form.topic === t}
                          className={`min-h-11 border-b-2 px-1 transition-colors ${
                            form.topic === t
                              ? 'border-ink text-ink'
                              : 'border-transparent text-ink/50 hover:text-ink'
                          }`}
                        >
                          {t}
                        </button>
                      </span>
                    ))}
                  </span>
                  . You can reach me at{' '}
                  <Blank
                    value={form.email}
                    onChange={update('email')}
                    placeholder="your email"
                    label="Your email"
                    type="email"
                    autoComplete="email"
                  />
                  .
                </p>

                <p className={`${sentence} mt-6`}>Here’s what I have in mind:</p>
                <textarea
                  rows={2}
                  value={form.message}
                  aria-label="Your message"
                  placeholder="tell us a little more…"
                  onChange={(e) => {
                    update('message')(e)
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  className="mt-2 w-full resize-none overflow-hidden border-0 border-b-2 border-ink/40 bg-transparent py-2 font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-ink outline-none transition-colors placeholder:text-ink/55 focus:border-ink"
                />

                <div className="mt-12">
                  <PullThread ready={ready} onSend={() => setSent(true)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ul className="mt-20 grid gap-x-10 gap-y-6 border-t border-ink/30 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {details.map((d) => (
              <li key={d.label} className="text-ink">
                <p className="text-xs uppercase tracking-[0.2em]">{d.label}</p>
                <p className="mt-1 font-serif text-2xl leading-tight">
                  {d.href ? (
                    <a href={d.href} className="underline-offset-4 hover:underline">
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* faq */}
      <section className="bg-sand px-6 py-20 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-6xl text-ink">
          <p className="text-xs uppercase tracking-[0.3em]">Questions</p>
          <h2 className="mt-3 font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95]">Before you ask.</h2>

          <ul className="mt-10 max-w-4xl border-b border-ink/30">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <li key={f.q} className="border-t border-ink/30">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-serif text-2xl sm:text-4xl">{f.q}</span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-3xl transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-base">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </main>
  )
}