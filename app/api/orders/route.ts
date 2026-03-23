import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

const shippingSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  province: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingAddress: shippingSchema,
  paymentMethod: z.enum(['STRIPE', 'PAYPAL']),
})

const SHIPPING_THRESHOLD = 1000
const FLAT_SHIPPING = 150

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createOrderSchema.parse(body)

    // Re-fetch all product prices from DB — never trust client prices
    const productIds = data.items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { message: 'One or more products are unavailable.' },
        { status: 400 }
      )
    }

    // Check stock availability
    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)!
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for "${product.name}".` },
          { status: 400 }
        )
      }
    }

    // Calculate totals using DB prices
    const subtotal = data.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!
      return sum + Number(product.price) * item.quantity
    }, 0)

    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
    const totalAmount = subtotal + shipping

    // Create order, items, and shipping address in a single transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          status: 'PENDING',
          totalAmount,
          paymentMethod: data.paymentMethod,
          items: {
            create: data.items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!
              return {
                productId: item.productId,
                productName: product.name,
                productImage: product.images[0] ?? '',
                quantity: item.quantity,
                unitPrice: Number(product.price),
              }
            }),
          },
          shippingAddress: {
            create: data.shippingAddress,
          },
        },
      })

      return newOrder
    })

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid order data.', errors: error.issues },
        { status: 400 }
      )
    }
    console.error('Order creation error:', error)
    return NextResponse.json(
      { message: 'Failed to create order.' },
      { status: 500 }
    )
  }
}
