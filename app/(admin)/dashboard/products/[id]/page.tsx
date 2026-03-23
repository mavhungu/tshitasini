import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import { ProductForm } from '@/components/admin/ProductForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { user } = await withAuth()
  if (!user) redirect('/')

  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update the details for{' '}
          <span className="font-semibold text-foreground">{product.name}</span>
        </p>
      </div>
      <ProductForm
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          stock: product.stock,
          category: product.category,
          images: product.images,
          isActive: product.isActive,
        }}
      />
    </div>
  )
}
