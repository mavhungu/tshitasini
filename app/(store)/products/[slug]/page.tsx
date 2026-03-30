import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductImageGallery } from '@/components/store/ProductImageGallery'
import { AddToCart } from '@/components/store/AddToCart'
import { prisma } from '@/lib/prisma/client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })

  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Tshitasini Enviro Solutions`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const [product, related] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  if (!product) notFound()

  // Fetch related separately now we have the product category
  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      category: product.category,
      NOT: { id: product.id },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  const price = Number(product.price)
  const inStock = product.stock > 0

  return (
    <div className="container mx-auto px-6 sm:px-10 md:px-16 pt-28 pb-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        aria-label="Back to products catalogue"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        <ProductImageGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className="bg-primary text-primary-foreground">
              {product.category}
            </Badge>
            {inStock ? (
              <Badge
                variant="outline"
                className="text-green-600 border-green-300 gap-1"
              >
                <CheckCircle className="h-3 w-3" aria-hidden="true" />
                In Stock ({product.stock} units)
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-destructive border-destructive/30 gap-1"
              >
                <XCircle className="h-3 w-3" aria-hidden="true" />
                Out of Stock
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
            {product.name}
          </h1>

          <p className="text-4xl font-bold text-primary mb-6">
            R {price.toFixed(2)}
          </p>

          <Separator className="mb-6" />

          <div className="mb-8">
            <h2 className="font-semibold text-foreground mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price,
              image: product.images[0] ?? '',
              stock: product.stock,
            }}
          />

          <Separator className="my-6" />

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Secure payment via
            </span>
            <span className="text-xs font-bold text-white bg-[#635BFF] px-2 py-1 rounded">
              Stripe
            </span>
            <span className="text-xs font-bold text-white bg-[#003087] px-2 py-1 rounded">
              PayPal
            </span>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <>
          <Separator className="mb-12" />
          <div>
            <div className="mb-6">
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
                More Like This
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{ ...p, price: Number(p.price) }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
