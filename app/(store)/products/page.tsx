import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Package } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductFilters } from '@/components/store/ProductFilters'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse our full range of certified PPE products including surgical gloves, masks, gowns, eye protection and more.',
  openGraph: {
    title: 'Products | Tshitasini Enviro Solutions',
    description: 'Browse certified PPE for healthcare and safety professionals.',
    images: [{ url: '/og-image.png' }],
  },
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    search?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort, search } = await searchParams

  const where = {
    isActive: true,
    ...(category && { category }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const orderBy =
    sort === 'price_asc'
      ? { price: 'asc' as const }
      : sort === 'price_desc'
      ? { price: 'desc' as const }
      : { createdAt: 'desc' as const }

  const [rawProducts, rawCategories] = await Promise.all([
    prisma.product.findMany({ where, orderBy }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    }),
  ])

  const products = rawProducts.map((p) => ({ ...p, price: Number(p.price) }))
  const categories = rawCategories.map((p) => p.category)

  return (
    <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 pt-28 pb-12">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
          Catalogue
        </p>
        <h1 className="text-3xl font-bold text-foreground">Our Products</h1>
        <p className="text-muted-foreground mt-1">
          Certified PPE for healthcare and safety professionals
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <Suspense
            fallback={
              <div className="h-80 rounded-xl bg-muted animate-pulse" />
            }
          >
            <ProductFilters
              categories={categories}
              currentCategory={category ?? null}
              currentSort={sort ?? null}
              currentSearch={search ?? null}
            />
          </Suspense>
        </aside>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-6">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {products.length}
            </span>{' '}
            product{products.length !== 1 ? 's' : ''}
            {category && (
              <>
                {' '}in{' '}
                <span className="font-semibold text-foreground">
                  {category}
                </span>
              </>
            )}
          </p>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-sm">
                Try adjusting your search or removing filters to see more results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
