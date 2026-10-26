import { Link } from 'react-router-dom'
import Logo from './Logo'

const shop = [
  { to: '/shop?c=women', label: 'Women' },
  { to: '/shop?c=men', label: 'Men' },
  { to: '/fabrics', label: 'Fabrics by the metre' },
]
const house = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const linkClass =
  'inline-flex min-h-11 items-center text-bone underline-offset-4 hover:underline'

export default function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-14 md:flex-row md:justify-between">
          <div className="max-w-md">
            <Logo tone="bone" className="h-8 w-auto" />
            <p className="mt-6 font-serif text-3xl leading-snug sm:text-4xl">
              Woven for the way you move.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex max-w-sm items-center border-b border-bone"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email address"
                className="min-h-11 w-full bg-transparent text-base text-bone outline-none placeholder:text-bone/70"
              />
              <button
                type="submit"
                className="min-h-11 shrink-0 px-2 text-sm uppercase tracking-widest text-bone underline-offset-4 hover:underline"
              >
                Join
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            <div>
              <h3 className="mb-3 text-sm uppercase tracking-[0.18em] text-bone/70">Shop</h3>
              <ul>
                {shop.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm uppercase tracking-[0.18em] text-bone/70">House</h3>
              <ul>
                {house.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm uppercase tracking-[0.18em] text-bone/70">Follow</h3>
              <ul>
                <li>
                  <a href="#" className={linkClass}>Instagram</a>
                </li>
                <li>
                  <a href="#" className={linkClass}>Pinterest</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-16 text-sm text-bone/70">© 2026 ZARVA. A concept website.</p>
      </div>
    </footer>
  )
}