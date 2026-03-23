import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cacheTag, cacheLife } from 'next/cache'
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

// ✅ Cached product fetch — tagged so revalidateTag('products')
// busts it when admin creates/edits/deletes a product
async function getProduct(slug: string) {
  'use cache'
  cacheTag('products')
  cacheLife('hours')

  return prisma.product.findUnique({ where: { slug } })
}

// ✅ Cached related products fetch
async function getRelatedProducts(category: string, excludeId: string) {
  'use cache'
  cacheTag('products')
  cacheLife('hours')

  return prisma.product.findMany({
    where: {
      isActive: true,
      category,
      NOT: { id: excludeId },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

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

// ✅ Pre-generate static paths for all active products at build time
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const related = await getRelatedProducts(product.category, product.id)

  const price = Number(product.price)
  const inStock = product.stock > 0

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        aria-label="Back to products catalogue"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

        {/* Left — image gallery */}
        <ProductImageGallery images={product.images} name={product.name} />

        {/* Right — product info */}
        <div className="flex flex-col">
          {/* Badges */}
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

          {/* Name */}
          <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-4xl font-bold text-primary mb-6">
            R {price.toFixed(2)}
          </p>

          <Separator className="mb-6" />

          {/* Description */}
          <div className="mb-8">
            <h2 className="font-semibold text-foreground mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Add to cart — client component island */}
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

          {/* Payment badges */}
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

      {/* Related products */}
      {related.length > 0 && (
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
              {related.map((p) => (
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
