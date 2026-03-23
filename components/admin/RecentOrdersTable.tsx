import Link from 'next/link'
import { Eye } from 'lucide-react'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type OrderStatus =
  | 'PENDING' | 'PAID' | 'PROCESSING'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

interface RecentOrder {
  id: string
  status: OrderStatus
  totalAmount: unknown
  paymentMethod: string
  createdAt: Date
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
  } | null
  items: { id: string }[]
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  PAID:       'bg-green-100 text-green-700 border-green-200',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED:    'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED:  'bg-teal-100 text-teal-700 border-teal-200',
  CANCELLED:  'bg-red-100 text-red-700 border-red-200',
}

export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No orders yet.</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="hidden sm:table-cell">Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-xs text-muted-foreground">
                {order.id.slice(0, 8).toUpperCase()}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {order.shippingAddress
                      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                      : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.shippingAddress?.email ?? '—'}
                  </p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-foreground">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </TableCell>
              <TableCell className="font-semibold text-sm text-foreground">
                R {Number(order.totalAmount).toFixed(2)}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span
                  className={`text-xs font-bold text-white px-2 py-1 rounded ${
                    order.paymentMethod === 'STRIPE'
                      ? 'bg-[#635BFF]'
                      : 'bg-[#003087]'
                  }`}
                >
                  {order.paymentMethod === 'STRIPE' ? 'Stripe' : 'PayPal'}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusStyles[order.status]}`}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString('en-ZA')}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    aria-label="View order details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
