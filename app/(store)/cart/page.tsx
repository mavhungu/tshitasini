'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCartStore } from '@/lib/store/cartStore'

const SHIPPING_THRESHOLD = 1000
const FLAT_SHIPPING = 150

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="p-6 bg-primary/10 rounded-full mb-6">
          <ShoppingBag className="h-14 w-14 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Looks like you haven&apos;t added any products yet. Browse our
          catalogue to get started.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link href="/products">
            Browse Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    )
  }

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
  const total = totalPrice + shipping

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              {/* Top row — image + name + delete */}
              <div className="flex gap-3">
                {/* Image */}
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-xs text-center px-1">
                      No image
                    </div>
                  )}
                </div>

                {/* Name + price + delete */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 text-sm leading-snug"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 mt-0.5"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-primary font-bold mt-1 text-sm">
                    R {item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Bottom row — quantity stepper + line total */}
              {/* Separated from top row to avoid cramping on mobile */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                {/* Quantity stepper */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums text-foreground">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Line total — always on same row as stepper */}
                <p className="font-bold text-foreground text-sm shrink-0">
                  R {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  R {totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="font-medium text-green-600">Free</span>
                ) : (
                  <span className="font-medium text-foreground">
                    R {shipping.toFixed(2)}
                  </span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over R{SHIPPING_THRESHOLD}
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span className="text-foreground">Total</span>
              <span className="text-primary">R {total.toFixed(2)}</span>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="w-full mt-2">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
