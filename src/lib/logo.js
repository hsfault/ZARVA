import raw from '../assets/logo/zarva-logo.svg?raw'

let cache = null

const isLight = (rgb) => {
  const m = rgb.match(/\d+(\.\d+)?/g)
  if (!m || m.length < 3) return false
  const [r, g, b] = m.map(Number)
  return (r + g + b) / 3 > 200
}

export function getLogo() {
  if (cache) return cache

  const holder = document.createElement('div')
  holder.style.cssText =
    'position:absolute;left:-10000px;top:0;width:1000px;visibility:hidden;pointer-events:none;'
  holder.innerHTML = raw
  document.body.appendChild(holder)

  const svg = holder.querySelector('svg')

  if (!svg.getAttribute('viewBox')) {
    const w = parseFloat(svg.getAttribute('width')) || 1000
    const h = parseFloat(svg.getAttribute('height')) || 1000
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  }
  svg.removeAttribute('height')
  svg.setAttribute('width', '1000')
  svg.style.display = 'block'

  // remove any big light background shape
  const box = svg.getBoundingClientRect()
  holder.querySelectorAll('path, rect, polygon, circle, ellipse').forEach((el) => {
    if (el.closest('defs, clipPath, mask')) return
    const r = el.getBoundingClientRect()
    const covers = r.width >= box.width * 0.9 && r.height >= box.height * 0.9
    if (covers && isLight(getComputedStyle(el).fill)) el.remove()
  })

  // crop tightly to the letters
  const vb = svg.viewBox.baseVal
  let x = vb.x
  let y = vb.y
  let w = vb.width
  let h = vb.height

  let bb = null
  try {
    bb = svg.getBBox()
  } catch {
    bb = null
  }
  if (bb && bb.width > 0 && bb.height > 0) {
    const pad = Math.max(bb.width, bb.height) * 0.015
    x = bb.x - pad
    y = bb.y - pad
    w = bb.width + pad * 2
    h = bb.height + pad * 2
  }

  cache = { viewBox: `${x} ${y} ${w} ${h}`, ratio: w / h, inner: svg.innerHTML }
  holder.remove()
  return cache
}