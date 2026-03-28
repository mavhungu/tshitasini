import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle, Clock, Package, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ClearCart } from '@/components/store/ClearCart'
import { prisma } from '@/lib/prisma/client'
import { verifyTransaction } from '@/lib/paystack'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully.',
}

interface Props {
  searchParams: Promise<{ 
    orderId?: string 
    //Paystack
    reference?: string
    trxref?: string
    //Ozow
    ref?: string
    method?: string
  }>
}

// Badge config per gateway

const GATEWAY_BADGE: Record<string, { label: string; className: string }>= {
  STRIPE: {
    label: 'Stripe',
    className: 'bg-[#635BFF] text-white text-xs',
  },
  PAYPAL: {
    label: 'PayPal',
    className: 'bg-[#003087] text-white text-xs',
  },
  PAYSTACK: {
    label: 'Paystack',
    className: 'bg-[#00C3F7] text-white text-xs',
  },
  OZOW: {
    label: 'Ozow EFT',
    className: 'bg-[#00CFAA] text-white text-xs',
  },
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams
  const { orderId } = params

  if (!orderId) redirect('/')

  const paystackRef = params.reference ?? params.trxref
  const isPaystack = params.method === 'paystack' || params.method === 'PAYSTACK' || (!!paystackRef && paystackRef.startsWith('PPE'))

  if(isPaystack && paystackRef) {
    try {
      const txn = await verifyTransaction(paystackRef)

      if(txn.status === 'success') {
        await prisma.order.updateMany({
          where: { id: orderId, status: 'PENDING' },
          data: {
            status: 'PAID',
            paymentMethod: 'PAYSTACK',
            paymentId: txn.reference,
          },
        })
      }
    } catch (err) {
      console.log('[success/paystack-verify]', err)
    }
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
    },
  })

  if (!order) redirect('/')

  const total = Number(order.totalAmount)
  const gateway = GATEWAY_BADGE[order.paymentMethod ?? ''] ?? null

  // Ozow pending state

  const isOzowPending = (params.method === 'ozow' || params.method === 'OZOW') && order.status === 'PENDING'

    if (isOzowPending) {
      return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <ClearCart />

        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Clock className="h-14 w-14 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Processing
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your EFT via Ozow is being confirmed by your bank. This usually
            takes less than a minute.
          </p>
          <p className="text-muted-foreground mt-2">
            A confirmation email will be sent to{' '}
            <span className="font-semibold text-foreground">
              {order.shippingAddress?.email}
            </span>{' '}
            once your payment clears.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5">
            <span className="text-xs text-muted-foreground">
              Order Reference:
            </span>
            <span className="text-xs font-mono font-bold text-foreground">
              {order.id.slice(0, 12).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Show the items they ordered so the page isn't empty */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Items Ordered</h2>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.productName}{' '}
                  <span className="text-muted-foreground">
                    × {item.quantity}
                  </span>
                </span>
                <span className="font-medium text-foreground">
                  R {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">R {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="flex-1">
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <ClearCart />

      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <CheckCircle className="h-14 w-14 text-green-600 dark:text-green-400" />
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
        <div className="mt-3 inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5">
          <span className="text-xs text-muted-foreground">Order Reference:</span>
          <span className="text-xs font-mono font-bold text-foreground">
            {order.id.slice(0, 12).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
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
              <span className="font-medium text-foreground">
                R {(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-bold">
          <span className="text-foreground">Total Paid</span>
          <span className="text-primary">R {total.toFixed(2)}</span>
        </div>

        {/* Payment gateway + status badges */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Payment via</span>
          {gateway ? (
            <Badge className={gateway.className}>{gateway.label}</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              {order.paymentMethod ?? 'Unknown'}
            </Badge>
          )}
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
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
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
            <Separator className="my-2" />
            <p>{order.shippingAddress.email}</p>
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
