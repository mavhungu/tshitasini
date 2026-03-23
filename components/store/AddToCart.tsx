'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cartStore'

interface AddToCartProduct {
  id: string
  name: string
  slug: string
  price: number
  image: string
  stock: number
}

export function AddToCart({ product }: { product: AddToCartProduct }) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  const cartItem = cartItems.find((i) => i.id === product.id)
  const alreadyInCart = cartItem?.quantity ?? 0
  const maxAddable = product.stock - alreadyInCart
  const inStock = product.stock > 0

  const decrease = () => setQuantity((q) => Math.max(1, q - 1))
  const increase = () => setQuantity((q) => Math.min(maxAddable, q + 1))

  const handleAddToCart = () => {
    if (!inStock || maxAddable <= 0) return

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
        stock: product.stock,
      },
      quantity
    )

    toast.success('Added to cart', {
      description: `${quantity}× ${product.name}`,
    })

    // Reset quantity selector after adding
    setQuantity(1)
  }

  if (!inStock) {
    return (
      <Button disabled size="lg" className="w-full">
        Out of Stock
      </Button>
    )
  }

  if (maxAddable <= 0) {
    return (
      <div className="space-y-2">
        <Button disabled size="lg" className="w-full">
          Maximum quantity in cart
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          You already have all available stock in your cart.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Quantity</p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span
            className="w-10 text-center font-semibold text-lg tabular-nums"
            aria-live="polite"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={increase}
            disabled={quantity >= maxAddable}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground">
            ({maxAddable} available)
          </span>
        </div>
      </div>

      {/* Add to cart */}
      <Button
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  )
}
