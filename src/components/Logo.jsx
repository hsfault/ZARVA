import { getLogo } from '../lib/logo'

// tone="ink" for light backgrounds, tone="bone" for dark and red ones
export default function Logo({ tone = 'ink', className = '' }) {
  const logo = getLogo()

  return (
    <svg
      role="img"
      aria-label="ZARVA"
      viewBox={logo.viewBox}
      className={`zarva-logo ${tone === 'bone' ? 'text-bone' : 'text-ink'} ${className}`}
      style={{ aspectRatio: logo.ratio }}
      dangerouslySetInnerHTML={{ __html: logo.inner }}
    />
  )
}