import { ProductCardSkeleton } from '@/components/store/ProductCard'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 pt-28 pb-12">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-3 w-20 bg-zinc-200 rounded animate-pulse" />
        <div className="h-9 w-48 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-zinc-200 rounded animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters skeleton */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="h-96 rounded-xl bg-zinc-100 animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="flex-1">
          <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
