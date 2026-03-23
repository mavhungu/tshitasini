import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal'
import { prisma } from '@/lib/prisma/client'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const createSchema = z.object({
  action: z.literal('create'),
  orderId: z.string(),
})

const captureSchema = z.object({
  action: z.literal('capture'),
  paypalOrderId: z.string(),
  orderId: z.string(),
})

const bodySchema = z.discriminatedUnion('action', [
  createSchema,
  captureSchema,
])

export async function POST(req: NextRequest) {
  // Rate limit — max 5 PayPal attempts per IP per minute
  const ip = getClientIp(req.headers)
  const allowed = rateLimit(ip, { limit: 5, windowMs: 60_000 })

  if (!allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    )
  }

  try {
    const body = bodySchema.parse(await req.json())

    if (body.action === 'create') {
      // Fetch order total from DB — never trust client amounts
      const order = await prisma.order.findUnique({
        where: { id: body.orderId },
      })

      if (!order) {
        return NextResponse.json(
          { message: 'Order not found.' },
          { status: 404 }
        )
      }

      const paypalOrderId = await createPayPalOrder(
        Number(order.totalAmount)
      )
      return NextResponse.json({ paypalOrderId })
    }

    if (body.action === 'capture') {
      const captureData = await capturePayPalOrder(body.paypalOrderId)

      if (captureData.status !== 'COMPLETED') {
        return NextResponse.json(
          { message: 'PayPal payment was not completed.' },
          { status: 400 }
        )
      }

      await prisma.order.update({
        where: { id: body.orderId },
        data: {
          status: 'PAID',
          paymentId: body.paypalOrderId,
        },
      })

      return NextResponse.json({
        success: true,
        orderId: body.orderId,
      })
    }
  } catch (error) {
    console.error('PayPal error:', error)
    return NextResponse.json(
      { message: 'PayPal payment failed.' },
      { status: 500 }
    )
  }
}
