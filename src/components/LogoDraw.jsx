import { useEffect, useRef } from 'react'
import { getLogo } from '../lib/logo'

// Draws the logo outline stroke by stroke, then fills it in
export default function LogoDraw({ className = '', delay = 0.2, duration = 1.3 }) {
  const ref = useRef(null)
  const logo = getLogo()

  useEffect(() => {
    const svg = ref.current
    if (!svg) return

    const shapes = svg.querySelectorAll('path, polygon, rect, circle, ellipse')
    const vb = svg.viewBox.baseVal
    const scale = svg.getBoundingClientRect().width / vb.width || 1
    const strokeWidth = 1.5 / scale // about 1.5px on screen
    const stagger = shapes.length > 1 ? Math.min(60, 400 / shapes.length) : 0
    const anims = []

    shapes.forEach((el, i) => {
      el.setAttribute('pathLength', '1')
      el.style.stroke = 'currentColor'
      el.style.strokeWidth = String(strokeWidth)
      el.style.strokeDasharray = '1px'
      el.style.strokeDashoffset = '1px'
      el.style.fillOpacity = '0'

      const start = delay * 1000 + i * stagger
      const fillStart = start + duration * 1000 * 0.6

      anims.push(
        el.animate([{ strokeDashoffset: '1px' }, { strokeDashoffset: '0px' }], {
          duration: duration * 1000,
          delay: start,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          fill: 'forwards',
        }),
        el.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], {
          duration: 500,
          delay: fillStart,
          easing: 'ease-out',
          fill: 'forwards',
        }),
        el.animate([{ strokeOpacity: 1 }, { strokeOpacity: 0 }], {
          duration: 500,
          delay: fillStart,
          easing: 'ease-out',
          fill: 'forwards',
        }),
      )
    })

    return () => anims.forEach((a) => a.cancel())
  }, [delay, duration])

  return (
    <svg
      ref={ref}
      role="img"
      aria-label="ZARVA"
      viewBox={logo.viewBox}
      className={`zarva-logo ${className}`}
      style={{ aspectRatio: logo.ratio }}
      dangerouslySetInnerHTML={{ __html: logo.inner }}
    />
  )
}