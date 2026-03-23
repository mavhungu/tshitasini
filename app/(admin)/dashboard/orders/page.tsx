import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { OrdersTable } from '@/components/admin/OrdersTable'

export default async function AdminOrdersPage() {
  const { user } = await withAuth()
  if (!user) redirect('/')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      shippingAddress: true,
      items: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} order{orders.length !== 1 ? 's' : ''} total
        </p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
