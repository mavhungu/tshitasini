'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cartStore'

// Tiny client component — clears Zustand cart when order is confirmed
export function ClearCart() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
