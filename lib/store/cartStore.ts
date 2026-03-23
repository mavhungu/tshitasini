import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.id === product.id)
        let updated: CartItem[]

        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, existing.stock)
          updated = items.map((i) =>
            i.id === product.id ? { ...i, quantity: newQty } : i
          )
        } else {
          updated = [...items, { ...product, quantity }]
        }

        set({
          items: updated,
          totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      },

      removeItem: (id) => {
        const updated = get().items.filter((i) => i.id !== id)
        set({
          items: updated,
          totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      },

      updateQuantity: (id, quantity) => {
        const updated = get().items.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
            : i
        )
        set({
          items: updated,
          totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    { name: 'tshitasini-cart' }
  )
)
