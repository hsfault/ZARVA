import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  // item: { key, name, sub, price, image, to, kind: 'piece' | 'fabric', qty? }
  const add = useCallback((item) => {
    setItems((prev) => {
      const found = prev.find((i) => i.key === item.key)
      const qty = item.qty || 1
      if (found) return prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { ...item, qty }]
    })
    setOpen(true)
  }, [])

  const setQty = useCallback((key, qty) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    )
  }, [])

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const value = useMemo(
    () => ({
      items,
      open,
      setOpen,
      add,
      setQty,
      remove,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    [items, open, add, setQty, remove],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)