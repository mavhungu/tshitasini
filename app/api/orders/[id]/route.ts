import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'

const updateOrderSchema = z.object({
  status: z.enum([
    'PENDING', 'PAID', 'PROCESSING',
    'SHIPPED', 'DELIVERED', 'CANCELLED',
  ]),
})

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  })

  if (!order) {
    return NextResponse.json({ message: 'Order not found.' }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params

  try {
    const body = await req.json()
    const { status } = updateOrderSchema.parse(body)

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid status value.' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Failed to update order.' },
      { status: 500 }
    )
  }
}
