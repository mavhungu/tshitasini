import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import slugify from 'slugify'
import { prisma } from '@/lib/prisma/client'

const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category: z.string().min(2),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

// Public — used by the store catalog
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const active = searchParams.get('active')

  const products = await prisma.product.findMany({
    where: active === 'true' ? { isActive: true } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

// Admin only — create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createProductSchema.parse(body)

    // Auto-generate a unique slug from the product name
    let slug = slugify(data.name, { lower: true, strict: true })
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const product = await prisma.product.create({
      data: { ...data, slug },
    })

    // ✅ Bust the "products" cache tag — updates store pages
    revalidateTag('products')

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid product data.', errors: error.issues },
        { status: 400 }
      )
    }
    console.error('Product creation error:', error)
    return NextResponse.json(
      { message: 'Failed to create product.' },
      { status: 500 }
    )
  }
}
