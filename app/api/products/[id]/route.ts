import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import slugify from 'slugify'
import { prisma } from '@/lib/prisma/client'

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  category: z.string().min(2).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params

  try {
    const body = await req.json()
    const data = updateProductSchema.parse(body)

    let slug: string | undefined
    if (data.name) {
      slug = slugify(data.name, { lower: true, strict: true })
      const existing = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      })
      if (existing) slug = `${slug}-${Date.now()}`
    }

    const product = await prisma.product.update({
      where: { id },
      data: { ...data, ...(slug && { slug }) },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid data.', errors: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Failed to update product.' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params

  try {
    const activeOrders = await prisma.orderItem.count({
      where: {
        productId: id,
        order: { status: { not: 'CANCELLED' } },
      },
    })

    if (activeOrders > 0) {
      return NextResponse.json(
        {
          message:
            'Cannot delete — this product has active orders. ' +
            'Deactivate it instead.',
        },
        { status: 400 }
      )
    }

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { message: 'Failed to delete product.' },
      { status: 500 }
    )
  }
}
