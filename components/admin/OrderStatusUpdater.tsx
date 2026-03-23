'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'

type OrderStatus =
  | 'PENDING' | 'PAID' | 'PROCESSING'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

const ALL_STATUSES: OrderStatus[] = [
  'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED',
]

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: OrderStatus
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleUpdate = () => {
    if (status === currentStatus) return

    startTransition(async () => {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        toast.success(`Order status updated to ${status}`)
        router.refresh()
      } else {
        toast.error('Failed to update order status')
        setStatus(currentStatus)
      }
    })
  }

  return (
    <div className="space-y-3">
      <Select
        value={status}
        onValueChange={(val) => setStatus(val as OrderStatus)}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALL_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleUpdate}
        disabled={isPending || status === currentStatus}
        className="w-full bg-primary hover:bg-primary/90"
        size="sm"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Updating...
          </>
        ) : (
          'Update Status'
        )}
      </Button>
    </div>
  )
}
