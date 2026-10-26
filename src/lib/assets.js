const files = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const map = {}
for (const path in files) {
  const key = path.replace('../assets/', '').replace(/\.[^.]+$/, '')
  map[key] = files[path]
}

// asset('models/w1') -> image url
export const asset = (key) => map[key] || ''