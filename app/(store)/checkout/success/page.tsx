import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ClearCart } from '@/components/store/ClearCart'
import { prisma } from '@/lib/prisma/client'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully.',
}

interface Props {
  searchParams: Promise<{ orderId?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams

  if (!orderId) redirect('/')

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
    },
  })

  if (!order) redirect('/')

  const total = Number(order.totalAmount)

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Clear cart on mount */}
      <ClearCart />

      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground">
          Thank you,{' '}
          <span className="font-semibold text-foreground">
            {order.shippingAddress?.firstName}
          </span>
          ! Your order has been placed successfully.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-1.5">
          <span className="text-xs text-muted-foreground">Order Reference:</span>
          <span className="text-xs font-mono font-bold text-foreground">
            {order.id.slice(0, 12).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-foreground">Items Ordered</h2>
        </div>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.productName}{' '}
                <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span className="font-medium">
                R {(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-bold">
          <span>Total Paid</span>
          <span className="text-primary">R {total.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Payment via</span>
          <Badge
            className={
              order.paymentMethod === 'STRIPE'
                ? 'bg-[#635BFF] text-white text-xs'
                : 'bg-[#003087] text-white text-xs'
            }
          >
            {order.paymentMethod === 'STRIPE' ? 'Stripe' : 'PayPal'}
          </Badge>
          <Badge
            variant="outline"
            className="text-green-600 border-green-300 text-xs"
          >
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="bg-white rounded-xl border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Delivering To</h2>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.province},{' '}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-1">{order.shippingAddress.email}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          asChild
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/products">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
