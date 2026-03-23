import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma/client'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const schema = z.object({ orderId: z.string() })

export async function POST(req: NextRequest) {
  // Rate limit — max 5 Stripe session attempts per IP per minute
  const ip = getClientIp(req.headers)
  const allowed = rateLimit(ip, { limit: 5, windowMs: 60_000 })

  if (!allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    )
  }

  try {
    const { orderId } = schema.parse(await req.json())

    // Fetch order with items from DB — build line items from server data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found.' },
        { status: 404 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'zar',
          product_data: {
            name: item.productName,
            ...(item.productImage && { images: [item.productImage] }),
          },
          // Stripe expects amount in smallest unit (cents)
          unit_amount: Math.round(Number(item.unitPrice) * 100),
        },
        quantity: item.quantity,
      })),
      metadata: { orderId },
      success_url: `${appUrl}/checkout/success?orderId=${orderId}`,
      cancel_url: `${appUrl}/checkout`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe session error:', error)
    return NextResponse.json(
      { message: 'Failed to create payment session.' },
      { status: 500 }
    )
  }
}
