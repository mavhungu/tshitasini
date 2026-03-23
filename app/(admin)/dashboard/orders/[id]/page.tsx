import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, CreditCard } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'

type OrderStatus =
  | 'PENDING' | 'PAID' | 'PROCESSING'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

const statusStyles: Record<OrderStatus, string> = {
  PENDING:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  PAID:       'bg-green-100 text-green-700 border-green-200',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED:    'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED:  'bg-teal-100 text-teal-700 border-teal-200',
  CANCELLED:  'bg-red-100 text-red-700 border-red-200',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { user } = await withAuth()
  if (!user) redirect('/')

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  })

  if (!order) notFound()

  const total = Number(order.totalAmount)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Order{' '}
              <span className="font-mono text-lg">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`text-sm px-3 py-1 ${statusStyles[order.status as OrderStatus]}`}
          >
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — items + pricing */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      R {Number(item.unitPrice).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm text-foreground shrink-0">
                    R {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">R {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span className="text-foreground">Total Charged</span>
                  <span className="text-primary">R {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Method</span>
                <span
                  className={`text-xs font-bold text-white px-2 py-1 rounded ${
                    order.paymentMethod === 'STRIPE'
                      ? 'bg-[#635BFF]'
                      : 'bg-[#003087]'
                  }`}
                >
                  {order.paymentMethod === 'STRIPE' ? 'Stripe' : 'PayPal'}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">
                    Payment ID
                  </span>
                  <span className="font-mono text-xs text-right break-all text-foreground">
                    {order.paymentId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — status + shipping */}
        <div className="space-y-6">

          {/* Status updater */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdater
                orderId={order.id}
                currentStatus={order.status as OrderStatus}
              />
            </CardContent>
          </Card>

          {/* Shipping address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Ship To
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province},{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <Separator className="my-2" />
                <p>{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
